import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import "../../public/assets/css/color-3.css";
import Banner from "@/components/sections/home3/Banner";
import Welcome from "@/components/sections/home3/Welcome";
import Trading from "@/components/sections/home3/Trading";
import Instrument from "@/components/sections/home3/Instrument";
import Market from "@/components/sections/home3/Market";
import Account from "@/components/sections/home3/Account";
import Choose from "@/components/sections/home3/Choose";
import About from "@/components/sections/home3/About";
import Awards from "@/components/sections/home3/Awards";
import Video from "@/components/sections/home3/Video";
import Slogan_Two from "@/components/sections/home3/Slogan_Two";
import Ebook from "@/components/sections/home3/Ebook";
import Blog from "@/components/sections/home3/Blog";

export const metadata: Metadata = {
  title: "Lucid Global Invest | Markets, platforms and accounts",
  description:
    "Explore the Lucid Global Invest trading platform, market coverage and account options, and open a customer dashboard in minutes.",
};

export default function Home_Three() {
  return (
    <div className="body-bg-2">
      <Layout headerStyle={3} footerStyle={3}>
        <Banner />
        <Welcome />
        <Trading />
        <Instrument />
        <Market />
        <Account />
        <Choose />
        <About />
        <Awards />
        <Video />
        <Slogan_Two />
        <Ebook />
        <Blog />
      </Layout>
    </div>
  );
}
