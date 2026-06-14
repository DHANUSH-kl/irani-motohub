"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InitialLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Lock scrolling on mount
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setShow(false);
      // Unlock scrolling after loading slide-up completes
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }, 2000);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 bg-[#221A14] z-50 flex flex-col justify-center items-center text-white"
        >
          {/* Subtle background precision grids */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="space-y-6 text-center z-10 px-4">
            
            {/* Small mechanical indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.1 }}
              className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400"
            >
              System Booting • RPM Stable
            </motion.div>

            {/* Glowing Brand Headline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-1.5"
            >
              <h1 className="font-headings font-extrabold text-3xl sm:text-4xl tracking-tighter">
                IRANI <span className="text-brand-red">MOTOHUB</span>
              </h1>
              <span className="w-2 h-2 bg-brand-red rounded-full self-end mb-2.5 animate-pulse" />
            </motion.div>

            {/* Premium Loading Progress Bar */}
            <div className="w-56 h-[1.5px] bg-white/10 mx-auto relative overflow-hidden rounded-full">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="absolute inset-y-0 w-2/3 bg-brand-red shadow-[0_0_8px_#B91C1C]"
              />
            </div>

            {/* Lower info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.4 }}
              className="text-[10px] tracking-wider uppercase text-gray-400 font-semibold"
            >
              Genuine Performance Access
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
