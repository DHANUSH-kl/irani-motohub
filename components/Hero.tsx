"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, Headset, ArrowRight } from "lucide-react";

export default function Hero() {
  const trustIndicators = [
    { icon: <Truck className="w-4 h-4 text-brand-red" />, text: "Free Shipping India-Wide" },
    { icon: <ShieldCheck className="w-4 h-4 text-brand-red" />, text: "Certified Products" },
    { icon: <RotateCcw className="w-4 h-4 text-brand-red" />, text: "4-Day Defect Replacement" },
    { icon: <Headset className="w-4 h-4 text-brand-red" />, text: "Engineer-Backed Support" }
  ];

  // Active Rider Garage status for display in Hero
  const [activeBike, setActiveBike] = useState<string>("");

  useEffect(() => {
    const checkGarage = () => {
      const saved = localStorage.getItem("rider_garage");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.maker && parsed.model) {
            setActiveBike(`${parsed.maker} ${parsed.model}`);
          }
        } catch (e) {
          setActiveBike("");
        }
      } else {
        setActiveBike("");
      }
    };
    checkGarage();

    window.addEventListener("garage-updated", checkGarage);
    return () => {
      window.removeEventListener("garage-updated", checkGarage);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-[#121212] text-white overflow-hidden pt-20">
      
      {/* Background Image with Cinematic Dark Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/hero-image.jpeg')",
          backgroundPosition: "center 40%"
        }}
      >
        {/* Multipoint mask overlay: left gradient for readability, bottom gradient to merge with the dark background */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30 md:from-black/90 md:via-black/50 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-95" />
      </div>

      {/* Grid overlay for a tech/precision look */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:45px_45px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-grow flex items-center py-16 lg:py-24">
        <div className="max-w-2xl md:max-w-3xl text-left space-y-6 md:space-y-8">
          
          {/* Small Label & Active Garage Alert */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="w-8 h-[1px] bg-brand-red" />
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.25em] text-brand-red font-headings flex items-center gap-2">
              RACE-PROVEN • PRECISION-ENGINEERED
            </span>
            {activeBike && (
              <span className="bg-brand-red/10 border border-brand-red/30 text-white text-[9px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Garage Profile Active: {activeBike}
              </span>
            )}
          </motion.div>

          {/* Luxury Alternating Heading */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-headings font-extrabold tracking-tight leading-[1.05] text-white flex flex-col"
            >
              <span className="block text-white">
                Everything Your Motorcycle Needs,
              </span>
              <span className="block mt-1">
                All in <span className="text-brand-red">One Place.</span>
              </span>
            </motion.h1>
          </div>

          {/* Elevated Descriptive Copywriting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-gray-300 font-body text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal"
          >
            From performance upgrades like air filters to bike care products and touring essentials, shop authentic motorcycle accessories designed to improve every ride.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link
              href="/collections/performance-air-filters"
              className="bg-brand-red hover:bg-white hover:text-[#121212] text-white px-8 py-4 font-headings text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 group rounded-sm"
            >
              Shop Performance Parts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a
              href="#brands-section"
              className="border border-white/20 hover:border-white hover:bg-white/5 text-white px-8 py-4 font-headings text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm"
            >
              Explore Manufacturers
            </a>
          </motion.div>
        </div>
      </div>

      {/* Trust Indicators Banner: Modular Structured bottom shelf */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/60 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x-0 lg:divide-x divide-white/10 text-center lg:text-left py-4.5">
            {trustIndicators.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-center lg:justify-start gap-3.5 py-4 px-6 lg:px-8"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                  {item.icon}
                </div>
                <span className="text-[10px] font-headings font-bold tracking-[0.15em] uppercase text-gray-300">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
