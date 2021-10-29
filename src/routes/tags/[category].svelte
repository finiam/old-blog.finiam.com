<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const hydrate = false;

	export const load: Load = async ({ fetch, page }) => {
		const response = await fetch(`/api/posts.json`);
		const posts = await response.json();

		if (response.status !== 200) {
			return {
				status: response.status
			};
		}

		if (!['development', 'design', 'team'].includes(page.params.category)) {
			return {
				status: 404
			};
		}

		return {
			props: {
				posts: posts.filter((post) => post.category === page.params.category),
				category: page.params.category
			},
			maxage: 300
		};
	};
</script>

<script>
	import Layout from '$lib/components/Layout.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import PostList from '$lib/components/PostList.svelte';
	import capitalize from '$lib/utils/capitalize';
	import Seo from '$lib/components/SEO.svelte';

	export let posts;
	export let category;
</script>

<Layout>
	<Seo title="{capitalize(category)} Blog" />

	<Navbar title="{capitalize(category)} Blog" slot="nav" />

	<PostList {posts} />
</Layout>
