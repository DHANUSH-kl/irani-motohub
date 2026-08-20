"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Unify authentication under passwordless login
    router.replace("/login");
  }, [router]);

  return null;
}
