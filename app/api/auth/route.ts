import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { customerLogin, customerRegister, customerGet } from "@/lib/shopify";

const COOKIE_NAME = "irani_motohub_access_token";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = await customerGet(token);
    if (!user) {
      // Invalid or expired token, clear cookie
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("GET /api/auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    const cookieStore = await cookies();

    if (action === "login") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ errors: ["Email and password are required."] }, { status: 400 });
      }

      const res = await customerLogin(email, password);
      if (res.customer && res.accessToken) {
        cookieStore.set({
          name: COOKIE_NAME,
          value: res.accessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return NextResponse.json({ success: true, user: res.customer });
      } else {
        return NextResponse.json({ errors: res.errors || ["Failed to log in."] }, { status: 400 });
      }
    }

    if (action === "signup") {
      const { firstName, lastName, email, password } = body;
      if (!firstName || !lastName || !email || !password) {
        return NextResponse.json({ errors: ["All fields are required for sign up."] }, { status: 400 });
      }

      const registerRes = await customerRegister(firstName, lastName, email, password);
      if (registerRes.customer) {
        // Auto login after sign up
        const loginRes = await customerLogin(email, password);
        if (loginRes.customer && loginRes.accessToken) {
          cookieStore.set({
            name: COOKIE_NAME,
            value: loginRes.accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          return NextResponse.json({ success: true, user: loginRes.customer });
        }
        return NextResponse.json({ success: true, user: registerRes.customer });
      } else {
        return NextResponse.json({ errors: registerRes.errors || ["Failed to register."] }, { status: 400 });
      }
    }

    if (action === "logout") {
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
