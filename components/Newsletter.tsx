"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Users } from "lucide-react";

export default function Newsletter() {
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
                MotoHub Community
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-headings font-extrabold tracking-tight text-white uppercase leading-none">
              JOIN THE MOTO-COMMUNITY
            </h2>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-lg font-body">
              Connect with fellow riders, get real-time build updates, race-track tuning tips, and exclusive early access to certified product drops directly on WhatsApp.
            </p>
          </div>

          {/* Right Column: Premium WhatsApp Community Card */}
          <div className="lg:col-span-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-[#181818] border border-white/10 p-6 sm:p-8 rounded-xl relative overflow-hidden shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 w-full"
            >
              {/* Subtle background glow effect */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start gap-4 w-full sm:w-auto">
                {/* Whatsapp SVG Icon Container */}
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 relative">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {/* Status Indicator */}
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#181818] rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-headings font-extrabold uppercase tracking-wider text-emerald-400">
                      Active Community
                    </span>
                  </div>
                  <h3 className="font-headings font-extrabold text-base text-white uppercase tracking-tight leading-none">
                    IRANI MOTOHUB CLUB
                  </h3>
                  {/* Community Stats */}
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>500+ Active Riders</span>
                  </div>
                </div>
              </div>

              <a
                href="https://chat.whatsapp.com/GHezlOWDiPJ5FnuMbrV22x"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 active:scale-95 text-white font-headings font-extrabold text-[10px] uppercase tracking-widest px-6 py-4 transition-all duration-300 rounded whitespace-nowrap flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                Join Now 
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
