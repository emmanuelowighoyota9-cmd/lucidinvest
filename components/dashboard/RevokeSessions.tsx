"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage, formMessageClass, readJson } from "./api";
import styles from "./dashboard.module.css";

export default function RevokeSessions({ otherSessions }: { otherSessions: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function revoke() {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/sessions/revoke-others", {
        method: "POST",
        credentials: "same-origin",
      });
      const body = await readJson(response);

      if (!response.ok) {
        setMessage({ tone: "error", text: apiErrorMessage(body, "We could not end those sessions. Please try again.") });
        return;
      }

      const revoked =
        body && typeof body === "object" && "revoked" in body && typeof body.revoked === "number" ? body.revoked : 0;
      setMessage({
        tone: "ok",
        text: revoked === 0 ? "No other sessions were signed in." : `Signed out ${revoked} other session${revoked === 1 ? "" : "s"}.`,
      });
      router.refresh();
    } catch {
      setMessage({ tone: "error", text: "Connection problem. Check your internet connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.formActions}>
      <button type="button" className={`${styles.cta} ${styles.ctaGhost}`} onClick={revoke} disabled={busy || otherSessions === 0}>
        {busy ? "Signing out…" : `Sign out other devices${otherSessions > 0 ? ` (${otherSessions})` : ""}`}
      </button>
      {message && (
        <p className={formMessageClass(message.tone)} role="status">
          {message.text}
        </p>
      )}
    </div>
  );
}
