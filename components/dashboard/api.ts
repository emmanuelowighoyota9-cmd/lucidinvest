"use client";

import styles from "./dashboard.module.css";

/** Pulls the `error` string out of an API response body, if there is one. */
export function apiErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "error" in body && typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }
  return fallback;
}

export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function formMessageClass(tone: "ok" | "error") {
  return `${styles.formMessage} ${tone === "ok" ? styles.formOk : styles.formError}`;
}
