import { NextResponse } from "next/server";
import { trackShiprocketShipment } from "@/lib/shiprocket";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id tracking query parameter." }, { status: 400 });
    }

    const result = await trackShiprocketShipment(orderId);

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Unable to retrieve tracking info." }, { status: 400 });
    }

    return NextResponse.json({ success: true, tracking: result.tracking });
  } catch (error: any) {
    console.error("GET /api/shiprocket/track error:", error);
    return NextResponse.json({ error: error.message || "Failed tracking shipment details." }, { status: 500 });
  }
}
