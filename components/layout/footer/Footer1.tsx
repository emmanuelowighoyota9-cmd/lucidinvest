
import Image from "next/image";
import Link from "next/link"

export default function Footer1() {
    return (
        <>
        
            <footer className="footer-style1">
                
                <div className="footer-main">
                    <div className="footer-main-top">
                        <div className="container">
                            <div className="row">
                                
                                <div className="col-xl-3 col-lg-6 col-md-6 single-widget">
                                    <div className="single-footer-widget wow fadeInUp" data-wow-duration="1200ms"
                                        data-wow-delay="000ms">
                                        <div className="single-footer-widget-contact">
                                            <div className="footer-logo-style1">
                                                <Link href="/">
                                                    <Image src="/assets/images/resources/lucid-global-invest-logo.png" alt="Lucid Global Invest Logo" width={142} height={71} priority />
                                                </Link>
                                            </div>
                                            <div className="text-box">
                                                <p> Business it will frequently to occur that pleasures have all repudiated
                                                    and annoyances accepted.</p>
                                            </div>
                                            <div className="your-trading">
                                                <div className="title1">
                                                    <h3>Begin Your Trading,</h3>
                                                </div>
                                                <div className="btn-box">
                                                    <Link href="/register"
                                                        className="btn-one">
                                                        <span className="txt">
                                                            New Account
                                                            <i className="icon-right-arrow"></i>
                                                        </span>
                                                    </Link>
                                                    <Link href="/login"
                                                        className="btn-one">
                                                        <span className="txt">
                                                            Sign In
                                                            <i className="icon-right-arrow"></i>
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-xl-2 col-lg-6 col-md-6 single-widget">
                                    <div className="single-footer-widget wow fadeInDown" data-wow-duration="1200ms"
                                        data-wow-delay="100ms">
                                        <div className="title">
                                            <h3>Trading</h3>
                                        </div>
                                        <div className="footer-widget-links">
                                            <ul>
                                                <li>
                                                    <Link href="/markets1-trade-forex">
                                                        Forex Trading
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/markets3-commodities-market">
                                                        Commodities
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/markets">
                                                        Indices
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/markets2-stock-market">
                                                        Stocks
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/markets4-crypto-market">
                                                        Cryptocurrencies
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/markets">
                                                        ETFs
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/markets5-futures-market">
                                                        Futures
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/markets">
                                                        Bonds
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-xl-2 col-lg-6 col-md-6 single-widget">
                                    <div className="single-footer-widget wow fadeInDown" data-wow-duration="1200ms"
                                        data-wow-delay="200ms">
                                        <div className="title">
                                            <h3>Platform</h3>
                                        </div>
                                        <div className="footer-widget-links">
                                            <ul>
                                                <li>
                                                    <Link href="/platform">
                                                        Web Trader
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/platform">
                                                        Meta Trader 4
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/platform">
                                                        Meta Trader 5
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/platform">
                                                        cTrader
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="single-footer-widget mt28 wow fadeInUp" data-wow-duration="1500ms"
                                        data-wow-delay="300ms">
                                        <div className="title">
                                            <h3>Support</h3>
                                        </div>
                                        <div className="footer-widget-links">
                                            <ul>
                                                <li>
                                                    <Link href="/faq">
                                                        FAQ
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/contact">
                                                        Get in Touch
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                                
                                <div className="col-xl-2 col-lg-6 col-md-6 single-widget">
                                    <div className="single-footer-widget wow fadeInDown" data-wow-duration="1200ms"
                                        data-wow-delay="400ms">
                                        <div className="title">
                                            <h3>Company</h3>
                                        </div>
                                        <div className="footer-widget-links">
                                            <ul>
                                                <li>
                                                    <Link href="/about">
                                                        About Us
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/team">
                                                        Leadership Team
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/about">
                                                        Press & Media
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/about">
                                                        Benefits
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/about">
                                                        Recognition
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/about">
                                                        Responsibility
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/contact">
                                                        Careers
                                                        <i className="icon-right-arrow"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-xl-3 col-lg-6 col-md-6 single-widget">
                                    <div className="single-footer-widget ml30 wow fadeInDown" data-wow-duration="1200ms"
                                        data-wow-delay="500ms">
                                        <div className="title">
                                            <h3>Trading Guides</h3>
                                        </div>
                                        <div className="footer-widget-trading-guides">
                                            <div className="img-box">
                                                <Image src="/assets/images/footer/footer-v1-img1.png" alt="Image" width={190} height={233} priority />
                                            </div>
                                            <div className="courses">
                                                <h6>10+ Courses</h6>
                                            </div>
                                            <div className="btn-box">
                                                <Link
                                                    href="https://fp-markets.net/stv/row-en/?fpm-affiliate-utm-source=Google/Paid&fpm-affiliate-pcode=G2536-NonBrCPA-for-ex-0924-S-D-gk-IN-125&gad_source=1&gclid=CjwKCAjw9p24BhB_EiwA8ID5BiRUgHYPV2Le75djkWSP6ohtUe198k-iN34r_tkfqMOUovCgNmP2ABoCGRgQAvD_BwE">
                                                    <i className="icon-download"></i>
                                                </Link>
                                            </div>
                                            <div className="title2">
                                                <h2>Free Ebook</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                

                            </div>
                        </div>
                    </div>

                    <div className="footer-main-bottom">
                        <div className="container">
                            <div className="footer-main-bottom__inner">
                 
                                <ul className="middle-box clearfix">
                                    <li>
                                        <Link href="https://www.facebook.com/">
                                            <div className="icon">
                                                <i className="icon-facebook"></i>
                                            </div>
                                            <div className="text">
                                                <p>Facebook</p>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.linkedin.com/login">
                                            <div className="icon">
                                                <i className="icon-linkedin"></i>
                                            </div>
                                            <div className="text">
                                                <p>Linkedin</p>
                                            </div>
                                        </Link>
                                    </li>
                             
                                </ul>
               

                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <div className="container">
                        <div className="bottom-inner">
                            <div className="copyright-text wow fadeInLeft" data-wow-duration="1500ms" data-wow-delay="000ms">
                                <p>
Copyrights © {new Date().getFullYear()} <Link href="/">Lucid Global Invest. </Link> All rights reserved.
                                </p>
                            </div>
                            <div className="footer-menu wow fadeInRight" data-wow-duration="1500ms" data-wow-delay="200ms">
                                <ul className="clearfix">
                                    <li>
                                        <Link href="/privacy">Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link href="/terms">Terms of Service</Link>
                                    </li>
                                    <li>
                                        <Link href="/risk-disclosure">Risk Disclosure</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                

            </footer>

        </>
    )
}
