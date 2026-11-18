import type { Inquiry } from "../../infrastructure/contact/src/contract.ts";

export const CONTACT_ENDPOINT = "https://biancotoro.com/api/inquiry";
export class ContactSubmissionError extends Error {
  code: "RATE_LIMITED" | "INVALID_REQUEST" | "DELIVERY_UNAVAILABLE";
  constructor(code: ContactSubmissionError["code"]) { super(code); this.code = code; }
}

/** Resolve only for a confirmed provider-accepted 202. No automatic retries. */
export async function submitInquiry(inquiry: Inquiry, options: { fetcher?: typeof fetch; signal?: AbortSignal } = {}): Promise<{ requestId: string }> {
  const response = await (options.fetcher || fetch)(CONTACT_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
    credentials: "omit", cache: "no-store", body: JSON.stringify(inquiry), signal: options.signal,
  });
  if (response.status === 429) throw new ContactSubmissionError("RATE_LIMITED");
  if (response.status === 400 || response.status === 413) throw new ContactSubmissionError("INVALID_REQUEST");
  if (response.status !== 202) throw new ContactSubmissionError("DELIVERY_UNAVAILABLE");
  const body = await response.json().catch(() => null);
  if (!body?.ok || typeof body.requestId !== "string" || !body.requestId) throw new ContactSubmissionError("DELIVERY_UNAVAILABLE");
  return { requestId: body.requestId };
}
