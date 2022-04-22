<script>
	import Tesseract from '$lib/Tess.svelte';
    import Canvas3D from '$lib/Canvas3D.svelte';

    let rects;
    let processed;

    $ : console.log(processed);
</script>

<svelte:head>
	<title>Title City Scapes</title>
</svelte:head>

<main ondragover="return false" class="test">
    <div class="px-5 grid grid-cols-2 gap-10 justify-items-center h-full max-h-fit">
        <Tesseract bind:rects bind:processed/>
        <Canvas3D bind:rects bind:processed/>
    </div>
</main>


<style>
.test {
    height: 80vh;
    width: 100%;
}
</style>