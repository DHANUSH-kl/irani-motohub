import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { verifyShopifyWebhook } from "@/lib/shopify-webhook";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const hmac = request.headers.get("x-shopify-hmac-sha256");
    const topic = request.headers.get("x-shopify-topic") || "products/update";

    if (!verifyShopifyWebhook(rawBody, hmac)) {
      console.warn(`[ShopifyProductWebhook] Invalid HMAC signature for topic: ${topic}`);
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      console.error("[ShopifyProductWebhook] Failed to parse JSON body:", err);
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const handle = payload?.handle;
    const title = payload?.title || "Unknown Product";

    console.log(`[ShopifyProductWebhook] Received ${topic} for product "${title}" (handle: ${handle || "N/A"})`);

    // 1. Invalidate targeted product tag and page route if handle is present
    // 1. Invalidate targeted product tag and page route if handle is present
    if (handle) {
      try {
        revalidateTag(`product:${handle}`, "max");
      } catch {
        (revalidateTag as any)(`product:${handle}`);
      }
      revalidatePath(`/products/${handle}`, "page");
    }

    // 2. Invalidate general products tag and listing pages
    try {
      revalidateTag("products", "max");
    } catch {
      (revalidateTag as any)("products");
    }

    revalidatePath("/products", "page");
    revalidatePath("/", "page");
    revalidatePath("/sitemap.xml", "page");

    return NextResponse.json({
      status: "revalidated",
      topic,
      handle: handle || null,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    console.error("[ShopifyProductWebhook] Handler error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
