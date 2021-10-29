<script lang="ts">
	import type { Post } from '$lib/types';
	import capitalize from '$lib/utils/capitalize';
	import AuthorAvatar from './AuthorAvatar.svelte';

	export let post: Post;
</script>

<div class="flex flex-row items-center">
	<div class="w-32 h-32 mr-16">
		<AuthorAvatar author={post.author} />
	</div>

	<p class="text-gray">
		{#if post.category}
			{post.author.name} · {capitalize(post.category)} · {new Date(post.publishedAt).toLocaleString(
				'default',
				{ month: 'long', year: 'numeric' }
			)}
		{:else}
			{post.author.name} · {new Date(post.publishedAt).toLocaleString('default', {
				month: 'long',
				year: 'numeric'
			})}
		{/if}
	</p>
</div>
