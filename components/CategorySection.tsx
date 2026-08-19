"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { getCollections, shopifyLoader } from "@/lib/shopify";

interface Category {
  title: string;
  handle: string;
  imageUrl: string;
  count: string;
}

export default function CategorySection({ initialCategories }: { initialCategories: Category[] }) {
  const [categories] = useState<Category[]>(initialCategories);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(380);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const gap = 24;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let width = 380;

        if (containerWidth < 640) {
          width = containerWidth - 32; // Mobile: single card with side padding
        } else if (containerWidth < 1024) {
          width = (containerWidth - gap) / 2; // Tablet: 2 cards
        } else {
          width = (containerWidth - (gap * 2)) / 3; // Desktop: 3 cards
        }
        
        setCardWidth(width);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    const timer = setTimeout(updateSize, 100);
    
    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timer);
    };
  }, [categories.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (maxScroll > 0) {
          setScrollProgress(scrollLeft / maxScroll);
          setCanScrollLeft(scrollLeft > 10);
          setCanScrollRight(scrollLeft < maxScroll - 10);
        } else {
          setScrollProgress(0);
          setCanScrollLeft(false);
          setCanScrollRight(false);
        }
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      // Trigger initial check
      handleScroll();
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, [categories]);

  // Handle navigation click
  const handlePrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: (cardWidth + gap), behavior: "smooth" });
    }
  };

  return (
    <section id="categories-section" className="py-24 bg-[#121212] text-white relative overflow-hidden border-b border-white/10">
      {/* Decorative vertical lines in background */}
      <div className="absolute inset-y-0 left-1/4 w-[1px] bg-white/[0.02] pointer-events-none hidden lg:block" />
      <div className="absolute inset-y-0 left-2/4 w-[1px] bg-white/[0.02] pointer-events-none hidden lg:block" />
      <div className="absolute inset-y-0 left-3/4 w-[1px] bg-white/[0.02] pointer-events-none hidden lg:block" />
      
      {/* Technical blueprint grid overlay */}
      <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Navigation Controls */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block">
              Curated Segments
            </span>
            <h2 className="text-4xl lg:text-5xl font-headings font-extrabold tracking-tight text-white uppercase leading-none">
              Shop By Category
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed font-body">
              Equip your machine with premium upgrades. Swipe the slider or use navigation controls to explore categories.
            </p>
          </div>
          
          {/* Custom Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-brand-red hover:border-brand-red disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/15 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 group"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-brand-red hover:border-brand-red disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/15 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 group"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div 
          ref={containerRef} 
          className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory pb-4"
        >
          {categories.map((cat, idx) => (
            <div
              key={cat.handle}
              className="relative bg-[#1A1A1A] border border-white/5 overflow-hidden group flex-shrink-0 snap-start"
              style={{ width: cardWidth, height: 420 }}
            >
              {/* Image Container with Hover Scale */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={cat.imageUrl}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 33vw"
                  draggable={false}
                  loader={cat.imageUrl?.includes("cdn.shopify.com") ? shopifyLoader : undefined}
                />
                {/* Dark Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />
              </div>

              {/* Floating Category Number indicator */}
              <span className="absolute top-6 left-6 font-headings font-extrabold text-white/20 text-xs tracking-widest">
                / {cat.count}
              </span>

              {/* Card Content bottom aligned */}
              <div className="absolute inset-x-6 bottom-6 flex justify-between items-end text-white z-10">
                <div className="space-y-1 pr-4 max-w-[75%]">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-brand-red mb-1">
                    Browse Segment
                  </span>
                  <h3 className="font-headings font-extrabold text-lg sm:text-xl uppercase tracking-tight leading-tight line-clamp-2">
                    {cat.title}
                  </h3>
                </div>
                
                {/* Action Link Icon */}
                <Link 
                  href={`/collections/${cat.handle}`}
                  className="w-11 h-11 bg-white text-[#121212] flex items-center justify-center rounded-full group-hover:bg-brand-red group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 shadow-lg flex-shrink-0"
                  aria-label={`View ${cat.title} Collection`}
                  draggable={false}
                >
                  <ArrowRight className="w-4.5 h-4.5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </Link>
              </div>

              {/* Premium Outer Hover Border */}
              <div className="absolute inset-0 border-0 group-hover:border-[2px] border-brand-red/80 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Scroll Progress Bar Indicator */}
        <div className="mt-12 w-full max-w-[200px] h-[2px] bg-white/10 mx-auto rounded-full overflow-hidden relative">
          <div
            style={{ 
              left: `${scrollProgress * 75}%`,
              width: "25%"
            }}
            className="absolute top-0 bottom-0 bg-brand-red rounded-full transition-all duration-200 ease-out"
          />
        </div>

      </div>
    </section>
  );
}
