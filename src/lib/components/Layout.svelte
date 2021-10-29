<script>
	import Footer from './Footer.svelte';
</script>

<slot name="nav" />

<main class="max-w-18-col pt-96 pb-168 lg:pb-104 md:pt-56 md:pb-88 mx-auto">
	<slot />
</main>

<Footer />
