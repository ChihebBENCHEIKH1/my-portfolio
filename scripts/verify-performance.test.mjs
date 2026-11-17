import assert from "node:assert/strict";
import http from "node:http";
import { fileURLToPath } from "node:url";
import test from "node:test";
import puppeteer from "puppeteer";
import sirv from "sirv";

test("the original 3D city loads automatically and its controls remain usable", { timeout: 90000 }, async () => {
  const server = http.createServer(sirv(fileURLToPath(new URL("../dist/", import.meta.url))));
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    });
    for (const [route, width, reduced] of [["/", 1280, false], ["/de/", 390, true]]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }]);
      const requests = [];
      const errors = [];
      page.on("request", request => requests.push(request.url()));
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(origin + route, { waitUntil: "networkidle0" });
      await page.waitForSelector(".city-launch");
      // The full renderer remains the default, including on mobile. Wait for
      // a real WebGL scene, not just a canvas element or the SVG fallback.
      await page.waitForFunction(() => {
        const fallback = document.querySelector(".city-landmarks-fallback");
        return fallback && getComputedStyle(fallback).visibility === "hidden" && document.querySelector(".city-foreground-3d canvas");
      }, { timeout: 25000 });
      assert(requests.some(url => /vendor-three/.test(url)), `${route}: full 3D loads automatically`);
      assert.equal(await page.$eval(".city-layer", el => el.getAttribute("data-active")), "true");
      assert(await page.$(".tokyo-tower"), `${route}: fallback landmarks are retained for WebGL failure`);
      await page.click(".city-day-toggle");
      assert.equal(await page.$eval(".city-day-toggle", el => el.getAttribute("aria-pressed")), "true");
      await page.click(".city-launch");
      await page.waitForSelector('.city-playground[role="dialog"]');
      await page.waitForFunction(() => !!document.querySelector(".city-foreground-3d canvas"), { timeout: 25000 });
      assert(requests.some(url => /vendor-three/.test(url)), `${route}: Explore retains the same 3D engine`);
      const before = Number(await page.$eval(".city-stepper output", el => el.textContent));
      await page.click(".city-stepper button:last-child");
      assert.equal(Number(await page.$eval(".city-stepper output", el => el.textContent)), before + 1);
      await page.click(".city-reset");
      assert.equal(Number(await page.$eval(".city-stepper output", el => el.textContent)), before);
      await page.keyboard.press("Escape");
      await page.waitForSelector(".city-launch");
      await page.waitForFunction(() => document.querySelector(".tokyo-hit")?.style.getPropertyValue("--tokyo-x"));
      assert.equal(await page.evaluate(() => document.documentElement.style.getPropertyValue("--tokyo-x")), "");
      assert.equal(await page.$eval("#main-content", el => el.hasAttribute("inert")), false);
      assert.equal(await page.evaluate(() => document.activeElement?.classList.contains("city-launch")), true);
      assert(await page.$(`footer a[href="${route}profile.json"]`));
      assert.deepEqual(errors, [], `${route}: no browser exceptions`);
      await page.close();
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});
