// Postbuild SSG: pre-render dist/index.html using headless Chromium so
// crawlers (LinkedIn, Bing, sourcing tools) and non-JS clients see fully
// rendered HTML. Googlebot also indexes the prerendered output faster.
//
// Flow:
//   1) Serve the freshly built dist/ on a random port
//   2) Headless Chromium loads each language and waits for real page content
//   3) Scroll through the page to trigger framer-motion useInView reveals
//      and lazy-loaded chunks
//   4) Serialize HTML with portable URLs into /index.html and /de/index.html
//   5) main.tsx mounts the interactive app over the static browser snapshot

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";
import puppeteer from "puppeteer";
import { collectPublicProfile, writeProfileExports, writeProfileIndex } from "./profile-export.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("[prerender] dist/index.html missing — run `vite build` first");
  process.exit(1);
}

const serve = sirv(DIST, { single: true, dev: false, etag: true });
const server = http.createServer((req, res) => serve(req, res, () => res.end()));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const PORT = server.address().port;
const ORIGIN = `http://127.0.0.1:${PORT}`;
console.log(`[prerender] serving dist on ${ORIGIN}`);

let browser;
const profiles = [];
const generatedAt = new Date().toISOString();
try {
  browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      // Use software WebGL so prerenders also work on build machines without a GPU.
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const routes = [["/", "en"], ["/de/", "de"]];
  if (fs.existsSync(path.join(DIST, "art-deco/index.html"))) routes.push(["/art-deco/", "en"]);
  for (const [route, language] of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    // Block third-party requests that keep network busy and aren't needed
    // for the static snapshot (FontAwesome kit, Google Fonts external CSS).
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      if (url.includes("kit.fontawesome.com") || url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com")) {
        return req.abort();
      }
      return req.continue();
    });

    // Use domcontentloaded — `networkidle0` never fires due to animation frames
    // and lingering analytics. We synchronise on the hero <h1> instead.
    await page.goto(`${ORIGIN}${route}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForSelector("h1", { timeout: 30_000 });
    await page.waitForFunction(
      (expected) => document.documentElement.lang === expected &&
        (document.querySelector("#root main")?.textContent?.length || 0) > 500,
      { timeout: 30_000 },
      language,
    );

    // Trigger every IntersectionObserver / useInView by walking the page
    await page.evaluate(async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const step = Math.max(200, Math.floor(window.innerHeight * 0.4));
      const max = document.documentElement.scrollHeight;
      for (let y = 0; y <= max; y += step) {
        window.scrollTo(0, y);
        await wait(80);
      }
      window.scrollTo(0, 0);
      await wait(400);
    });

    // Give framer-motion / typewriter a beat to finish before snapshotting
    await new Promise((r) => setTimeout(r, 1200));

    if (errors.length) throw new Error(`${route}: ${errors.join("; ")}`);
    const html = await page.evaluate(() => {
      if (!document.querySelector("#root h1") || !document.querySelector("#root main")) {
        throw new Error("Cannot publish an empty application snapshot");
      }
      // The full application is already present; remove the duplicate text fallback.
      document.querySelectorAll("body > noscript").forEach(element => element.remove());
      document.documentElement.classList.remove("custom-cursor");
      // Canvas pixels are not serialized. Retain the CSS/SVG skyline for no-JS visitors.
      document.querySelectorAll(".city-foreground-fallback, .city-landmarks-fallback").forEach(element => {
        element.style.visibility = "visible";
      });
      document.querySelectorAll(".city-foreground-3d").forEach(element => element.remove());
      return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    });
    // Vite and image preloads can materialize the temporary server origin.
    // Remove only this build's exact origin, preserving external HTTPS resources.
    const portable = html.replaceAll(ORIGIN, "").replace(/[\t ]+$/gm, "");
    if (/https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?/.test(portable)) {
      throw new Error(`${route}: local URL leaked into the static page`);
    }

    const outPath = path.join(DIST, route, "index.html");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, portable, "utf8");
    if (route === "/" || route === "/de/") {
      const profile = await page.evaluate(collectPublicProfile, generatedAt);
      writeProfileExports(profile, path.dirname(outPath));
      profiles.push(profile);
    }
    const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`[prerender] wrote ${outPath} (${sizeKb} KB)`);
    await page.close();
  }
  writeProfileIndex(profiles, DIST);
} catch (err) {
  console.error("[prerender] failed:", err);
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.close();
}
