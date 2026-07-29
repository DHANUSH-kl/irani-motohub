import { NextResponse } from "next/server";
import { checkServiceability } from "@/lib/shiprocket";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { delivery_pincode, weight, cod_flag } = body;

    if (!delivery_pincode) {
      return NextResponse.json({ error: "delivery_pincode is required." }, { status: 400 });
    }

    const weightNum = parseFloat(weight) || 0.5;
    const codFlagNum = cod_flag === 1 || cod_flag === true ? 1 : 0;

    const result = await checkServiceability({
      delivery_pincode,
      weight: weightNum,
      cod_flag: codFlagNum,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to retrieve courier serviceability." }, { status: 400 });
    }

    return NextResponse.json({ success: true, couriers: result.couriers });
  } catch (error: any) {
    console.error("POST /api/shiprocket/serviceability error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error querying courier serviceability." },
      { status: 500 }
    );
  }
}
