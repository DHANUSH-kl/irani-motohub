import { NextResponse } from "next/server";

// 5 minutes TTL in milliseconds
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

export async function POST(request: Request) {
  try {
    const { query, variables } = await request.json();
    
    // Create a unique key for the cache based on request payload
    const cacheKey = JSON.stringify({ query, variables });
    
    // Check if we have a valid cached response
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedEntry.data);
    }

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

    // Cache the response if there are no GraphQL query errors
    if (data && !data.errors) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in Shopify API proxy handler:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error connecting to Shopify" },
      { status: 500 }
    );
  }
}
