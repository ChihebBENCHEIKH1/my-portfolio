import assert from "node:assert/strict";
import http from "node:http";
import { fileURLToPath } from "node:url";
import test from "node:test";
import puppeteer from "puppeteer";
import sirv from "sirv";

test("the prerendered name stays visible and stable until interaction", { timeout: 20000 }, async () => {
  const server = http.createServer(sirv(fileURLToPath(new URL("../dist/", import.meta.url))));
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      window.nameSamples = [];
      let currentHeading;
      let headingObserver;
      const observeHeading = () => {
        const heading = document.querySelector("#Home h1");
        if (!heading || heading === currentHeading) return;
        currentHeading = heading;
        headingObserver?.disconnect();
        const sample = () => {
          const pink = heading.querySelector(".glow-pink");
          if (pink) window.nameSamples.push({ opacity: Number(getComputedStyle(heading).opacity), text: pink.textContent });
        };
        headingObserver = new MutationObserver(sample);
        headingObserver.observe(heading, { attributes: true, attributeFilter: ["style"], childList: true, characterData: true, subtree: true });
        sample();
      };
      const rootObserver = new MutationObserver(observeHeading);
      document.addEventListener("DOMContentLoaded", () => {
        observeHeading();
        rootObserver.observe(document.getElementById("root"), { childList: true, subtree: true });
      }, { once: true });
      window.stopNameObservation = () => { rootObserver.disconnect(); headingObserver?.disconnect(); };
    });
    await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil: "networkidle0" });
    await new Promise(resolve => setTimeout(resolve, 4500));
    const samples = await page.evaluate(() => { window.stopNameObservation(); return window.nameSamples; });
    assert(samples.length > 0, "observed the rendered heading");
    assert(samples.every(value => value.opacity === 1), "the already-visible heading faded out during startup");
    assert(samples.every(value => value.text === "CHEIKH"), "an idle timer rewrote the already-visible name");
    await page.evaluate(() => {
      window.nameHoverChanges = 0;
      const observer = new MutationObserver(() => { window.nameHoverChanges++; });
      observer.observe(document.querySelector("#Home h1 .glow-pink"), { childList: true, characterData: true, subtree: true });
    });
    await page.hover("#Home h1 .glow-pink");
    await page.waitForFunction(() => window.nameHoverChanges > 1);
    await page.waitForFunction(() => document.querySelector("#Home h1 .glow-pink").textContent === "CHEIKH");
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

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
      await page.evaluateOnNewDocument(() => {
        window.shaderDebugQueries = 0;
        window.shaderWarmCompletionObserved = false;
        window.unpreparedFirstDrawPrograms = 0;
        window.sceneDrawStarted = false;
        const prototype = WebGL2RenderingContext.prototype;
        const getProgramParameter = prototype.getProgramParameter;
        prototype.getProgramParameter = function (program, parameter) {
          const result = getProgramParameter.call(this, program, parameter);
          const extension = this.getExtension("KHR_parallel_shader_compile");
          if (extension && parameter === extension.COMPLETION_STATUS_KHR && result === true) window.shaderWarmCompletionObserved = true;
          return result;
        };
        const linkProgram = prototype.linkProgram;
        prototype.linkProgram = function (program) {
          if (window.shaderWarmCompletionObserved && !window.sceneDrawStarted) window.unpreparedFirstDrawPrograms++;
          return linkProgram.call(this, program);
        };
        for (const name of ["drawElements", "drawArrays"]) {
          const original = prototype[name];
          prototype[name] = function (...args) {
            window.sceneDrawStarted = true;
            return original.apply(this, args);
          };
        }
        for (const name of ["getProgramInfoLog", "getShaderInfoLog"]) {
          const original = WebGL2RenderingContext.prototype[name];
          WebGL2RenderingContext.prototype[name] = function (...args) {
            window.shaderDebugQueries++;
            return original.apply(this, args);
          };
        }
      });
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
      assert.equal(await page.evaluate(() => window.shaderDebugQueries), 0, `${route}: production startup avoids synchronous shader-debug queries`);
      if (await page.evaluate(() => window.shaderWarmCompletionObserved)) {
        assert.equal(await page.evaluate(() => window.unpreparedFirstDrawPrograms), 0, `${route}: first draw reused its prepared shaders`);
      }
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
