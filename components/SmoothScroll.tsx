"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential deceleration easing
      touchMultiplier: 1.8,
      infinite: false,
    });

    lenisRef.current = lenis;
    // Expose lenis instance globally for custom visual HUD controls
    if (typeof window !== "undefined") {
      (window as any).lenisInstance = lenis;
    }

    // RequestAnimationFrame execution loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Clean up on unmount
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        delete (window as any).lenisInstance;
      }
    };
  }, []);

  // Reset scroll to top instantly on route changes (fixes pages remaining scrolled down)
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}

