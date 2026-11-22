/**
 * Money helpers shared by API routes and client components.
 *
 * Amounts are carried as integer minor units (cents) everywhere in this module
 * and in the wallet API, so no arithmetic is ever done on a float. Decimal
 * strings only appear at the database boundary, where NUMERIC(24, 8) keeps its
 * own exact representation.
 */

/** Smallest amount the wallet accepts, in minor units. */
export const MIN_AMOUNT_MINOR = 100;
/** Largest single wallet movement, in minor units (100,000,000.00). */
export const MAX_AMOUNT_MINOR = 10_000_000_000;

const AMOUNT = /^\d{1,12}(?:\.\d{1,2})?$/;

/**
 * Parses user input into minor units without going through a float.
 * Accepts a string such as "250", "250.5" or "250.50" (and JSON numbers whose
 * decimal form is exact); anything with more than two decimals is rejected.
 */
export function parseAmountToMinor(value: unknown): number | null {
  const text =
    typeof value === "number"
      ? String(value)
      : typeof value === "string"
        ? value.trim().replace(/,/g, "")
        : null;
  if (text === null || !AMOUNT.test(text)) return null;

  const [whole, fraction = ""] = text.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(minor) ? minor : null;
}

/** Reads a NUMERIC balance from Postgres. Display and comparison only. */
export function decimalToMinor(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const text = typeof value === "number" ? value.toFixed(8) : String(value).trim();
  const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(text);
  if (!match) return null;

  const whole = Number(match[2]);
  const fraction = (match[3] ?? "").slice(0, 2).padEnd(2, "0");
  const minor = whole * 100 + Number(fraction);
  return Number.isSafeInteger(minor) ? (match[1] ? -minor : minor) : null;
}

/** Exact decimal string for NUMERIC parameters; never renders a float artefact. */
export function minorToDecimal(minor: number): string {
  const sign = minor < 0 ? "-" : "";
  const absolute = Math.abs(Math.trunc(minor));
  return `${sign}${Math.trunc(absolute / 100)}.${String(absolute % 100).padStart(2, "0")}`;
}

/** Currency formatting for display. */
export function formatMinor(minor: number | null | undefined, currency: string): string {
  if (minor === null || minor === undefined || !Number.isFinite(minor)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(minor / 100);
  } catch {
    return `${currency} ${minorToDecimal(minor)}`;
  }
}

/** Currency formatting for a NUMERIC balance read from Postgres. */
export function formatDecimal(value: string | number | null | undefined, currency: string): string {
  return formatMinor(decimalToMinor(value), currency);
}

/** `+$25.00` / `−$25.00`, for ledger rows. */
export function formatSignedMinor(minor: number, currency: string): string {
  const formatted = formatMinor(Math.abs(minor), currency);
  if (minor === 0) return formatted;
  return minor > 0 ? `+${formatted}` : `−${formatted}`;
}
