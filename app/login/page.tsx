"use client";

import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    // Automatically redirect users to the server-side OIDC initialization route
    window.location.href = "/api/auth/login";
  }, []);

  return (
    <main className="flex-1 min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#090909] text-white">
      <div className="flex flex-col items-center gap-3.5">
        <span className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-body">Redirecting to secure login portal...</p>
      </div>
    </main>
  );
}
