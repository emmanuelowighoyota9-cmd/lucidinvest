import Layout from "@/components/layout/Layout";
import Link from "next/link";

export const metadata = { title: "Privacy Policy | Lucid Global Invest" };

const SECTIONS = [
  {
    title: "What we collect",
    body: [
      "When you register we store your name, email address and a scrypt hash of your password. We never store the password itself.",
      "When you sign in we create a session record containing a SHA-256 digest of the session token, so a stolen database copy cannot be replayed as a live session. The token itself lives only in your browser's HttpOnly cookie.",
      "Account, investment, transaction and enquiry records are created by our staff through reviewed processes. Your dashboard shows those records exactly as they were posted.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "To authenticate you, keep your session alive, render your dashboard and answer the enquiries you send us.",
      "To keep an audit trail of staff actions on customer records, so changes can be traced back to the person who made them.",
      "We do not sell your data, and we do not use it for advertising.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We set one cookie: the signed, HttpOnly session cookie that keeps you signed in. It is SameSite=Lax and marked Secure in production. Signing out revokes the session server-side.",
      "No advertising or analytics cookies are set by the account area.",
    ],
  },
  {
    title: "Where your data lives",
    body: [
      "Data is stored in a managed PostgreSQL database (Neon). Only our server can reach it: browser code never connects to the database directly.",
      "Access is limited to staff who need it to operate accounts and respond to enquiries.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can see your profile details, active sessions and account history in your dashboard, and revoke sessions you do not recognise.",
      "To request a copy, correction or deletion of your data, contact support@lucidglobalinvest.com. Some records may be kept where we are required to retain them.",
    ],
  },
  {
    title: "Children",
    body: ["Accounts are only available to people aged 18 or over. We do not knowingly hold data for anyone under 18."],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="body-bg-1">
      <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Privacy Policy" breadcrumbTitleTwo="Legal">
        <section style={{ padding: "90px 0" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-9">
                <h2>Privacy Policy</h2>
                <p>Last updated: November 2026. This page explains what the Lucid Global Invest portal stores and why.</p>
                {SECTIONS.map((section) => (
                  <div key={section.title} style={{ marginTop: 32 }}>
                    <h3>{section.title}</h3>
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ))}
                <p style={{ marginTop: 32 }}>
                  Questions about this policy? <Link href="/contact">Contact our team</Link> or email{" "}
                  <Link href="mailto:support@lucidglobalinvest.com">support@lucidglobalinvest.com</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
}
