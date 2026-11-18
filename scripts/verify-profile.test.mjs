import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import puppeteer from "puppeteer";
import sirv from "sirv";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const canonicalOrigin = "https://www.chihebbencheikh.com";

test("public profile exports preserve the current pages and remain readable without JavaScript", async () => {
  for (const route of ["/", "/de/"]) {
    const exists = await fs.access(path.join(dist, route, "profile.json")).then(() => true, () => false);
    assert(exists, `${route}: profile.json has not been generated`);
  }
  const server = http.createServer(sirv(dist, { dev: false }));
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
    for (const [route, language, expected] of [["/", "en", "BiancoToro"], ["/de/", "de", "Gründer"]]) {
      const profile = JSON.parse(await fs.readFile(path.join(dist, route, "profile.json"), "utf8"));
      const markdown = await fs.readFile(path.join(dist, route, "about.md"), "utf8");
      assert.equal(profile.schema_version, "1.0");
      assert.equal(profile.canonical_url, canonicalOrigin + route);
      assert.equal(profile.language, language);
      assert(Number.isFinite(Date.parse(profile.generated_at)));
      assert(profile.sections.length >= 5, `${route}: substantive public sections`);
      assert(JSON.stringify(profile).includes(expected), `${route}: current translated content`);
      assert(!/https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/.test(JSON.stringify(profile)));
      assert(!JSON.stringify(profile).includes("SYS.BOOT"), `${route}: decorative text excluded`);
      assert(markdown.includes(profile.canonical_url));
      for (const section of profile.sections) {
        assert(markdown.includes(section.text), `${route}: Markdown and JSON share public text`);
        assert.equal(new URL(section.source_url).origin, canonicalOrigin);
        for (const link of section.links) assert(["https:", "http:", "mailto:", "tel:"].includes(new URL(link.url).protocol));
      }
      for (const format of ["markdown", "json"]) {
        const resource = new URL(profile.representations[format]);
        const response = await fetch(origin + resource.pathname);
        assert.equal(response.status, 200, resource.href);
        if (format === "json") assert.match(response.headers.get("content-type"), /application\/json/);
      }
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      await page.goto(origin + route, { waitUntil: "domcontentloaded" });
      assert(await page.$eval('#Contact button[type="submit"]', button => button.disabled), `${route}: no-JavaScript visitors use the visible email link`);
      assert.equal(await page.$eval('link[rel="manifest"]', element => element.getAttribute("href")), "/manifest.json", "site manifest remains on the canonical host");
      assert.equal(await page.$eval('link[rel="icon"]', element => element.getAttribute("href")), "/logo-mark.svg", "site icon remains on the canonical host");
      const source = await page.evaluate(() => ({
        description: document.querySelector('meta[name="description"]')?.content,
        structured: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
        footerLinks: [...document.querySelectorAll("footer a[href]")].map(el => el.getAttribute("href")),
      }));
      assert.equal(profile.description, source.description);
      assert.deepEqual(profile.structured_data, source.structured);
      assert(source.footerLinks.includes(route + "about.md"), `${route}: discoverable Markdown`);
      assert(source.footerLinks.includes(route + "profile.json"), `${route}: discoverable JSON`);
      await page.close();
    }
    const index = await fs.readFile(path.join(dist, "llms.txt"), "utf8");
    for (const route of ["/", "/de/"]) assert(index.includes(canonicalOrigin + route + "profile.json"));
    JSON.parse(await fs.readFile(path.join(dist, "profile.schema.json"), "utf8"));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});
