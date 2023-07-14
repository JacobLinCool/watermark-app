<script lang="ts">
	import { t } from "svelte-i18n";
	import { fade } from "svelte/transition";
</script>

<div
	in:fade={{ duration: 200, delay: 200 }}
	out:fade={{ duration: 200 }}
	class="h-full w-full flex justify-center items-center"
>
	<div class="prose">
		<h1>{$t("welcome")}</h1>
		<p>
			{$t("slogan")} <br />
			{$t("description")}
		</p>
		<p>
			<a class="btn btn-primary" href="./app">
				{$t("start")}
			</a>
		</p>
	</div>
</div>
