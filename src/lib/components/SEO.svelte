<script lang="ts">
	export let title = 'Blog';
	export let description = "Finiam's blog";
	export let keywords =
		'blog, finiam, fintech, design, development, startup, team, agency, digital, software, product';
	export let image = '';
</script>

<title>{title} - Finiam</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content={description} />
<meta name="keywords" content={keywords} />

<meta content={title} property="og:title" />
<meta content={description} property="og:description" />
<meta content={image} property="og:image" />

<meta content={title} property="twitter:title" />
<meta content={description} property="twitter:description" />
<meta content={image} property="twitter:image" />

<meta content={title} property="twitter:title" />
<meta content={description} property="twitter:description" />
<meta content={image} property="twitter:image" />
