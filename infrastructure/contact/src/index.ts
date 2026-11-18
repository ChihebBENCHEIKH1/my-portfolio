import type { ContactResponse, Dependencies, Env, ErrorCode, Inquiry, Language, Site } from "./contract.ts";

const MAX_BYTES = 32768;
const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
const defaults: Dependencies = { now: () => Date.now(), id: () => crypto.randomUUID(), log: event => console.info(JSON.stringify(event)) };

function siteFor(origin: string): Site | undefined {
  if (["https://www.chihebbencheikh.com", "https://chihebbencheikh.com"].includes(origin)) return "portfolio";
  if (["https://biancotoro.com", "https://www.biancotoro.com"].includes(origin) || /^https:\/\/(?:[a-z0-9-]+\.)?biancotoro\.pages\.dev$/.test(origin)) return "biancotoro";
}

function configured(env: Env): boolean {
  return !!env.EMAIL?.send && !!env.CONTACT_LIMITER?.limit && !!env.SITE_LIMITER?.limit && emailPattern.test(env.CONTACT_RECIPIENT || "") && emailPattern.test(env.CONTACT_FROM || "");
}

function parseInquiry(value: unknown, site: Site): Inquiry | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const data = value as Record<string, unknown>;
  if (Object.keys(data).some(key => !["name", "email", "subject", "message", "lang", "website"].includes(key))) return;
  const field = (key: string, max: number, optional = false) => {
    if (data[key] === undefined && optional) return "";
    if (typeof data[key] !== "string") return undefined;
    const text = data[key].trim();
    return text.length <= max && !text.includes("\0") && (optional || text.length > 0) ? text : undefined;
  };
  const name = field("name", 120), email = field("email", 254), message = field("message", 5000);
  const subject = field("subject", 160, true), website = field("website", 200, true);
  const languages = site === "portfolio" ? ["en", "de"] : ["en", "fr", "ar"];
  if (!name || !email || !message || subject === undefined || website === undefined || website !== "") return;
  if (!emailPattern.test(email) || /[\r\n]/.test(name + email + subject) || !languages.includes(String(data.lang))) return;
  return { name, email, message, subject: subject || "Website inquiry", lang: data.lang as Language };
}

async function boundedBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("Content-Length")) > MAX_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader(), decoder = new TextDecoder();
  let size = 0, text = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) { await reader.cancel(); return null; }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

export async function handleContact(request: Request, env: Env, dependencies: Dependencies = defaults): Promise<Response> {
  const started = dependencies.now(), requestId = dependencies.id();
  const pathname = new URL(request.url).pathname;
  const path = pathname === "/api/inquiry" ? "/inquiry" : pathname === "/api/inquiry/health" ? "/health" : pathname;
  const origin = request.headers.get("Origin") || "", site = siteFor(origin);
  const headers = new Headers({ "Cache-Control": "no-store", "Vary": "Origin", "X-Content-Type-Options": "nosniff" });
  if (site) headers.set("Access-Control-Allow-Origin", origin);
  const respond = (body: ContactResponse, status: number) => Response.json(body, { status, headers });
  const failure = (code: ErrorCode, status: number) => {
    dependencies.log({ event: "website_inquiry", requestId, site, outcome: status === 503 ? "failed" : "rejected", code, elapsedMs: Math.max(0, dependencies.now() - started) });
    return respond({ ok: false, requestId, error: { code } }, status);
  };
  if (path === "/health" && request.method === "GET") return Response.json({ service: "website-inquiries", configured: configured(env) }, { status: configured(env) ? 200 : 503, headers });
  if (path !== "/inquiry") return failure("NOT_FOUND", 404);
  if (!site) return failure("ORIGIN_NOT_ALLOWED", 403);
  if (request.method === "OPTIONS") {
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Max-Age", "86400");
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== "POST") return failure("METHOD_NOT_ALLOWED", 405);
  if (!configured(env)) return failure("DELIVERY_UNAVAILABLE", 503);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("Content-Type") || "")) return failure("UNSUPPORTED_MEDIA_TYPE", 415);
  let inquiry: Inquiry | undefined;
  try {
    const text = await boundedBody(request);
    if (text === null) return failure("BODY_TOO_LARGE", 413);
    inquiry = parseInquiry(JSON.parse(text), site);
  } catch { return failure("INVALID_REQUEST", 400); }
  if (!inquiry) return failure("INVALID_REQUEST", 400);
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(site + ":" + ip));
    const key = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
    const personal = await env.CONTACT_LIMITER.limit({ key });
    const global = personal.success ? await env.SITE_LIMITER.limit({ key: site }) : { success: false };
    if (!personal.success || !global.success) { headers.set("Retry-After", "60"); return failure("RATE_LIMITED", 429); }
    const label = site === "portfolio" ? "Portfolio" : "BiancoToro";
    await env.EMAIL.send({
      from: { email: env.CONTACT_FROM, name: site === "portfolio" ? "Chiheb portfolio" : "BiancoToro website" },
      to: env.CONTACT_RECIPIENT,
      replyTo: { email: inquiry.email, name: inquiry.name },
      subject: `[${label}] ${inquiry.subject}`,
      text: [`Website: ${origin}`, `Name: ${inquiry.name}`, `Reply email: ${inquiry.email}`, `Language: ${inquiry.lang}`, `Subject: ${inquiry.subject}`, "", "Message:", inquiry.message].join("\n"),
    });
    dependencies.log({ event: "website_inquiry", requestId, site, outcome: "accepted", elapsedMs: Math.max(0, dependencies.now() - started) });
    return respond({ ok: true, requestId }, 202);
  } catch { return failure("DELIVERY_UNAVAILABLE", 503); }
}

export default { fetch: (request: Request, env: Env) => handleContact(request, env) };
