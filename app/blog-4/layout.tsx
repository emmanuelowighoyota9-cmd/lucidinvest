import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | Lucid Global Invest",
  description: "Market analysis, economic news and learning material from the Lucid Global Invest team.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
