/**
 * Stage only public assets/fonts and preserve older content-hashed chunks.
 * @param {{dist: string, destination: string, previous?: {version: number, files: {path: string, sha256: string, bytes: number}[]}, download?: (path: string) => Promise<Uint8Array>}} options
 * @returns {Promise<{version: number, files: {path: string, sha256: string, bytes: number}[]}>}
 * Reject unsafe paths, changed immutable names and corrupt archived bytes.
 * Never copy site HTML, backend code, configuration or private data.
 */
export async function stageCdnAssets({ dist, destination, previous = { version: 1, files: [] }, download }) {
  if (previous.version !== 1 || !Array.isArray(previous.files) || previous.files.length > 10000) throw new Error("Invalid CDN manifest");
  const old = new Map();
  for (const file of previous.files) {
    if (!file || !safePath(file.path) || !/^[a-f0-9]{64}$/.test(file.sha256) || !Number.isInteger(file.bytes) || file.bytes < 0 || file.bytes > 25 * 1024 * 1024 || old.has(file.path)) throw new Error("Invalid CDN manifest entry");
    old.set(file.path, file);
  }
  const fresh = new Map();
  for (const folder of ["assets", "fonts"]) {
    const entries = await fs.readdir(path.join(dist, folder), { withFileTypes: true });
    for (const entry of entries) {
      const name = `${folder}/${entry.name}`;
      if (!entry.isFile() || !safePath(name)) throw new Error(`Unsupported public asset: ${name}`);
      const data = await fs.readFile(path.join(dist, name));
      const file = { path: name, sha256: hash(data), bytes: data.length };
      if (folder === "assets" && old.has(name) && old.get(name).sha256 !== file.sha256) throw new Error(`Refusing changed immutable asset: ${name}`);
      fresh.set(name, { file, data });
    }
  }
  const existing = await fs.readdir(destination).catch(error => { if (error.code === "ENOENT") return []; throw error; });
  if (existing.length) throw new Error("CDN staging directory must be empty");
  await fs.mkdir(destination, { recursive: true });
  const files = new Map();
  for (const [name, file] of old) {
    if (fresh.has(name)) continue;
    if (!download) throw new Error("Cannot preserve old CDN assets without a downloader");
    const data = Buffer.from(await download(name));
    if (data.length !== file.bytes || hash(data) !== file.sha256) throw new Error(`Archived asset integrity failure: ${name}`);
    await fs.mkdir(path.dirname(path.join(destination, name)), { recursive: true });
    await fs.writeFile(path.join(destination, name), data); files.set(name, file);
  }
  for (const [name, { file, data }] of fresh) {
    await fs.mkdir(path.dirname(path.join(destination, name)), { recursive: true });
    await fs.writeFile(path.join(destination, name), data); files.set(name, file);
  }
  const manifest = { version: 1, files: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)) };
  await fs.writeFile(path.join(destination, "asset-manifest.json"), JSON.stringify(manifest, null, 2));
  await fs.writeFile(path.join(destination, "_headers"), headers);
  await fs.writeFile(path.join(destination, "robots.txt"), "User-agent: *\nDisallow: /\nAllow: /assets/\nAllow: /fonts/\n");
  await fs.writeFile(path.join(destination, "404.html"), '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Asset host</title>');
  return manifest;
}
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const safePath = name => /^(assets|fonts)\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(name);
const hash = data => createHash("sha256").update(data).digest("hex");
const headers = `/assets/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  X-Content-Type-Options: nosniff
/fonts/*
  Cache-Control: public, max-age=86400
  Access-Control-Allow-Origin: *
  X-Content-Type-Options: nosniff
/asset-manifest.json
  Cache-Control: no-store
  X-Robots-Tag: noindex
/robots.txt
  Cache-Control: public, max-age=3600
`;
