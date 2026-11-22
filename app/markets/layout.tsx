import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markets | Lucid Global Invest",
  description: "Forex, stocks, commodities, crypto, futures and options markets covered by Lucid Global Invest.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
