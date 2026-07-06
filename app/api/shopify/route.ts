import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, variables } = await request.json();
    const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!DOMAIN || !ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Shopify configuration missing on server" },
        { status: 500 }
      );
    }

    const endpoint = `https://${DOMAIN}/api/2024-01/graphql.json`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Shopify Storefront API returned status ${response.status}:`, errorText);
      return NextResponse.json(
        { error: `Shopify API responded with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in Shopify API proxy handler:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error connecting to Shopify" },
      { status: 500 }
    );
  }
}
