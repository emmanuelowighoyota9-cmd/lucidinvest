"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage, formMessageClass, readJson } from "./api";
import styles from "./dashboard.module.css";

export default function CancelInvestmentButton({ id, product }: { id: string; product: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function cancel() {
    const confirmed = window.confirm(
      `Cancel your pending ${product} request? The request is withdrawn and our team will not review it.`,
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/account/investments/${id}/cancel`, {
        method: "POST",
        credentials: "same-origin",
      });
      const body = await readJson(response);

      if (!response.ok) {
        setMessage({ tone: "error", text: apiErrorMessage(body, "We could not cancel that request. Please try again.") });
        return;
      }

      setMessage({ tone: "ok", text: "Request cancelled." });
      router.refresh();
    } catch {
      setMessage({ tone: "error", text: "Connection problem. Check your internet connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.formActions}>
      <button
        type="button"
        className={`${styles.cta} ${styles.ctaGhost}`}
        style={{ height: 34, padding: "0 12px", fontSize: 13 }}
        onClick={cancel}
        disabled={busy}
      >
        {busy ? "Cancelling…" : "Cancel"}
      </button>
      {message && (
        <p className={formMessageClass(message.tone)} role="status">
          {message.text}
        </p>
      )}
    </div>
  );
}
