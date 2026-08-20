"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { user, signIn, error: authError, clearError } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  // Reset errors on mount
  useEffect(() => {
    clearError();
  }, []);

  const handleSignIn = async () => {
    setSubmitting(true);
    clearError();
    const success = await signIn();
    if (!success) {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#090909] py-16 px-4 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-10 relative text-white">
        {/* Header */}
        <div className="text-center space-y-3.5 mb-8">
          <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-red/10">
            <User className="w-6 h-6" />
          </div>
          <h1 className="font-headings font-extrabold text-2xl tracking-tight text-white uppercase">
            RIDER SIGN IN
          </h1>
          <p className="text-xs text-gray-400 font-body max-w-[260px] mx-auto">
            Access your secure profile, manage builds in your garage, and track orders.
          </p>
        </div>

        {/* Display Errors */}
        {authError && (
          <div className="p-3 mb-6 bg-red-950/40 border border-red-500/30 text-red-400 rounded text-xs font-semibold">
            {authError}
          </div>
        )}

        {/* Options */}
        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={submitting}
            className="w-full bg-brand-red hover:bg-red-700 text-white py-3.5 rounded-lg text-xs font-headings font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-brand-red/10 hover:shadow-brand-red/25 cursor-pointer"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Continue with Email OTP
              </>
            )}
          </button>

          <button
            onClick={handleSignIn}
            disabled={submitting}
            className="w-full bg-[#1e1e1e] hover:bg-[#282828] border border-white/10 text-white py-3.5 rounded-lg text-xs font-headings font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.85-6.277-6.36s2.81-6.36 6.277-6.36c1.497 0 2.87.547 3.95 1.543l3.116-3.116C18.666 1.958 15.659 1 12.24 1A11 11 0 001.25 12a11 11 0 0010.99 11c6.079 0 11.25-4.4 11.25-11 0-.74-.066-1.475-.25-2.185H12.24z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        {/* Info text */}
        <div className="text-center pt-6 mt-6 border-t border-white/5 text-[10px] text-gray-500 font-body">
          <p className="flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-red" /> Secure passwordless authentication powered by Shopify.
          </p>
        </div>
      </div>
    </main>
  );
}
