import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, variables } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "GraphQL query is required" }, { status: 400 });
    }

    const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!DOMAIN || !ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Shopify configuration missing on server" },
        { status: 500 }
      );
    }

    const isMutation = query.trim().startsWith("mutation");
    const endpoint = `https://${DOMAIN}/api/2024-01/graphql.json`;

    const fetchInit: RequestInit & { next?: { revalidate?: number | false } } = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    };

    if (isMutation) {
      fetchInit.cache = "no-store";
    }

    const response = await fetch(endpoint, fetchInit);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Shopify Storefront API returned status ${response.status}:`, errorText);
      return NextResponse.json(
        { error: `Shopify API responded with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    const responseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (!isMutation && !data.errors) {
      // Allow edge CDN caching for read queries
      responseHeaders["Cache-Control"] = "public, s-maxage=300, stale-while-revalidate=600";
    } else {
      responseHeaders["Cache-Control"] = "no-store, no-cache, must-revalidate";
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Error in Shopify API proxy handler:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error connecting to Shopify" },
      { status: 500 }
    );
  }
}
