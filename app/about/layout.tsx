import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About us | Lucid Global Invest",
  description: "Who we are, how we work and what the Lucid Global Invest platform provides.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
