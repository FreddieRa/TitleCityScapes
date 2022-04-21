<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>


<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 2rem 3rem;
		width: 100%;
        height: 100%;
		margin: 10 10;
		box-sizing: border-box;
	}

</style>
