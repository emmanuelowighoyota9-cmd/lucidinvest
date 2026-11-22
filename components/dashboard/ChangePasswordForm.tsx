"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage, formMessageClass, readJson } from "./api";
import styles from "./dashboard.module.css";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (newPassword.length < 12) {
      setMessage({ tone: "error", text: "Choose a password with at least 12 characters." });
      return;
    }
    if (newPassword !== confirm) {
      setMessage({ tone: "error", text: "Both new passwords must match." });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await readJson(response);

      if (!response.ok) {
        setMessage({ tone: "error", text: apiErrorMessage(body, "We could not change your password. Please try again.") });
        return;
      }

      const revoked =
        body && typeof body === "object" && "revokedSessions" in body && typeof body.revokedSessions === "number"
          ? body.revokedSessions
          : 0;
      setMessage({
        tone: "ok",
        text:
          revoked > 0
            ? `Password updated. ${revoked} other session${revoked === 1 ? "" : "s"} signed out.`
            : "Password updated. No other sessions were signed in.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      router.refresh();
    } catch {
      setMessage({ tone: "error", text: "Connection problem. Check your internet connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={save}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="current-password">
            Current password
          </label>
          <input
            id="current-password"
            className={styles.input}
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            className={styles.input}
            type="password"
            name="newPassword"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            className={styles.input}
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.cta} disabled={busy}>
          {busy ? "Saving…" : "Change password"}
        </button>
        {message && (
          <p className={formMessageClass(message.tone)} role="status">
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
