"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, Product, isProductCompatible } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  
  // Track wishlist items locally
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string; year?: string } | null>(null);

  // Slider navigation states
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(300);
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

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Filter products by garage bike (Limit to 8 to fit slider)
  const displayedProducts = products
    .filter((p) => isProductCompatible(p, garageBike))
    .slice(0, 8);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let width = 300;
        let visibleCards = 4;

        if (containerWidth < 640) {
          width = containerWidth - 32; // Mobile: single card
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
        setMaxIndex(Math.max(0, displayedProducts.length - visibleCards));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    // Recalculate size when products load or filter updates
    const timer = setTimeout(updateSize, 100);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timer);
    };
  }, [displayedProducts.length]);

  // Adjust active index if it exceeds max index after filtering
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
    <section className="py-24 bg-white relative overflow-hidden border-b border-brand-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Navigation */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block mb-2">
              Curated Selection
            </span>
            <h2 className="text-4xl font-headings font-extrabold tracking-tight text-brand-primary uppercase">
              Featured Products
            </h2>
            {garageBike ? (
              <p className="text-xs text-brand-muted mt-2 font-medium">
                Showing upgrades compatible with your <span className="text-brand-red font-bold">{garageBike.maker} {garageBike.model}{garageBike.year ? ` (${garageBike.year})` : ""}</span>
              </p>
            ) : (
              <p className="text-xs text-brand-muted mt-2 font-medium">
                Explore our recommended premium upgrades and replacement parts.
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/products"
              className="text-brand-red hover:text-brand-primary font-bold text-xs uppercase tracking-widest transition-colors border-b border-brand-red pb-1 mr-4 hidden md:inline-block"
            >
              View Full Catalog
            </Link>
            
            {/* Carousel navigation controls */}
            {displayedProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="w-12 h-12 rounded-full border border-black/10 bg-black/5 hover:bg-brand-red hover:border-brand-red text-black hover:text-white disabled:opacity-30 disabled:hover:bg-black/5 disabled:hover:border-black/10 disabled:hover:text-black disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 group"
                  aria-label="Previous products"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === maxIndex}
                  className="w-12 h-12 rounded-full border border-black/10 bg-black/5 hover:bg-brand-red hover:border-brand-red text-black hover:text-white disabled:opacity-30 disabled:hover:bg-black/5 disabled:hover:border-black/10 disabled:hover:text-black disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 group"
                  aria-label="Next products"
                >
                  <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel / Product track container */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-semibold">
            No featured products compatible with your {garageBike?.maker} {garageBike?.model} at the moment.
          </div>
        ) : (
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
              style={{ width: displayedProducts.length * cardWidth + (displayedProducts.length - 1) * gap }}
            >
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col bg-transparent flex-shrink-0"
                  style={{ width: cardWidth }}
                >
                  {/* Image Container (Full Bleed, Studio background) */}
                  <div className="relative aspect-[4/5] w-full bg-[#F3F3F0] overflow-hidden">
                    <Link href={`/products/${product.handle}`} draggable={false}>
                      <Image
                        src={product.images[0]?.url}
                        alt={product.images[0]?.altText || product.title}
                        fill
                        className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-w-768px) 100vw, 25vw"
                        priority
                        draggable={false}
                      />
                    </Link>

                    {/* Wishlist Heart Icon (Top-Right) */}
                    <button
                      onClick={(e) => toggleWishlist(e, product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-brand-primary hover:text-brand-red shadow-sm transition-all duration-200 z-10"
                      aria-label="Add to wishlist"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          wishlist.includes(product.id) ? "fill-brand-red text-brand-red" : "text-brand-primary"
                        }`} 
                      />
                    </button>

                    {/* Quick Add Tag Overlay if needed */}
                    {product.variants[0]?.compareAtPrice && (
                      <span className="absolute top-4 left-4 bg-brand-red text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 z-10">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Product Info (Left-Aligned, Spaced out) */}
                  <div className="flex-grow flex flex-col pt-4 pb-4">
                    
                    {/* Brand name in Red Text */}
                    <span className="text-[10px] font-extrabold text-brand-red uppercase tracking-widest mb-1.5">
                      {product.brand}
                    </span>

                    {/* Title */}
                    <h3 className="font-headings font-extrabold text-base text-brand-primary tracking-tight uppercase line-clamp-1 mb-1 group-hover:text-brand-red transition-colors">
                      <Link href={`/products/${product.handle}`} draggable={false}>
                        {product.title}
                      </Link>
                    </h3>

                    {/* Compatibility indicator */}
                    <div className="mb-3 min-h-[22px] flex items-center">
                      {garageBike ? (
                        isProductCompatible(product, garageBike) ? (
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-1.5 py-0.5 rounded uppercase tracking-wide">
                            ✓ Fits Your Bike
                          </span>
                        ) : (
                          <span className="text-[9px] bg-red-50 text-red-700 font-bold border border-red-200 px-1.5 py-0.5 rounded uppercase tracking-wide">
                            ✗ Does Not Fit
                          </span>
                        )
                      ) : (
                        <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider">
                          Fits: {product.compatibility.slice(0, 1).join(", ")}
                          {product.compatibility.length > 1 && " & more"}
                        </p>
                      )}
                    </div>

                    {/* Price (Left-aligned) */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-sm font-bold text-brand-primary">
                        ₹{parseInt(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                      </span>
                      {product.variants[0]?.compareAtPrice && (
                        <span className="text-xs text-brand-muted line-through">
                          ₹{parseInt(product.variants[0].compareAtPrice.amount).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Full-width Add to Cart Button */}
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={addingId === product.id}
                      className="w-full bg-[#1E1E1E] hover:bg-brand-red text-white py-3.5 font-headings text-xs font-bold uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      {addingId === product.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ADDING...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          ADD TO CART
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Scroll Progress Bar Indicator */}
        {displayedProducts.length > 0 && (
          <div className="mt-12 w-full max-w-[200px] h-[2px] bg-black/10 mx-auto rounded-full overflow-hidden relative">
            <motion.div
              animate={{ 
                left: maxIndex > 0 ? `${(currentIndex / maxIndex) * 75}%` : "0%"
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 bottom-0 w-[25%] bg-brand-red rounded-full"
            />
          </div>
        )}

      </div>
    </section>
  );
}
