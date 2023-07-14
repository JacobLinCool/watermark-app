<script lang="ts">
	import Drawer from "$lib/component/Drawer.svelte";
	import Head from "$lib/component/Head.svelte";
	import { t } from "svelte-i18n";
	import "../app.css";
</script>

<Head description="{$t('slogan')} {$t('description')}" />

<Drawer title={$t("watermark-app")}>
	<svelte:fragment slot="menu">
		<li>
			<a href="/app">App</a>
		</li>
	</svelte:fragment>
	<div class="h-full w-full p-2" slot="body">
		<slot />
	</div>
</Drawer>
