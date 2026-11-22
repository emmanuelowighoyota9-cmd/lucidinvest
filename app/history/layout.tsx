import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our history | Lucid Global Invest",
  description: "How Lucid Global Invest has developed and what the platform covers today.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
