import { cookies } from "next/headers";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET;

export interface DiscoveryMetadata {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  graphql_api_endpoint: string;
}

let cachedMetadata: DiscoveryMetadata | null = null;

export async function getDiscoveryMetadata(): Promise<DiscoveryMetadata> {
  if (cachedMetadata) return cachedMetadata;

  if (!DOMAIN) {
    throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not configured.");
  }

  const cleanDomain = DOMAIN.replace(/^https?:\/\//, "");
  console.log(`[OAuthDiscovery] Resolving metadata for domain: ${cleanDomain}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`[OAuthDiscovery] Request timed out for domain: ${cleanDomain}. Aborting...`);
    controller.abort();
  }, 3000); // 3 seconds timeout

  try {
    const [oidcRes, customerApiRes] = await Promise.all([
      fetch(`https://${cleanDomain}/.well-known/openid-configuration`, { 
        signal: controller.signal,
        cache: "no-store"
      }),
      fetch(`https://${cleanDomain}/.well-known/customer-account-api`, { 
        signal: controller.signal,
        cache: "no-store"
      })
    ]);

    clearTimeout(timeoutId);

    if (!oidcRes.ok || !customerApiRes.ok) {
      throw new Error(`Non-ok status returned. OIDC: ${oidcRes.status}, Customer API: ${customerApiRes.status}`);
    }

    const oidcConfig = await oidcRes.json();
    const customerApiConfig = await customerApiRes.json();

    console.log("[OAuthDiscovery] Shopify metadata resolved successfully.");

    cachedMetadata = {
      authorization_endpoint: oidcConfig.authorization_endpoint,
      token_endpoint: oidcConfig.token_endpoint,
      end_session_endpoint: oidcConfig.end_session_endpoint,
      graphql_api_endpoint: customerApiConfig.api_endpoint || `https://shopify.com/authentication/api/graphql`
    };

    return cachedMetadata;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`[OAuthDiscovery] Discovery request failed: ${error?.message || error}. Falling back to default URI schemes.`);
    
    // Fallback: If cleanDomain is checkout.iranimotohub.in, the Customer Account client utilizes the shopify.com/auth routes.
    // However, the customer account auth base requires the shop ID (e.g. shopify.com/101206196541/auth/oauth/authorize).
    // If the Shop ID is not resolved, standard sub-routing uses cleanDomain as fallback for dynamic endpoints.
    return {
      authorization_endpoint: `https://${cleanDomain}/auth/oauth/authorize`,
      token_endpoint: `https://${cleanDomain}/auth/oauth/token`,
      end_session_endpoint: `https://${cleanDomain}/auth/oauth/logout`,
      graphql_api_endpoint: `https://shopify.com/authentication/api/graphql`
    };
  }
}

// Generate a random string using standard Web Crypto API
export function generateRandomString(length: number): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

// Base64URL encode helper
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const binary = String.fromCharCode(...new Uint8Array(hash));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
) {
  const metadata = await getDiscoveryMetadata();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID || "",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  // If Client Secret is configured, use Basic Authentication header for confidential client exchange
  if (CLIENT_SECRET) {
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    headers["Authorization"] = `Basic ${credentials}`;
  }

  const response = await fetch(metadata.token_endpoint, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Token exchange failed:", errorText);
    throw new Error(`Token exchange failed with status: ${response.status}`);
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken: string) {
  const metadata = await getDiscoveryMetadata();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID || "",
    refresh_token: refreshToken,
  });

  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (CLIENT_SECRET) {
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    headers["Authorization"] = `Basic ${credentials}`;
  }

  const response = await fetch(metadata.token_endpoint, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Token refresh failed:", errorText);
    throw new Error(`Token refresh failed with status: ${response.status}`);
  }

  return response.json();
}
