"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect signup visitors to the secure OIDC initialization route
    window.location.href = "/api/auth/login";
  }, []);

  return null;
}
