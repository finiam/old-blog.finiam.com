<script lang="ts">
	import type { Author } from '$lib/types';

	export let author: Author;
</script>

{#if author.image}
	<img
		class="rounded-full bg-gray-light w-full h-full"
		src="{author.image.asset.url}?w=52&h=52&auto=format&fit=crop"
		alt="{author.name}'s avatar"
		loading="lazy"
	/>
{:else}
	<div
		class="rounded-full bg-gray-light w-full h-full"
		aria-label="No photo present for this author"
	/>
{/if}
