import assert from "node:assert/strict";
import test from "node:test";
import { CONTACT_ENDPOINT, submitInquiry } from "../src/utils/contact.ts";

const inquiry = { name: "Visitor", email: "visitor@example.net", message: "Project details", lang: "en", website: "" };
test("client submits once without cookies and resolves only after accepted response", async () => {
  let count = 0;
  const result = await submitInquiry(inquiry, { fetcher: async (url, options) => {
    count++; assert.equal(url, CONTACT_ENDPOINT); assert.equal(options.credentials, "omit"); assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(options.body), inquiry);
    return Response.json({ ok: true, requestId: "accepted-id" }, { status: 202 });
  } });
  assert.deepEqual(result, { requestId: "accepted-id" }); assert.equal(count, 1);
});
test("client never treats errors, malformed acknowledgements or network failures as sent", async () => {
  for (const [status, body, code] of [[429, { ok: false }, "RATE_LIMITED"], [400, { ok: false }, "INVALID_REQUEST"], [503, { ok: true }, "DELIVERY_UNAVAILABLE"], [202, { ok: true }, "DELIVERY_UNAVAILABLE"], [200, { ok: true, requestId: "not-accepted" }, "DELIVERY_UNAVAILABLE"]]) {
    await assert.rejects(submitInquiry(inquiry, { fetcher: async () => Response.json(body, { status }) }), error => error.code === code);
  }
  let count = 0;
  await assert.rejects(submitInquiry(inquiry, { fetcher: async () => { count++; throw new TypeError("Network unavailable"); } }));
  assert.equal(count, 1, "network failures are not automatically retried");
});
