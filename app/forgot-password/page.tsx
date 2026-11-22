import type { Metadata } from "next";
import PasswordRecoveryForm from "@/components/auth/PasswordRecoveryForm";

export const metadata: Metadata = {
  title: "Forgot password | Lucid Global Invest",
  description: "Request a single-use link to reset the password on your Lucid Global Invest account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <PasswordRecoveryForm mode="forgot" />;
}
