import assert from "node:assert/strict";
import http from "node:http";
import { fileURLToPath } from "node:url";
import test from "node:test";
import puppeteer from "puppeteer";
import sirv from "sirv";

test("localized forms acknowledge only acceptance, retain failed drafts and prevent duplicate sends", { timeout: 60000 }, async () => {
  const server = http.createServer(sirv(fileURLToPath(new URL("../dist/", import.meta.url))));
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
    for (const route of ["/", "/de/"]) {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844 });
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      // This browser test must never send a real email, including on regression.
      await page.setRequestInterception(true);
      page.on("request", request => request.method() === "POST" ? request.abort() : request.continue());
      await page.evaluateOnNewDocument(() => {
        const original = window.fetch;
        window.contactRequests = [];
        window.mockStatus = 503;
        window.fetch = (url, options) => {
          if (!String(url).includes("/api/inquiry")) return original(url, options);
          window.contactRequests.push(JSON.parse(options.body));
          return new Promise(resolve => { window.resolveContact = () => resolve(new Response(JSON.stringify(window.mockStatus === 202 ? { ok: true, requestId: "mock-only" } : { ok: false }), { status: window.mockStatus, headers: { "Content-Type": "application/json" } })); });
        };
      });
      await page.goto(`http://127.0.0.1:${server.address().port}${route}`, { waitUntil: "networkidle0" });
      await page.$eval("#Contact", element => element.scrollIntoView());
      await page.type("#contact-name", "Website browser test");
      await page.type("#contact-email", "test@example.com");
      await page.type("#contact-subject", "Mock verification");
      await page.type("#contact-message", "This test is intercepted and never sent.");
      const submit = () => page.$eval("#Contact form", form => form.requestSubmit());
      await submit();
      await page.waitForFunction(() => window.contactRequests.length === 1);
      assert(await page.$eval('#Contact button[type="submit"]', el => el.disabled));
      await submit();
      assert.equal(await page.evaluate(() => window.contactRequests.length), 1);
      await page.evaluate(() => window.resolveContact());
      await page.waitForSelector(".contact-submit-status.is-error");
      const originalMessage = await page.$eval("#contact-message", el => el.value);
      assert.match(originalMessage, /intercepted/);
      assert.equal(await page.$eval('#Contact button[type="submit"]', el => el.disabled), false);
      await page.evaluate(() => { window.mockStatus = 429; });
      await submit(); await page.waitForFunction(() => window.contactRequests.length === 2);
      await page.evaluate(() => window.resolveContact());
      await page.waitForFunction(() => /minute|Minute/.test(document.querySelector(".contact-submit-status").textContent));
      assert.equal(await page.$eval("#contact-message", el => el.value), originalMessage);
      await page.evaluate(() => { window.mockStatus = 202; });
      await submit(); await page.waitForFunction(() => window.contactRequests.length === 3);
      await page.evaluate(() => window.resolveContact());
      await page.waitForFunction(() => document.querySelector("#contact-message").value === "");
      assert(!await page.$(".contact-submit-status.is-error"));
      assert.match(await page.$eval(".contact-submit-status", el => el.textContent), /submitted|übermittelt/);
      assert.equal(await page.evaluate(() => window.contactRequests.at(-1).lang), route === "/" ? "en" : "de");
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});
