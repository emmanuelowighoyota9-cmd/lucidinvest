import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently asked questions | Lucid Global Invest",
  description: "Answers about accounts, onboarding, security and how the Lucid Global Invest dashboard works.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
