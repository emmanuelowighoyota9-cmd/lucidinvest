"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./recovery.module.css";

type Props = { mode: "forgot" | "reset"; token?: string };

export default function PasswordRecoveryForm({ mode, token = "" }: Props) {
  const resetting = mode === "reset";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (resetting) {
      if (!token) {
        setError("This page needs the link from your reset email.");
        return;
      }
      if (password.length < 12) {
        setError("Choose a password with at least 12 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Both passwords must match.");
        return;
      }
    }

    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${resetting ? "reset-password" : "forgot-password"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(resetting ? { token, password } : { email }),
      });

      let result: unknown = null;
      try {
        result = await response.json();
      } catch {
        /* Fall back to generic copy. */
      }
      const fromBody = (key: "error" | "message") =>
        result && typeof result === "object" && key in result && typeof (result as Record<string, unknown>)[key] === "string"
          ? String((result as Record<string, unknown>)[key])
          : "";

      if (!response.ok) {
        setError(fromBody("error") || "We could not complete that request. Please try again.");
        return;
      }

      if (resetting) {
        setNotice(fromBody("message") || "Password updated. You can sign in now.");
        setPassword("");
        setConfirm("");
      } else {
        setNotice(fromBody("message") || "If that email belongs to an account, a reset link is on its way.");
        setEmail("");
      }
    } catch {
      setError("Connection problem. Check your internet connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <Link href="/" className={styles.brand} aria-label="Lucid Global Invest home">
          <Image
            src="/assets/images/resources/lucid-global-invest-logo.png"
            alt="Lucid Global Invest"
            width={142}
            height={71}
            className={styles.brandImage}
            priority
          />
        </Link>

        <p className={styles.eyebrow}>{resetting ? "ACCOUNT RECOVERY" : "FORGOT PASSWORD"}</p>
        <h1 className={styles.title}>{resetting ? "Choose a new password" : "Reset your password"}</h1>
        <p className={styles.lead}>
          {resetting
            ? "This link can be used once and expires an hour after it was requested. Setting a new password signs out every other device."
            : "Enter the email address on your account and we will send a link that lets you choose a new password. The link expires in one hour."}
        </p>

        <form className={styles.form} onSubmit={submit}>
          {resetting ? (
            <>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="recovery-password">
                  New password
                </label>
                <input
                  id="recovery-password"
                  className={styles.input}
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="recovery-confirm">
                  Confirm new password
                </label>
                <input
                  id="recovery-confirm"
                  className={styles.input}
                  type="password"
                  name="confirm"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="recovery-email">
                Email address
              </label>
              <input
                id="recovery-email"
                className={styles.input}
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className={styles.ok} role="status">
              {notice}
            </p>
          )}

          <button className={styles.submit} type="submit" disabled={busy}>
            {busy ? "Please wait…" : resetting ? "Set new password" : "Send reset link"}
          </button>
        </form>

        <p className={styles.hint}>
          <Link href="/login">Back to sign in</Link>
          {resetting ? " · " : " · "}
          <Link href={resetting ? "/forgot-password" : "/register"}>
            {resetting ? "Request a new link" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
