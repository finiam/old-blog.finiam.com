<script lang="ts">
	import { browser } from '$app/env';
	import { page } from '$app/stores';
	import ShortLogo from '$lib/icons/ShortLogo.svelte';

	export let title: string;
	export let disableSubNav = false;

	let backLink = '/';

	$: {
		if (browser) {
			if (window.history.length !== 1) backLink = 'javascript:history.back()';
		}
	}
</script>

<nav class="py-40 flex flex-col border-b border-gray-light">
	<div class="max-w-18-col w-full mx-auto px-56 md:px-0">
		<div class="flex flex-row items-center justify-between md:px-gutter">
			<div class="flex flex-row items-baseline">
				<a href="https://finiam.com"><ShortLogo /></a>
				<a class="ml-8 text-2xl font-serif" href="/">/&nbsp;blog</a>
			</div>

			<ul class="flex flex-row space-x-24 font-edgy">
				<li><a class="text-brand" href="/">Blog</a></li>
				<li><a href="mailto:contact@finiam.com">Say Hi</a></li>
			</ul>
		</div>

		{#if !disableSubNav}
			{#if $page.path === '/' || $page.path.startsWith('/tags/')}
				<ul
					class="flex flex-row space-x-24 mt-32 text-lg font-edgy md:max-w-full md:overflow-x-auto md:whitespace-nowrap md:pl-gutter"
				>
					<li>
						<a class:text-gray={$page.path !== '/'} class:text-brand={$page.path === '/'} href="/">
							All Blogposts
						</a>
					</li>
					<li>
						<a
							sveltekit:prefetch
							class:text-gray={$page.path !== '/tags/design'}
							class:text-brand={$page.path === '/tags/design'}
							href="/tags/design"
						>
							Design
						</a>
					</li>
					<li>
						<a
							sveltekit:prefetch
							class:text-gray={$page.path !== '/tags/development'}
							class:text-brand={$page.path === '/tags/development'}
							href="/tags/development"
						>
							Development
						</a>
					</li>
					<li>
						<a
							sveltekit:prefetch
							class:text-gray={$page.path !== '/tags/team'}
							class:text-brand={$page.path === '/tags/team'}
							href="/tags/team"
						>
							Team
						</a>
					</li>
				</ul>
			{:else}
				<div class="flex flex-row space-x-6 mt-32 text-lg md:px-gutter">
					<a href={backLink}><span class="text-gray">← Blog</span> / {title}</a>
				</div>
			{/if}
		{/if}
	</div>
</nav>
