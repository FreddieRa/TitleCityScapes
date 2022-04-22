<script>
	import {
		CircleBufferGeometry,
		MeshStandardMaterial,
		BoxBufferGeometry,
		SphereBufferGeometry,
		DoubleSide,
		ShaderMaterial,
		Color,
		UniformsUtils,
		UniformsLib,
		TextureLoader,
		RepeatWrapping
	} from 'three';
	import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
	import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
	import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass';
	// import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass'
	import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';

	import colors from '$lib/json/1000.json';

	import {
		AmbientLight,
		Canvas,
		DirectionalLight,
		Group,
		HemisphereLight,
		Mesh,
		OrbitControls,
		PerspectiveCamera,
		Pass,
		Fog,
		useTexture
	} from 'threlte';
	import { spring } from 'svelte/motion';
	import { onMount } from 'svelte';

	const scale = spring(1);
	let iScale = 0.01;
	let dScale = 4;
	let lim = 2;
	let ll = lim * lim;

	let seed = 0;

	let texture;

	export let rects;
	export let processed;
	// export let oldPalette = [
	//     [27,62,77],[238,159,47],[252,126,10],[230,75,11],[155,36,31]
	// ];

	onMount(() => {
		texture = new TextureLoader().load('/images/grain.jpg', (tex) => {
			tex.wrapS = RepeatWrapping;
			tex.wrapT = RepeatWrapping;
			tex.wrapS = RepeatWrapping;
			tex.repeat.set(0.2, 1);
		});
	});

	let shapes = [];

	function intersect(ob1, ob2) {
		let xintersect = ob1.x0 < ob2.x1 && ob1.x1 > ob2.x0;
		let yintersect = ob1.y0 < ob2.y1 && ob1.y1 > ob2.y0;
		return xintersect && yintersect;
	}

	function rgbToHex(r, g, b) {
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

	export function generateShapes() {
		shapes = [];
		rects.forEach((rect) => {
			let shape = {};
			shape.width = rect.y1 - rect.y0;
			shape.height = rect.x1 - rect.x0;
			let [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
			shape.col = rgbToHex(r, g, b);

			let counter = 0;
			let placed = false;

			let h = shape.height * iScale;

			while (!placed && counter < 1000) {
				// Random placement, with bigger things more central, and greater allowance over time
				let x = (Math.random() - 0.5) * (dScale / h) * (1 + counter / 5000);

				let z = (Math.random() - 0.5) * (dScale / h) * (1 + counter / 5000);

				let dist = x * x + z * z;

				// If too far out, scale back in
				if (dist > ll) {
					let s = Math.sqrt(ll / dist);
					x *= s + 0.05;
					z *= s + 0.05;
				}

				let y = h / 2;

				shape.x = x;
				shape.y = y;
				shape.z = z;

				placed = true;
				for (let s in shapes) {
					if (intersect(shape, shapes[s])) {
						placed = false;
						break;
					}
				}
				counter++;
			}
			shapes.push(shape);
		});
	}

	const hashCode = function (str, seed = 0) {
		let h1 = 0xdeadbeef ^ seed,
			h2 = 0x41c6ce57 ^ seed;
		for (let i = 0, ch; i < str.length; i++) {
			ch = str.charCodeAt(i);
			h1 = Math.imul(h1 ^ ch, 2654435761);
			h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
		h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
		return 4294967296 * (2097151 & h2) + (h1 >>> 0);
	};

	export function generateShapes2() {
		shapes = [];
		let string = JSON.stringify(rects);
		let newRects = JSON.parse(string);
		let h = hashCode(string, seed);
		let palette = colors[parseInt(Math.abs(h)) % colors.length];
		// let palette = colors[Math.floor(Math.random() * colors.length)]

		// Sort by height
		newRects.sort((a, b) => {
			return b.x1 - b.x0 - (a.x1 - a.x0);
		});

		for (let i in newRects) {
			let rect = newRects[i];
			let shape = {};
			shape.width = rect.y1 - rect.y0;
			shape.height = rect.x1 - rect.x0;

			let h = shape.height * iScale;
			let w = shape.width * iScale;

			let c = Math.floor(shape.height) % palette.length;
			// let [r, g, b] = palette[c]
			// shape.col = rgbToHex(r, g, b)
			shape.col = new Color(palette[c]).offsetHSL(0, 0, -0.3);
			shape.dark = new Color(palette[c]).offsetHSL(0, 0, -0.7);

			let tex = texture;
			// let tex = texture.clone()
			// tex.rotation = Math.random()
			// tex.updateMatrix()
			// tex.wrapS = RepeatWrapping;
			// tex.wrapT = RepeatWrapping;
			// tex.repeat.set(0.2,1);
			// tex.needsUpdate = true

			let radius = i / 24 + w;
			let theta = i + shape.width;

			shape.x = Math.cos(theta) * radius;
			shape.z = Math.sin(theta) * radius;

			shape.y = h / 2;

			shape.geometry = new BoxBufferGeometry(shape.width, shape.height, shape.width);
			shape.geometry.computeBoundingBox();

			shape.material1 = new MeshStandardMaterial({ color: shape.col });

			let uniforms = {
				bbMin: { value: shape.geometry.boundingBox.min },
				bbMax: { value: shape.geometry.boundingBox.max },
				color1: { value: shape.col },
				color2: { value: shape.dark }
			};

			shape.material3 = new MeshStandardMaterial({
				roughness: 0.25,
				metalness: 0.75,
				map: tex,
				onBeforeCompile: (shader) => {
					shader.uniforms.bbMin = uniforms.bbMin;
					shader.uniforms.bbMax = uniforms.bbMax;
					shader.uniforms.color1 = uniforms.color1;
					shader.uniforms.color2 = uniforms.color2;
					shader.vertexShader = `
        varying vec3 vPos;
      ${shader.vertexShader}
    `.replace(
						`#include <begin_vertex>`,
						`#include <begin_vertex>
    vPos = transformed;
    `
					);
					shader.fragmentShader = `
        uniform vec3 bbMin;
      uniform vec3 bbMax;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vPos;
      ${shader.fragmentShader}
    `.replace(
						`vec4 diffuseColor = vec4( diffuse, opacity );`,
						`
      float f = clamp((vPos.y - bbMin.y) / (bbMax.y - bbMin.y), 0., 1.);
      vec3 col = mix(color2, color1, f);
      vec4 diffuseColor = vec4( col, opacity );`
					);
				}
			});

			shapes.push(shape);
		}
	}
</script>

<main class="border">
	<Canvas>
		<!-- <Pass pass={new AdaptiveToneMappingPass(1, 1)}/> -->
		<!-- <Pass pass={new HalftonePass(1, 1, {radius: 4})}/> -->
		<Fog color={'#ffffff'} near={22} far={28} />
		<PerspectiveCamera position={{ x: 15, y: 8, z: 15 }} fov={24}>
			<OrbitControls autoRotate enableZoom={true} target={{ y: 0.5 }} />
		</PerspectiveCamera>

		<DirectionalLight shadow position={{ x: 3, y: 10, z: 10 }} intensity={2} />
		<!-- <DirectionalLight shadow position={{ x: -3, y: 10, z: -10 }} intensity={2} /> -->
		<AmbientLight intensity={0.4} />

		<!-- Cube -->
		<Group scale={$scale}>
			{#each shapes as shape}
				<Mesh
					interactive
					scale={iScale}
					position={{ x: shape.x, y: shape.y - 1.5, z: shape.z }}
					castShadow
					geometry={shape.geometry}
					material={shape.material3}
				/>
			{/each}
		</Group>

		<!-- Floor -->
		<Mesh
			receiveShadow
			position={{ y: -1.501 }}
			rotation={{ x: -90 * (Math.PI / 180) }}
			geometry={new CircleBufferGeometry(3, 72)}
			material={new MeshStandardMaterial({ side: DoubleSide, color: 'grey' })}
		/>

		<!-- <Mesh
        geometry={new SphereBufferGeometry(1000, 72, 72)}
        material={new MeshStandardMaterial({ side: DoubleSide, color: 'white' })}
      /> -->
	</Canvas>

	<div class="bottomDiv flex flex-row">
		<button
			on:click={() => {
				seed = 0;
				generateShapes2();
			}}
			class="inline-block mx-5 px-2 py-1 lg:px-6 lg:py-2.5 bg-red-600 text-white font-medium text-2xs  leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
			disabled={!processed}
		>
			Build City
		</button>

		<button
			on:click={() => {
				seed = Math.floor(Math.random() * 100000);
				generateShapes2();
			}}
			class="inline-block mx-5 px-2 py-1 lg:px-6 lg:py-2.5 bg-red-600 text-white font-medium text-2xs  leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
			disabled={!processed}
		>
			New Colours
		</button>
	</div>
</main>

<style>
	main {
		position: relative;
		height: 100%;
		width: 100%;
	}

	.bottomDiv {
		/* box-sizing: border-box; */
		position: absolute;
		left: 50%;
		transform: translate(-50%, -60%);
		width: fit-content;
		height: fit-content;
		bottom: 0;
		/* margin-top: 30px; */
		/* border: 1px solid #ddd; */
	}

	button:disabled {
		background: #f5f5f5;
		color: #c3c3c3;
	}
</style>
