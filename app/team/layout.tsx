import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our team | Lucid Global Invest",
  description: "The people behind the Lucid Global Invest platform.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
