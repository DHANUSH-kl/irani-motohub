"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-20 bg-[#121212] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* Blueprint grid background */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Value Proposition Copy */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              <span className="text-[10px] font-headings font-extrabold uppercase tracking-[0.25em] text-brand-red">
                MotoHub Bulletin
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-headings font-extrabold tracking-tight text-white uppercase leading-none">
              JOIN THE INBOX GARAGE
            </h2>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-lg font-body">
              Sign up for technical build updates, race-track tuning tips, and exclusive early access to certified product drops. Receive a **10% OFF welcome coupon** in your inbox.
            </p>
          </div>

          {/* Right Column: Interactive Subscription Form */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                // Success State
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#181818] border border-emerald-500/30 p-8 rounded-xl flex items-center gap-4.5 text-left shadow-2xl relative overflow-hidden"
                >
                  {/* Subtle success border glow */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
                  
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-headings font-extrabold text-sm text-white uppercase tracking-wider">
                      Welcome to the Hub!
                    </h3>
                    <p className="text-[11px] text-gray-400 font-body mt-0.5 leading-relaxed">
                      Check your inbox. Your **10% OFF welcome coupon** has been generated and dispatched.
                    </p>
                  </div>
                </motion.div>
              ) : (
                // Empty Form State
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#181818] border border-white/10 rounded px-4 py-4 pl-11 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 text-xs font-semibold font-body transition-all"
                      />
                      <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-brand-red hover:bg-red-700 disabled:opacity-40 text-white font-headings font-extrabold text-[10px] uppercase tracking-widest px-8 py-4 transition-all duration-300 rounded whitespace-nowrap flex items-center justify-center gap-2 group shadow-md"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Subscribe <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-body pl-1">
                    Zero spam guarantee. Unsubscribe with a single click.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
