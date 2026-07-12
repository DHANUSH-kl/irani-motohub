import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "irani_motohub_access_token";

export function middleware(request: NextRequest) {
  const hasToken = request.cookies.has(COOKIE_NAME);

  if (!hasToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/account"],
};
