"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/components/auth/AuthForm.module.css";

export default function AdminSetupForm({ email }: { email: string }) {
  const router = useRouter();
  const [setupKey, setSetupKey] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ setupKey, password }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? "Admin setup failed. Please try again.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Admin setup failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <p className={styles.hint}>
        This makes <strong>{email}</strong> the first administrator.
      </p>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="setup-key">
          Setup key
        </label>
        <input
          id="setup-key"
          className={styles.input}
          type="password"
          autoComplete="off"
          value={setupKey}
          onChange={(event) => setSetupKey(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="setup-password">
          Your password
        </label>
        <input
          id="setup-password"
          className={styles.input}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className={styles.submit} disabled={busy || !setupKey || !password}>
        {busy ? "Creating admin…" : "Create admin account"}
      </button>
    </form>
  );
}
