import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { stageCdnAssets } from "./cdn-assets.mjs";

if (Number(process.versions.node.split(".")[0]) < 22) throw new Error("Publishing requires Node22.19+ for the pinned Wrangler CLI. Local builds still support Node20.");
const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const cdnOrigin = "https://chiheb-portfolio-assets.pages.dev";
const stateRoot = path.join(root, ".portfolio-publish");
await fs.mkdir(stateRoot, { recursive: true });
const work = await fs.mkdtemp(path.join(stateRoot, "build-"));
const stage = path.join(work, "cdn");
const environment = { ...process.env, CLOUDFLARE_ACCOUNT_ID: "39b32128becb0b47e7ee99e157d87509" };
const receipt = { cdnOrigin, work, status: "starting" };
const checkpoint = async status => { receipt.status = status; await fs.writeFile(path.join(stateRoot, "latest.json"), JSON.stringify(receipt, null, 2)); };
const run = (command, args, extra = {}) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { cwd: root, env: { ...environment, ...extra }, stdio: "inherit" });
  child.on("error", reject);
  child.on("exit", code => code === 0 ? resolve() : reject(new Error(`${path.basename(command)} exited ${code}`)));
});
const node = (script, args = [], env = {}) => run(process.execPath, [script, ...args], env);
const wrangler = args => process.env.npm_execpath
  ? node(process.env.npm_execpath, ["exec", "--yes", "--package=wrangler@4.164.0", "--", "wrangler", ...args])
  : run("npm", ["exec", "--yes", "--package=wrangler@4.164.0", "--", "wrangler", ...args]);

try {
  const health = await fetch("https://biancotoro.com/api/inquiry/health");
  if (!health.ok || !(await health.json()).configured) throw new Error("Contact service is not configured; refusing to activate a broken form.");
  await node("scripts/generate-project-images.mjs");
  await node("node_modules/vite/bin/vite.js", ["build", "--mode", "cyberpunk"], { PORTFOLIO_ASSET_ORIGIN: cdnOrigin });
  await checkpoint("built");
  let previous;
  const bootstrap = process.argv.includes("--bootstrap-cdn");
  let manifestResponse;
  try {
    manifestResponse = await fetch(`${cdnOrigin}/asset-manifest.json`, { cache: "no-store" });
  } catch (error) {
    if (!(bootstrap && error.cause?.code === "ENOTFOUND")) throw error;
  }
  if (manifestResponse?.ok) previous = await manifestResponse.json();
  else if (!(bootstrap && (!manifestResponse || manifestResponse.status === 404))) throw new Error(`CDN manifest returned ${manifestResponse?.status}`);
  else console.log("Initial CDN deployment requested; no previous manifest is required.");
  const manifest = await stageCdnAssets({ dist, destination: stage, previous, download: async file => {
    const response = await fetch(`${cdnOrigin}/${file}`);
    if (!response.ok) throw new Error(`Cannot preserve old CDN asset: ${file} (${response.status})`);
    return new Uint8Array(await response.arrayBuffer());
  } });
  receipt.assets = manifest.files.length;
  await wrangler(["pages", "deploy", stage, "--project-name", "chiheb-portfolio-assets", "--branch", "main", "--commit-dirty=true"]);
  await checkpoint("cdn-published");
  const live = await fetch(`${cdnOrigin}/asset-manifest.json`, { cache: "no-store" });
  if (!live.ok || JSON.stringify(await live.json()) !== JSON.stringify(manifest)) throw new Error("CDN deployment not visible yet. Canonical site was not changed.");
  const sample = manifest.files.find(file => file.path.startsWith("assets/") && file.path.endsWith(".js"));
  const response = await fetch(`${cdnOrigin}/${sample.path}`);
  if (!/max-age=31536000/.test(response.headers.get("cache-control") || "") || !/immutable/.test(response.headers.get("cache-control") || "") || response.headers.get("access-control-allow-origin") !== "*") throw new Error("CDN cache/CORS headers did not match.");
  await node("scripts/prerender.mjs");
  await node("scripts/verify-seo.mjs");
  await node("--experimental-strip-types", ["--test", "scripts/verify-profile.test.mjs", "scripts/verify-performance.test.mjs", "scripts/verify-contact.test.mjs", "scripts/contact-client.test.mjs", "scripts/cdn-assets.test.mjs", "infrastructure/contact/contact.test.mjs"]);
  await checkpoint("validated");
  if (process.argv.includes("--stage-only")) {
    console.log(`Validated CDN and site build. Canonical site not published. Receipt: ${path.join(stateRoot, "latest.json")}`);
  } else {
    await node("node_modules/gh-pages/bin/gh-pages.js", ["-d", "dist", "--nojekyll", "-m", "Publish optimized full3D portfolio and direct contact delivery"], { CACHE_DIR: path.join(work, "gh-pages-cache"), GIT_SSH_COMMAND: "ssh -o BatchMode=yes" });
    await checkpoint("published");
  }
} catch (error) {
  receipt.error = String(error.message || error); await checkpoint("failed"); throw error;
}
