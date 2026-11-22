import Layout from "@/components/layout/Layout";
import Image from "next/image";
import Link from "next/link";

export const ACCOUNT_TYPES = [
  { href: "/accounts1-standard-account", label: "Standard Account" },
  { href: "/accounts2-mini-account", label: "Mini Account" },
  { href: "/accounts3-stp-account", label: "STP Account" },
  { href: "/accounts4-demo-account", label: "Demo Account" },
  { href: "/accounts5-islamic-account", label: "Islamic Account" },
  { href: "/accounts6-corporate-account", label: "Corporate Account" },
];

const LIVE_CHAT_URL = "https://tawk.to/chat/6a988eb8a0ffc53446f9b976/1k1hur10v";

const WHY_CHOOSE = [
  {
    icon: "icon-line-chart",
    paths: 9,
    title: "No Commissions",
    text: "You pay the spread on the trade, not a commission on top of it. Every charge is shown on the account statement before you confirm an order.",
  },
  {
    icon: "icon-statistics",
    paths: 4,
    title: "Flexible Leverage",
    text: "Leverage is set per account and can be adjusted by our team on request, so exposure matches the way you actually trade.",
  },
  {
    icon: "icon-deposit",
    paths: 10,
    title: "Low Minimum Deposit",
    text: "Accounts open from the minimum shown above, and the dashboard shows exactly what has been posted to your balance.",
  },
  {
    icon: "icon-chat",
    paths: 6,
    title: "24/6 Support",
    text: "Our team answers account and platform questions Monday to Saturday, and every enquiry is logged so nothing is lost.",
  },
];

export type AccountDetailProps = {
  slug: string;
  title: string;
  breadcrumb: string;
  intro: string;
  benefitsLead: string;
  benefits: string[];
  technology: string;
  specs: { label: string; value: string }[];
};

function Paths({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span className={`path${i + 1}`} key={i}></span>
      ))}
    </>
  );
}

export default function AccountDetail({
  slug,
  title,
  breadcrumb,
  intro,
  benefitsLead,
  benefits,
  technology,
  specs,
}: AccountDetailProps) {
  return (
    <div className="body-bg-1">
      <Layout headerStyle={1} footerStyle={1} breadcrumbTitle={breadcrumb} breadcrumbTitleTwo="Trading">
        <section className="account-detail-style1">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-5">
                <div className="account-detail-style1__sidebar">
                  <div className="account-detail-style1__sidebar-single">
                    <div className="title-box">
                      <h3>Account Types</h3>
                    </div>
                    <div className="border-line"></div>
                    <ul className="catagory">
                      {ACCOUNT_TYPES.map((type) => (
                        <li className={type.href === `/${slug}` ? "active" : undefined} key={type.href}>
                          <Link href={type.href}>
                            {type.label}
                            <i className="icon-right-arrow"></i>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="account-detail-style1__sidebar-single">
                    <div className="title-box">
                      <h3>Download</h3>
                    </div>
                    <div className="border-line"></div>
                    <ul className="download">
                      <li>
                        <div className="left-side">
                          <h4>
                            <Link href="/platform">Trading Platform</Link>
                          </h4>
                          <h6>Overview</h6>
                        </div>
                        <div className="right-side">
                          <div className="icon1">
                            <span className="icon-checked">
                              <Paths count={9} />
                            </span>
                          </div>
                          <div className="icon2">
                            <i className="icon-download"></i>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="left-side">
                          <h4>
                            <Link href="/faq">Account Guide</Link>
                          </h4>
                          <h6>Help centre</h6>
                        </div>
                        <div className="right-side">
                          <div className="icon1">
                            <span className="icon-checked">
                              <Paths count={9} />
                            </span>
                          </div>
                          <div className="icon2">
                            <i className="icon-download"></i>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="account-detail-style1__sidebar-info">
                    <div className="title-box">
                      <h3>Contact Info</h3>
                    </div>
                    <div className="border-line"></div>
                    <ul className="phn-email">
                      <li>
                        <div className="icon">
                          <span className="icon-phone-vibration">
                            <Paths count={9} />
                          </span>
                        </div>
                        <div className="text">
                          <h4>Phone</h4>
                          <Link href="tel:+180098765432">+1 800.98.76.5432</Link>
                        </div>
                      </li>
                      <li>
                        <div className="icon mt3">
                          <span className="icon-read">
                            <Paths count={4} />
                          </span>
                        </div>
                        <div className="text">
                          <h4>Email</h4>
                          <Link href="mailto:support@lucidglobalinvest.com">support@lucidglobalinvest.com</Link>
                        </div>
                      </li>
                    </ul>
                    <div className="live-chat-box">
                      <div className="live-chat-box__inner">
                        <ul>
                          <li>
                            <div className="img">
                              <Image
                                src="/assets/images/resources/account-detail-v1-img1.jpg"
                                alt="Image"
                                width={60}
                                height={60}
                                priority
                              />
                            </div>
                          </li>
                          <li>
                            <div className="icon">
                              <i className="icon-comment"></i>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="link-box">
                        <Link href={LIVE_CHAT_URL}>
                          Live Chat With Expert
                          <i className="icon-right-arrow"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-8 col-lg-7">
                <div className="account-detail-style1__content">
                  <div className="intro-box">
                    <h2>{title}</h2>
                    <p>{intro}</p>
                  </div>

                  <div className="offers-box">
                    <div className="row">
                      <div className="col-xl-6 col-lg-12 col-md-6">
                        <div className="offers-box-img">
                          <Image
                            src="/assets/images/resources/account-detail-v1-img2.jpg"
                            alt="Image"
                            width={350}
                            height={375}
                            priority
                          />
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-12 col-md-6">
                        <div className="offers-box-text">
                          <div className="offers-box-text-benefits-box">
                            <div className="icon">
                              <span className="icon-checkmark-2">
                                <Paths count={3} />
                              </span>
                            </div>
                            <div className="title">
                              <h3>Benefits</h3>
                              <p>{benefitsLead}</p>
                            </div>
                            <div className="list-item">
                              <ul>
                                {benefits.map((benefit) => (
                                  <li key={benefit}>
                                    <p>{benefit}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="offers-box-text-benefits-box offers-box-text-trading-technology">
                            <div className="icon">
                              <span className="icon-checkmark-2">
                                <Paths count={3} />
                              </span>
                            </div>
                            <div className="title">
                              <h3>Trading Technology</h3>
                              <p>{technology}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="standard-account-info-box">
                    <div className="title-box">
                      <h3>{title} Info</h3>
                      <p>Terms shown for this account type. Ask our team for the current schedule before opening.</p>
                    </div>
                    <div className="standard-account-info-box__inner">
                      <div className="row">
                        {specs.map((spec) => (
                          <div className="col-xl-6 col-lg-12 col-md-6" key={spec.label}>
                            <div className="single-standard-account-info-box">
                              <div className="left">
                                <div className="icon">
                                  <span className="icon-right-arrow-2">
                                    <Paths count={2} />
                                  </span>
                                </div>
                                <p>{spec.label}</p>
                              </div>
                              <div className="right">
                                <p>{spec.value}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="why-choose-us">
                    <div className="title-box">
                      <h3>Why Choose Us</h3>
                      <p>What every Lucid Global Invest account includes, whichever option you open.</p>
                    </div>
                    <div className="why-choose-us__inner">
                      <div className="row">
                        {WHY_CHOOSE.map((item) => (
                          <div className="col-xl-6 col-lg-12 col-md-6" key={item.title}>
                            <div className="single-why-choose-us">
                              <div className="icon-box">
                                <span className={item.icon}>
                                  <Paths count={item.paths} />
                                </span>
                              </div>
                              <div className="content-box">
                                <div className="title">
                                  <h3>{item.title}</h3>
                                </div>
                                <div className="border-line"></div>
                                <div className="text">
                                  <p>{item.text}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
}
