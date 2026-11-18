# Portfolio publication

The canonical EN/DE HTML stays on GitHub Pages at `www.chihebbencheikh.com`. Hashed assets are served from the assets-only Cloudflare Pages project `chiheb-portfolio-assets`. This changes no domain or mail routing.

Local builds require Node 20. Publication requires Node 22.19+, Chrome, Git/SSH access to this repository, and authentication to the existing Cloudflare account. Wrangler is pinned to the official `4.164.0` package. Use `PUPPETEER_EXECUTABLE_PATH` when Chrome isn't in Puppeteer's default cache.

```sh
npm run build:cyberpunk       # Local assets; automatic full 3D remains enabled
npm run deploy:stage          # Publish CDN assets, prerender, run acceptance checks
npm run deploy                # Same pipeline, then publish tested dist to gh-pages
```

Do not deploy a plain `npm run build`: it also includes the unapproved alternate edition. The publisher builds only the approved cyberpunk entry. Do not publish GitHub Pages before CDN verification succeeds. A failed stage leaves the canonical site unchanged; inspect `.portfolio-publish/latest.json` and the command output. That state directory is ignored by Git.

The CDN stages only `assets/` and `fonts/`, public cache headers, a checksum manifest, robots and a noindex 404. There is no duplicate portfolio HTML. Hashed assets have one-year immutable caching and public CORS; unversioned font files have one-day caching. The manifest is no-store. Existing hashed chunks are retained across publication using size/SHA-256 verification, so cached HTML and open tabs continue to work. Never manually empty the CDN as routine cleanup.

The project is already initialized. Normal publication requires its manifest to be readable. `--bootstrap-cdn` is reserved for a new empty project (404 or DNS not found); it never treats an outage as an empty archive. A brand-new undeployed Pages project can return 522: check that its deployment list is empty and make an explicit initial assets-only deployment, rather than weakening the normal preservation checks. Future deploys do not need the project-creation `--force` option.

For a staged build already validated without subsequent source changes, publish that exact `dist/` with the existing `gh-pages` CLI, `--nojekyll`, and a unique `CACHE_DIR`. Record the source commit and deployment commit separately. Verify the public HTML/assets after the provider reports completion.

See [contact deployment and measurement](../infrastructure/contact/README.md). Browser tests intercept all form POSTs; they never send mail. Preserve the automatic 3D city, composer-target shader preparation, controls, and the visual comparison baseline when changing the renderer. Lab results are not physical-device FPS or field Core Web Vitals.
