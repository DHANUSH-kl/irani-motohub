"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Product, getOptimizedImageUrl } from "@/lib/shopify";

export default function BestsellersCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let isPaused = false;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        if (!isPaused && containerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
          const maxScroll = scrollWidth - clientWidth;

          if (maxScroll <= 0) return;

          // Carousel cards on mobile are 280px wide + 24px gap = 304px
          const cardWidth = 280;
          const gap = 24;

          if (scrollLeft >= maxScroll - 15) {
            containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            containerRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
          }
        }
      }, 4000); // Autoplay every 4s
    };

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
    const handleTouchStart = () => { isPaused = true; };
    const handleTouchEnd = () => {
      setTimeout(() => {
        isPaused = false;
      }, 2000);
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      el.addEventListener("touchstart", handleTouchStart);
      el.addEventListener("touchend", handleTouchEnd);
    }

    startAutoplay();

    return () => {
      clearInterval(intervalId);
      if (el) {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [products]);

  return (
    <div
      ref={containerRef}
      className="flex sm:grid overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 scrollbar-none snap-x snap-mandatory sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => {
        const rating = 4.8;
        return (
          <div
            key={product.id}
            className="group flex flex-col bg-[#141414] border border-white/5 rounded-lg p-4 hover:border-brand-red/30 hover:shadow-2xl transition-all duration-300 relative min-w-[280px] sm:min-w-0 w-[280px] sm:w-auto snap-start flex-shrink-0"
          >
            {/* Image Box */}
            <div className="relative aspect-square w-full bg-[#f6f6f6] overflow-hidden rounded-md mb-4 flex items-center justify-center p-4">
              <Link href={`/products/${product.handle}`} className="relative w-full h-full block">
                <Image
                  src={getOptimizedImageUrl(product.images[0]?.url, 400)}
                  alt={product.images[0]?.altText || product.title}
                  fill
                  className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 25vw"
                  unoptimized={product.images[0]?.url?.includes("cdn.shopify.com")}
                />
              </Link>
              <span className="absolute top-3 left-3 bg-[#1c1c1c] border border-white/10 text-white text-[8px] font-headings font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                BEST SELLER
              </span>
            </div>

            {/* Details */}
            <div className="flex-grow flex flex-col">
              <span className="text-[9px] font-bold text-brand-red uppercase tracking-wider block mb-1 font-body">
                {product.category}
              </span>

              <h3 className="font-headings font-extrabold text-sm text-white hover:text-brand-red transition-colors line-clamp-1 mb-2 uppercase leading-tight">
                <Link href={`/products/${product.handle}`}>{product.title}</Link>
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 text-[10px] mb-3 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-white mt-0.5">{rating}</span>
                <span className="text-gray-500 font-normal mt-0.5">(Verified)</span>
              </div>

              {/* Pricing and Action */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div>
                  <span className="text-xs text-gray-500 block uppercase tracking-wider text-[8px]">Price</span>
                  <span className="font-headings font-extrabold text-sm text-white">
                    ₹{parseInt(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                  </span>
                </div>

                <Link
                  href={`/products/${product.handle}`}
                  className="bg-brand-red hover:bg-white hover:text-black text-white px-4 py-2 font-headings text-[9px] font-bold uppercase tracking-widest transition-colors rounded-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
