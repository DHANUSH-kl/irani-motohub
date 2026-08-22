import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens } from "@/lib/oauth";
import { setSession } from "@/lib/session";

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (e) {
    console.error("JWT payload decoding failed:", e);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const cookieStore = await cookies();
    const savedState = cookieStore.get("oauth_state")?.value;
    const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;

    // Validate parameters
    if (!code || !state) {
      return NextResponse.json({ error: "Missing authorization code or state" }, { status: 400 });
    }

    if (!savedState || state !== savedState) {
      return NextResponse.json({ error: "Invalid state parameter. Possible CSRF attack detected." }, { status: 400 });
    }

    if (!codeVerifier) {
      return NextResponse.json({ error: "Missing PKCE code verifier session cookie" }, { status: 400 });
    }

    const url = new URL(request.url);
    const isLocal =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1";

    const redirectUri = isLocal
      ? `http://${url.host}/api/auth/callback`
      : "https://iranimotohub.in/api/auth/callback";

    // Exchange the authorization code for tokens
    const tokens = await exchangeCodeForTokens(code, codeVerifier, redirectUri);

    if (!tokens.access_token) {
      return NextResponse.json({ error: "Failed to obtain access token from Shopify" }, { status: 400 });
    }

    // Decode id_token to extract customer email & Shopify profile identifier
    let customerMetadata = undefined;
    if (tokens.id_token) {
      const decodedPayload = decodeJwtPayload(tokens.id_token);
      if (decodedPayload) {
        customerMetadata = {
          email: decodedPayload.email || "",
          id: decodedPayload.sub || "" // Shopify Customer Account ID
        };
      }
    }

    // Generate secure random UUID for the session
    const sessionId = crypto.randomUUID();

    // Calculate expiry timestamp
    const expiresAt = Date.now() + (tokens.expires_in || 3600) * 1000;

    // Persist session server-side
    const sessionSuccess = await setSession(sessionId, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || "",
      expiresAt,
      idToken: tokens.id_token || "",
      customerMetadata
    });

    if (!sessionSuccess) {
      return NextResponse.json({ error: "Failed to persist authentication session server-side" }, { status: 500 });
    }

    const cookieDomain = url.hostname.endsWith("iranimotohub.in") ? "iranimotohub.in" : undefined;

    // Clear OAuth temporary transition cookies with matching domain option
    cookieStore.set("oauth_state", "", { path: "/", domain: cookieDomain, maxAge: 0 });
    cookieStore.set("oauth_nonce", "", { path: "/", domain: cookieDomain, maxAge: 0 });
    cookieStore.set("oauth_code_verifier", "", { path: "/", domain: cookieDomain, maxAge: 0 });

    // Redirect the customer back to their account dashboard
    const accountUrl = new URL("/account", request.url);
    const response = NextResponse.redirect(accountUrl.toString());

    // Set the opaque session ID cookie directly on the redirect response
    response.cookies.set({
      name: "iranimotohub_session_id",
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || !url.host.includes("localhost"),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      domain: cookieDomain,
    });

    return response;
  } catch (error: any) {
    console.error("OAuth callback processing failed:", error);
    return NextResponse.json({ error: error.message || "Failed to process authorization callback" }, { status: 500 });
  }
}
