/** Unified shipping rules — must match Shopify Admin shipping configuration. */
export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 100;

export function calculateEstimatedShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function calculateEstimatedTotal(subtotal: number): number {
  return subtotal + calculateEstimatedShipping(subtotal);
}

export function isFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

export function getAmountAwayFromFreeShipping(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return Math.ceil(FREE_SHIPPING_THRESHOLD - subtotal);
}

export function formatShippingCost(shipping: number): string {
  return shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`;
}

export function getFreeShippingMessage(subtotal: number): string {
  if (subtotal <= 0) return "";
  if (isFreeShipping(subtotal)) {
    return "Congratulations! You unlocked FREE shipping.";
  }
  const remaining = getAmountAwayFromFreeShipping(subtotal);
  return `You're only ₹${remaining.toLocaleString("en-IN")} away from FREE shipping.`;
}
