<script lang="ts">
	import { page } from "$app/stores";

	export let title = "";
	export let description = "A simple app to add watermarks to images.";
	export let image = `https://watermark-app.pages.dev/banner.jpg`;

	function ellipsis(str: string, len: number) {
		if (str.length <= len) {
			return str;
		}

		const words = str.split(" ");
		let result = "";
		for (const word of words) {
			if (result.length + word.length > len) {
				break;
			}
			result += word + " ";
		}
		return result + "...";
	}
</script>

<svelte:head>
	{#if title}
		<title>{title} | Watermark App</title>
	{:else}
		<title>Watermark App</title>
	{/if}
	<meta name="description" content={ellipsis(description.replace(/\n/g, " "), 240)} />
	<meta property="og:image" content={image} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
