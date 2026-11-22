import AccountDetail from "@/components/sections/InnerPage/AccountDetail";

export const metadata = { title: "Corporate Account | Lucid Global Invest" };

export default function CorporateAccount() {
  return (
    <AccountDetail
      slug="accounts6-corporate-account"
      title="Corporate Account"
      breadcrumb="Corporate Account"
      intro="The Corporate Account is opened in a company's name for treasury and investment teams that need one documented account structure. Onboarding is handled by our team so the authorised people are set up correctly from the start."
      benefitsLead="One account structure for a company and the people who act for it."
      benefits={["Company ownership records", "Multiple authorised users", "Dedicated onboarding", "Consolidated reporting"]}
      technology="Corporate accounts use the same platform and dashboard. Access is tied to individual logins, so activity can always be traced back to the person who placed it."
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
