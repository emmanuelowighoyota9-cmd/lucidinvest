import Layout from "@/components/layout/Layout";
import Link from "next/link";

export const metadata = { title: "Terms of Service | Lucid Global Invest" };

const SECTIONS = [
  {
    title: "Using this portal",
    body: [
      "By creating an account you agree to these terms. Accounts are for people aged 18 or over, and the details you register must be your own and accurate.",
      "You are responsible for keeping your password safe. Every session you open appears in your dashboard and can be revoked from it.",
    ],
  },
  {
    title: "What the portal does",
    body: [
      "The customer dashboard shows the account, investment, transaction and wallet records our staff have posted for you, plus your profile and security settings.",
      "You can record deposit and withdrawal instructions and move funds between your own wallet and accounts. The portal has no external payment rail: deposits and withdrawals are requests that our team reviews and posts to the ledger, and every step is recorded and auditable.",
      "Nothing on this site is an offer, a recommendation to buy or sell any instrument, or a promise of any return.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "Do not attempt to access another customer's data, bypass authentication, probe the service for vulnerabilities without written permission, or use automated tools to scrape or overload the site.",
      "We may suspend an account that is used in breach of these terms, or where we are required to do so by law.",
    ],
  },
  {
    title: "Availability and changes",
    body: [
      "We work to keep the portal available, but maintenance, upstream provider outages and security work can interrupt it. We may change or withdraw features as the service develops.",
      "We may update these terms; the current version always applies from the date shown on this page.",
    ],
  },
  {
    title: "Content and intellectual property",
    body: [
      "The site, its design, text and marks belong to Lucid Global Invest or its licensors. You may read and print pages for your own use, but not republish them commercially without permission.",
    ],
  },
  {
    title: "Liability",
    body: [
      "Trading and investing carry risk, which is set out in our risk disclosure. We do not exclude liability that cannot be excluded by law.",
      "Where liability can be limited, it is limited to the extent permitted by the agreement you hold with us.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="body-bg-1">
      <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Terms of Service" breadcrumbTitleTwo="Legal">
        <section style={{ padding: "90px 0" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-9">
                <h2>Terms of Service</h2>
                <p>Last updated: November 2026. These terms cover your use of the Lucid Global Invest website and dashboard.</p>
                {SECTIONS.map((section) => (
                  <div key={section.title} style={{ marginTop: 32 }}>
                    <h3>{section.title}</h3>
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ))}
                <p style={{ marginTop: 32 }}>
                  Read the <Link href="/risk-disclosure">risk disclosure</Link> before opening an account, or{" "}
                  <Link href="/contact">contact us</Link> with any question about these terms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
}
