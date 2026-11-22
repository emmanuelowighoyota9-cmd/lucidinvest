import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us | Lucid Global Invest",
  description: "Contact the Lucid Global Invest team about accounts, onboarding or an existing request.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
