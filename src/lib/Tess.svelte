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

    function handleFile(file) {
        if (file.type.match(/image.*/)) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let img = document.getElementById('input');
                img.src = e.target.result;
                img.onload = () => {
                    console.log("Loaded")
                    showImage = true
                    updateCanvas();
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

	function showBoxes() {
        for (let b of rects) {
            ioctx.strokeWidth = 2;
            ioctx.strokeStyle = 'red';
            ioctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0)
        }

	}

	onMount(() => {
		updateCanvas();

        document.body.addEventListener('drop', async function(e){
            e.preventDefault();
            e.stopPropagation();
            handleFile(e.dataTransfer.files[0]);
        });
        document.body.addEventListener('keydown', onEnter, false)
	});

    function updateCanvas() {
        let img = document.getElementById('input');
        
        input_overlay.width = img.width;
		input_overlay.height = img.height;
        ioctx = null
		ioctx = input_overlay.getContext('2d');
        console.log(ioctx)
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        let s1 = 1;
        let s2 = 1;

        return {
            x: (evt.clientX - rect.left*s1) / (rect.right*s1 - rect.left*s1) * canvas.width * s2,
            y: (evt.clientY - rect.top*s1) / (rect.bottom*s1 - rect.top*s1)  * canvas.height * s2
        };
    }


    function startRect(e) {
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
            
            for (let rect of rects) {
                // Check whether the rect is within the box
                if (rect.x0 >= finished.x0 && 
                    rect.x1 <= finished.x1 && 
                    rect.y0 >= finished.y0 && 
                    rect.y1 <= finished.y1) {
                        // Remove the box from the array
                        rects.splice(rects.indexOf(rect), 1);
                }
            }
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
         id="input-overlay" class="toFit"/>
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

    <!-- <div class="border-wrap" style="background: linear-gradient({90}deg, green {percentage}%, white {percentage}%)"> -->
    <div class="bottomLocation flex flex-col">
        <button on:click={logTesseract} 
            bind:this={processButton}
            class="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
        >
            Process Image
        </button>
        <progress class="w-full mt-2 h-1" value={$percentage} />
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

		position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
		padding: 20px;
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
