"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage, formMessageClass, readJson } from "./api";
import styles from "./dashboard.module.css";

export default function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const cleaned = fullName.trim().replace(/\s+/g, " ");
    if (cleaned.length < 2) {
      setMessage({ tone: "error", text: "Enter your full name (2–100 characters)." });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ fullName: cleaned }),
      });

      if (!response.ok) {
        const body = await readJson(response);
        setMessage({ tone: "error", text: apiErrorMessage(body, "We could not save your details. Please try again.") });
        return;
      }

      setFullName(cleaned);
      setMessage({ tone: "ok", text: "Profile updated." });
      router.refresh();
    } catch {
      setMessage({ tone: "error", text: "Connection problem. Check your internet connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.panel} onSubmit={save}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="profile-name">
          Full name
        </label>
        <input
          id="profile-name"
          className={styles.input}
          name="fullName"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          minLength={2}
          maxLength={100}
          required
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.cta} disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
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
