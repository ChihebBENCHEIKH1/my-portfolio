import assert from "node:assert/strict";
import test from "node:test";
import { handleContact } from "./src/index.ts";

const valid = { name: "Client café", email: "visitor@example.net", subject: "System review", message: "A review of our system — مرحبا.", lang: "en", website: "" };
function fixture() {
  const sent = [], events = [], limits = [];
  const env = {
    EMAIL: { send: async message => { sent.push(message); return { messageId: "provider-id" }; } },
    CONTACT_LIMITER: { limit: async key => { limits.push(key); return { success: true }; } },
    SITE_LIMITER: { limit: async key => { limits.push(key); return { success: true }; } },
    CONTACT_RECIPIENT: "owner@example.org",
    CONTACT_FROM: "website@biancotoro.com",
  };
  const dependencies = { id: () => "test-request-id", now: () => 100, log: event => events.push(event) };
  return { env, dependencies, sent, events, limits };
}
function request(body = valid, origin = "https://biancotoro.com", extra = {}) {
  return new Request("https://contact.example/inquiry", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: origin, "CF-Connecting-IP": "192.0.2.8" }, body: JSON.stringify(body), ...extra,
  });
}

test("provider acceptance preserves Unicode and reply-to without logging visitor data", async () => {
  const f = fixture(); const response = await handleContact(request(), f.env, f.dependencies);
  assert.equal(response.status, 202); assert.deepEqual(await response.json(), { ok: true, requestId: "test-request-id" });
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://biancotoro.com");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(f.sent.length, 1); assert.equal(f.sent[0].to, f.env.CONTACT_RECIPIENT);
  assert.deepEqual(f.sent[0].replyTo, { email: valid.email, name: valid.name });
  assert(f.sent[0].text.includes(valid.message)); assert(f.sent[0].subject.includes(valid.subject));
  assert.equal(f.events[0].outcome, "accepted"); assert.equal(f.events[0].site, "biancotoro");
  for (const text of [valid.name, valid.email, valid.message, "192.0.2.8", f.env.CONTACT_RECIPIENT]) assert(!JSON.stringify(f.events).includes(text));
  assert(!JSON.stringify(f.limits).includes("192.0.2.8"));
});

test("invalid input, header injection and arbitrary recipient fields never send", async () => {
  for (const change of [{ email: "invalid" }, { email: "a@example.net\r\nBcc:x@example.net" }, { name: "x\r\nBcc:y" }, { subject: "x\nBCC:y" }, { message: "" }, { message: "x".repeat(5001) }, { to: "other@example.net" }, { website: "https://spam.example" }, { lang: "de" }]) {
    const f = fixture(); const response = await handleContact(request({ ...valid, ...change }), f.env, f.dependencies);
    assert.equal(response.status, 400, JSON.stringify(change).slice(0,90)); assert.equal(f.sent.length, 0);
  }
});

test("site derives from exact allowed origin and supports its languages", async () => {
  const f = fixture(); const response = await handleContact(request({ ...valid, lang: "de" }, "https://www.chihebbencheikh.com"), f.env, f.dependencies);
  assert.equal(response.status, 202); assert.equal(f.events[0].site, "portfolio"); assert(f.sent[0].subject.startsWith("[Portfolio]"));
  for (const origin of ["https://biancotoro.com.evil.example", "http://biancotoro.com", "https://unrelated.example", "null"]) {
    const q = fixture(); const denied = await handleContact(request(valid, origin), q.env, q.dependencies);
    assert.equal(denied.status, 403); assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null); assert.equal(q.sent.length, 0);
  }
});

test("unsupported media, malformed JSON and oversized streaming bodies are rejected", async () => {
  const f = fixture();
  const plain = await handleContact(request(valid, "https://biancotoro.com", { headers: { Origin: "https://biancotoro.com", "Content-Type": "text/plain" } }), f.env, f.dependencies);
  assert.equal(plain.status, 415);
  const malformed = await handleContact(request(valid, "https://biancotoro.com", { body: "{" }), f.env, f.dependencies); assert.equal(malformed.status, 400);
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(18000)); controller.enqueue(new Uint8Array(18000)); controller.close(); } });
  const oversized = await handleContact(request(valid, "https://biancotoro.com", { body: stream, duplex: "half" }), f.env, f.dependencies);
  assert.equal(oversized.status, 413); assert.equal(f.sent.length, 0);
});

test("per-IP and per-site rate limits fail closed without sending", async () => {
  for (const binding of ["CONTACT_LIMITER", "SITE_LIMITER"]) {
    const f = fixture(); f.env[binding].limit = async () => ({ success: false });
    const response = await handleContact(request(), f.env, f.dependencies);
    assert.equal(response.status, 429); assert.equal(response.headers.get("Retry-After"), "60"); assert.equal(f.sent.length, 0);
  }
  const f = fixture(); f.env.CONTACT_LIMITER.limit = async () => { throw new Error("private limiter error"); };
  assert.equal((await handleContact(request(), f.env, f.dependencies)).status, 503); assert.equal(f.sent.length, 0);
});

test("delivery failure never reports success or exposes provider error details", async () => {
  const f = fixture(); f.env.EMAIL.send = async () => { throw new Error("Private provider mailbox or token"); };
  const response = await handleContact(request(), f.env, f.dependencies); assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, requestId: "test-request-id", error: { code: "DELIVERY_UNAVAILABLE" } });
  assert.equal(f.events[0].outcome, "failed"); assert(!JSON.stringify(f.events).includes("Private provider"));
});

test("preflight, unknown routes and configuration health do not send email", async () => {
  const f = fixture();
  const preflight = await handleContact(new Request("https://contact.example/inquiry", { method: "OPTIONS", headers: { Origin: "https://biancotoro.com" } }), f.env, f.dependencies);
  assert.equal(preflight.status, 204); assert.equal(preflight.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
  assert.equal((await handleContact(new Request("https://contact.example/unknown"), f.env, f.dependencies)).status, 404);
  assert.equal((await handleContact(new Request("https://contact.example/health"), f.env, f.dependencies)).status, 200);
  assert.equal((await handleContact(new Request("https://biancotoro.com/api/inquiry/health"), f.env, f.dependencies)).status, 200);
  f.env.CONTACT_RECIPIENT = "";
  const unhealthy = await handleContact(new Request("https://contact.example/health"), f.env, f.dependencies); assert.equal(unhealthy.status, 503);
  assert.equal((await handleContact(request(), f.env, f.dependencies)).status, 503); assert.equal(f.sent.length, 0);
});
