# Website Inquiry and Delivery Improvements Implementation Plan

> Execute in this session using the existing isolated worktree. User approved all five proposed improvements; later excluded the client case study.

**Goal:** Deliver reliable website inquiries, lighter responsive imagery, durable asset caching, efficient identical 3D buildings, and a focused architecture/security review page.

**Architecture:** A shared Cloudflare Worker accepts validated submissions and sends through the account's existing verified email-routing inbox. A Cloudflare Pages project serves versioned static assets with immutable caching; the portfolio's canonical HTML stays on GitHub Pages and existing DNS. BiancoToro retains its static Python generator, locales, CSP and SPA navigation. No client claims are added.

**Tech Stack:** React/TypeScript/Vite/Three, Python static HTML, Cloudflare Workers native email/rate-limit bindings, Pages static CDN, existing Sharp/Puppeteer.

## 1. Contact contract and backend

- Create `infrastructure/contact/src/contract.ts`, `index.ts`, `contact.test.mjs`, `tsconfig.json`, `wrangler.toml`, `README.md`.
- Contract: origin-derived site; bounded JSON `{name,email,subject?,message,lang,website?}`; `202 {ok:true,requestId}` only after provider acceptance. Typed validation, origin, throttling and upstream errors. No arbitrary recipients, visitor data in logs, automatic retries or inquiry storage.
- Establish types/stub first and type-check. Add meaningful red tests: invalid body/origin/size never sends; Unicode/reply-to survive; per-IP/global throttling; provider failure never reports success; logs exclude PII. Implement using documented native email API and validate in Wrangler's runtime/dry run.
- Use the precise existing-domain route `biancotoro.com/api/inquiry*` without changing DNS or creating a workers.dev namespace. Configure verified recipient as a secret; never commit or display private inbox values. Real test emails require exact-text approval after preparation.

## 2. Responsive project image

- Generate smaller WebP variants from the existing original screenshot using Sharp. Update `src/components/ProjectPreview.tsx` with intrinsic dimensions, `srcSet` and accurate `sizes`; maintain preview styling.
- Browser-check requested image width/bytes at mobile/desktop and verify no layout/content change.

## 3. Assets-only CDN

- Add a documented deployment script and Vite support for an explicit asset origin. Default local build stays local. Production deploy builds once, uploads assets to Pages, prerenders against the deployed assets, verifies, then publishes canonical HTML to GitHub Pages.
- CDN includes `/assets/`, fonts and license files, CORS for public assets, immutable caching only for hashed files, no indexable duplicate site HTML. Retain existing hashed assets via a checked public manifest so open tabs and cached HTML continue to load older chunks.
- Add preconnect and align font preload URLs with CSS font URLs. Validate actual headers, repeat-cache behavior and absence of duplicate font downloads. No DNS or mailbox migration.

## 4. Identical 3D geometry batching

- Baseline the existing rendered scene on desktop/mobile, day/night and 6/16/26-building settings.
- In `src/canvas/SceneManager.tsx`, share unit box geometry/materials and instance repeated opaque facade bodies by tone. Keep all transforms, textures, transparency ordering, landmarks, bloom, lighting and controls unchanged. Preserve automatic shader preparation for the actual composer target.
- Compare deterministic screenshots and program/geometry/draw statistics. Revert any batching that alters rendering. Keep first-draw regression and all existing controls tests green. Check attached ADB devices; report physical-device unavailability honestly.

## 5. Focused existing-offer service page

- Add EN/FR/AR static routes for the existing architecture/security review offer through `build_data.py`, `build_views.py` and `build.py` (or a focused new view module). Integrate links, sitemap, canonical/hreflang and route-library navigation.
- Reuse existing styles and one contact conversion path. Explain audience, inputs, review scope, deliverables, boundaries and next step. No invented price, completion time, endorsement, client logo, outcome metric or client case study.
- Update relevant privacy contact-flow facts to match actual processing/provider; preserve unresolved legal facts rather than inventing them.

## 6. Frontend delivery and measurement

- `Contact.tsx` submits immediately with a real pending state; preserves input on errors; shows success only after backend acceptance; retains email fallback and existing visual identity. Localize new status text. Add honeypot/max lengths; avoid fake encryption/success effects.
- BiancoToro `app.js`/generated forms use the shared endpoint with the same behavior; update CSP only for the exact intended API origin. Privacy statements and service-page forms stay consistent.
- Backend emits minimal accepted/rejected/failed inquiry events, IDs and brand, no message/email/IP. Document how to count accepted inquiries and exclude known approved test IDs. Do not equate accepted mail with booked business.
- Reopen existing Search Console reports read-only if authenticated browser is available; save dated aggregate baseline/index status. No repeated indexing submissions and no ranking promises.

## 7. Ship and verify

- Run focused backend tests/type-check, portfolio browser/type/SEO/profile checks, BiancoToro generator/locale/route/export tests. Inspect mobile/desktop rendered pages and error/success flows with mocked mail delivery first.
- Publish Worker/CDN and exact tested site builds under existing authorization. Verify public assets, CORS/cache/MIME headers, canonical/locale URLs, functional 3D, forms and original export endpoints.
- Ask for exact-text approval for prepared self-test emails only when ready; no client messages. Physical-device and actual inbox checks are reported as verified only when observed.
- Save source/deployment refs, tests, measured benefits and unresolved external inputs in the shared handover, weekly note and journal before completion.
