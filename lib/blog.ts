/**
 * One typed source of truth for every article shown on the marketing site.
 *
 * The listing pages (`/blog-1` … `/blog-4`) and the detail routes
 * (`/blog-N/[slug]`) all read from here, so a slug that exists on a listing page
 * always resolves, and an unknown slug can be rejected with `notFound()`.
 */

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  /** Display date, kept in the format the templates render. */
  date: string;
  /** ISO date used for ordering and metadata. */
  published: string;
  author: string;
  readTime: string;
  image: string;
  excerpt: string;
  comments: number;
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "1",
    title: "How Global Events are Shaping Commodity Prices",
    category: "Market Analysis",
    date: "15.09.2025",
    published: "2025-09-15",
    author: "t.maverick",
    readTime: "4 Minutes read",
    image: "/assets/images/blog/blog-v1-1.jpg",
    excerpt:
      "Supply routes, sanctions and weather all reach commodity markets before they reach the headlines. Here is how to read the sequence.",
    comments: 10,
    content: [
      "Commodity markets react to physical constraints before they react to commentary. When a shipping route is disrupted or a harvest is revised lower, the nearest futures contract usually moves first while longer-dated prices adjust more slowly.",
      "For a portfolio, the practical question is exposure rather than prediction. A diversified allocation limits the effect of any single supply chain, and a defined review schedule stops short-term volatility from turning into a permanent change in strategy.",
      "We track these shifts through published data and issuer disclosures. Nothing in this article is a recommendation to buy or sell a specific instrument.",
    ],
  },
  {
    slug: "2",
    title: "The Effect of Fiscal Policies on Stock Market Performance",
    category: "Economic News",
    date: "31.08.2025",
    published: "2025-08-31",
    author: "N.Isabella",
    readTime: "3 Minutes read",
    image: "/assets/images/blog/blog-v1-2.jpg",
    excerpt:
      "Tax changes and spending plans move earnings expectations long before they reach company accounts.",
    comments: 8,
    content: [
      "Fiscal policy reaches equity markets through expectations. A change to corporate taxation alters forecast earnings, and a change to public spending alters the demand that companies expect to meet.",
      "Because those effects arrive with a lag, markets tend to price them in stages: first the announcement, then the legislation, then the first set of reported results that confirms or contradicts the assumption.",
      "Investors who review their allocation against a written mandate are less likely to react to the first stage alone.",
    ],
  },
  {
    slug: "3",
    title: "Understanding Leverage: The Pros and Cons",
    category: "Learning Center",
    date: "23.08.2025",
    published: "2025-08-23",
    author: "z.olivia",
    readTime: "5 Minutes read",
    image: "/assets/images/blog/blog-v1-3.jpg",
    excerpt:
      "Leverage magnifies both the gain and the loss. Understanding the mechanics matters more than the headline ratio.",
    comments: 24,
    content: [
      "Leverage is borrowed exposure. It lets a position be larger than the capital committed to it, which means a small move in the underlying market produces a large move in the account.",
      "The same mechanism works in both directions. A position that is twice as large loses twice as much when the market moves against it, and a margin call can close the position at the least convenient moment.",
      "Treat leverage as a risk setting rather than a target. Position size, stop levels and the time available to monitor a trade should all be decided before the trade is opened.",
    ],
  },
  {
    slug: "4",
    title: "Overcoming Fear & Greed in Trading",
    category: "Learning Center",
    date: "18.08.2025",
    published: "2025-08-18",
    author: "N.Isabella",
    readTime: "4 Minutes read",
    image: "/assets/images/blog/blog-v1-4.jpg",
    excerpt:
      "A written plan is the cheapest defence against decisions made in the middle of a fast market.",
    comments: 12,
    content: [
      "Fear and greed are not character flaws; they are predictable responses to uncertainty. What separates disciplined investors is not the absence of those responses but the presence of a process that does not depend on them.",
      "That process usually has three parts: a written objective, a maximum acceptable loss per position, and a scheduled review. Each part removes one decision from the heat of the moment.",
      "Keeping a record of why each position was opened also makes the review honest, because it shows whether the original reason still holds.",
    ],
  },
  {
    slug: "5",
    title: "Reading a Central Bank Statement Without Overreacting",
    category: "Market Analysis",
    date: "11.08.2025",
    published: "2025-08-11",
    author: "Silver Scott",
    readTime: "6 Minutes read",
    image: "/assets/images/blog/blog-v1-5.jpg",
    excerpt:
      "The wording changes more often than the policy does. Separating the two avoids trading a headline.",
    comments: 17,
    content: [
      "Central bank statements contain two kinds of information: the decision itself and the language around it. The decision is usually well signposted; the language is where the nuance lives.",
      "Comparing a statement with the previous one line by line shows what actually changed. Often the policy rate is unchanged while the description of risks has shifted, and that shift is the more useful signal for long-term planning.",
      "Reacting to the first headline is rarely a strategy. Waiting for the full statement and the accompanying projections gives a clearer picture.",
    ],
  },
  {
    slug: "6",
    title: "Why Diversification Still Matters in a Connected Market",
    category: "Trading Strategies",
    date: "04.08.2025",
    published: "2025-08-04",
    author: "t.maverick",
    readTime: "5 Minutes read",
    image: "/assets/images/blog/blog-v1-6.jpg",
    excerpt:
      "Correlations rise in a crisis, but the assets that recover first are rarely the same ones.",
    comments: 9,
    content: [
      "In a sharp market move, many assets fall together and diversification looks ineffective. The benefit appears later, when the recovery is uneven and the portfolio is not concentrated in the slowest asset to heal.",
      "Diversification is therefore a property of the whole cycle rather than of any single day. Judging it by one week of correlated losses is misleading.",
      "The practical test is whether the portfolio still meets its stated risk profile after a bad month, without forcing a sale at the bottom.",
    ],
  },
  {
    slug: "7",
    title: "A Practical Guide to Reviewing Your Portfolio",
    category: "Learning Center",
    date: "27.07.2025",
    published: "2025-07-27",
    author: "z.olivia",
    readTime: "4 Minutes read",
    image: "/assets/images/blog/blog-v1-7.jpg",
    excerpt:
      "A short quarterly checklist that keeps a long-term plan on course without constant trading.",
    comments: 6,
    content: [
      "A review is not a reason to trade. Its purpose is to confirm that the portfolio still matches the objective it was built for, and to notice when it no longer does.",
      "Start with the mandate: time horizon, income needs and the maximum loss that would still be tolerable. Then compare the current allocation with those constraints rather than with last month's performance.",
      "Document the conclusion even when no change is made. The record is what makes the next review faster and less emotional.",
    ],
  },
  {
    slug: "8",
    title: "What New Investors Should Know About Market Volatility",
    category: "Economic News",
    date: "19.07.2025",
    published: "2025-07-19",
    author: "Silver Scott",
    readTime: "5 Minutes read",
    image: "/assets/images/blog/blog-v1-8.jpg",
    excerpt:
      "Volatility is the price of participating in markets. Planning for it in advance is more useful than predicting it.",
    comments: 21,
    content: [
      "Volatility measures how much a price moves, not whether an investment is good or bad. A calm asset can still be a poor holding, and a volatile one can be appropriate in small size.",
      "What matters for a new investor is the ability to hold through a drawdown without being forced to sell. That depends on the size of the position relative to available savings and on the time horizon.",
      "Setting those two numbers before investing is the simplest way to keep volatility from becoming a crisis.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export const LATEST_BLOG_POST: BlogPost = BLOG_POSTS[0];

/** Newest first, by published date. */
export function sortedBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.published.localeCompare(a.published));
}
