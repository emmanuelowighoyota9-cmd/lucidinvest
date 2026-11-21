import "server-only";
import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  formatSessionCookie,
  isExpired,
  parseSessionCookie,
  sessionPayload,
  timingSafeHexEqual,
} from "@/lib/session-cookie";

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = SESSION_COOKIE_NAME;
const SESSION_DAYS = 7;
const SCRYPT_KEY_LENGTH = 64;

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be configured with at least 32 characters");
  return secret;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, digest] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !digest || !/^[a-f0-9]{128}$/i.test(digest)) return false;
  const actual = (await scrypt(password, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  const expected = Buffer.from(digest, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

function tokenDigest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function signature(token: string, expiresAtMs: number) {
  return createHmac("sha256", authSecret()).update(sessionPayload(token, expiresAtMs)).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const expiresAtMs = expiresAt.getTime();
  await getSql()`INSERT INTO auth_sessions (user_id, token_hash, expires_at) VALUES (${userId}, ${tokenDigest(token)}, ${expiresAt.toISOString()})`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, formatSessionCookie(token, expiresAtMs, signature(token, expiresAtMs)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Returns the session token only when the cookie is signed and still within its expiry. */
async function readSessionToken() {
  const jar = await cookies();
  const parsed = parseSessionCookie(jar.get(COOKIE_NAME)?.value);
  if (!parsed || isExpired(parsed)) return null;
  try {
    if (!timingSafeHexEqual(signature(parsed.token, parsed.expiresAtMs), parsed.signature)) return null;
  } catch {
    return null;
  }
  return parsed.token;
}

export async function getCurrentSessionDigest() {
  const token = await readSessionToken();
  return token ? tokenDigest(token) : null;
}

export async function getCurrentUser() {
  const digest = await getCurrentSessionDigest();
  if (!digest) return null;

  const rows = await getSql()`
    SELECT u.id, u.email, u.full_name, u.role, u.status
    FROM auth_sessions s
    JOIN app_users u ON u.id = s.user_id
    WHERE s.token_hash = ${digest} AND s.expires_at > now() AND u.status = 'active'
    LIMIT 1
  `;
  const row = Array.isArray(rows) ? rows[0] : undefined;
  return row && !Array.isArray(row) && typeof row === "object" ? row as {
    id: string; email: string; full_name: string; role: string; status: string;
  } : null;
}

export async function destroySession() {
  try {
    const digest = await getCurrentSessionDigest();
    if (digest) await getSql()`DELETE FROM auth_sessions WHERE token_hash = ${digest}`;
  } catch { /* Still clear the browser cookie if server configuration is incomplete. */ }
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(0) });
}

/** For pages that cannot render without a signed-in customer. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
