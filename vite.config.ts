import { defineConfig } from "vite";
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

export default defineConfig({
  base: "./",
  assetsInclude: ["**/*.png", "**/*.jpeg", "**/*.jpg"],
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
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
});
