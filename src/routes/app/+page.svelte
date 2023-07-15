<script lang="ts">
	import { browser } from "$app/environment";
	import { t } from "svelte-i18n";
	import { fade } from "svelte/transition";
	import Icon from "@iconify/svelte";
	import Watermark from "./Watermark.svelte";

	let images: FileList | null = null;

	let text = $t("default-watermark");
	let size = 30;
	let opacity = 30;
	let luminosity = 70;
	let repeat = false;

	let editors: Watermark[] = [];

	const buffer_timeout = 300;
	let buffer_text = text;
	let buffer_size = size;
	let buffer_opacity = opacity;
	let buffer_luminosity = luminosity;
	let buffer_repeat = repeat;
	let buffer_timer: number | null = null;
	$: {
		if (browser) {
			if (buffer_timer) {
				clearTimeout(buffer_timer);
				buffer_timer = null;
			}
			buffer_timer = window.setTimeout(() => {
				text = buffer_text;
				size = buffer_size;
				opacity = buffer_opacity;
				luminosity = buffer_luminosity;
				repeat = buffer_repeat;
			}, buffer_timeout);
		}
	}

	let downloading = false;

	async function download(idx: number) {
		if (!images) {
			return;
		}

		if (downloading) {
			return;
		}
		downloading = true;

		const a = document.createElement("a");
		a.href = await editors[idx].png();
		a.target = "_blank";
		a.download = watermarked_name(images[idx].name);
		a.click();
		a.remove();

		downloading = false;
	}

	async function download_all() {
		if (!images) {
			return;
		}

		if (downloading) {
			return;
		}
		downloading = true;

		const JSZip = (await import("jszip")).default;
		const zip = new JSZip();
		for (let i = 0; i < editors.length; i++) {
			zip.file(watermarked_name(images[i].name), editors[i].blob(), { binary: true });
		}

		const blob = await zip.generateAsync({ type: "blob" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.target = "_blank";
		a.download = "watermarked.zip";
		a.click();
		a.remove();

		downloading = false;
	}

	function watermarked_name(original: string) {
		// remove extension
		const ext = original.lastIndexOf(".");
		if (ext !== -1) {
			original = original.substring(0, ext);
		}

		// add suffix
		return `${original}-watermarked.png`;
	}
</script>

<div
	in:fade={{ duration: 200, delay: 200 }}
	out:fade={{ duration: 200 }}
	class="h-full w-full flex justify-center items-center"
>
	{#if !images || images.length === 0}
		<div class="prose">
			<h2>
				{$t("step-1")}
			</h2>
			<label class="btn btn-primary">
				<input class="hidden" type="file" accept="image/*" multiple bind:files={images} />
				{$t("upload")}
			</label>
		</div>
	{:else}
		<div
			class="max-h-full md:h-full w-full flex flex-col-reverse md:flex-row justify-around items-center p-4 max-md:overflow-auto"
		>
			<div class="carousel md:carousel-vertical md:flex-1 h-full p-2 gap-2">
				{#each Array.from(images) as image, i}
					<div
						class="carousel-item w-full h-full border rounded-xl overflow-hidden flex justify-center items-center"
					>
						<Watermark
							{image}
							{text}
							{size}
							{opacity}
							{luminosity}
							{repeat}
							bind:this={editors[i]}
						/>
						<span
							class="absolute top-0 right-0 p-2 bg-gray-800 bg-opacity-50 rounded-bl-xl text-white text-sm"
						>
							{i + 1}. {image.name}

							<button
								class="btn btn-xs btn-ghost ml-1"
								on:click={() => download(i)}
								disabled={downloading}
							>
								<Icon icon="octicon:download-16" class="inline-block" />
							</button>
						</span>
					</div>
				{/each}
			</div>
			<div class="md:flex-1">
				<div class="prose">
					<h2>
						{$t("step-2")}
					</h2>

					<div>
						<label class="label" for="">{$t("text")}</label>
						<input
							class="input input-bordered w-full"
							type="text"
							bind:value={buffer_text}
							placeholder="Only for testing purposes!"
						/>
					</div>

					<div>
						<label class="label" for="">{$t("size")} {buffer_size}px</label>
						<input
							class="range range-bordered w-full"
							type="range"
							bind:value={buffer_size}
							min="10"
							max="200"
						/>
					</div>

					<div>
						<label class="label" for="">{$t("opacity")} {buffer_opacity}%</label>
						<input
							class="range range-bordered w-full"
							type="range"
							bind:value={buffer_opacity}
							min="1"
							max="100"
						/>
					</div>

					<div>
						<label class="label" for="">{$t("luminosity")} {buffer_luminosity}%</label>
						<input
							class="range range-bordered w-full"
							type="range"
							bind:value={buffer_luminosity}
							min="0"
							max="100"
						/>
					</div>

					<div>
						<label class="label" for="">{$t("repeat")}</label>
						<input
							class="checkbox checkbox-bordered"
							type="checkbox"
							bind:checked={buffer_repeat}
						/>
					</div>

					<button
						class="btn btn-primary my-4"
						on:click={download_all}
						disabled={downloading}
					>
						{$t("download-all")}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
