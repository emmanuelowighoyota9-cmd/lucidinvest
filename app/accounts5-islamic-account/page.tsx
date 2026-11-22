import AccountDetail from "@/components/sections/InnerPage/AccountDetail";

export const metadata = { title: "Islamic Account | Lucid Global Invest" };

export default function IslamicAccount() {
  return (
    <AccountDetail
      slug="accounts5-islamic-account"
      title="Islamic Account"
      breadcrumb="Islamic Account"
      intro="The Islamic Account follows the same pricing and market access as the Standard Account but is structured to be swap-free, so positions held overnight are not charged or credited interest."
      benefitsLead="Swap-free overnight holding for clients who need it."
      benefits={["Swap-free holding", "Same spreads as Standard", "Access to major markets", "Full dashboard reporting"]}
      technology="Accounts run on MetaTrader 4 and 5, and the dashboard shows every position and ledger entry in one place, including anything held overnight."
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
