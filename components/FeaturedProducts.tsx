"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { getProducts, Product, isProductCompatible } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  
  // Track wishlist items locally
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string; year?: string } | null>(null);

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

  // Filter products by garage bike
  const displayedProducts = products
    .filter((p) => isProductCompatible(p, garageBike))
    .slice(0, 4);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block mb-2">
              Curated Selection
            </span>
            <h2 className="text-4xl font-headings font-extrabold tracking-tight text-brand-primary uppercase">
              Featured Products
            </h2>
            {garageBike && (
              <p className="text-xs text-brand-muted mt-2 font-medium">
                Showing upgrades compatible with your <span className="text-brand-red font-bold">{garageBike.maker} {garageBike.model}{garageBike.year ? ` (${garageBike.year})` : ""}</span>
              </p>
            )}
          </div>
          <Link 
            href="/products"
            className="text-brand-red hover:text-brand-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors border-b border-brand-red pb-1"
          >
            View Full Catalog
          </Link>
        </div>

        {/* Product Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-semibold">
            No featured products compatible with your {garageBike?.maker} {garageBike?.model} at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col w-full bg-transparent"
              >
                {/* Image Container (Full Bleed, Studio background) */}
                <div className="relative aspect-[4/5] w-full bg-[#F3F3F0] overflow-hidden">
                  <Link href={`/products/${product.handle}`}>
                    <Image
                      src={product.images[0]?.url}
                      alt={product.images[0]?.altText || product.title}
                      fill
                      className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-w-768px) 100vw, 25vw"
                      priority
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
                    <Link href={`/products/${product.handle}`}>
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
          </div>
        )}
      </div>
    </section>
  );
}
