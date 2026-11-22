import AccountDetail from "@/components/sections/InnerPage/AccountDetail";

export const metadata = { title: "Standard Account | Lucid Global Invest" };

export default function StandardAccount() {
  return (
    <AccountDetail
      slug="accounts1-standard-account"
      title="Standard Account"
      breadcrumb="Standard A/c"
      intro="The Standard Account is where most Lucid Global Invest clients start. It opens up forex, indices, commodities and crypto markets from one login, with fixed spreads from 3 pips, order sizes between 0.01 and 500 lots, and leverage up to 1:3000."
      benefitsLead="Built for first-time investors who want clear pricing while they learn."
      benefits={["Lower spreads", "Access to major markets", "Full market access", "Educational resources"]}
      technology="Orders are placed through MetaTrader 4 and 5, and every account, position and ledger entry is visible in your dashboard, so the records you see always match what was posted."
      specs={[
        { label: "Initial Deposit", value: "$100" },
        { label: "Leverage", value: "Upto 1:3000" },
        { label: "Order Volume", value: "0.01 - 500 lots" },
        { label: "Spread", value: "Fixed from 3 pips" },
        { label: "24/7 Support", value: "Yes" },
        { label: "Multi Language CC", value: "Yes" },
      ]}
    />
  );
}
