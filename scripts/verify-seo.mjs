import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import sirv from "sirv";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const canonicalOrigin = "https://www.chihebbencheikh.com";
const pages = [
  { route: "/", language: "en", expectedText: "BiancoToro", profile: true },
  { route: "/de/", language: "de", expectedText: "Gründer", profile: true },
  { route: "/case-studies/hugging-face-filesystem-cache/", language: "en", expectedText: "My contribution", profile: false },
  { route: "/case-studies/llama-cpp-json-schema/", language: "en", expectedText: "My contribution", profile: false },
];
const server = http.createServer(sirv(dist, { dev: false }));
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;

try {
  browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const results = [];
  for (const { route, language, expectedText, profile } of pages) {
    const raw = await fs.readFile(path.join(dist, route, "index.html"), "utf8");
    assert(!/https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?/.test(raw), `${route}: local URL leaked into HTML`);
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    const response = await page.goto(origin + route, { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200);
    const facts = await page.evaluate(() => ({
      language: document.documentElement.lang,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      alternates: Object.fromEntries([...document.querySelectorAll("link[hreflang]")].map(el => [el.hreflang, el.href])),
      headings: document.querySelectorAll("h1").length,
      content: (document.querySelector("#root") || document.querySelector("main"))?.textContent,
      invalidImages: [...document.images].filter(el => !el.hasAttribute("width") || !el.hasAttribute("height")).map(el => el.alt),
      assets: [...document.querySelectorAll('script[src], img[src], link[rel="stylesheet"], link[rel="icon"], link[rel="manifest"], link[rel="modulepreload"]')].map(el => el.src || el.href),
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
    }));
    assert.equal(facts.language, language, `${route}: document language`);
    assert(facts.title.length <= 60, `${route}: concise title`);
    assert(facts.description?.length <= 160, `${route}: concise description`);
    assert.equal(facts.canonical, canonicalOrigin + route);
    if (profile) {
      assert.equal(facts.alternates.en, canonicalOrigin + "/");
      assert.equal(facts.alternates.de, canonicalOrigin + "/de/");
      assert.equal(facts.alternates["x-default"], canonicalOrigin + "/");
    }
    assert.equal(facts.headings, 1, `${route}: one primary heading in static output`);
    assert(facts.content?.includes(expectedText), `${route}: translated content available without JavaScript`);
    assert.deepEqual(facts.invalidImages, [], `${route}: image dimensions`);
    for (const asset of facts.assets) {
      const url = new URL(asset);
      if (url.origin === origin) await fs.access(path.join(dist, decodeURIComponent(url.pathname)));
    }
    if (profile) {
      assert(facts.schema.some(item => item["@type"] === "Person"));
      assert(facts.schema.some(item => item["@type"] === "ProfilePage" && item.url === canonicalOrigin + route));
    } else {
      assert(facts.schema.some(item => item["@type"] === "Article" && item.url === canonicalOrigin + route && item.author?.name === "Chiheb Ben Cheikh"));
    }
    results.push({ route, language, title: facts.title, staticContent: true });
    await page.close();
  }
  const sitemap = await fs.readFile(path.join(dist, "sitemap.xml"), "utf8");
  for (const { route } of pages) assert(sitemap.includes(`<loc>${canonicalOrigin}${route}</loc>`));
  assert.equal((await fs.readFile(path.join(dist, "CNAME"), "utf8")).trim(), "www.chihebbencheikh.com");
  console.log(JSON.stringify({ passed: true, pages: results, sitemap: true, customDomain: true }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
