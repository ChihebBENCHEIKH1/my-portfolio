import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { stageCdnAssets } from "./cdn-assets.mjs";

const digest = bytes => createHash("sha256").update(bytes).digest("hex");
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "portfolio-cdn-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const dist = path.join(root, "dist"), destination = path.join(root, "cdn");
  await fs.mkdir(path.join(dist, "assets"), { recursive: true }); await fs.mkdir(path.join(dist, "fonts"));
  await fs.writeFile(path.join(dist, "assets", "main-hash.js"), "new current code");
  await fs.writeFile(path.join(dist, "fonts", "body.woff2"), "font bytes");
  await fs.writeFile(path.join(dist, "index.html"), "private site HTML must not be mirrored");
  await fs.writeFile(path.join(dist, ".env"), "never copy configuration");
  return { dist, destination };
}

test("retains previous chunks so cached HTML and open tabs keep working", async t => {
  const f = await fixture(t); const old = Buffer.from("old still-live code");
  const result = await stageCdnAssets({ ...f, previous: { version: 1, files: [{ path: "assets/old-hash.js", sha256: digest(old), bytes: old.length }] }, download: async name => { assert.equal(name, "assets/old-hash.js"); return old; } });
  assert.equal(result.files.length, 3); assert.equal(await fs.readFile(path.join(f.destination, "assets/old-hash.js"), "utf8"), old.toString());
  await assert.rejects(fs.access(path.join(f.destination, "index.html")));
  await assert.rejects(fs.access(path.join(f.destination, ".env")));
  const headers = await fs.readFile(path.join(f.destination, "_headers"), "utf8");
  assert(headers.includes("max-age=31536000, immutable")); assert(headers.includes("Access-Control-Allow-Origin: *"));
  assert.equal(JSON.parse(await fs.readFile(path.join(f.destination, "asset-manifest.json"), "utf8")).version, 1);
});

test("rejects traversal/config paths and corrupt archived chunks", async t => {
  const f = await fixture(t); const old = Buffer.from("expected");
  for (const name of ["../secret", "assets/../../secret", ".env", "assets/%2e%2e%2fsecret", "https://evil.example/file"]) {
    await assert.rejects(stageCdnAssets({ ...f, previous: { version: 1, files: [{ path: name, sha256: digest(old), bytes: old.length }] }, download: async () => old }), /manifest/i);
  }
  await assert.rejects(stageCdnAssets({ ...f, previous: { version: 1, files: [{ path: "assets/old-hash.js", sha256: digest(old), bytes: old.length }] }, download: async () => Buffer.from("tampered") }), /integrity/i);
});

test("refuses to overwrite an immutable path with different bytes", async t => {
  const f = await fixture(t); const original = Buffer.from("previous bytes");
  await assert.rejects(stageCdnAssets({ ...f, previous: { version: 1, files: [{ path: "assets/main-hash.js", sha256: digest(original), bytes: original.length }] }, download: async () => original }), /immutable/i);
});
