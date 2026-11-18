# Website inquiries

The Worker serves `POST https://biancotoro.com/api/inquiry` for the portfolio and BiancoToro. BiancoToro uses a same-origin route, preserving its existing CSP. The portfolio uses CORS with its exact approved origin. `GET /api/inquiry/health` checks configuration only.

## Contract

Send JSON `{name,email,message,lang,subject?,website?}`. Names are limited to 120 characters, email to 254, subject to 160, message to 5000, and the complete body to 32 KiB. `website` is an empty honeypot. Portfolio languages are `en/de`; BiancoToro languages are `en/fr/ar`. Unknown fields and header newlines are rejected.

`202 {ok:true,requestId}` means Cloudflare accepted the email. It does not confirm inbox receipt or a booked project. Errors return `{ok:false,requestId,error:{code}}`: invalid input 400, forbidden origin 403, route 404, method 405, size 413, media type 415, rate limit 429, unavailable delivery/configuration 503. Errors never clear the visitor's draft. The client has a 15-second timeout and does not retry automatically; a timeout can occur after acceptance.

The sender is `website@biancotoro.com`. The recipient is the existing account-verified inbox receiving `contact@biancotoro.com`, configured only as the `CONTACT_RECIPIENT` Worker secret. Neither address can be selected by the visitor. Replies use the validated visitor address. No message database, tracking cookie, or visitor fields in application event logs are added. Provider infrastructure still processes requests and email.

## Deploy and verify

Use Node 22.19+ and the official Wrangler CLI pinned to `4.164.0`. Authenticate to the existing Cloudflare account; do not commit credentials.

```sh
node --experimental-strip-types --test infrastructure/contact/contact.test.mjs
node node_modules/typescript/bin/tsc -p infrastructure/contact/tsconfig.json
npm exec --yes --package=wrangler@4.164.0 -- wrangler deploy --config infrastructure/contact/wrangler.toml --dry-run
# First setup only: pipe the approved existing verified destination into secret put.
npm exec --yes --package=wrangler@4.164.0 -- wrangler secret put CONTACT_RECIPIENT --config infrastructure/contact/wrangler.toml
npm exec --yes --package=wrangler@4.164.0 -- wrangler deploy --config infrastructure/contact/wrangler.toml
```

The precise `biancotoro.com/api/inquiry*` route owns only the contact API. No workers.dev namespace or DNS migration is needed. Native Email Sending supports verified destinations in the existing Email Routing setup. Rate-limit bindings apply 3 requests/minute per hashed IP and brand, plus 30/minute per brand. Cloudflare rate limits are location-based and approximate, not a hard global budget. Origin checks and a honeypot are abuse reductions, not authentication against a custom HTTP client. Limiter failures fail closed. Consider stronger bot challenges only if actual abuse requires them.

Automated tests mock email delivery. A real verification email requires the owner's approval of the exact text. The single approved verification on 2026-11-18 returned 202, and the owner confirmed receipt. Do not resend it during routine QA.

## Measurement

Worker observability records JSON events with `event=website_inquiry`, `site`, `outcome`, `requestId`, optional error `code`, and `elapsedMs`. Filter **application events**, not HTTP request logs. Count unique `requestId` with `outcome=accepted`, by brand and dated UTC window. Exclude verification ID `517ac34b-60d0-4c15-8a02-ba64c1bd57d1` and any later explicitly documented tests. The same person can submit twice: this is accepted submissions, not unique leads or sales. Log retention/sampling determine the available window; do not imply permanent analytics storage. No retrospective data exists before deployment.

Record qualified inquiries and booked work separately in the business's own records. Compare Search Console clicks/impressions and index status using the already configured properties and explicit date windows; no repeat sitemap submissions or ranking promises. New service routes appear in BiancoToro's existing sitemap and internal links.
