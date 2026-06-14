"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate progress percentage
      const percentage = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      setScrollProgress(percentage);

      // Show/hide scroll to top button
      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Call once to initialize
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const lenis = (window as any).lenisInstance;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // SVG parameters for the circular progress dial
  const stroke = 3;
  const radius = 22; // Larger outer frame
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Top HUD Scroll Progress Line */}
      <div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-brand-red z-[999] pointer-events-none transition-transform duration-75 ease-out origin-left shadow-[0_0_10px_rgba(185,28,28,0.8),0_0_5px_rgba(185,28,28,0.6)]"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      {/* Floating Telemetry Scroll-to-Top Dial */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-75 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToTop}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#121212]/95 backdrop-blur border border-white/10 text-white hover:text-brand-red hover:border-brand-red shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group cursor-pointer"
          aria-label="Scroll to top"
        >
          {/* Circular progress track SVG */}
          <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
            <circle
              className="text-white/5"
              strokeWidth={stroke}
              stroke="currentColor"
              fill="transparent"
              r={normalizedRadius}
              cx="24"
              cy="24"
            />
            <circle
              className="text-brand-red transition-all duration-100 ease-out"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={normalizedRadius}
              cx="24"
              cy="24"
            />
          </svg>
          
          {/* Central arrow icon with gear-like telemetry hover effect */}
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:scale-110 duration-300" />
        </button>
      </div>
    </>
  );
}
