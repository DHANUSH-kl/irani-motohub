let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getShiprocketToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error("Shiprocket credentials SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD are not configured.");
  }

  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shiprocket Auth login failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error("Invalid response from Shiprocket Auth: token missing.");
  }

  cachedToken = data.token;
  // Cache for 9 days (Shiprocket tokens typically expire in 10 days)
  tokenExpiry = now + 9 * 24 * 60 * 60 * 1000;
  return cachedToken as string;
}

export interface ServiceabilityParams {
  delivery_pincode: string;
  weight: number;
  cod_flag: 0 | 1;
}

export interface CourierRecommendation {
  courier_name: string;
  rate: number;
  etd: string;
}

export async function checkServiceability({
  delivery_pincode,
  weight,
  cod_flag,
}: ServiceabilityParams): Promise<{ success: boolean; couriers?: CourierRecommendation[]; message?: string }> {
  try {
    const token = await getShiprocketToken();
    const pickupPincode = "560001"; // Default store location/HQ pincode (e.g. Bangalore)

    const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${delivery_pincode}&weight=${weight}&cod=${cod_flag}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, message: `Shiprocket serviceability query failed: ${errorText}` };
    }

    const data = await response.json();
    if (data.status !== 200 || !data.data || !data.data.available_courier_companies) {
      return { success: false, message: data.message || "No serviceability for the destination pincode." };
    }

    const couriers = data.data.available_courier_companies.map((c: any) => ({
      courier_name: c.courier_name,
      rate: parseFloat(c.rate) || 0,
      etd: c.etd || "3-5 Days",
    }));

    return { success: true, couriers };
  } catch (error: any) {
    console.error("Error in checkServiceability:", error);
    return { success: false, message: error.message || "Failed to check serviceability." };
  }
}

export interface ShiprocketOrderLineItem {
  name: string;
  sku: string;
  units: number;
  selling_price: string;
  discount?: string;
  tax?: string;
  hsn?: string;
}

export interface ShiprocketOrderParams {
  order_id: string;
  order_date: string;
  pickup_location?: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: ShiprocketOrderLineItem[];
  payment_method: "Prepaid" | "COD";
  sub_total: number;
  length: number; // in cm
  width: number;  // in cm
  height: number; // in cm
  weight: number; // in kg
}

export async function createShiprocketOrder(params: ShiprocketOrderParams) {
  try {
    const token = await getShiprocketToken();
    const pickup_location = params.pickup_location || process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";

    const payload = {
      order_id: params.order_id,
      order_date: params.order_date,
      pickup_location,
      billing_customer_name: params.billing_customer_name,
      billing_last_name: params.billing_last_name,
      billing_address: params.billing_address,
      billing_city: params.billing_city,
      billing_pincode: params.billing_pincode,
      billing_state: params.billing_state,
      billing_country: params.billing_country,
      billing_email: params.billing_email,
      billing_phone: params.billing_phone,
      shipping_is_billing: params.shipping_is_billing,
      order_items: params.order_items,
      payment_method: params.payment_method,
      sub_total: params.sub_total,
      length: params.length,
      width: params.width,
      height: params.height,
      weight: params.weight,
    };

    const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, message: `Shiprocket order creation failed: ${errorText}` };
    }

    const data = await response.json();
    return {
      success: true,
      order_id: data.order_id,
      shipment_id: data.shipment_id,
      status: data.status || "NEW",
    };
  } catch (error: any) {
    console.error("Error creating Shiprocket order:", error);
    return { success: false, message: error.message || "Failed to create Shiprocket order." };
  }
}

export async function trackShiprocketShipment(awbOrOrderId: string) {
  try {
    const token = await getShiprocketToken();
    // Query tracking by Order ID or AWB Code
    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${awbOrOrderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, message: `Tracking call failed: ${errorText}` };
    }

    const data = await response.json();
    return { success: true, tracking: data };
  } catch (error: any) {
    console.error("Error tracking shipment:", error);
    return { success: false, message: error.message || "Failed to track shipment." };
  }
}
