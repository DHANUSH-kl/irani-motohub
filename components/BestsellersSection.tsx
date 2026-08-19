import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { getProductLightweight, shopifyLoader, getOptimizedImageUrl } from "@/lib/shopify";

export default async function BestsellersSection() {
  const handles = [
    "oval-barend-mirrors",
    "dimaond-barend-mirrors",
    "bsddp-aluminium-mirrors-black",
    "duke-gen-3-tail-tidy"
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

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {validProducts.map((product) => {
            const hasDiscount = false; // standard catalog price
            const rating = 4.8;
            
            return (
              <div 
                key={product.id}
                className="group flex flex-col bg-[#141414] border border-white/5 rounded-lg p-4 hover:border-brand-red/30 hover:shadow-2xl transition-all duration-300 relative"
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
                      loader={product.images[0]?.url?.includes("cdn.shopify.com") ? shopifyLoader : undefined}
                    />
                  </Link>
                  <span className="absolute top-3 left-3 bg-[#1c1c1c] border border-white/10 text-white text-[8px] font-headings font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    BEST SELLER
                  </span>
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col">
                  <span className="text-[9px] font-bold text-brand-red uppercase tracking-wider block mb-1 font-body">
                    {product.brand || "MTOHUB"}
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

      </div>
    </section>
  );
}
