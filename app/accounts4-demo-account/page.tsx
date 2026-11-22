import AccountDetail from "@/components/sections/InnerPage/AccountDetail";

export const metadata = { title: "Demo Account | Lucid Global Invest" };

export default function DemoAccount() {
  return (
    <AccountDetail
      slug="accounts4-demo-account"
      title="Demo Account"
      breadcrumb="Demo Account"
      intro="The Demo Account gives you the full platform with simulated funds, so you can place orders, test a strategy and get used to the dashboard before any real money is involved. Nothing traded on a demo account affects your live records."
      benefitsLead="Practise on live market prices without funding an account."
      benefits={["Simulated funds", "Live market prices", "Full platform access", "Move to a live account anytime"]}
      technology="The demo runs on the same MetaTrader and dashboard stack as a live account. When you are ready, our team opens a funded account and the demo history stays separate."
      specs={[
        { label: "Initial Deposit", value: "None (demo funds)" },
        { label: "Leverage", value: "Upto 1:3000" },
        { label: "Order Volume", value: "0.01 - 500 lots" },
        { label: "Spread", value: "Fixed from 3 pips" },
        { label: "24/7 Support", value: "Yes" },
        { label: "Multi Language CC", value: "Yes" },
      ]}
    />
  );
}
