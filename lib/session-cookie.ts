/**
 * Pure helpers for the session cookie. Kept free of Node APIs so both the
 * server (node:crypto) and the middleware (Web Crypto) can share one format.
 *
 * Cookie value: `<token>.<expiresAtMs>.<hmac-sha256 of "<token>.<expiresAtMs>">`
 */

export const SESSION_COOKIE_NAME = "lucidinvest_session";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,}$/;
const EXPIRY_PATTERN = /^\d{10,16}$/;
const SIGNATURE_PATTERN = /^[a-f0-9]{64}$/i;

export type ParsedSessionCookie = {
  token: string;
  expiresAtMs: number;
  signature: string;
};

export function parseSessionCookie(value: string | undefined | null): ParsedSessionCookie | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [token, expiry, signature] = parts;
  if (!TOKEN_PATTERN.test(token) || !EXPIRY_PATTERN.test(expiry) || !SIGNATURE_PATTERN.test(signature)) return null;

  return { token, expiresAtMs: Number(expiry), signature: signature.toLowerCase() };
}

/** The exact bytes that are signed, so a tampered expiry cannot pass. */
export function sessionPayload(token: string, expiresAtMs: number) {
  return `${token}.${expiresAtMs}`;
}

export function formatSessionCookie(token: string, expiresAtMs: number, signature: string) {
  return `${token}.${expiresAtMs}.${signature}`;
}

export function timingSafeHexEqual(expected: string, supplied: string) {
  if (expected.length !== supplied.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ supplied.charCodeAt(index);
  }
  return difference === 0;
}

export function isExpired(cookie: ParsedSessionCookie, now = Date.now()) {
  return cookie.expiresAtMs <= now;
}
