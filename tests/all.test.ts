import { expect, test } from "@playwright/test";
import t from "../locales/en.json" assert { type: "json" };

test("test", async ({ page }) => {
	expect(t.start).toBe("Start");
	await page.goto("http://localhost:4173/");
	await page.getByRole("link", { name: t.start }).click();
	await page.getByText(t.upload, { exact: true }).setInputFiles("static/favicon.png");
	const downloadPromise = page.waitForEvent("download");
	await page.locator("span").getByRole("button").click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toBe("watermarked-favicon.png");
	const download1Promise = page.waitForEvent("download");
	await page.getByRole("button", { name: t["download-all"] }).click();
	const download1 = await download1Promise;
	expect(download1.suggestedFilename()).toBe("watermarked.zip");
});
