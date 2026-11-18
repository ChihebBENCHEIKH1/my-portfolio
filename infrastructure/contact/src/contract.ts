export type Site = "portfolio" | "biancotoro";
export type Language = "en" | "de" | "fr" | "ar";

export interface Inquiry {
  name: string;
  email: string;
  subject?: string;
  message: string;
  lang: Language;
  website?: string;
}

export type ErrorCode = "ORIGIN_NOT_ALLOWED" | "METHOD_NOT_ALLOWED" | "UNSUPPORTED_MEDIA_TYPE" | "BODY_TOO_LARGE" | "INVALID_REQUEST" | "RATE_LIMITED" | "DELIVERY_UNAVAILABLE" | "NOT_FOUND";
export type ContactResponse = { ok: true; requestId: string } | { ok: false; requestId: string; error: { code: ErrorCode } };

export interface OutboundMessage {
  from: { email: string; name: string };
  to: string;
  replyTo: { email: string; name: string };
  subject: string;
  text: string;
}

export interface Env {
  EMAIL: { send(message: OutboundMessage): Promise<{ messageId: string }> };
  CONTACT_LIMITER: { limit(input: { key: string }): Promise<{ success: boolean }> };
  SITE_LIMITER: { limit(input: { key: string }): Promise<{ success: boolean }> };
  CONTACT_RECIPIENT: string;
  CONTACT_FROM: string;
}

export interface InquiryEvent {
  event: "website_inquiry";
  requestId: string;
  site?: Site;
  outcome: "accepted" | "rejected" | "failed";
  code?: ErrorCode;
  elapsedMs: number;
}

export interface Dependencies {
  now(): number;
  id(): string;
  log(event: InquiryEvent): void;
}

// Contract invariants:
// - POST /api/inquiry (or /inquiry locally) accepts a bounded JSON Inquiry
//   from an allowed website. GET /api/inquiry/health reveals configuration only.
// - Site/recipient/sender are determined by trusted configuration, never input.
// - A 202 is returned only after EMAIL.send resolves; it confirms provider
//   acceptance, not inbox receipt or a booked engagement.
// - Invalid, throttled and unavailable requests never report success.
// - Logs contain only this InquiryEvent, never names, email, IP or message.
// - No visitor tracking cookies, message database or automatic retry is added.
