"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, Product, isProductCompatible } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // UI states
  const [addingId, setAddingId] = useState<string | null>(null);
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string; year?: string } | null>(null);

  // Carousel slider states
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(300);
  const [isHovered, setIsHovered] = useState(false);
  const gap = 24;

  useEffect(() => {
    const fetchProds = async () => {
      const allProds = await getProducts();
      setProducts(allProds);
    };
    fetchProds();

    // Load active bike from garage cache
    const saved = localStorage.getItem("rider_garage");
    if (saved) {
      try {
        setGarageBike(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    const syncGarage = () => {
      const savedUpdate = localStorage.getItem("rider_garage");
      if (savedUpdate) {
        try {
          setGarageBike(JSON.parse(savedUpdate));
        } catch (e) {
          setGarageBike(null);
        }
      } else {
        setGarageBike(null);
      }
    };

    window.addEventListener("garage-updated", syncGarage);
    return () => {
      window.removeEventListener("garage-updated", syncGarage);
    };
  }, []);

  // Auto-play interval for carousel when not hovered
  useEffect(() => {
    if (isHovered || maxIndex === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, maxIndex, currentIndex]);

  // Sort products by ID descending to get the latest additions first, limiting to 8 items
  const latestProducts = products
    .slice()
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 8);

  // Resize calculation for responsive carousel card sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let width = 300;
        let visibleCards = 4;

        if (containerWidth < 640) {
          width = containerWidth - 32; // Mobile: single card with side padding
          visibleCards = 1;
        } else if (containerWidth < 1024) {
          width = (containerWidth - gap) / 2; // Tablet: 2 cards
          visibleCards = 2;
        } else if (containerWidth < 1280) {
          width = (containerWidth - (gap * 2)) / 3; // Small Desktop: 3 cards
          visibleCards = 3;
        } else {
          width = (containerWidth - (gap * 3)) / 4; // Large Desktop: 4 cards
          visibleCards = 4;
        }
        
        setCardWidth(width);
        setMaxIndex(Math.max(0, latestProducts.length - visibleCards));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    // Recalculate size after component updates
    const timer = setTimeout(updateSize, 100);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timer);
    };
  }, [latestProducts.length]);

  // Adjust active index if it exceeds max index
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

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

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultVariant = product.variants[0];
    if (!defaultVariant) return;

    setAddingId(product.id);
    addItem(product, defaultVariant, 1);
    
    setTimeout(() => {
      setAddingId(null);
    }, 1000);
  };

  if (latestProducts.length === 0) return null;

  return (
    <section className="py-24 bg-[#121212] text-white relative overflow-hidden border-b border-white/10">
      {/* Cinematic grid backdrop */}
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/[0.02] pointer-events-none hidden lg:block" />
      <div className="absolute top-0 right-2/4 w-[1px] h-full bg-white/[0.02] pointer-events-none hidden lg:block" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-headings font-extrabold tracking-widest text-brand-red uppercase block">
              Latest Arrivals
            </span>
            <h2 className="text-4xl font-headings font-extrabold tracking-tight text-white uppercase">
              New Drops
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed font-body">
              Explore the newest performance filters, tuning chips, and gear just added to our catalog.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Link 
              href="/products"
              className="text-brand-red hover:text-white font-bold text-xs uppercase tracking-widest transition-colors border-b border-brand-red pb-1 mr-4 hidden md:inline-block font-headings"
            >
              Browse All Products
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-brand-red hover:border-brand-red text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 group"
                aria-label="Previous arrivals"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-brand-red hover:border-brand-red text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 group"
                aria-label="Next arrivals"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Slider viewport */}
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
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-6"
            style={{ width: latestProducts.length * cardWidth + (latestProducts.length - 1) * gap }}
          >
            {latestProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-[#1c1c1c] border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/15 flex-shrink-0"
                style={{ width: cardWidth }}
              >
                {/* Image panel */}
                <div className="relative aspect-[4/5] w-full bg-[#f6f6f6] overflow-hidden flex items-center justify-center p-4">
                  <Link href={`/products/${product.handle}`} className="relative w-full h-full block" draggable={false}>
                    <Image
                      src={product.images[0]?.url}
                      alt={product.images[0]?.altText || product.title}
                      fill
                      className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-w-768px) 100vw, 25vw"
                      draggable={false}
                    />
                  </Link>

                  {/* New Arrival Tag */}
                  <span className="absolute top-4 left-4 bg-brand-red text-white text-[8px] font-headings font-extrabold uppercase tracking-widest px-2.5 py-1 z-10 rounded-sm">
                    NEW DROP
                  </span>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-4 right-4 p-2 bg-[#121212]/80 hover:bg-brand-red rounded-full text-white shadow-sm transition-all duration-200 z-10"
                    aria-label="Add to wishlist"
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 transition-colors ${
                        isInWishlist(product.id) ? "fill-brand-red text-brand-red border-brand-red" : "text-white"
                      }`} 
                    />
                  </button>
                </div>

                {/* Info Panel */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-headings font-extrabold text-brand-red uppercase tracking-widest block">
                      {product.brand}
                    </span>
                    <h3 className="font-headings font-extrabold text-sm text-white uppercase tracking-tight line-clamp-1 group-hover:text-brand-red transition-colors">
                      <Link href={`/products/${product.handle}`}>{product.title}</Link>
                    </h3>

                    {/* Compatibility verification badge */}
                    <div className="pt-0.5">
                      {garageBike ? (
                        isProductCompatible(product, garageBike) ? (
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/20 px-2 py-0.5 rounded tracking-wide uppercase inline-flex items-center">
                            ✓ Fits Your Bike
                          </span>
                        ) : (
                          <span className="text-[8px] bg-red-500/10 text-red-400 font-extrabold border border-red-500/20 px-2 py-0.5 rounded tracking-wide uppercase inline-flex items-center">
                            ✗ Does Not Fit
                          </span>
                        )
                      ) : (
                        <span className="text-[8px] text-gray-500 font-semibold tracking-wider uppercase">
                          Fits: {product.compatibility[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Cart add action */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
                    <span className="text-sm font-bold text-white font-mono">
                      ₹{parseInt(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                    </span>

                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={addingId === product.id}
                      className="bg-brand-red hover:bg-white hover:text-black text-white p-2.5 rounded-sm transition-all duration-300 flex items-center justify-center disabled:bg-brand-red/50 disabled:text-white/50"
                      aria-label="Add to Cart"
                    >
                      {addingId === product.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ShoppingBag className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

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
