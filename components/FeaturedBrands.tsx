"use client";

import React, { useEffect, useState } from "react";
import { getFeaturedBrands, Brand } from "@/lib/shopify";

interface FeaturedBrandsProps {
  brands?: Brand[];
}

export default function FeaturedBrands({ brands: initialBrands }: FeaturedBrandsProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands || []);

  useEffect(() => {
    if (initialBrands) return;

    const fetchBrands = async () => {
      try {
        const data = await getFeaturedBrands();
        setBrands(data);
      } catch (e) {
        console.error("Failed to load brands:", e);
      }
    };

    fetchBrands();
  }, [initialBrands]);

  // Repeat the brands array to create a seamless infinite loop
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

  if (brands.length === 0) {
    return null;
  }

  return (
    <section id="brands-section" className="py-24 bg-white border-b border-brand-border overflow-hidden">
      
      {/* Self-contained high-performance CSS marquee styles */}
      <style>{`
        @keyframes marquee-infinite {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          gap: 1.5rem;
          animation: marquee-infinite 30s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-headings font-extrabold tracking-tight text-brand-primary">
            FEATURED BRANDS
          </h2>
          <p className="text-brand-muted text-sm font-body">
            We partner with the world&apos;s leading manufacturers to bring genuine race track performance to Indian asphalt.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden">
          
          {/* Elegant edge gradient fades to enhance the carousel visual */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Marquee Body */}
          <div className="animate-marquee-infinite py-2">
            {duplicatedBrands.map((brand, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-center items-center p-6 bg-brand-bg border border-brand-border hover:border-brand-red hover:shadow-lg rounded-lg transition-all duration-300 h-28 w-44 flex-shrink-0 cursor-pointer"
              >
                {/* Brand Logo Image */}
                <div className="w-full max-w-[120px] h-8 relative opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-8 max-w-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                
                {/* Category Subtext */}
                <span className="text-[8px] font-headings font-bold tracking-wider uppercase text-brand-muted mt-3 group-hover:text-brand-red transition-colors duration-300">
                  {brand.category}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
