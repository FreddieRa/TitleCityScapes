<script>
	import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';

    import Tesseract from '$lib/Tess.svelte';
    import Canvas3D from '$lib/Canvas3D.svelte';
    import Popup from '$lib/Popup.svelte';

    
    const modal = writable(null);
    const showModal = () => modal.set(Popup);

    let rects;
    let processed;

    $ : console.log(processed);

    onMount(() => {
        const visited = localStorage.getItem('visited', false);
        console.log(visited)
        if (!visited) showModal();
        localStorage.setItem('visited', true);
    });
</script>

<svelte:head>
	<title>Title City Scapes</title>
</svelte:head>

<main ondragover="return false" class="test">
    <Modal show={$modal}>
        <div class="px-5 grid grid-cols-2 gap-10 justify-items-center h-full max-h-fit">
            <Tesseract bind:rects bind:processed/>
            <Canvas3D rects={rects} bind:processed/>
        </div>
    </Modal>
</main>


<style>
.test {
    height: 80vh;
    width: 100%;
}
</style>