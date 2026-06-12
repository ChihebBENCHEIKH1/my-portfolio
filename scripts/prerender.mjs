// Postbuild SSG: pre-render dist/index.html using headless Chromium so
// crawlers (LinkedIn, Bing, sourcing tools) and non-JS clients see fully
// rendered HTML. Googlebot also indexes the prerendered output faster.
//
// Flow:
//   1) Serve the freshly built dist/ on a random port
//   2) Headless-Chromium loads "/" and waits for the hero <h1>
//   3) Scroll through the page to trigger framer-motion useInView reveals
//      and lazy-loaded chunks
//   4) Serialise document.documentElement → overwrite dist/index.html
//   5) main.tsx detects hydration vs first-paint via #root.hasChildNodes()

import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";
import puppeteer from "puppeteer";

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

const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
  ],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Surface in-page errors during prerender so we don't ship blank HTML
  page.on("pageerror", (err) => console.error("[prerender][pageerror]", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("[prerender][console]", msg.text());
  });

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
  await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("h1", { timeout: 30_000 });

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

  const html = await page.evaluate(() => "<!DOCTYPE html>\n" + document.documentElement.outerHTML);

  const outPath = path.join(DIST, "index.html");
  fs.writeFileSync(outPath, html, "utf8");
  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`[prerender] wrote ${outPath} (${sizeKb} KB)`);
} catch (err) {
  console.error("[prerender] failed:", err);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
