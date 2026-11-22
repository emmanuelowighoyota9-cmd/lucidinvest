import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client feedback | Lucid Global Invest",
  description: "Feedback from clients who use the Lucid Global Invest dashboard and platform.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
