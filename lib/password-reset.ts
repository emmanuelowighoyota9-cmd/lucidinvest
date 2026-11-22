import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { getSql } from "@/lib/db";

/**
 * Password reset tokens.
 *
 * The raw token only ever exists in the response of the request that created it
 * and in the link sent to the customer. The database stores a SHA-256 digest,
 * the token expires after one hour and can be used exactly once.
 */

const TTL_MINUTES = 60;

function digestToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function rows<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === "object") as T[]) : [];
}

/**
 * Creates a reset token for an active account. Returns null when the email does
 * not belong to an active account, so the caller can answer identically either
 * way and avoid revealing which addresses are registered.
 */
export async function createPasswordResetToken(email: string): Promise<{ token: string; name: string } | null> {
  const sql = getSql();
  const users = rows<{ id: string; full_name: string }>(await sql`
    SELECT id, full_name
    FROM app_users
    WHERE lower(email) = ${email} AND status = 'active'
    LIMIT 1
  `);
  const user = users[0];
  if (!user) return null;

  const token = randomBytes(32).toString("base64url");
  const hash = digestToken(token);

  // Only the newest link works: earlier unused tokens are closed out first.
  await sql`
    UPDATE password_reset_tokens
    SET used_at = now()
    WHERE user_id = ${user.id} AND used_at IS NULL
  `;
  await sql`
    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
    VALUES (${user.id}, ${hash}, now() + (${TTL_MINUTES} || ' minutes')::interval)
  `;
  await sql`
    INSERT INTO audit_events (actor_user_id, action, entity_type, entity_id)
    VALUES (${user.id}, 'auth.password_reset_requested', 'app_user', ${user.id})
  `;

  return { token, name: user.full_name };
}

export type ResetOutcome =
  | { ok: true; revokedSessions: number }
  | { ok: false; status: number; error: string };

/**
 * Consumes a token and sets the new password in one statement: the token can
 * only be marked used once, the password update follows the same row, and every
 * existing session for the account is revoked.
 */
export async function resetPasswordWithToken(
  token: string,
  passwordHash: string,
): Promise<ResetOutcome> {
  const hash = digestToken(token);
  const sql = getSql();

  const result = rows<{ updated: number; revoked: number }>(await sql`
    WITH used AS (
      UPDATE password_reset_tokens
      SET used_at = now()
      WHERE token_hash = ${hash} AND used_at IS NULL AND expires_at > now()
      RETURNING user_id
    ), updated AS (
      UPDATE app_users
      SET password_hash = ${passwordHash}, updated_at = now()
      WHERE id IN (SELECT user_id FROM used)
      RETURNING id
    ), revoked AS (
      DELETE FROM auth_sessions
      WHERE user_id IN (SELECT user_id FROM used)
      RETURNING id
    ), audited AS (
      INSERT INTO audit_events (actor_user_id, action, entity_type, entity_id)
      SELECT id, 'auth.password_reset', 'app_user', id::text FROM updated
      RETURNING id
    )
    SELECT (SELECT count(*)::int FROM updated) AS updated,
           (SELECT count(*)::int FROM revoked) AS revoked
  `);

  const row = result[0];
  if (Number(row?.updated ?? 0) === 0) {
    return { ok: false, status: 400, error: "That reset link is invalid or has expired. Request a new one." };
  }
  return { ok: true, revokedSessions: Number(row?.revoked ?? 0) };
}
