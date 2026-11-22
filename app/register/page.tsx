import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create your account | Lucid Global Invest",
  description: "Open a Lucid Global Invest account to track global markets from one secure dashboard.",
};

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  investment: "investment",
  cash: "cash",
  demo: "demo",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const params = await searchParams;
  const requested = Array.isArray(params.type) ? params.type[0] : params.type;
  const selectedAccount = requested ? ACCOUNT_TYPE_LABELS[requested] : undefined;

  return <AuthForm mode="register" selectedAccount={selectedAccount} />;
}
