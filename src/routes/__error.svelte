<script lang="ts" context="module">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const hydrate = false;

	export const load: ErrorLoad = async ({ error, status }) => {
		if (status !== 404) console.error(error);

		return {
			props: {
				status
			}
		};
	};
</script>

<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Seo from '$lib/components/SEO.svelte';

	export let status: number;
</script>

<Layout>
	<Navbar title="Blog" slot="nav" disableSubNav />

	<div class="flex flex-col justify-center items-center text-center">
		<p class=" text-2xl mb-16">Oops.</p>

		{#if status === 404}
			<Seo title="Not Found" />
			<p class="text-lg font-light">Page not found...</p>
		{:else}
			<Seo title="Bad error" />

			<p class="text-lg font-light">Something crashed on our side. We'll fix it soon...</p>
		{/if}

		<a href="/" class="text-brand mt-40">Go home</a>
	</div>
</Layout>
