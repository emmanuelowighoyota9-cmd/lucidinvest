import AccountDetail from "@/components/sections/InnerPage/AccountDetail";

export const metadata = { title: "Mini Account | Lucid Global Invest" };

export default function MiniAccount() {
  return (
    <AccountDetail
      slug="accounts2-mini-account"
      title="Mini Account"
      breadcrumb="Mini Account"
      intro="The Mini Account keeps the same market access as the Standard Account but is built around smaller positions, so you can trade from 0.01 lots and keep the amount at risk on each trade modest while you test a strategy on live prices."
      benefitsLead="A smaller starting size for clients who are still building confidence."
      benefits={[
        "Smaller position sizes",
        "Same market access as Standard",
        "Lower exposure per trade",
        "Full dashboard reporting",
      ]}
      technology="The Mini Account runs on the same MetaTrader 4 and 5 platforms, and every order, fill and ledger entry appears in your dashboard exactly as it was executed."
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
