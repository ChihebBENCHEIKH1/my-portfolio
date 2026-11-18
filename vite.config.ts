import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// Chunks that are mounted lazily after first paint. Vite would otherwise inject
// <link rel="modulepreload"> for them, pulling them into the LCP critical path.
// Strip them from preload deps so the browser only fetches when the chunk runs.
const HEAVY_DEFERRED = [
  "vendor-three",
  "SceneManager",
  "CityBackground",
  "ParticleField",
  "Icosphere",
];

const assetOrigin = process.env.PORTFOLIO_ASSET_ORIGIN?.replace(/\/$/, "");
if (assetOrigin && (new URL(assetOrigin).origin !== assetOrigin || !assetOrigin.startsWith("https://"))) {
  throw new Error("PORTFOLIO_ASSET_ORIGIN must be an HTTPS origin without a path");
}

export default defineConfig(({ mode }): UserConfig => ({
  // Canonical HTML stays on the custom domain; production assets can use a CDN.
  base: assetOrigin ? `${assetOrigin}/` : "/",
  experimental: {
    renderBuiltUrl(filename, { hostType, type }) {
      if (!assetOrigin) return;
      // Critical styles/fonts stay on the HTML origin, avoiding a second
      // connection before first paint. Large JS/images retain CDN caching.
      if (type === "public") return `/${filename}`;
      if (filename.endsWith(".css")) return hostType === "js"
        ? { runtime: `window.location.origin + ${JSON.stringify(`/${filename}`)}` }
        : `/${filename}`;
    },
  },
  assetsInclude: ["**/*.png", "**/*.jpeg", "**/*.jpg"],
  plugins: [
    {
      name: "portfolio-asset-preconnect",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          if (!assetOrigin) return html;
          // Vite also rebases root public files. Only assets/fonts live on
          // this host; the web manifest and icon stay with canonical HTML.
          return html.split(`${assetOrigin}/manifest.json`).join("/manifest.json")
            .split(`${assetOrigin}/logo-mark.svg`).join("/logo-mark.svg")
            .replace("<head>", `<head>\n<link rel="preconnect" href="${assetOrigin}" crossorigin>`);
        },
      },
    },
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      // SVG optimization needs optional svgo; leave these source vectors intact.
      exclude: /\.svg$/i,
      png: { quality: 80 },
      jpeg: { quality: 75 },
      jpg: { quality: 75 },
    }),
  ],
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((d) => !HEAVY_DEFERRED.some((name) => d.includes(name))),
    },
    rollupOptions: {
      // The alternate design stays available locally; publish only the approved edition.
      input: mode === "cyberpunk" ? { main: "index.html" } : { main: "index.html", artDeco: "art-deco/index.html" },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three") || id.includes("@react-three")) {
            return "vendor-three";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer";
          }
          if (id.includes("node_modules/gsap")) {
            return "vendor-gsap";
          }
        },
      },
    },
  },
}));
