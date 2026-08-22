import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductLightweight } from "@/lib/shopify";
import BestsellersCarousel from "./BestsellersCarousel";

export default async function BestsellersSection() {
  const handles = [
    "ktm-front-brembo-pad",
    "ninja-zx10r-evotech-swingarm-spools",
    "tanax-napoleon-anti-glare-mirrors-copy",
    "rcb-s1-fl-master-brake-pump-14mm-rh-01bp049s-silver"
  ];

  const products = await Promise.all(
    handles.map(handle => getProductLightweight(handle))
  );

  const validProducts = products.filter((p): p is any => p !== null);

  if (validProducts.length === 0) return null;

  return (
    <section className="py-16 bg-[#0c0c0c] border-y border-white/5 relative overflow-hidden">
      {/* Tech grid decoration */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1px] bg-brand-red" />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-red font-headings">
                POPULAR DEMAND
              </span>
            </div>
            <h2 className="font-headings font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
              BEST SELLERS
            </h2>
            <p className="text-xs text-gray-400 font-body mt-1">
              Top-rated performance gear and upgrades chosen by riders this week.
            </p>
          </div>
          <Link 
            href="/products"
            className="text-brand-red hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:gap-2 transition-all"
          >
            Explore All Upgrades <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bestsellers Carousel / Grid Client Wrapper */}
        <BestsellersCarousel products={validProducts} />

      </div>
    </section>
  );
}
