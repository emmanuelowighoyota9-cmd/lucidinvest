import "server-only";
import type { NextRequest } from "next/server";

/** Host name (with port) from an absolute URL, or null when it does not parse. */
function hostOf(value: string) {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * True when a state-changing request was made by a page on this same site.
 *
 * Browsers send `Origin` (or at least `Referer`) on cross-site POSTs, so a
 * mismatch is a forgery attempt. Non-browser clients that send neither are
 * judged by `Sec-Fetch-Site`; a missing header is allowed because such a client
 * still has to present the HttpOnly session cookie.
 */
export function isSameOriginRequest(request: NextRequest) {
  const target = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").toLowerCase();
  if (!target) return false;

  const origin = request.headers.get("origin");
  if (origin) return hostOf(origin) === target;

  const referer = request.headers.get("referer");
  if (referer) return hostOf(referer) === target;

  const site = request.headers.get("sec-fetch-site");
  return site === null || site === "same-origin" || site === "none";
}
