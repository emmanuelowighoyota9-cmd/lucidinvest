import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import "../../public/assets/css/color-1.css";
import Banner from "@/components/sections/home4/Banner";
import Trade from "@/components/sections/home4/Trade";
import Service from "@/components/sections/home4/Service";
import Instruments from "@/components/sections/home4/Instruments";
import Counter from "@/components/sections/home4/Counter";
import Broker from "@/components/sections/home4/Broker";
import Ebook from "@/components/sections/home4/Ebook";
import Account from "@/components/sections/home4/Account";
import Testimonial from "@/components/sections/home4/Testimonial";
import Blog from "@/components/sections/home4/Blog";

export const metadata: Metadata = {
  title: "Lucid Global Invest | Trade global markets from one desk",
  description:
    "A four-market overview of the Lucid Global Invest platform, instruments, account types and research, with a customer dashboard for every client.",
};

export default function Home_Four() {
  return (
    <div className="body-bg-2">
      <Layout headerStyle={4} footerStyle={4}>
        <Banner />
        <Trade />
        <Service />
        <Instruments />
        <Counter />
        <Broker />
        <Ebook />
        <Account />
        <Testimonial />
        <Blog />
      </Layout>
    </div>
  );
}
