<script>
	import Tesseract from '$lib/Tess.svelte';
    import Canvas3D from '$lib/Canvas3D.svelte';
</script>


<main ondragover="return false" class="border border-blue-500 test">
    <div class="border px-5 grid grid-cols-2 gap-10 justify-items-center h-full max-h-fit">
        <Tesseract/>
        <Canvas3D/>
    </div>
</main>


<style>
.test {
    height: 80vh;
    width: 100%;
}
</style>