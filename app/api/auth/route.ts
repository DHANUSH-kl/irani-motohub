import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDiscoveryMetadata, refreshAccessToken } from "@/lib/oauth";
import { getSession, setSession, deleteSession } from "@/lib/session";

const SESSION_COOKIE = "iranimotohub_session_id";

// Fetch customer profile from Shopify Customer Account GraphQL API
async function fetchCustomerProfile(endpoint: string, accessToken: string) {
  const query = `
    query GetCustomerInfo {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        orders(first: 20) {
          edges {
            node {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              cancelledAt
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken, // Shopify Customer Account API expects raw token directly
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Shopify Customer Account API responded with: ${response.status}`);
    }

    const payload = await response.json();
    if (payload.errors && payload.errors.length > 0) {
      throw new Error(payload.errors[0].message);
    }

    return payload.data?.customer;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json({ user: null });
    }

    let session = await getSession(sessionId);
    if (!session) {
      cookieStore.delete(SESSION_COOKIE);
      return NextResponse.json({ user: null });
    }

    // Handle token expiration & auto-refresh (refresh token is kept strictly server-side)
    if (Date.now() >= session.expiresAt - 60 * 1000) {
      console.log("[SessionRefresh] Access token expired or close to expiry. Refreshing...");
      try {
        const freshTokens = await refreshAccessToken(session.refreshToken);
        session.accessToken = freshTokens.access_token;
        if (freshTokens.refresh_token) {
          session.refreshToken = freshTokens.refresh_token;
        }
        session.expiresAt = Date.now() + (freshTokens.expires_in || 3600) * 1000;
        if (freshTokens.id_token) {
          session.idToken = freshTokens.id_token;
        }

        await setSession(sessionId, session);
        console.log("[SessionRefresh] Access token refreshed successfully.");
      } catch (refreshErr) {
        console.error("[SessionRefresh] Automatic token refresh failed:", refreshErr);
        await deleteSession(sessionId);
        cookieStore.delete(SESSION_COOKIE);
        return NextResponse.json({ user: null });
      }
    }

    // Fetch live user profile
    const metadata = await getDiscoveryMetadata();
    try {
      const customer = await fetchCustomerProfile(metadata.graphql_api_endpoint, session.accessToken);
      if (!customer) {
        return NextResponse.json({ user: null });
      }

      // Map to storefront customer schema for compatibility
      const formattedUser = {
        id: customer.id,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.emailAddress?.emailAddress || "",
        phone: "",
        orders: customer.orders?.edges?.map((edge: any) => {
          const node = edge.node;
          return {
            id: node.id,
            orderNumber: node.name ? node.name.replace("#", "") : "",
            processedAt: node.processedAt,
            financialStatus: node.financialStatus,
             fulfillmentStatus: node.fulfillmentStatus,
            status: node.cancelledAt ? "CANCELLED" : "ACTIVE",
            totalPrice: {
              amount: node.totalPrice?.amount || "0",
              currencyCode: node.totalPrice?.currencyCode || "INR",
            },
            lineItems: node.lineItems?.edges?.map((itemEdge: any) => {
              const itemNode = itemEdge.node;
              return {
                title: itemNode.title,
                quantity: itemNode.quantity,
                price: {
                  amount: itemNode.price?.amount || "0",
                  currencyCode: itemNode.price?.currencyCode || "INR",
                },
              };
            }) || [],
            successfulFulfillments: [],
          };
        }) || [],
      };

      return NextResponse.json({ user: formattedUser });
    } catch (apiErr) {
      console.error("Failed to fetch customer profile from Customer Account API:", apiErr);
      return NextResponse.json({ user: null });
    }
  } catch (error: any) {
    console.error("GET /api/auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (action === "logout") {
      if (sessionId) {
        const session = await getSession(sessionId);
        await deleteSession(sessionId);
        cookieStore.delete(SESSION_COOKIE);

        if (session && session.idToken) {
          const metadata = await getDiscoveryMetadata();
          const host = new URL(request.url).host;
          const protocol = host.includes("localhost") ? "http" : "https";
          const postLogoutRedirect = `${protocol}://${host}/`;

          // Generate standard OIDC logout redirection endpoint
          const logoutUrl = new URL(metadata.end_session_endpoint);
          logoutUrl.searchParams.set("id_token_hint", session.idToken);
          logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirect);

          return NextResponse.json({ success: true, redirectUrl: logoutUrl.toString() });
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (sessionId) {
      await deleteSession(sessionId);
      cookieStore.delete(SESSION_COOKIE);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
