import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDiscoveryMetadata } from "@/lib/oauth";
import { getSession } from "@/lib/session";

const SESSION_COOKIE = "iranimotohub_session_id";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session cookie found. Please log in first." }, { status: 400 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found in Redis." }, { status: 404 });
    }

    const metadata = await getDiscoveryMetadata();
    
    // Perform test GraphQL fetch using access token
    const query = `
      query GetCustomerInfo {
        customer {
          id
          firstName
          lastName
        }
      }
    `;

    const shopifyResponse = await fetch(metadata.graphql_api_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session.accessToken,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const responseStatus = shopifyResponse.status;
    const responseHeaders = Object.fromEntries(shopifyResponse.headers.entries());
    const responseBody = await shopifyResponse.text();

    let parsedBody = null;
    try {
      parsedBody = JSON.parse(responseBody);
    } catch {
      parsedBody = responseBody;
    }

    return NextResponse.json({
      diagnostic: {
        sessionExists: true,
        hasAccessToken: !!session.accessToken,
        accessTokenLength: session.accessToken.length,
        graphqlEndpoint: metadata.graphql_api_endpoint,
        shopifyResponseStatus: responseStatus,
        shopifyResponseHeaders: responseHeaders,
        shopifyResponseBody: parsedBody,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Diagnostics failed" }, { status: 500 });
  }
}
