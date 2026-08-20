import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "iranimotohub_session_id";

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);

  // If session ID cookie is absent, intercept request and redirect to login portal
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/account"],
};
