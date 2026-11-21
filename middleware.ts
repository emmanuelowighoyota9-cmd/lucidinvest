import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  isExpired,
  parseSessionCookie,
  sessionPayload,
  timingSafeHexEqual,
} from "@/lib/session-cookie";

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates the signed session cookie, including its embedded expiry, so an
 * expired session is rejected before any page or database work happens.
 */
async function hasLiveSession(value: string | undefined, secret: string) {
  const parsed = parseSessionCookie(value);
  if (!parsed || isExpired(parsed)) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(sessionPayload(parsed.token, parsed.expiresAtMs)),
  );

  return timingSafeHexEqual(toHex(new Uint8Array(mac)), parsed.signature);
}

export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  // Without a usable secret every session is invalid anyway; let the dashboard layout decide.
  if (!secret || secret.length < 32) return NextResponse.next();

  const live = await hasLiveSession(request.cookies.get(SESSION_COOKIE_NAME)?.value, secret);
  if (live) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl, 307);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
