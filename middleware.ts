import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "iranimotohub_session_id";

export function middleware(request: NextRequest) {
  // Bypass redirecting for Next.js internal prefetch requests to avoid client-side router reload loops
  const isPrefetch = 
    request.headers.get("x-middleware-prefetch") === "1" || 
    request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(SESSION_COOKIE);

  // If session ID cookie is absent, intercept request and redirect directly to Shopify portal
  if (!hasSession) {
    const loginUrl = new URL("/api/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/account"],
};
