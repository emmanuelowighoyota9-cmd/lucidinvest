import Layout from "@/components/layout/Layout";
import Link from "next/link";

export const metadata = { title: "Risk Disclosure | Lucid Global Invest" };

const RISKS = [
  {
    title: "Leverage magnifies losses",
    body: "Leveraged products move a position by a multiple of the capital you commit. A small move in the underlying market can wipe out the margin behind a trade, and losses can exceed the amount you put in. Never trade with money you cannot afford to lose.",
  },
  {
    title: "Past performance is not a guide",
    body: "Historic prices, back-tested strategies, published results and any figure shown on this site describe what has already happened. They do not predict what a market will do next.",
  },
  {
    title: "We do not give investment advice",
    body: "Everything published here, including articles, guides, courses and market commentary, is general information. It does not take your circumstances, objectives or experience into account and is not a personal recommendation.",
  },
  {
    title: "Market, liquidity and execution risk",
    body: "Prices can gap, liquidity can disappear and orders can fill away from the quoted level, particularly around news releases and outside active hours. Stops are not guaranteed to execute at the level you set.",
  },
  {
    title: "Counterparty and currency risk",
    body: "Holding a position with any provider exposes you to that provider, and holding assets in another currency exposes you to exchange-rate movements on top of the trade itself.",
  },
  {
    title: "Demo accounts are simulated",
    body: "Demo accounts use simulated funds and live prices. Results there do not reflect the slippage, costs or emotional pressure of trading real capital.",
  },
];

export default function RiskDisclosurePage() {
  return (
    <div className="body-bg-1">
      <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Risk Disclosure" breadcrumbTitleTwo="Legal">
        <section style={{ padding: "90px 0" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-9">
                <h2>Risk Disclosure</h2>
                <p>
                  Last updated: November 2026. Trading leveraged products is high risk. Read this page before you open an
                  account, and take independent advice if you are unsure whether it suits you.
                </p>
                {RISKS.map((risk) => (
                  <div key={risk.title} style={{ marginTop: 32 }}>
                    <h3>{risk.title}</h3>
                    <p>{risk.body}</p>
                  </div>
                ))}
                <p style={{ marginTop: 32 }}>
                  Questions about the risks described here? <Link href="/contact">Talk to our team</Link> before you
                  commit any capital.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
}
