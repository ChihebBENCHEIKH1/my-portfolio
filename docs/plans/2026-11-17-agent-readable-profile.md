# Agent-readable profile implementation plan

**Goal:** Publish static Markdown and JSON representations of the existing public portfolio and BiancoToro pages.

**Architecture:** Generate exports from the same rendered HTML and structured metadata as the website. Keep the canonical HTML, existing content, crawler policies and contact behavior. No new backend, dependencies, public claims or contact actions. The user approved this design in chat on 17 November 2026.

**Contract:** `profile.schema.json` defines version 1.0. Each supported language has `about.md` and `profile.json`, with canonical source URLs, public structured data, readable sections and the actual generation time. Invalid metadata or missing content fails the build. `generated_at` is an export timestamp, not a claim about when facts changed.

**Scope:** Portfolio EN/DE and BiancoToro EN/FR/AR, a short resource index and unobtrusive footer links. Calibib already exposes JSON and is unchanged. Deployment, submissions and other outbound communications require separate authorization.

1. Verify the existing portfolio SEO checks and BiancoToro build in isolated directories.
2. Add artifact acceptance checks; observe missing exports fail before implementation.
3. Portfolio: collect public content during existing prerendering, generate static exports and schema, link exports in the footer.
4. BiancoToro: extract the same public content from its generated HTML, write equivalent exports and content headers, retain and extend its existing llms.txt.
5. Run acceptance checks, schema validation, existing SEO checks and browser checks of local outputs. Inspect the complete diff and generated documents.
6. Apply only verified BiancoToro source changes after checking its original files still match the saved baseline. Keep portfolio changes in its isolated branch.

Acceptance: all export URLs resolve locally, parse correctly, agree with their source pages, preserve Unicode and metadata, omit hidden/decorative controls, link to the canonical source, and remain usable with JavaScript disabled. No data is copied from private conversations.
