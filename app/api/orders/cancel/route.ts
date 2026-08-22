import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDiscoveryMetadata } from "@/lib/oauth";
import { getSession } from "@/lib/session";

const SESSION_COOKIE = "iranimotohub_session_id";

async function fetchCustomerOrders(endpoint: string, accessToken: string) {
  const query = `
    query GetCustomerOrders {
      customer {
        orders(first: 50) {
          edges {
            node {
              id
              name
              fulfillmentStatus
            }
          }
        }
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopify Customer Account API responded with: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message);
  }

  return payload.data?.customer?.orders?.edges?.map((edge: any) => edge.node) || [];
}

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch the user's orders to verify they own this order
    const metadata = await getDiscoveryMetadata();
    const orders = await fetchCustomerOrders(metadata.graphql_api_endpoint, session.accessToken);

    const order = orders.find((o: any) => o.id === orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
    }

    // 2. Check if the order is already fulfilled or delivered
    const fStatus = order.fulfillmentStatus?.toUpperCase();
    if (fStatus === "FULFILLED" || fStatus === "DELIVERED") {
      return NextResponse.json({ error: "Fulfilled orders cannot be cancelled" }, { status: 400 });
    }

    // 3. Make Admin API call to cancel the order
    const adminDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_PRIVATE_ACCESS_TOKEN;

    if (!adminDomain || !adminToken) {
      return NextResponse.json(
        { error: "Shopify Admin credentials missing on server" },
        { status: 500 }
      );
    }

    // Endpoint for Shopify Admin GraphQL API
    const adminEndpoint = `https://${adminDomain}/admin/api/2024-01/graphql.json`;

    const cancelMutation = `
      mutation orderCancel($id: ID!, $reason: OrderCancelReason) {
        orderCancel(id: $id, reason: $reason) {
          order {
            id
            cancelledAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const adminResponse = await fetch(adminEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: cancelMutation,
        variables: {
          id: orderId,
          reason: "CUSTOMER",
        },
      }),
      cache: "no-store",
    });

    if (!adminResponse.ok) {
      const errText = await adminResponse.text();
      console.error("Shopify Admin API cancel request failed:", errText);
      return NextResponse.json({ error: "Failed to cancel order on Shopify" }, { status: 500 });
    }

    const adminData = await adminResponse.json();
    if (adminData.errors && adminData.errors.length > 0) {
      console.error("Shopify Admin API GraphQL errors:", adminData.errors);
      return NextResponse.json({ error: adminData.errors[0].message }, { status: 400 });
    }

    const userErrors = adminData.data?.orderCancel?.userErrors;
    if (userErrors && userErrors.length > 0) {
      console.error("Shopify Admin API user errors:", userErrors);
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    return NextResponse.json({ success: true, cancelledAt: adminData.data?.orderCancel?.order?.cancelledAt });
  } catch (error: any) {
    console.error("POST /api/orders/cancel error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
