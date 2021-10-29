<script lang="ts">
	import type { Post } from '$lib/types';

	import Author from './Author.svelte';

	export let posts: Post[] = [];
	let firstPost: Post;
	let otherPosts: Post[];
	$: {
		[firstPost, ...otherPosts] = posts;
	}
</script>

{#if firstPost}
	<ul class="grid gap-x-gutter gap-y-96 grid-cols-2 px-56 md:px-0 md:gap-y-72">
		<li class="flex flex-col col-span-2">
			<div class="h-456 w-full bg-gray-light">
				<a sveltekit:prefetch href="/blog/{firstPost.slug.current}/">
					<img
						class="h-456 w-full object-cover object-center"
						src="{firstPost.featuredImage.asset.url}?w=1024&q=80&auto=format"
						alt={firstPost.featuredImageAlt}
					/>
				</a>
			</div>

			<div class="grid grid-cols-2 mt-24 lg:grid-cols-1 md:px-gutter">
				<div class="flex flex-col lg:mb-40">
					<a
						class="block text-xl md:text-xl mr-column-spacing md:mr-0 font-edgy font-bold"
						href="/blog/{firstPost.slug.current}/"
					>
						{firstPost.title}
					</a>

					<div class="lg:hidden mt-40">
						<Author post={firstPost} />
					</div>
				</div>

				<a class="md:mt-0 mt-8 prose text-lg font-serif" href="/blog/{firstPost.slug.current}/">
					{firstPost.longDescription} →
				</a>

				<div class="hidden lg:block lg:mt-40 md:mt-32">
					<Author post={firstPost} />
				</div>
			</div>
		</li>

		{#each otherPosts as post}
			<li class="flex flex-col lg:col-span-2">
				<div class="h-456 w-full bg-gray-light">
					<a sveltekit:prefetch href="/blog/{post.slug.current}/">
						<img
							class="h-456 w-full object-cover object-center"
							src="{post.featuredImage.asset.url}?w=1024&h=336&q=75&auto=format&fit=crop"
							alt={post.featuredImageAlt}
							loading="lazy"
						/>
					</a>
				</div>

				<div class="md:px-gutter">
					<a
						class="block text-xl md:text-xl mt-32 font-edgy font-bold"
						href="/blog/{post.slug.current}/"
					>
						{post.title}
					</a>

					<a
						class="block my-40 md:my-32 font-serif prose text-lg"
						href="/blog/{post.slug.current}/"
					>
						{post.longDescription} →
					</a>

					<Author {post} />
				</div>
			</li>
		{/each}
	</ul>
{/if}
