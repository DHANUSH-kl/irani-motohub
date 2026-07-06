"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  title: string;
  handle: string;
  imageUrl: string;
  count: string;
}

export default function CategorySection() {
  const categories: Category[] = [
    {
      title: "Performance Air Filters",
      handle: "performance-air-filters",
      imageUrl: "/shop-by-category/performance-air-filters.jpeg",
      count: "01",
    },
    {
      title: "Engine Tuning",
      handle: "engine-performance",
      imageUrl: "/shop-by-category/engine-tuning.jpeg",
      count: "02",
    },
    {
      title: "Riding Gear",
      handle: "riding-gear",
      imageUrl: "/shop-by-category/riding-gear.jpeg",
      count: "03",
    },
    {
      title: "Bike Care",
      handle: "bike-care",
      imageUrl: "/shop-by-category/bike-care.jpeg",
      count: "04",
    },
    {
      title: "Touring Gear",
      handle: "touring-accessories",
      imageUrl: "/shop-by-category/touring-gear.jpeg",
      count: "05",
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(380);
  const [isHovered, setIsHovered] = useState(false);
  const gap = 24;

  useEffect(() => {
    if (isHovered || maxIndex === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, maxIndex, currentIndex]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let width = 380;
        let visibleCards = 3;

        if (containerWidth < 640) {
          width = containerWidth - 32; // Mobile: single card with side padding
          visibleCards = 1;
        } else if (containerWidth < 1024) {
          width = (containerWidth - gap) / 2; // Tablet: 2 cards
          visibleCards = 2;
        } else {
          width = (containerWidth - (gap * 2)) / 3; // Desktop: 3 cards
          visibleCards = 3;
        }
        
        setCardWidth(width);
        setMaxIndex(Math.max(0, categories.length - visibleCards));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    // Trigger layout measurement after load state completes
    const timer = setTimeout(updateSize, 100);
    
    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timer);
    };
  }, [categories.length]);

  // Handle navigation click
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Drag snapping logic
  const onDragEnd = (event: any, info: any) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    let shift = 0;

    if (swipe < -80 || velocity < -300) {
      shift = 1;
    } else if (swipe > 80 || velocity > 300) {
      shift = -1;
    }

    setCurrentIndex((prev) => Math.max(0, Math.min(maxIndex, prev + shift)));
  };

  return (
    <section className="py-24 bg-[#121212] text-white relative overflow-hidden border-b border-white/10">
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
              Equip your machine with premium upgrades. Drag the slider or use navigation controls to explore categories.
            </p>
          </div>
          
          {/* Custom Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-brand-red hover:border-brand-red disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/15 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 group"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          className="overflow-visible select-none cursor-grab active:cursor-grabbing"
        >
          <motion.div
            drag="x"
            dragConstraints={{
              left: -maxIndex * (cardWidth + gap),
              right: 0
            }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            animate={{ x: -currentIndex * (cardWidth + gap) }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} // slow, premium ease-out bezier
            className="flex gap-6"
            style={{ width: categories.length * cardWidth + (categories.length - 1) * gap }}
          >
            {categories.map((cat, idx) => (
              <div
                key={cat.handle}
                className="relative bg-[#1A1A1A] border border-white/5 overflow-hidden group flex-shrink-0"
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
          </motion.div>
        </div>

        {/* Scroll Progress Bar Indicator */}
        <div className="mt-12 w-full max-w-[200px] h-[2px] bg-white/10 mx-auto rounded-full overflow-hidden relative">
          <motion.div
            animate={{ 
              left: maxIndex > 0 ? `${(currentIndex / maxIndex) * 75}%` : "0%"
            }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 bottom-0 w-[25%] bg-brand-red rounded-full"
          />
        </div>

      </div>
    </section>
  );
}
