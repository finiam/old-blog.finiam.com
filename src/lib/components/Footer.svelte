<script>
	import Dev from '$lib/icons/Dev.svelte';
	import Twitter from '$lib/icons/Twitter.svelte';
	import Facebook from '$lib/icons/Facebook.svelte';
	import Github from '$lib/icons/Github.svelte';
	import Instagram from '$lib/icons/Instagram.svelte';
	import Linkedin from '$lib/icons/Linkedin.svelte';
	import LongLogo from '$lib/icons/LongLogo.svelte';
</script>

<footer class="border-gray-light border-t">
	<address
		class="max-w-18-col pt-64 pb-96 px-56 md:px-gutter mx-auto flex flex-row lg:flex-col not-italic"
	>
		<div class="flex flex-col w-3-col mr-column-spacing lg:mr-0 lg:mb-40">
			<a href="https://finiam.com" aria-label="Finiam">
				<LongLogo />
			</a>

			<a class="mt-24 hover:opacity-60" href="mailto:contact@finiam.com">contact@finiam.com</a>
		</div>

		<div class="flex flex-col w-3-col mr-column-spacing lg:mr-0 lg:mb-40">
			<p class="text-gray mb-24 font-edgy">Get directions</p>

			<ul class="space-y-8">
				<li>
					<a
						href="https://www.google.com/maps/place/Subvisual/@41.5432058,-8.401708,17z/data=!3m1!4b1!4m5!3m4!1s0xd24f8d2f346281d:0x25c8359fe8964cf0!8m2!3d41.5432205!4d-8.3993921?shorturl=1"
						class="hover:opacity-60">Braga, Portugal →</a
					>
				</li>
				<li>
					<a
						href="https://www.google.com/maps/place/CIC+Cambridge+@+1+Broadway/@42.3626974,-71.0837953,15z/data=!4m5!3m4!1s0x89e370a5cb85c1c7:0x1672bc59901eb87a!8m2!3d42.3626974!4d-71.0837953?shorturl=1"
						class="hover:opacity-60">Boston, USA →</a
					>
				</li>
			</ul>
		</div>

		<div class="flex flex-col">
			<p class="text-gray mb-24 font-edgy">Follow Us</p>

			<ul class="flex flex-row space-x-24 items-center">
				<li class="hover:opacity-60">
					<a href="https://dev.to/finiam" aria-label="dev.to"><Dev /></a>
				</li>
				<li class="hover:opacity-60">
					<a href="https://twitter.com/wearefiniam" aria-label="Twitter"><Twitter /></a>
				</li>
				<li class="hover:opacity-60">
					<a href="https://www.linkedin.com/company/finiam" aria-label="LinkedIn"><Linkedin /></a>
				</li>
				<li class="hover:opacity-60">
					<a href="https://www.instagram.com/wearefiniam" aria-label="Instagram"><Instagram /></a>
				</li>
				<li class="hover:opacity-60">
					<a href="https://www.facebook.com/wearefiniam" aria-label="Facebook"><Facebook /></a>
				</li>
				<li class="hover:opacity-60">
					<a href="https://github.com/finiam" aria-label="Github"><Github /></a>
				</li>
			</ul>
		</div>
	</address>
</footer>
