<script lang="ts">
	import Drawer from "$lib/component/Drawer.svelte";
	import Head from "$lib/component/Head.svelte";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	// @ts-expect-error
	import { pwaInfo } from "virtual:pwa-info";
	import "../app.css";

	onMount(async () => {
		if (pwaInfo) {
			// @ts-expect-error
			const { registerSW } = await import("virtual:pwa-register");
			registerSW({
				immediate: true,
				onRegistered(r: ServiceWorkerRegistration) {
					r &&
						setInterval(() => {
							console.log("Checking for sw update");
							r.update();
						}, 300_000);
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error: Error) {
					console.log("SW registration error", error);
				},
			});
		}
	});

	$: manifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<Head description="{$t('slogan')} {$t('description')}" />

<svelte:head>
	{@html manifest}
</svelte:head>

<Drawer title={$t("watermark-app")}>
	<svelte:fragment slot="menu">
		<li>
			<a href="/app"> App </a>
		</li>
		<li>
			<a href="https://github.com/JacobLinCool/watermark-app" target="_blank"> GitHub </a>
		</li>
	</svelte:fragment>
	<div class="h-full w-full p-2" slot="body">
		<slot />
	</div>
</Drawer>
