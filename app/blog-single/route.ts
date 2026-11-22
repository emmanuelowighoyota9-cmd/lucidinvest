import { NextResponse, type NextRequest } from "next/server";

/**
 * `/blog-single` used to be a second, hand-maintained copy of an article page.
 * Articles now live in `lib/blog.ts`, so this path answers with a real redirect
 * to the listing instead of rendering stale template copy.
 */
export function GET(request: NextRequest) {
  // Build the target from the public host the visitor used, not the address the
  // server happens to be bound to (which can be 0.0.0.0 behind a proxy).
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const target = host ? `${proto}://${host}/blog-1` : new URL("/blog-1", request.url).toString();
  return NextResponse.redirect(target, 307);
}
