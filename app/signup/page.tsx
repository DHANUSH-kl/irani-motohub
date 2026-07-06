"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const { user, signUp, error: authError, clearError } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    clearError();

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields.");
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setSubmitting(false);
      return;
    }

    const success = await signUp(firstName, lastName, email, password);
    setSubmitting(false);

    if (success) {
      router.push("/account");
    }
  };

  return (
    <main className="flex-1 min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#090909] py-16 px-4 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-10 text-white relative">
        {/* Header */}
        <div className="text-center space-y-3.5 mb-8">
          <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-red/10">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="font-headings font-extrabold text-2xl tracking-tight text-white uppercase">
            CREATE RIDER PROFILE
          </h1>
          <p className="text-xs text-gray-400 font-body max-w-[280px] mx-auto">
            Join Irani MotoHub to plan builds, sync your carts, and trace shipments.
          </p>
        </div>

        {/* Display Errors */}
        {(error || authError) && (
          <div className="p-3 mb-6 bg-red-950/40 border border-red-500/30 text-red-400 rounded text-xs font-semibold">
            {error || authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-headings font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Rider"
                className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-brand-red font-body transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-headings font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Singh"
                className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-brand-red font-body transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-headings font-extrabold uppercase tracking-wider text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-brand-red font-body transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-headings font-extrabold uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-brand-red font-body transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-red hover:bg-red-700 text-white py-3.5 rounded-lg text-xs font-headings font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-brand-red/10 hover:shadow-brand-red/25"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Register & Sign In"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center pt-6 mt-6 border-t border-white/5 text-xs text-gray-400 font-body">
          Already registered?{" "}
          <Link href="/login" className="text-brand-red hover:underline font-bold transition-all">
            Sign in instead
          </Link>
        </div>
      </div>
    </main>
  );
}
