"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage, formMessageClass, readJson } from "./api";
import styles from "./dashboard.module.css";

export type ProductOption = {
  id: string;
  name: string;
  currency: string;
  minimum: string;
};

export type AccountOption = {
  id: string;
  accountNumber: string | null;
  accountType: string;
  currency: string;
  status: string;
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function InvestmentRequestForm({
  products,
  accounts,
}: {
  products: ProductOption[];
  accounts: AccountOption[];
}) {
  const router = useRouter();
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const product = products.find((entry) => entry.id === productId) ?? products[0];

  const eligibleAccounts = useMemo(
    () =>
      product
        ? accounts.filter(
            (account) =>
              account.currency.trim() === product.currency.trim() &&
              (account.status === "pending" || account.status === "active"),
          )
        : [],
    [accounts, product],
  );

  const account = eligibleAccounts.find((entry) => entry.id === accountId) ?? eligibleAccounts[0];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!product) {
      setMessage({ tone: "error", text: "Choose a product first." });
      return;
    }
    if (!account) {
      setMessage({ tone: "error", text: `Open a ${product.currency.trim()} account before investing in this product.` });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/account/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ productId: product.id, accountId: account.id, amount }),
      });

      if (!response.ok) {
        const body = await readJson(response);
        setMessage({ tone: "error", text: apiErrorMessage(body, "We could not record that request. Please try again.") });
        return;
      }

      setMessage({
        tone: "ok",
        text: `Request recorded for ${product.name}. It stays pending until our team reviews and funds it.`,
      });
      setAmount("");
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
          <label className={styles.label} htmlFor="investment-product">
            Product
          </label>
          <select
            id="investment-product"
            className={styles.input}
            name="productId"
            value={product?.id ?? ""}
            onChange={(event) => {
              setProductId(event.target.value);
              setAccountId("");
            }}
            disabled={busy || products.length === 0}
          >
            {products.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name} · {entry.currency.trim()}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="investment-account">
            Account
          </label>
          <select
            id="investment-account"
            className={styles.input}
            name="accountId"
            value={account?.id ?? ""}
            onChange={(event) => setAccountId(event.target.value)}
            disabled={busy || eligibleAccounts.length === 0}
          >
            {eligibleAccounts.length === 0 ? (
              <option value="">No {product?.currency.trim() ?? ""} account open</option>
            ) : (
              eligibleAccounts.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.accountNumber ?? "Pending number"} · {entry.currency.trim()}
                </option>
              ))
            )}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="investment-amount">
            Amount ({product?.currency.trim() ?? "USD"})
          </label>
          <input
            id="investment-amount"
            className={styles.input}
            name="amount"
            type="number"
            inputMode="decimal"
            min={product?.minimum ?? "0"}
            step="0.01"
            placeholder={product ? Number(product.minimum).toFixed(2) : "0.00"}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={busy}
            required
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.cta} disabled={busy || !product || eligibleAccounts.length === 0}>
          {busy ? "Submitting…" : "Submit request"}
        </button>
        {message && (
          <p className={formMessageClass(message.tone)} role="status">
            {message.text}
          </p>
        )}
      </div>
      <p className={styles.hint}>
        {product
          ? `Minimum ${formatMoney(Number(product.minimum), product.currency.trim())}. `
          : ""}
        {eligibleAccounts.length === 0 ? (
          <>
            You need an open account in this currency. <Link href="/dashboard/accounts">Open an account</Link>.
          </>
        ) : (
          "Submitting records a request for review. Nothing is charged or transferred from this page."
        )}
      </p>
    </form>
  );
}
