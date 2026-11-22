import type { Metadata } from "next";
import PasswordRecoveryForm from "@/components/auth/PasswordRecoveryForm";

export const metadata: Metadata = {
  title: "Reset password | Lucid Global Invest",
  description: "Choose a new password for your Lucid Global Invest account.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] ?? "" : params.token ?? "";

  return <PasswordRecoveryForm mode="reset" token={token} />;
}
