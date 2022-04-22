<script context="module">
	import { browser, dev } from '$app/env';
    import Canvas3D from '$lib/Canvas3D.svelte';
    import example from '$lib/json/exampleRects.json'


	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	// export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	// export const prerender = true;

    let processed = true;

    let rects = example;

</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="content">
	<h1 class="font-medium leading-tight text-5xl mt-0 mb-2 text-red-600">About</h1>

	<p>
		This is a site built to analyse title pages, like the one below, and build cities out of them.
	</p>

    <div class="p-5 grid grid-cols-2 gap-10 justify-items-center w-1/2 m-auto">
        <div class="border">
            <img src="/Women.jpg" class="p-10" alt="A title page of the work ">
        </div>
        <Canvas3D bind:rects bind:processed/>
    </div>

    
    <br>
    <p>
        This was directly inspired by the excellent work of <a href="https://c82.net/" class="text-red-500">Nicholas Rougeux</a> and his <a href="https://c82.net/work/?id=385" class="text-red-500">Title Cities</a> project. These beautiful designs 
    </p>

</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
    .test {
        height: 80vh;
        width: 100%;
    }

</style>