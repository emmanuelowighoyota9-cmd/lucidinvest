import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course details | Lucid Global Invest",
  description: "Course outline, format and enrolment details for Lucid Global Invest education.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
