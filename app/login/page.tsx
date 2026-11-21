import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign in | Lucid Global Invest",
  description: "Sign in to your Lucid Global Invest account to review your dashboard, account status and market coverage.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
