<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const hydrate = false;

	export const load: Load = async ({ fetch }) => {
		const response = await fetch('/api/posts.json');
		const posts = await response.json();

		if (response.status !== 200) {
			return {
				status: response.status
			};
		}

		return { props: { posts }, maxage: 300 };
	};
</script>

<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import PostList from '$lib/components/PostList.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import type { Post } from '$lib/types';

	export let posts: Post[];
</script>

<Layout>
	<Seo />

	<Navbar title="Blog" slot="nav" />

	<PostList {posts} />
</Layout>
