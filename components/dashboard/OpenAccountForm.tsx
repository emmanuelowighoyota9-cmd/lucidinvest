"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage, formMessageClass, readJson } from "./api";
import styles from "./dashboard.module.css";

const ACCOUNT_TYPES = [
  { value: "investment", label: "Investment account" },
  { value: "cash", label: "Cash account" },
  { value: "demo", label: "Demo account" },
];

const CURRENCIES = ["USD", "EUR", "GBP"];

export default function OpenAccountForm({ initialType }: { initialType?: string }) {
  const router = useRouter();
  const [accountType, setAccountType] = useState(
    ACCOUNT_TYPES.some((entry) => entry.value === initialType) ? (initialType as string) : "investment",
  );
  const [currency, setCurrency] = useState("USD");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setBusy(true);

    try {
      const response = await fetch("/api/account/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ accountType, currency }),
      });

      if (!response.ok) {
        const body = await readJson(response);
        setMessage({ tone: "error", text: apiErrorMessage(body, "We could not open that account. Please try again.") });
        return;
      }

      const body = (await readJson(response)) as { account?: { accountNumber?: string } } | null;
      const accountNumber = body?.account?.accountNumber;
      setMessage({
        tone: "ok",
        text: accountNumber
          ? `Account ${accountNumber} opened. It stays pending until our team completes its review.`
          : "Account opened. It stays pending until our team completes its review.",
      });
      router.refresh();
    } catch {
      setMessage({ tone: "error", text: "Connection problem. Check your internet connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="account-type">
            Account type
          </label>
          <select
            id="account-type"
            className={styles.input}
            name="accountType"
            value={accountType}
            onChange={(event) => setAccountType(event.target.value)}
            disabled={busy}
          >
            {ACCOUNT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="account-currency">
            Currency
          </label>
          <select
            id="account-currency"
            className={styles.input}
            name="currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            disabled={busy}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.cta} disabled={busy}>
          {busy ? "Opening…" : "Open account"}
        </button>
        {message && (
          <p className={formMessageClass(message.tone)} role="status">
            {message.text}
          </p>
        )}
      </div>
      <p className={styles.hint}>
        One open account per type and currency. Opening an account creates a record for review; it does not fund it.
      </p>
    </form>
  );
}
