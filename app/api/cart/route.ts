import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createCartWithLines, getCart } from "@/lib/shopify";

const COOKIE_NAME = "irani_motohub_access_token";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ valid: false, error: "Missing cart ID" }, { status: 400 });
    }

    const cart = await getCart(id);
    if (cart) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false });
  } catch (error: any) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lines } = body;

    if (!lines || !Array.isArray(lines)) {
      return NextResponse.json({ error: "Invalid lines payload" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const customerAccessToken = cookieStore.get(COOKIE_NAME)?.value;

    console.log("[CartAPI] Syncing cart. Lines:", lines, "HasCustomerToken:", !!customerAccessToken);

    const cart = await createCartWithLines(lines, customerAccessToken);

    if (cart) {
      console.log("[CartAPI] Shopify cart created/updated. ID:", cart.id, "Checkout URL:", cart.checkoutUrl);
      return NextResponse.json({ success: true, cart });
    }

    return NextResponse.json({ error: "Failed to create cart on Shopify" }, { status: 500 });
  } catch (error: any) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
