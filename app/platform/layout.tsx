import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trading platform | Lucid Global Invest",
  description: "The Lucid Global Invest platform, the tools it provides and how it connects to your dashboard.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
