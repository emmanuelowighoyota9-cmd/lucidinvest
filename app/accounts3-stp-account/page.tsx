import AccountDetail from "@/components/sections/InnerPage/AccountDetail";

export const metadata = { title: "STP Account | Lucid Global Invest" };

export default function StpAccount() {
  return (
    <AccountDetail
      slug="accounts3-stp-account"
      title="STP Account"
      breadcrumb="STP Account"
      intro="The STP Account routes every order straight through to our liquidity providers, with no dealing desk involved. Pricing comes from the underlying market and each fill is executed against the venue that quoted it."
      benefitsLead="Straight-through processing for clients who want venue pricing."
      benefits={["No dealing desk", "Direct liquidity routing", "Transparent execution records", "Full market access"]}
      technology="Execution details, including price and volume, are recorded against the order and stay visible in your dashboard so you can reconcile every fill against the statement."
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
