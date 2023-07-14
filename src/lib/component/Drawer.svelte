<script lang="ts">
	import Icon from "@iconify/svelte";

	export let title: string;

	const id = Math.random().toString(36).substring(2);
</script>

<div class="drawer h-full">
	<input id="drawer-{id}" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex h-full flex-col overflow-hidden">
		<!-- Navbar -->
		<div class="navbar w-full bg-base-200">
			<div class="flex-none lg:hidden">
				<label for="drawer-{id}" class="btn-ghost btn-square btn">
					<Icon icon="mdi:menu" class="inline-block h-6 w-6 stroke-current" />
				</label>
			</div>
			<a class="contents" href="/">
				<div class="mx-2 flex-1 px-2 text-xl font-bold">{title}</div>
			</a>

			<div class="hidden flex-none lg:block">
				<ul class="menu menu-horizontal gap-2">
					<slot name="menu" />
				</ul>
			</div>
		</div>
		<div class="w-full flex-1 overflow-hidden">
			<slot name="body" />
		</div>
	</div>
	<div class="drawer-side z-10">
		<label for="drawer-{id}" class="drawer-overlay" />
		<ul class="menu h-full w-80 gap-2 bg-base-200 p-4 !duration-200">
			<slot name="menu" />
		</ul>
	</div>
</div>
