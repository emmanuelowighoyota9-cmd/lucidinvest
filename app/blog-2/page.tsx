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

export default function Blog_Page_Two() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Lightbox slides (use same images as blog posts)
  const slides = blogPosts.map((post) => ({ src: post.image }));

  return (
<div className="body-bg-1">
      <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Blog" breadcrumbTitleTwo="Blog">
        <section className="blog-page-two">
          <div className="container">
            <div className="row">
              {blogPosts.map((post, i) => (
                <div className="col-xl-3 col-lg-6 col-md-6" key={post.slug}>
                  <div className="single-blog-style4">
                    <div className="category-box">
                      <div className="icon">
                        <span className="icon-hashtag"></span>
                      </div>
                      <h6>{post.category}</h6>
                    </div>

                    <div className="img-box relative group">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={270}
                        height={240}
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
                      <ul className="meta-box clearfix">
                        <li>
                          <div className="icon">
                            <i className="fa fa-calendar"></i>
                          </div>
                          <h6>{post.date}</h6>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="fa fa-user-circle" aria-hidden="true"></i>
                          </div>
                          <h6>{post.author}</h6>
                        </li>
                      </ul>

                      <div className="title-box">
                        <h3>
                          <Link href={`/blog-2/${post.slug}`}>{post.title}</Link>
                        </h3>
                      </div>

                      <div className="btn-box">
                        <Link className="show-btn" href={`/blog-2/${post.slug}`}>
                          {post.readTime} <i className="icon-right-arrow"></i>
                        </Link>
                        <Link className="overlay-btn" href={`/blog-2/${post.slug}`}>
                          Read More <i className="icon-right-arrow"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
