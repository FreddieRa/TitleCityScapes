<script>
    import { CircleBufferGeometry, MeshStandardMaterial, BoxBufferGeometry, SphereBufferGeometry, DoubleSide } from 'three'
    import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
    import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
    import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass'
    import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass'
    import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass'
    
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
      Fog
    } from 'threlte'
    import { spring } from 'svelte/motion'
  
    const scale = spring(1)
    let iScale = 0.01
    let dScale = 4
    let lim = 2
    let ll = lim*lim

    export let rects;
    export let processed;
    export let palette = [[27,62,77],[238,159,47],[252,126,10],[230,75,11],[155,36,31]];

    let shapes = []

    function intersect(ob1, ob2) {
        let xintersect = ob1.x0 < ob2.x1 && ob1.x1 > ob2.x0
        let yintersect = ob1.y0 < ob2.y1 && ob1.y1 > ob2.y0
        return xintersect && yintersect
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    export function generateShapes() {
        shapes = []
        rects.forEach(rect => {
            let shape = {}
            shape.width = rect.y1 - rect.y0
            shape.height = rect.x1 - rect.x0
            let [r, g, b] = palette[Math.floor(Math.random() * palette.length)]
            shape.col = rgbToHex(r, g, b)

            let counter = 0;
            let placed = false;

            let h = shape.height * iScale
            
            while (!placed && counter < 1000) {
                

                // Random placement, with bigger things more central, and greater allowance over time
                let x = (Math.random() - 0.5) * (dScale/h) * (1 + counter/5000)
                
                let z = (Math.random() - 0.5) * (dScale/h) * (1 + counter/5000)

                let dist = x*x + z*z

                // If too far out, scale back in
                if (dist > ll) {
                    let s = Math.sqrt(ll/dist)
                    x *= s+0.1
                    z *= s+0.1
                }

                let y = h/2

                shape.x = x
                shape.y = y
                shape.z = z

                placed = true;
                for (let s in shapes) {
                    if (intersect(shape, shapes[s])) {
                        placed = false;
                        break;
                    }
                }
                counter++;
            }
            shapes.push(shape)
        })
    }


    export function generateShapes2() {
        shapes = []
        let newRects = JSON.parse(JSON.stringify(rects))

        // Sort by height
        newRects.sort((a, b) => {
            return (b.x1 - b.x0) - (a.x1 - a.x0)
        })

        for (let i in newRects) {
            let rect = newRects[i]
            let shape = {}
            shape.width = rect.y1 - rect.y0
            shape.height = rect.x1 - rect.x0

            let h = shape.height * iScale
            let w = shape.width * iScale

            let c = Math.floor(shape.height) % palette.length
            let [r, g, b] = palette[c]
            shape.col = rgbToHex(r, g, b)

            let radius = (i/12 + w)
            let theta = i + shape.width

            shape.x = Math.cos(theta) * radius
            shape.z = Math.sin(theta) * radius

            shape.y = h/2
            
            shapes.push(shape)
        }

    }

  </script>
  
  <main class="border">
    <Canvas>
        <!-- <Pass pass={new AdaptiveToneMappingPass(1, 1)}/> -->
        <!-- <Pass pass={new HalftonePass(1, 1, {radius: 4})}/> -->
        <Fog color={'#ffffff'} near={22} far={28} />
      <PerspectiveCamera position={{ x: 15, y: 8, z: 15 }} fov={24}>
        <OrbitControls
          autoRotate
          enableZoom={true}
          target={{ y: 0.5 }}
        />
      </PerspectiveCamera>
  
      <DirectionalLight shadow position={{ x: 3, y: 10, z: 10 }} />
      <DirectionalLight position={{ x: -3, y: 10, z: -10 }} intensity={0.2} />
      <AmbientLight intensity={0.6} />
  
      <!-- Cube -->
      <Group scale={$scale}>
        <!-- <Mesh
          interactive
          on:pointerenter={() => ($scale = 2)}
          on:pointerleave={() => ($scale = 1)}
          position={{ y: 0.5 }}
          castShadow
          geometry={new BoxBufferGeometry(1, 1, 1)}
          material={new MeshStandardMaterial({ color: '#333333' })}
        /> -->
        {#each shapes as shape}
        <Mesh
            interactive
            scale={iScale}
            position={{x: shape.x, y: shape.y-1.5, z: shape.z}}
            castShadow
            geometry={new BoxBufferGeometry(shape.width, shape.height, shape.width)}
            material={new MeshStandardMaterial({ color: shape.col })}
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
    
    <button on:click={generateShapes2} 
    class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
    disabled={!processed}>
        Build City
    </button>
</main>
  
  <style>
    main {
        position: relative;
      height: 100%;
      width: 100%;
    }

    button {
        /* box-sizing: border-box; */
        position:absolute;
        left: 50%;
        transform: translate(-50%, -60%);
        width:fit-content;
        height:fit-content;
        bottom:0;
		/* margin-top: 30px; */
		/* border: 1px solid #ddd; */
    }

    button:disabled {
        background: #F5F5F5;
        color : #C3C3C3;
    }
  </style>