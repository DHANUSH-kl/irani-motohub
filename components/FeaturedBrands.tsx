"use client";

import React from "react";

export default function FeaturedBrands() {
  const brands = [
    {
      name: "BMC",
      category: "Air Filters",
      logo: (
        <svg viewBox="0 0 100 35" className="w-full h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="5%" y="75%" fontFamily="sans-serif" fontWeight="900" fontSize="24" fontStyle="italic" fill="#B91C1C">BMC</text>
          <text x="52%" y="75%" fontFamily="sans-serif" fontWeight="700" fontSize="8" fill="#1E1E1E">AIR FILTERS</text>
        </svg>
      )
    },
    {
      name: "K&N",
      category: "Filters & Intake",
      logo: (
        <svg viewBox="0 0 100 35" className="w-full h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="10%" y="75%" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#1E1E1E">K&amp;</text>
          <text x="52%" y="75%" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#B91C1C">N</text>
        </svg>
      )
    },
    {
      name: "Motul",
      category: "Lubricants",
      logo: (
        <svg viewBox="0 0 100 35" className="w-full h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="25" fill="#B91C1C" rx="2" />
          <text x="50%" y="70%" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#FFFFFF">MOTUL</text>
        </svg>
      )
    },
    {
      name: "Liqui Moly",
      category: "Engine Care",
      logo: (
        <svg viewBox="0 0 100 35" className="w-full h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="2" width="90" height="15" fill="#1D4ED8" rx="1" />
          <text x="50%" y="13" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="9" fill="#FFFFFF">LIQUI</text>
          <rect x="5" y="18" width="90" height="15" fill="#B91C1C" rx="1" />
          <text x="50%" y="29" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="9" fill="#FFFFFF">MOLY</text>
        </svg>
      )
    },
    {
      name: "Axor",
      category: "Helmets",
      logo: (
        <svg viewBox="0 0 100 35" className="w-full h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="75%" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="20" letterSpacing="3" fill="#1E1E1E">AXOR</text>
        </svg>
      )
    },
    {
      name: "SMK",
      category: "Helmets",
      logo: (
        <svg viewBox="0 0 100 35" className="w-full h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="75%" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="22" letterSpacing="1" fill="#1E1E1E">SMK</text>
          <rect x="72" y="8" width="4" height="4" fill="#B91C1C" />
        </svg>
      )
    }
  ];

  // Repeat the brands array to create a seamless infinite loop
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

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
                {/* Colored Logo (No grayscale filter) */}
                <div className="w-full max-w-[100px] opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                  {brand.logo}
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
