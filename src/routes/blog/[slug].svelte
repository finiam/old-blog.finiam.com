<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const hydrate = false;

	export const load: Load = async ({ fetch, page }) => {
		const response = await fetch(`/api/posts/${page.params.slug}.json`);

		if (response.status !== 200) {
			return {
				status: response.status
			};
		}

		const post = await response.json();

		return { props: { post }, maxage: 300 };
	};
</script>

<script>
	import { page } from '$app/stores';
	import Author from '$lib/components/Author.svelte';
	import AuthorAvatar from '$lib/components/AuthorAvatar.svelte';
	import Layout from '$lib/components/Layout.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import Facebook from '$lib/icons/Facebook.svelte';
	import Linkedin from '$lib/icons/Linkedin.svelte';
	import Twitter from '$lib/icons/Twitter.svelte';

	export let post;
</script>

<Layout>
	<Navbar title={post.title} slot="nav" />

	<Seo title={post.title} description={post.description} keywords={post.keywords} />

	<article class="flex flex-col items-center mx-auto max-w-12-col md:max-w-none">
		<div class="w-full mb-72 lg:px-gutter max-w-10-col lg:max-w-full">
			<h1 class="text-2xl text-brand mb-40 font-edgy">
				{post.title}
			</h1>

			<Author {post} />
		</div>

		<div class="prose prose-center lg:max-w-full lg:prose-full text-lg font-serif md:break-words">
			{@html post.body}
		</div>

		<div class="flex flex-row md:flex-col w-full mt-80 justify-between lg:px-gutter">
			<div>
				<p class="mb-16 font-edgy">Written by</p>

				<div class="flex flex-row items-center md:mb-48">
					<div class="w-48 h-48 mr-16">
						<AuthorAvatar author={post.author} />
					</div>

					<div class="flex flex-col">
						<p class="text-lg">{post.author.name}</p>
						<p class="text-gray">{post.author.role}</p>
					</div>
				</div>
			</div>

			<div>
				<p>Share</p>

				<ul class="flex flex-row space-x-24 mt-16 items-center">
					<li class="hover:opacity-60">
						<a href="https://twitter.com/intent/tweet?url=https://finiam.com/{$page.path}">
							<Twitter />
						</a>
					</li>
					<li class="hover:opacity-60">
						<a
							href="https://www.linkedin.com/shareArticle?mini=true&url=https://finiam.com/{$page.path}"
						>
							<Linkedin />
						</a>
					</li>
					<li class="hover:opacity-60">
						<a href="https://www.facebook.com/sharer/sharer.php?u=https://finiam.com/{$page.path}">
							<Facebook />
						</a>
					</li>
				</ul>
			</div>
		</div>
	</article>
</Layout>
