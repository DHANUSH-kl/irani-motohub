import { NextResponse } from "next/server";
import { createShiprocketOrder } from "@/lib/shiprocket";
import {
  isCodOrder,
  mapShopifyOrderToShiprocket,
  markOrderProcessed,
  shouldSkipShiprocket,
  verifyShopifyWebhook,
  type ShopifyWebhookOrder,
} from "@/lib/shopify-webhook";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const hmac = request.headers.get("x-shopify-hmac-sha256");

    if (!verifyShopifyWebhook(rawBody, hmac)) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    const order = JSON.parse(rawBody) as ShopifyWebhookOrder;

    if (shouldSkipShiprocket(order)) {
      const reason = isCodOrder(order) ? "already_processed" : "prepaid_or_non_cod";
      console.log(`[ShopifyWebhook] Skipping Shiprocket for order ${order.name} (${reason}).`);
      return NextResponse.json({ status: "skipped", reason });
    }

    const shiprocketPayload = mapShopifyOrderToShiprocket(order);
    const result = await createShiprocketOrder(shiprocketPayload);

    if (!result.success) {
      console.error(`[ShopifyWebhook] Shiprocket creation failed for ${order.name}:`, result.message);
      return NextResponse.json({ error: result.message }, { status: 502 });
    }

    markOrderProcessed(order.id);

    console.log(
      `[ShopifyWebhook] COD order ${order.name} synced to Shiprocket.`,
      `shiprocket_order_id=${result.order_id}`,
      `shipment_id=${result.shipment_id}`
    );

    return NextResponse.json({
      status: "created",
      shopify_order: order.name,
      shiprocket_order_id: result.order_id,
      shipment_id: result.shipment_id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    console.error("[ShopifyWebhook] orders/create error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
