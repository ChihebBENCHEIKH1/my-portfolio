# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Requires Node 18+.** System default is v12 — use `~/.nvm/versions/node/v20.18.3/bin/node` explicitly, or activate nvm first.

```bash
npm run dev        # Start dev server (node node_modules/vite/bin/vite.js)
npm run build      # Production build via Vite (no tsc — Node 12 can't run tsc 5.x)
npm run preview    # Preview production build locally
npm run verify:seo # Check built English/German HTML without JavaScript
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

**React + TypeScript + Vite + React Three Fiber** cyberpunk portfolio. CSS atmosphere, SVG fallback landmarks and a 3D city sit behind the HTML content.

**Entry point:** `index.html` → `src/main.tsx` (`LanguageProvider`) → `src/App.tsx` → deferred `CityBackground` plus HTML sections. The page starts immediately; no boot overlay or scrolling technology banner.

**City (`src/canvas/`):**
- `CityBackground.tsx` — original layered neon city, billboards and traffic; pauses CSS motion outside the hero and while the tab is hidden. Lazily mounts the WebGL scene and keeps a CSS/SVG fallback.
- `SceneManager.tsx` — orthographic 3D foreground buildings, reusable illuminated facade textures, bloom and mouse parallax. `frameloop="demand"` stops drawing when the camera settles. Pointer movement restarts it; reduced motion disables camera movement.
- `TokyoLandmarks3D.tsx` — actual 3D Tokyo Tower and Skytree, instanced structural beams, observation decks and stylized light rings. Skytree color responds to job hover.
- `Airship.tsx` / `.css` — a native SVG courier with a waving captain, illuminated cockpit/engines, a large Welcome aboard/name sign and click-to-boost flight. One optional illustrated launch vehicle appears only after pressing Launch rocket in the playground, following a five-second countdown. Its layer is behind the buildings. Closing the playground cancels it. CSS motion pauses offhero/tab-hidden and respects reduced motion, including preference changes during a launch.
- `TowerFireworks.tsx` / `.css` — short-lived CSS spark bursts near the tower tips. Tower clicks randomly select fireworks or illumination; the toolbar's light buttons always illuminate. Expired bursts are removed and rapid clicks are bounded to six simultaneous bursts.
- `TokyoLandmarks.tsx` / `.css` — vector landmarks used when WebGL is unavailable and in static HTML snapshots (canvas pixels cannot be serialized).
- `ParticleField.tsx` and `Icosphere.tsx` are legacy components, currently unused.

**Scene state (`src/store/sceneStore.ts`):** Zustand store with `activeSection` and normalised `mouseX/mouseY`. App.tsx writes to it via `IntersectionObserver` (section tracking) and mouse `pointermove` events. Canvas reads from it — this is the bridge between HTML scroll and 3D.

**Interactive city:** `CityPlayground.tsx` provides an accessible modal with building count (6–26), light intensity, day/night, tower pulses, ship boost, optional rocket launch, and reset. The normal portfolio becomes inert while open; Escape returns focus to the launch button. `cityModel.ts` shares building placement between 3D and CSS fallbacks. A day/night toggle also appears beside Explore Tokyo on the main page, and the selected time persists when leaving the playground. Day mode uses darker hero text and dark section surfaces for contrast. Tower meshes and keyboard-accessible hero hit areas share the random celebration action. Flight acceleration changes animation playback rate without restarting a visible ship.

**Responsive skyline:** `getCityProfile` defaults to 10 buildings below 600px, 13 below 1050px and 16 on desktop. Narrow viewports get wider, shorter buildings and proportionate landmarks. Viewport changes preserve a customized building count. SceneManager projects real tower coordinates into CSS variables for aligned fireworks/hit areas. Hero tower clicks exclude links and controls so they cannot intercept a CTA.

**Bilingual support (English/German):** All text in `src/utils/Text.ts` keyed by `eng`/`de`. Components receive `titles` prop from App.tsx and call `useLanguage()` to select the language key.

**Styling:** Tailwind CSS v4 plus `index.css` utilities and component stylesheets. `refinements.css` loads last and owns the revised panel surfaces/shapes and mobile navigation breakpoint. The visual identity uses vivid cyan and magenta accents with luminous, asymmetric cards. Preserve realistic window-light intensity; the towers carry the brighter accents.

**Fonts:** Space Grotesk (headings) and JetBrains Mono (body/UI), self-hosted Latin variable WOFF2 files under `public/fonts`, preloaded in `index.html`; OFL licenses accompany them. German umlauts are in the Latin subset. The Art Deco entry additionally loads Poiret One, also self-hosted with its OFL license.

**Content:** `Portfolio.tsx` is a two-column gallery (one column on mobile), with six projects from `Text.ts`. First and last cards span both columns on wide screens. `ProjectPreview.tsx` renders six distinct concept vignettes keyed by each project's stable `preview` value: API graph, RAG flow, storefront, workflow, Kanban and security remediation. The storefront uses the original screenshot; other visuals illustrate documented project features rather than claiming live metrics. Hover/focus animation respects reduced motion. `SectionFlow` crossfades subdued colors and reveals decorative section typography. `WorkExperience.tsx` remains a vertical timeline; section tracking uses an intersection band so tall mobile sections still become active.

**Art Deco edition:** Independent Vite entry `art-deco/index.html` → `src/art-deco/main.tsx`. It shares project content/previews with the main site but has its own stylesheet and illustrated SVG city. English/German switching uses `?lang=de` within `/art-deco/`; do not wrap it in the main LanguageProvider, which normalizes routes. Day/night works on the page and in its keyboard-accessible city explorer (buildings, light slider, tower illumination). This alternative is marked `noindex` and omitted from the public sitemap pending design approval.

**GitHub Pages:** `public/CNAME` binds the custom domain. Vite uses `base: "/"` so assets resolve on `/`, `/de/` and `/art-deco/`. The postbuild script prerenders all three entries, removes the temporary preview origin from URLs, and rejects page errors or empty snapshots. Run `npm run verify:seo` after building. A browser snapshot contains completed animations, so the client mounts fresh rather than hydrating it. Scripts bypass the `vite` bin wrapper and call `node node_modules/vite/bin/vite.js` directly to avoid Node version shebang issues.
