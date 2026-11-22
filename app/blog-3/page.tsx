"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Layout from "@/components/layout/Layout";
import { BLOG_POSTS } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";

const blogPosts = BLOG_POSTS.map((post) => ({
  slug: post.slug,
  title: post.title,
  category: post.category,
  date: post.date,
  readTime: post.readTime,
  author: post.author,
  comment: `${post.comments} Cmts`,
  image: post.image,
  excerpt: post.excerpt,
}));

export default function Blog_Page_Three() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Lightbox slides (use same images as blog posts)
  const slides = blogPosts.map((post) => ({ src: post.image }));

  return (
    <div className="body-bg-1">
      <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Blog" breadcrumbTitleTwo="Blog">
        <section className="blog-page-three">
          <div className="container">
            <div className="row">
                <div className="col-xl-8">
                    <div className="blog-page-three__content">
                        {blogPosts.map((post, i) => (
                        <div className="single-blog-page-three" key={post.slug}>
                            <div className="img-box">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    width={770}
                                    height={500}
                                    priority
                                />
                                <div className="overlay-icon">
                                    <button type="button"
                                    className="lightbox-image"
                                    onClick={() => {
                                        setIndex(i);
                                        setOpen(true);
                                    }}
                                    >
                                    <i className="icon-maximize"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="content-box">
                                <div className="top-box">
                                    <div className="category">
                                        <div className="icon">
                                            <i className="icon-hashtag"></i>
                                        </div>
                                        <h6>{post.category}</h6>
                                    </div>
                                    <ul>
                                        <li>
                                            <div className="icon">
                                                <i className="fa fa fa-calendar"></i>
                                            </div>
                                            <h6>{post.date}</h6>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <i className="icon-add-user"></i>
                                            </div>
                                            <h6>{post.author}</h6>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <i className="icon-comment"></i>
                                            </div>
                                            <h6>{post.comment}</h6>
                                        </li>
                                    </ul>
                                </div>
                                <div className="title-box">
                                    <h3>
                                        <Link href={`/blog-3/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p>
                                        {post.excerpt}
                                    </p>
                                </div>
                                <div className="btn-box">
                                    <Link className="show-btn" href={`/blog-3/${post.slug}`}>
                                    {post.readTime} <i className="icon-right-arrow"></i>
                                    </Link>
                                    <Link className="overlay-btn" href={`/blog-3/${post.slug}`}>
                                    Read More <i className="icon-right-arrow"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="col-xl-4">
                <div className="blog-page__sidebar">
                  {/* Search */}
                  <div className="sidebar-search-box-one">
                    <form className="search-form" action="#">
                      <input
                        placeholder="Keyword..."
                        type="text"
                        defaultValue=""
                      />
                      <button type="submit">
                        <i className="icon-search"></i>
                      </button>
                    </form>
                  </div>

                  {/* Categories */}
                  <div className="single-sidebar-box">
                    <div className="sidebar-title">
                      <h3>Categories</h3>
                    </div>
                    <ul className="single-sidebar__categories clearfix">
                      {[
                        "Economic",
                        "Market Analysis",
                        "Trading Strategies",
                        "Technical Analysis",
                        "Economic News",
                        "Learning Center",
                      ].map((cat) => (
                        <li key={cat}>
                          <a href="/blog-3">
                            <p>
                              {cat} <span>(05)</span>
                            </p>
                            <div className="icon">
                              <i className="icon-arrow-right"></i>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Popular Posts */}
                  <div className="single-sidebar-box">
                    <div className="sidebar-title">
                      <h3>Popular Post</h3>
                    </div>
                    <ul className="single-sidebar__post clearfix">
                      {blogPosts.map((p) => (
                        <li key={p.slug}>
                          <div className="category">
                            <div className="icon">
                              <i className="icon-hashtag"></i>
                            </div>
                            <h6>{p.category}</h6>
                          </div>
                          <div className="title-box">
                            <h4>
                              <a href={`/blog-3/${p.slug}`}>{p.title}</a>
                            </h4>
                          </div>
                          <div className="btn-box">
                            <a
                              className="show-btn"
                              href={`/blog-3/${p.slug}`}
                            >
                              Read More <i className="icon-right-arrow"></i>
                            </a>
                            <a
                              className="overlay-btn"
                              href={`/blog-3/${p.slug}`}
                            >
                              Read More <i className="icon-right-arrow"></i>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="single-sidebar-box">
                    <div className="sidebar-title">
                      <h3>Post Tag</h3>
                    </div>
                    <ul className="single-sidebar__tag clearfix">
                      {[
                        "Analytics",
                        "Commodities",
                        "Day Trading",
                        "Equities",
                        "ETF",
                        "Forex",
                        "Futures",
                        "Gold",
                        "Hot Tips",
                        "Index Funds",
                        "New Traders",
                      ].map((tag) => (
                        <li key={tag}>
                          <a href="/blog-3">{tag}</a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subscribe Box */}
                  <div className="subscribe-sidebar-box">
                    <div className="tilte-box">
                      <h3>SubscribeUs</h3>
                      <p>Get updates in your inbox directly.</p>
                    </div>
                    <div className="subscribe-sidebar-form">
                      <form action="#" method="post">
                        <div className="form-group">
                          <input
                            type="email"
                            name="email"
                            placeholder="Email address..."
                            required
                            defaultValue=""
                          />
                        </div>
                        <div className="checked-box1">
                          <input
                            type="checkbox"
                            name="agree"
                            id="agree"
                            defaultChecked
                          />
                          <label htmlFor="agree">
                            <span></span>I agree to terms & conditions.
                          </label>
                        </div>
                        <div className="btn-box">
                          <button className="submit btn-one" type="submit">
                            <span className="txt">Subscribe</span>
                            <i className="icon-right-arrow"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Lightbox Component */}
          <Lightbox
            open={open}
            index={index}
            close={() => setOpen(false)}
            slides={slides}
          />
        </section>
      </Layout>
    </div>
  );
}
