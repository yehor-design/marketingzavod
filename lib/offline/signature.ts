import { createHmac, timingSafeEqual } from "node:crypto";

/** HubSpot rejects nothing itself: the receiver must drop requests older than five minutes. */
const MAX_AGE_MS = 5 * 60 * 1000;

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Validates X-HubSpot-Signature-v3: base64 HMAC-SHA256 of
 * method + full URL + body + timestamp, keyed with the app's client secret.
 */
export function verifyHubspotSignature(input: {
  secret: string;
  method: string;
  url: string;
  body: string;
  timestamp: string | null;
  signature: string | null;
  now?: number;
}): boolean {
  const { secret, method, url, body, timestamp, signature } = input;
  if (!secret || !timestamp || !signature) {
    return false;
  }
  const sent = Number(timestamp);
  if (!Number.isFinite(sent) || Math.abs((input.now ?? Date.now()) - sent) > MAX_AGE_MS) {
    return false;
  }
  const expected = createHmac("sha256", secret)
    .update(`${method}${url}${body}${timestamp}`, "utf8")
    .digest("base64");
  return safeEqual(expected, signature);
}

/** Constant-time comparison for shared secrets passed as a key or password. */
export function secretMatches(expected: string | undefined, given: string | null | undefined): boolean {
  if (!expected || !given) {
    return false;
  }
  return safeEqual(expected, given);
}
