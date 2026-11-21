import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create your account | Lucid Global Invest",
  description: "Open a Lucid Global Invest account to track global markets from one secure dashboard.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
