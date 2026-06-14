"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PerformanceBanner() {
  return (
    <section className="relative h-[480px] lg:h-[540px] flex items-center bg-brand-footer text-white overflow-hidden">
      
      {/* Background Image with Dark Heat Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out hover:scale-105"
        style={{ 
          backgroundImage: "url('/pro-tuning-segment.jpeg')" 
        }}
      >
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-footer via-transparent to-transparent opacity-80" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-xl space-y-5">
          
          {/* Label */}
          <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block">
            PRO-TUNING SEGMENT
          </span>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-headings font-extrabold tracking-tight leading-tight uppercase"
          >
            Unlock Better <br />
            <span className="text-white font-extrabold">Performance</span>
          </motion.h2>

          {/* Description */}
          <p className="text-gray-300 font-body text-sm sm:text-base leading-relaxed">
            Premium performance upgrades engineered for riders who demand more. From high-flow cotton filters to advanced autotuning ECU piggybacks, optimize your throttle response and fuel curves.
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-4"
          >
            <Link
              href="/collections/engine-performance"
              className="bg-brand-red hover:bg-white hover:text-brand-primary text-white px-7 py-4 font-headings text-xs font-bold uppercase tracking-wider transition-all duration-300 inline-flex items-center gap-2 group"
            >
              Explore Performance Parts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
