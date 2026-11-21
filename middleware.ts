import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
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
 * Returns the session token when the cookie is genuinely ours.
 */
async function liveSessionToken(value: string | undefined, secret: string) {
  const parsed = parseSessionCookie(value);
  if (!parsed || isExpired(parsed)) return null;

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

  return timingSafeHexEqual(toHex(new Uint8Array(mac)), parsed.signature) ? parsed.token : null;
}

/**
 * Staff areas need the role from the database. If the lookup fails we let the
 * request through so the admin layout, which repeats the check, can decide.
 */
async function isAdminSession(token: string) {
  try {
    const digest = toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))));
    const result = await getSql()`
      SELECT u.role
      FROM auth_sessions s
      JOIN app_users u ON u.id = s.user_id
      WHERE s.token_hash = ${digest} AND s.expires_at > now() AND u.status = 'active'
      LIMIT 1
    `;
    const rows = Array.isArray(result) ? result : [];
    return (rows[0] as { role?: string } | undefined)?.role === "admin";
  } catch {
    return true;
  }
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url, 307);
}

export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  // Without a usable secret every session is invalid anyway; let the layouts decide.
  if (!secret || secret.length < 32) return NextResponse.next();

  const token = await liveSessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value, secret);
  if (!token) return redirectTo(request, "/login");

  if (request.nextUrl.pathname.startsWith("/admin") && !(await isAdminSession(token))) {
    return redirectTo(request, "/dashboard");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
  // The admin role check reads the session row, so this must run on Node.js.
  runtime: "nodejs",
};
