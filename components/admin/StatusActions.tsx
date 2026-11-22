"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage, readJson } from "@/components/dashboard/api";
import styles from "@/components/dashboard/dashboard.module.css";

export type StatusOption = { value: string; label: string };

export default function StatusActions({
  endpoint,
  options,
  record,
}: {
  endpoint: string;
  options: StatusOption[];
  record: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function apply(value: string, label: string) {
    const confirmed = window.confirm(
      `${label} for ${record}? This change is recorded in the audit log and cannot be undone from this console.`,
    );
    if (!confirmed) return;

    setBusy(value);
    setMessage(null);
    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status: value }),
      });
      const body = await readJson(response);

      if (!response.ok) {
        setMessage({ tone: "error", text: apiErrorMessage(body, "That change was not applied. Please try again.") });
        return;
      }

      setMessage({ tone: "ok", text: `${label} recorded.` });
      router.refresh();
    } catch {
      setMessage({ tone: "error", text: "Connection problem. Check your internet connection and try again." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={styles.formActions} style={{ gap: 8 }}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.cta} ${option.value === "active" ? "" : styles.ctaGhost}`}
          style={{ height: 32, padding: "0 11px", fontSize: 12.5 }}
          onClick={() => apply(option.value, option.label)}
          disabled={busy !== null}
        >
          {busy === option.value ? "Working…" : option.label}
        </button>
      ))}
      {message && (
        <p
          className={`${styles.formMessage} ${message.tone === "ok" ? styles.formOk : styles.formError}`}
          role="status"
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
