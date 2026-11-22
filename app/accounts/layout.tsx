import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account types | Lucid Global Invest",
  description: "Compare the account types available at Lucid Global Invest and open one from your dashboard.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
