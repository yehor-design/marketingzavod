/**
 * Request checks shared by the route handlers that take data from the
 * browser: same-origin only, and the client address for rate limiting.
 */
import type { NextRequest } from "next/server";

export function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** A request without an Origin header is allowed: same-origin form posts may omit it. */
export function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
