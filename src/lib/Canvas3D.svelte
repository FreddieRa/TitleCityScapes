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
		RepeatWrapping,
	} from 'three';
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
		useThrelte,
        ContextBridge
	} from 'threlte';

    import { spring } from 'svelte/motion';
    import { tweened } from 'svelte/motion';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

    import * as THREE  from 'three';
	import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
	import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
	import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass';
	// import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass'
	import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';

	import colors from '$lib/json/1000.json';

	const scale = spring(1);
	let iScale = 0.01;
	let dScale = 4;
	let lim = 2;
	let ll = lim * lim;

    let ctx;
    let camera;
    $: console.log(ctx)
	let seed = 0;

	let texture;

	let shapes = [];
    let objects = [];

	export let rects;
	export let processed;
	

    const buildProgress = tweened(0, {
		duration: 1500,
		easing: cubicIn
	});

	onMount(() => {
		texture = new TextureLoader().load('/images/grain.jpg', (tex) => {
			tex.wrapS = RepeatWrapping;
			tex.wrapT = RepeatWrapping;
			tex.wrapS = RepeatWrapping;
			tex.repeat.set(0.2, 1);
		});
	});

    const bound = function(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    const doesIntersect = function(shape1, shape2, scale) {
        let x1 = shape1.x;
        let y1 = shape1.z;
        let x2 = shape2.x;
        let y2 = shape2.z;
        let w1 = shape1.width * scale;
        let h1 = shape1.height * scale;
        let w2 = shape2.width * scale;
        let h2 = shape2.height * scale;

        let xOverlap = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2));
        let yOverlap = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2));

        return xOverlap * yOverlap > 0;
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
        objects = [];

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

			shape.col = new Color(palette[c]).offsetHSL(0, 0, 0);
			shape.dark = new Color(palette[c]).offsetHSL(0, 0, -0.6);

			let tex = texture;

			let radius = i / 24 + w;
			let theta = i + shape.width;

			shape.x = Math.cos(theta) * radius;
			shape.z = Math.sin(theta) * radius;

            // Not working, will have to come back to this
            // for (let other of shapes) {
            //     if (doesIntersect(shape, other, 1)) {
            //         console.log("YES")
            //         radius += 0.05;
            //         theta += 0.05;
            //         shape.x = Math.cos(theta) * radius;
			//         shape.z = Math.sin(theta) * radius;
            //     } 
            // }

			shape.y = h / 2;

            shape.offset = Math.random();

			shape.geometry = new BoxBufferGeometry(shape.width, shape.height, shape.width);
			shape.geometry.computeBoundingBox();

			shape.material1 = new MeshStandardMaterial({ color: shape.col });

			let uniforms = {
				bbMin: { value: shape.geometry.boundingBox.min },
				bbMax: { value: shape.geometry.boundingBox.max },
				color1: { value: shape.col },
				color2: { value: shape.dark }
			};

            // From here: 
            // https://stackoverflow.com/questions/64560154/applying-color-gradient-to-material-by-extending-three-js-material-class-with-on
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

            let o = new THREE.Mesh(shape.geometry, shape.material3);
            o.translateX(shape.x);
            o.translateY(shape.y);
            o.translateZ(shape.z);
            
            objects.push(o);
            shapes.push(shape);
		}
        buildProgress.set(1);
	}

    function screenshot() {
        let strMime = "image/jpeg";
        ctx.renderer.setPixelRatio( window.devicePixelRatio * 4);
        ctx.scene.background = new Color(0xffffff);
        ctx.renderer.render(ctx.scene, camera)

        let imgData = ctx.renderer.domElement.toDataURL(strMime);
        let link = document.createElement('a');

        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = "CityScape.jpg";
        link.href = imgData;
        link.click();
        document.body.removeChild(link);
        ctx.renderer.setPixelRatio( window.devicePixelRatio);
    }

</script>

<main class="border">
	<Canvas bind:ctx rendererParameters={{preserveDrawingBuffer: false, antialiasing: false}}>
        <!-- <ContextBridge bind:ctx /> -->
		<!-- <Pass pass={new AdaptiveToneMappingPass(1, 1)}/> -->
		<!-- <Pass pass={new HalftonePass(1, 1, {radius: 4})}/> -->
		<Fog color={'#ffffff'} near={22} far={28} />
		<PerspectiveCamera position={{ x: 15, y: 8, z: 15 }} fov={24} bind:camera>
			<OrbitControls autoRotate enableZoom={true} target={{ y: 0.5 }} />
		</PerspectiveCamera>

		<DirectionalLight shadow position={{ x: 3, y: 10, z: 10 }} intensity={3} />
		<!-- <DirectionalLight shadow position={{ x: -3, y: 10, z: -10 }} intensity={2} /> -->
		<AmbientLight intensity={0.7} />

		<!-- Cube -->

        <!-- Anim 1
        scale={{x: iScale, y: iScale * $buildProgress, z: iScale}}
		position={{ x: shape.x, y: shape.y * $buildProgress - 1.5, z: shape.z }} -->

        <!-- 150 * (bound(1 - $buildProgress - shape.offset, 0, 1)) +  -->
		<Group scale={$scale}>
			{#each shapes as shape}
				<Mesh
					interactive
					scale={{x: iScale, y: iScale, z: iScale}}
					position={{ x: shape.x, y: 150 * (bound(1 - $buildProgress - shape.offset, 0, 1)) + shape.y - 1.5, z: shape.z }}
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
			class="inline-block mx-5 px-2 py-1 lg:px-6 lg:py-2.5 bg-red-600 text-white font-medium text-2xs lg:text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
			disabled={!processed}
		>
			Build City
		</button>

		<button
			on:click={() => {
				seed = Math.floor(Math.random() * 100000);
				generateShapes2();
			}}
			class="inline-block mx-5 px-2 py-1 lg:px-6 lg:py-2.5 bg-red-600 text-white font-medium text-2xs lg:text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
			disabled={!processed}
		>
			New Colours
		</button>
	</div>

    <div class="rightLocation flex flex-row bg-red-500 rounded-full p-1.5">
        <input type="image" on:click={screenshot} src="/images/camera-icon-21.png" width="30" alt="Camera icon">
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


    .rightLocation {
        position:absolute;
        right: 2%;
        top: 2%;
        width:fit-content;
        height:fit-content;

    }

	button:disabled {
		background: #f5f5f5;
		color: #c3c3c3;
	}

    input {
        filter: invert(100%);
    }
</style>
