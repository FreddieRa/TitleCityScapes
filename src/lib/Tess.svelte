<script>
	import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import Tesseract from 'tesseract.js';

	let div;
	let input;
	let w;
	let h;
	let input_overlay;
	let ioctx;
    let showImage = false;
    // let percentage = 0;

    let res;

    let mode = 0;
    let modes = {
        0: "Nothing",
        1: "Add boxes",
        2: "Remove boxes",
    }

    let processButton;

    const percentage = tweened(0, {
		duration: 400,
		easing: cubicOut
	});
    // let buttonColour = "red";

    export let rects = [];
    export let processed = false;


    let rectStart = false;
    let finished = false;

    let realWidth = 0;
    let realHeight = 0;

    function handleFile(file) {
        if (file.type.match(/image.*/)) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let img = document.getElementById('input');
                img.src = e.target.result;
                img.onload = () => {
                    console.log("Loaded")
                    showImage = true
                    realWidth = img.naturalWidth;
                    realHeight = img.naturalHeight;
                    setTimeout(updateCanvas, 500);
                    processed = false;
                };
            }
            reader.readAsDataURL(file);
        }
        else {
            console.log("File not supported!");
        }
    }

	function logTesseract() {
        // processButton.innerHTML = "";
		Tesseract.recognize(
			input,
			'eng',
			{ logger: (m) => {
                console.log(m); 
                if (m.status == "recognizing text") {
                    percentage.set(m.progress);
                }
            }
            }
		).then((data) => {
			console.log(data.data);
            processed = true;
            res = data.data;
			onResult(res);
            // processButton.innerHTML = "Processed";
            // processButton.style.color = "white";
		});
	}

	function onResult(res) {
        console.log(res)
        rects = res.words.map(r => r.bbox);
        showBoxes();
        console.log(JSON.stringify(rects))
	}

    function getX(x) {
        return x * input.width / realWidth ;
    } 

    function getY(y) {
        return y * input.height / realHeight;
    }


	function showBoxes() {
        for (let b of rects) {
            ioctx.strokeWidth = 2;
            ioctx.strokeStyle = 'red';
            let x0 = getX(b.x0)
            let y0 = getY(b.y0)
            let x1 = getX(b.x1)
            let y1 = getY(b.y1)
            ioctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        }

	}

	onMount(() => {
        document.body.addEventListener('drop', async function(e){
            e.preventDefault();
            e.stopPropagation();
            handleFile(e.dataTransfer.files[0]);
        });
        document.body.addEventListener('keydown', onEnter, false)
	});

    function updateCanvas() {
        let width = input.width;
        let height = input.height;
        input_overlay.width = width;
        input_overlay.height = height;
        ioctx = input_overlay.getContext('2d');
    }

    function getMousePos(canvas, evt) {
        let bb = canvas.getBoundingClientRect();

        return {
            x: (evt.clientX - bb.left) / (bb.right - bb.left) * canvas.width,
            y: (evt.clientY - bb.top) / (bb.bottom - bb.top)  * canvas.height
        };

    }


    function startRect(e) {
        // if (mode == 0) return
       console.log(e)
       rectStart = getMousePos(input_overlay, e)
    }

    function drawRect(e) {
        if (rectStart) {
            ioctx.clearRect(0, 0, 10000, 10000);
            showBoxes();
            ioctx.strokeStyle = mode == 1 ? 'green' : 'blue';
            let {x, y} = getMousePos(input_overlay, e);
            ioctx.strokeRect(rectStart.x, rectStart.y, x - rectStart.x, y - rectStart.y);
        }
    }

    function finishRect(e) {
        let {x, y} = getMousePos(input_overlay, e);
        finished = {
            x0: rectStart.x,
            y0: rectStart.y,
            x1: x,
            y1: y
        }
        rectStart = false;
    }

    function onEnter(e) {
        if (e.keyCode == 13) {
            switch (mode) {
                case 1: addNewBox(); break;
                case 2: deleteBoxes(); break;
            }
        }
    }

    function addNewBox() {
        // If they have not finished drawing the box
        if (finished) {
            // Add the box to the array
            rects.push(finished);
            // Clear the canvas
            ioctx.clearRect(0, 0, 10000, 10000);
            // Show the boxes
            showBoxes();
            // Reset the finished box
            finished = false;
        }
    }

    function deleteBoxes() {
        // If they have not finished drawing the box
        if (finished) {
            let newRects = [];
            for (let rect of rects) {
                // Check whether the rect is within the box
                if (getX(rect.x0) >= finished.x0 && 
                    getX(rect.x1) <= finished.x1 && 
                    getY(rect.y0) >= finished.y0 && 
                    getY(rect.y1) <= finished.y1) {
                        // Remove the box from the array
                        // rects.splice(rects.indexOf(rect), 1);
                } else {
                    newRects.push(rect);
                }
            }
            rects = newRects;
            // Clear the canvas
            ioctx.clearRect(0, 0, 10000, 10000);
            // Show the boxes
            showBoxes();
            // Reset the finished box
            finished = false;
        }
    }


</script>

<main 
    ondragover="return false;"
    class="border left-0 right-0 top-0 bottom-0 items-center">

	<div bind:this={div} id="img-container" class="" >
		<canvas 
        on:mousedown={startRect}
        on:mousemove={drawRect}
        on:mouseup={finishRect}
        
        bind:this={input_overlay}
         id="input-overlay" 
         class="positioning mt-5"/>
        <img
            bind:this={input}
            hidden={!showImage}
            id="input"
            class="toFit positioning"
            alt="input"
        />
        <p hidden={showImage} class="toFit positioning text-slate-500 " id="text">
            Drag an Image to Start
        </p>
	</div>

    <!-- <div class="border-wrap" style="background: linear-gradient({90}deg, green {percentage}%, white {percentage}%)"> -->
    <div class="bottomLocation flex flex-col">
        <button on:click={logTesseract} 
            bind:this={processButton}
            class="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
        >
            Process Image
        </button>
        <progress class=" mt-2 h-1" width={500} value={$percentage} />
    </div>

    <div class="leftLocation flex flex-col">
        <button on:click={() => mode = 1} 
        disabled={!processed}
            class="inline-block px-5 py-2 m-2 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
        >
            +
        </button>
        <button on:click={() => mode = 2} 
        disabled={!processed}
        class="inline-block px-5 py-2 m-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
    >
        -
    </button>
    </div>

	
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
		padding: 20px;
    }

    .positioning {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
    }

	#input-overlay {
        z-index: 20;
        cursor: crosshair;
		/* border: 1px solid #d00;    */
	}


    .bottomLocation {
        position:absolute;
        left: 50%;
        transform: translate(-50%, -20%);
        width:fit-content;
        height:fit-content;
        bottom:0;
    }

    .leftLocation {
        position:absolute;
        left: 2%;
        top: 2%;
        width:fit-content;
        height:fit-content;

    }

    .border-wrap {
        position:absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        width:fit-content;
        height:fit-content;
        bottom:0;
        max-width: 250px;
        padding: 1rem;
        border-radius: 0.35rem;
        box-sizing: border-box;
        /* position: relative; */
        /* background: linear-gradient(to right, red, purple); */
        padding: 3px;
    }

    main {
        /* max-height: 80vh;
        max-width: screen; */
        position: relative;
        height:100%;
        width:100%;
    }

    button:disabled {
		background: #f5f5f5;
		color: #c3c3c3;
	}


</style>
