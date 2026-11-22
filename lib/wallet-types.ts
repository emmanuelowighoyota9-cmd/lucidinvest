/**
 * Wallet API contract. Imported by both the route handlers and the client
 * components, so the JSON shape is defined once.
 *
 * Every amount is a decimal string exactly as Postgres holds it (NUMERIC);
 * the UI converts it with `decimalToMinor` before doing anything else.
 */

export type Wallet = {
  id: string;
  walletNumber: string;
  currency: string;
  status: string;
  balance: string;
  createdAt: string;
};

export type TradingAccountMode = "real" | "demo";

export type TradingAccount = {
  id: string;
  accountNumber: string | null;
  accountType: string;
  mode: TradingAccountMode;
  currency: string;
  status: string;
  balance: string;
  createdAt: string;
};

export type WalletRequestKind = "deposit" | "withdrawal";

export type WalletRequest = {
  id: string;
  kind: WalletRequestKind;
  amount: string;
  currency: string;
  status: string;
  reference: string;
  note: string | null;
  createdAt: string;
  processedAt: string | null;
};

export type WalletOverview = {
  wallet: Wallet;
  realAccounts: TradingAccount[];
  demoAccounts: TradingAccount[];
  pendingRequests: WalletRequest[];
};

export type WalletTransactionKind = "deposit" | "withdrawal" | "transfer" | "investment" | "other";

export type WalletTransaction = {
  id: string;
  kind: WalletTransactionKind;
  amount: string;
  currency: string;
  description: string;
  reference: string | null;
  status: string;
  postedAt: string | null;
  createdAt: string;
  /** Trading account number for account entries, null for wallet entries. */
  accountNumber: string | null;
  /** Wallet number for wallet entries, null for account entries. */
  walletNumber: string | null;
};

export type WalletTransactionPage = {
  entries: WalletTransaction[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type WalletTransferReceipt = {
  transactionId: string;
  reference: string;
  amount: string;
  currency: string;
  accountNumber: string | null;
};

export type AdminWalletRequest = WalletRequest & {
  customerName: string;
  customerEmail: string;
  walletNumber: string;
  walletBalance: string;
};

export type WalletApiError = { error: string };
