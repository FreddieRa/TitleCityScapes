<script>
	import { onMount } from 'svelte';

	import Tesseract from 'tesseract.js';

	let div;
	let input;
	let w;
	let h;
	let input_overlay;
	let ioctx;
    let showImage = false;

    export let rects = [];

    function handleFile(file) {
        if (file.type.match(/image.*/)) {
            let reader = new FileReader();
            reader.onload = function(e) {
                input.src = e.target.result;
                input.onload = () => {
                    updateCanvas();
                    showImage = true
                };
                // updateCanvas();
            }
            reader.readAsDataURL(file);
        }
        else {
            console.log("File not supported!");
        }
    }

	function logTesseract() {
		Tesseract.recognize(
			input,
			'eng',
			{ logger: (m) => console.log(m) }
			//    ).then(({ data: { text } }) => {
			//       console.log(text);
			//    })
		).then((data) => {
			console.log(data.data);
			onResult(data.data);
		});
	}

	function onResult(res) {
		showBoxes(res);
        console.log(res)
        rects = res.words.map(r => r.bbox);
	}

	function showBoxes(res) {
		res.words.forEach(function (w) {
			var b = w.bbox;
            var c = w.confidence;

            if (c >= 0) {
                ioctx.strokeWidth = 2;

                ioctx.strokeStyle = 'red';
                ioctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
                ioctx.beginPath();
                ioctx.moveTo(w.baseline.x0, w.baseline.y0);
                ioctx.lineTo(w.baseline.x1, w.baseline.y1);
                ioctx.strokeStyle = 'green';
                ioctx.stroke();
            }

			// octx.font = '20px Times';
			// octx.font = 20 * (b.x1 - b.x0) / octx.measureText(w.text).width + "px Times";
			// octx.fillText(w.text, b.x0, w.baseline.y0);
		});
	}

	onMount(() => {
		updateCanvas();

        document.body.addEventListener('drop', async function(e){
            e.preventDefault();
            e.stopPropagation();
            handleFile(e.dataTransfer.files[0]);
        });
	});

    function updateCanvas() {
        input_overlay.width = input.width;
		input_overlay.height = input.height;
		ioctx = input_overlay.getContext('2d');
    }
</script>

<main ondragover="return false" class="left-0 right-0 top-0 bottom-0 items-center">


	<div bind:this={div} id="img-container" class="">
		<canvas bind:this={input_overlay} id="input-overlay" class="toFit"/>
        <img
            bind:this={input}
            hidden={!showImage}
            id="input"
            class="toFit"
            alt="input"
        />
        <p hidden={showImage} class="toFit text-slate-500" id="text">
            Drag an Image to Start
        </p>
	</div>
    <button on:click={logTesseract} class="rounded bg-blue-600 text-white px-10 py-2">
        Build City
    </button>

	
    <!-- src="https://tesseract.projectnaptha.com/img/eng_bw.png" -->
</main>

<style>
	#input {

		/* border: 1px solid #ddd; */

	}

    #text {
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .toFit {
        max-height:73vh;
        max-width: 40vw;

		position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
		padding: 20px;
    }

	#input-overlay {
        z-index: 20;
		/* border: 1px solid #d00;    */
	}

    button {
        /* box-sizing: border-box; */
        position:absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        width:fit-content;
        height:fit-content;
        bottom:0;
		/* margin-top: 30px; */
		/* border: 1px solid #ddd; */
    }

    main {
        /* max-height: 80vh;
        max-width: screen; */
        position: relative;
        height:100%;
        width:100%;
    }


</style>
