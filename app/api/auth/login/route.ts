import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { 
  getDiscoveryMetadata, 
  generateRandomString, 
  generateCodeChallenge 
} from "@/lib/oauth";

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;

export async function GET(request: Request) {
  try {
    if (!CLIENT_ID) {
      return NextResponse.json({ error: "SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID is not configured" }, { status: 500 });
    }

    const host = new URL(request.url).host;
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    // Fetch discovery metadata dynamically
    const metadata = await getDiscoveryMetadata();

    // Generate OAuth security parameters
    const state = generateRandomString(32);
    const nonce = generateRandomString(32);
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const cookieStore = await cookies();

    // Store security parameters in browser cookies with HttpOnly and secure attributes (expires in 5 minutes)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || !host.includes("localhost"),
      sameSite: "lax" as const,
      path: "/",
      maxAge: 300, // 5 minutes
    };

    cookieStore.set("oauth_state", state, cookieOptions);
    cookieStore.set("oauth_nonce", nonce, cookieOptions);
    cookieStore.set("oauth_code_verifier", codeVerifier, cookieOptions);

    // Build the authorization redirect URL using discovered endpoint
    const authUrl = new URL(metadata.authorization_endpoint);
    authUrl.searchParams.set("client_id", CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email customer-account-api:full");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("nonce", nonce);
    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");

    return NextResponse.redirect(authUrl.toString());
  } catch (error: any) {
    console.error("Login redirect initialization failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error during login redirect" }, { status: 500 });
  }
}
