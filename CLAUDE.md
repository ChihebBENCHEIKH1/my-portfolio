# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Requires Node 18+.** System default is v12 — use `~/.nvm/versions/node/v20.18.3/bin/node` explicitly, or activate nvm first.

```bash
npm run dev        # Start dev server (node node_modules/vite/bin/vite.js)
npm run build      # Production build via Vite (no tsc — Node 12 can't run tsc 5.x)
npm run preview    # Preview production build locally
npm run lint       # ESLint with zero warnings allowed
npm run deploy     # Build + deploy to GitHub Pages (gh-pages -d dist)
```

Direct invocation (when system node is wrong version):
```bash
~/.nvm/versions/node/v20.18.3/bin/node node_modules/vite/bin/vite.js        # dev
~/.nvm/versions/node/v20.18.3/bin/node node_modules/vite/bin/vite.js build  # build
```

No test runner is configured.

## Architecture

**React + TypeScript + Vite + React Three Fiber** 3D portfolio. Deep-space atmospheric design with glassmorphism UI floating above a persistent R3F canvas.

**Entry point flow:** `index.html` → `src/main.tsx` (wraps in `LanguageProvider`) → `src/App.tsx` → fixed `<SceneManager>` (z-0) + HTML content layer (z-10).

**3D layer (`src/canvas/`):**
- `SceneManager.tsx` — persistent `<Canvas>` fixed behind all HTML (`pointer-events: none`). Reads `activeSection` from zustand store to switch scene elements.
- `ParticleField.tsx` — 1500 instanced particles, vertex-colored cyan/indigo, slow rotation.
- `Icosphere.tsx` — wireframe icosahedron + torus ring, mouse-tracked, visible on `about`/`experience` sections.

**Scene state (`src/store/sceneStore.ts`):** Zustand store with `activeSection` and normalised `mouseX/mouseY`. App.tsx writes to it via `IntersectionObserver` (section tracking) and `mousemove`. Canvas reads from it — this is the bridge between HTML scroll and 3D.

**Bilingual support (English/German):** All text in `src/utils/Text.ts` keyed by `eng`/`de`. Components receive `titles` prop from App.tsx and call `useLanguage()` to select the language key.

**Styling:** Tailwind CSS v4 (`@import "tailwindcss"` in `index.css` + `@tailwindcss/vite` plugin). Custom tokens defined in `@theme` block. Glass cards use `.glass` / `.glass-hover` / `.glow-accent` utility classes from `index.css`. No Bootstrap.

**Fonts:** Cormorant Garamond (headings, serif italic for accents) + JetBrains Mono (body/UI labels). Loaded via Google Fonts `@import` at top of `index.css`.

**Scroll-driven timeline (`WorkExperience.tsx`):** Tall container (`height: Nxvh`) with a sticky inner div. Framer Motion `useScroll` + `useTransform` maps vertical scroll progress → horizontal `x` translate of the card strip.

**Vite config** sets `base: "./"` for GitHub Pages. Scripts bypass the `vite` bin wrapper and call `node node_modules/vite/bin/vite.js` directly to avoid Node version shebang issues.
