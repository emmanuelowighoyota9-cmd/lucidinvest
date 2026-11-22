import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming soon | Lucid Global Invest",
  description: "The new Lucid Global Invest site is on its way. Leave your email and we will let you know when it launches.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
