import crypto from "crypto";
import type { ShiprocketOrderParams } from "@/lib/shiprocket";

export interface ShopifyWebhookAddress {
  first_name?: string;
  last_name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
}

export interface ShopifyWebhookLineItem {
  title: string;
  quantity: number;
  price: string;
  sku?: string;
  grams?: number;
}

export interface ShopifyWebhookOrder {
  id: number;
  name: string;
  order_number: number;
  email?: string;
  created_at: string;
  financial_status: string;
  gateway?: string;
  payment_gateway_names?: string[];
  shipping_address?: ShopifyWebhookAddress;
  billing_address?: ShopifyWebhookAddress;
  line_items: ShopifyWebhookLineItem[];
  subtotal_price?: string;
  total_price?: string;
  tags?: string;
}

const processedOrderIds = new Set<number>();

export function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[ShopifyWebhook] SHOPIFY_WEBHOOK_SECRET is not configured.");
    return process.env.NODE_ENV !== "production";
  }

  if (!hmacHeader) return false;

  const digest = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const digestBuffer = Buffer.from(digest);
  const hmacBuffer = Buffer.from(hmacHeader);

  if (digestBuffer.length !== hmacBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(digestBuffer, hmacBuffer);
}

export function isCodOrder(order: ShopifyWebhookOrder): boolean {
  const gateways = order.payment_gateway_names ?? [];
  if (gateways.some((gateway) => /cash on delivery|\bcod\b/i.test(gateway))) {
    return true;
  }

  if (order.gateway && /cash on delivery|\bcod\b/i.test(order.gateway)) {
    return true;
  }

  if (order.tags && /\bcod\b/i.test(order.tags)) {
    return true;
  }

  return order.financial_status === "pending";
}

export function shouldSkipShiprocket(order: ShopifyWebhookOrder): boolean {
  if (!isCodOrder(order)) {
    return true;
  }

  if (processedOrderIds.has(order.id)) {
    return true;
  }

  return false;
}

export function markOrderProcessed(orderId: number): void {
  processedOrderIds.add(orderId);
}

export function mapShopifyOrderToShiprocket(order: ShopifyWebhookOrder): ShiprocketOrderParams {
  const address = order.shipping_address ?? order.billing_address;
  if (!address) {
    throw new Error(`Shopify order ${order.name} is missing shipping and billing address.`);
  }

  const firstName = address.first_name?.trim() || "Customer";
  const lastName = address.last_name?.trim() || "";
  const street = [address.address1, address.address2].filter(Boolean).join(", ");
  const subTotal = parseFloat(order.subtotal_price || order.total_price || "0");
  const totalWeightKg = Math.max(
    0.5,
    order.line_items.reduce((sum, item) => sum + (item.grams || 500) * item.quantity, 0) / 1000
  );

  return {
    order_id: order.order_number.toString(),
    order_date: order.created_at.slice(0, 10),
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: street || "Address not provided",
    billing_city: address.city || "Unknown",
    billing_pincode: address.zip || "000000",
    billing_state: address.province || "Unknown",
    billing_country: address.country || "India",
    billing_email: order.email || "customer@iranimotohub.com",
    billing_phone: (address.phone || "9999999999").replace(/\s+/g, ""),
    shipping_is_billing: true,
    order_items: order.line_items.map((item) => ({
      name: item.title,
      sku: item.sku || `SKU-${order.order_number}`,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: "COD",
    sub_total: subTotal,
    length: 10,
    width: 10,
    height: 10,
    weight: totalWeightKg,
  };
}
