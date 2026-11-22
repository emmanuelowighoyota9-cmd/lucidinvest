import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses | Lucid Global Invest",
  description: "Educational material on markets, risk and portfolio construction from Lucid Global Invest.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
