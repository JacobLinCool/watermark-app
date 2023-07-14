<svelte:options accessors={true} />

<script lang="ts">
	import { onMount, onDestroy, afterUpdate } from "svelte";

	export let image: File;
	export let text: string;
	export let size: number;
	export let opacity: number;
	export let luminosity: number;

	export function png() {
		return canvas.toDataURL("image/png");
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let img: HTMLImageElement;

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) {
			throw new Error("2d context not supported");
		}
		ctx = context;

		img = new Image();
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			edit();
		};
		img.src = URL.createObjectURL(image);
	});

	afterUpdate(() => {
		requestAnimationFrame(edit);
	});

	onDestroy(() => {
		URL.revokeObjectURL(img.src);
	});

	function edit() {
		if (ctx && img) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, img.width, img.height);
			ctx.font = size + "px Arial";
			ctx.fillStyle = `rgba(128, 128, 128, ${opacity / 100})`;

			const lines = img.height / (size * 1.5);
			const width = ctx.measureText(text).width;
			const x_step = (img.width - width) / lines;
			const y_step = size * 1.5;

			for (let i = 0; i < lines + 1; i++) {
				const [r, g, b] = hsl2rgb((i * 360) / lines, 100, luminosity);
				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
				ctx.fillText(text, i * x_step, i * y_step);
			}
		}
	}

	function hsl2rgb(h: number, s: number, l: number): [r: number, g: number, b: number] {
		s /= 100;
		l /= 100;
		const k = (n: number) => (n + h / 30) % 12;
		const a = s * Math.min(l, 1 - l);
		const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
		return [255 * f(0), 255 * f(8), 255 * f(4)];
	}
</script>

<canvas class="max-w-full max-h-full" bind:this={canvas} />
