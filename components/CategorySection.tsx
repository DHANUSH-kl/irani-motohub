"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Category {
  title: string;
  handle: string;
  imageUrl: string;
  count: string;
  gridClass: string;
}

function CategoryCard({ cat, idx }: { cat: Category; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Hook into scroll position of this card relative to viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Create parallax effect: translate image y-axis slightly as user scrolls
  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.92, y: 45 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: 0.85, 
        ease: [0.16, 1, 0.3, 1], // premium custom cubic-bezier ease
        delay: idx * 0.12 // staggered delay
      }}
      className={`${cat.gridClass} group relative bg-brand-footer overflow-hidden border border-brand-border h-[320px] sm:h-[400px] lg:h-[450px]`}
    >
      {/* Scroll-based Parallax Image Container */}
      <div className="absolute inset-0 w-full h-[124%] -top-[12%] overflow-hidden">
        <motion.div
          style={{ y: imageY }}
          className="relative w-full h-full"
        >
          <Image
            src={cat.imageUrl}
            alt={cat.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
          />
        </motion.div>
        
        {/* Cinematic Color Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />
      </div>

      {/* Floating Category Info Indicator */}
      <span className="absolute top-6 left-6 font-headings font-extrabold text-white/30 text-xs tracking-widest">
        / {cat.count}
      </span>

      {/* Card Details & Content */}
      <div className="absolute inset-x-6 bottom-6 flex justify-between items-end text-white z-10">
        <div className="space-y-1 pr-6 max-w-[80%]">
          <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-brand-red mb-1">
            Browse Segment
          </span>
          <h3 className="font-headings font-extrabold text-xl sm:text-2xl md:text-3xl uppercase tracking-tight leading-none">
            {cat.title}
          </h3>
        </div>
        
        {/* Glow Link Action Icon */}
        <Link 
          href={`/collections/${cat.handle}`}
          className="w-12 h-12 bg-white text-brand-primary flex items-center justify-center rounded-full group-hover:bg-brand-red group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 shadow-lg flex-shrink-0"
          aria-label={`View ${cat.title} Collection`}
        >
          <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
        </Link>
      </div>

      {/* Premium Outer Hover Border */}
      <div className="absolute inset-0 border-0 group-hover:border-2 border-brand-red transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
}

export default function CategorySection() {
  const categories: Category[] = [
    {
      title: "Performance Air Filters",
      handle: "performance-air-filters",
      imageUrl: "/shop-by-category/performance-air-filters.jpeg",
      count: "01",
      gridClass: "md:col-span-2" // Wide Item
    },
    {
      title: "Engine Tuning",
      handle: "engine-performance",
      imageUrl: "/shop-by-category/engine-tuning.jpeg",
      count: "02",
      gridClass: "md:col-span-1" // Standard Item
    },
    {
      title: "Certified Helmets",
      handle: "helmets",
      imageUrl: "/shop-by-category/certified-helmets.jpeg",
      count: "03",
      gridClass: "md:col-span-1" // Standard Item
    },
    {
      title: "Riding Gear",
      handle: "riding-gear",
      imageUrl: "/shop-by-category/riding-gear.jpeg",
      count: "04",
      gridClass: "md:col-span-2" // Wide Item
    },
    {
      title: "Bike Care",
      handle: "bike-care",
      imageUrl: "/shop-by-category/bike-care.jpeg",
      count: "05",
      gridClass: "md:col-span-2" // Wide Item
    },
    {
      title: "Touring Gear",
      handle: "touring-accessories",
      imageUrl: "/shop-by-category/touring-gear.jpeg",
      count: "06",
      gridClass: "md:col-span-1" // Standard Item
    }
  ];

  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden">
      
      {/* Decorative vertical lines in background */}
      <div className="absolute inset-y-0 left-1/4 w-[1px] bg-brand-border/30 pointer-events-none hidden lg:block" />
      <div className="absolute inset-y-0 left-2/4 w-[1px] bg-brand-border/30 pointer-events-none hidden lg:block" />
      <div className="absolute inset-y-0 left-3/4 w-[1px] bg-brand-border/30 pointer-events-none hidden lg:block" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block mb-2">
              Curated Segments
            </span>
            <h2 className="text-4xl lg:text-5xl font-headings font-extrabold tracking-tight text-brand-primary uppercase leading-none">
              Shop By Category
            </h2>
          </div>
          <p className="text-brand-muted text-sm max-w-lg leading-relaxed font-body">
            Equip your machine with premium upgrades. Our collections alternate between wider focus areas and standard components for an enhanced layout.
          </p>
        </div>

        {/* Asymmetric Alternating Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={cat.handle} cat={cat} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
