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

export default function Blog_Page_One() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Prepare Lightbox slides (all blog images)
  const slides = blogPosts.map((post) => ({ src: post.image }));

  return (
    <div className="body-bg-1">
      <Layout
        headerStyle={1}
        footerStyle={1}
        breadcrumbTitle="Blog"
        breadcrumbTitleTwo="Blog"
      >
        <section className="blog-page-one">
          <div className="container">
            <div className="row">
              {blogPosts.map((post, i) => (
                <div className="col-xl-4 col-lg-6 col-md-6" key={post.slug}>
                  <div className="single-blog-style5 single-blog-style5--style6">
                    {/* ---------- Image Box ---------- */}
                    <div className="img-box relative group">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={370}
                        height={270}
                        priority
                        className="rounded-md"
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

                    {/* ---------- Content Box ---------- */}
                    <div className="content-box">
                      <div className="top-box">
                        <div className="category">
                          <div className="icon">
                            <i className="icon-hashtag"></i>
                          </div>
                          <h6>{post.category}</h6>
                        </div>
                        <div className="date">
                          <div className="icon">
                            <i className="fa fa-calendar"></i>
                          </div>
                          <h6>{post.date}</h6>
                        </div>
                      </div>

                      <div className="title-box">
                        <h3>
                          <Link href={`/blog-1/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p>{post.excerpt}</p>
                      </div>

                      <div className="btn-box">
                        <Link className="show-btn" href={`/blog-1/${post.slug}`}>
                          {post.readTime} <i className="icon-right-arrow"></i>
                        </Link>
                        <Link className="overlay-btn" href={`/blog-1/${post.slug}`}>
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
