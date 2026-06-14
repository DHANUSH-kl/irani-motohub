"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Grid, Star, ShoppingCart, Eye, RotateCcw, Heart, ShoppingBag } from "lucide-react";
import { getCollection, getProducts, Product, Collection } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;
  const searchParams = useSearchParams();
  const searchBarQuery = searchParams.get("search") || "";

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");

  const { addItem } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Load collection and products
  useEffect(() => {
    const loadCollectionData = async () => {
      setLoading(true);
      const colData = await getCollection(handle);
      setCollection(colData);

      // Fetch products for this collection
      const prodData = await getProducts({ collectionHandle: handle });
      setProducts(prodData);
      setFilteredProducts(prodData);
      setLoading(false);
    };

    loadCollectionData();
  }, [handle]);

  // Apply filters & sorting
  useEffect(() => {
    let result = [...products];

    // Filter by Search Query from URL
    if (searchBarQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchBarQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchBarQuery.toLowerCase())
      );
    }

    // Filter by Brand checkbox
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by Price Tiers
    if (selectedPriceTier !== "all") {
      result = result.filter((p) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        if (selectedPriceTier === "under-2k") return price < 2000;
        if (selectedPriceTier === "2k-5k") return price >= 2000 && price <= 5000;
        if (selectedPriceTier === "over-5k") return price > 5000;
        return true;
      });
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, selectedBrands, selectedPriceTier, sortBy, searchBarQuery]);

  // Extract unique brands for filters
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceTier("all");
    setSortBy("default");
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const variant = product.variants[0];
    if (!variant) return;

    setAddingId(product.id);
    addItem(product, variant, 1);
    setTimeout(() => setAddingId(null), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-brand-bg pt-24">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-brand-muted text-sm font-semibold tracking-wider uppercase">Loading Collection...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-brand-bg pt-24 text-center px-4">
        <h2 className="text-2xl font-headings font-extrabold text-brand-primary mb-2">COLLECTION NOT FOUND</h2>
        <p className="text-brand-muted text-sm mb-6">The collection you requested does not exist in our store.</p>
        <Link href="/" className="bg-brand-primary text-white px-6 py-3 font-headings text-xs font-bold uppercase tracking-wider hover:bg-brand-red transition-colors">
          Return to Garage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pt-20">
      {/* Banner */}
      <div className="bg-brand-footer text-white py-16 border-b border-[#3a3028] relative overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block">
              Riding Segment
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headings font-extrabold tracking-tight uppercase leading-none text-white">
              {collection.title}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS - Desktop */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white border border-brand-border p-6 rounded-lg space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-brand-border">
                <span className="font-headings font-extrabold text-sm text-brand-primary tracking-wider uppercase flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-brand-red" />
                  Filters
                </span>
                {(selectedBrands.length > 0 || selectedPriceTier !== "all" || searchBarQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] font-bold text-brand-red hover:underline uppercase tracking-wider flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Active Search Term Indicator */}
              {searchBarQuery && (
                <div className="p-3 bg-brand-bg rounded border border-brand-border text-xs">
                  <span className="text-brand-muted block text-[10px] uppercase font-bold mb-0.5">Searching for</span>
                  <span className="font-semibold text-brand-primary">&quot;{searchBarQuery}&quot;</span>
                </div>
              )}

              {/* Brand Filter */}
              {uniqueBrands.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-headings font-extrabold text-xs tracking-wider text-brand-primary uppercase">
                    BRANDS
                  </h4>
                  <div className="space-y-2 text-sm text-brand-primary">
                    {uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="rounded border-brand-border text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Tier Filter */}
              <div className="space-y-3 border-t border-brand-border pt-6">
                <h4 className="font-headings font-extrabold text-xs tracking-wider text-brand-primary uppercase">
                  PRICE RANGE
                </h4>
                <div className="space-y-2 text-sm text-brand-primary">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="price-tier"
                      checked={selectedPriceTier === "all"}
                      onChange={() => setSelectedPriceTier("all")}
                      className="text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                    />
                    All Prices
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="price-tier"
                      checked={selectedPriceTier === "under-2k"}
                      onChange={() => setSelectedPriceTier("under-2k")}
                      className="text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                    />
                    Under ₹2,000
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="price-tier"
                      checked={selectedPriceTier === "2k-5k"}
                      onChange={() => setSelectedPriceTier("2k-5k")}
                      className="text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                    />
                    ₹2,000 - ₹5,000
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="price-tier"
                      checked={selectedPriceTier === "over-5k"}
                      onChange={() => setSelectedPriceTier("over-5k")}
                      className="text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                    />
                    Over ₹5,000
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT RESULTS GRID */}
          <main className="flex-1 space-y-6">
            
            {/* Top Bar Controls */}
            <div className="bg-white border border-brand-border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-semibold">
              <span className="text-brand-muted text-xs uppercase tracking-wider">
                {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} found
              </span>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-brand-muted text-xs uppercase tracking-wider whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded px-3 py-1.5 text-xs text-brand-primary font-semibold focus:outline-none focus:border-brand-primary w-full sm:w-auto"
                >
                  <option value="default">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-brand-border rounded-lg text-center py-20 px-4 space-y-4">
                <SlidersHorizontal className="w-12 h-12 text-brand-muted mx-auto stroke-[1.2]" />
                <h3 className="text-lg font-headings font-extrabold text-brand-primary uppercase">No parts found</h3>
                <p className="text-brand-muted text-sm max-w-sm mx-auto">
                  Try adjusting your filters, selecting another brand, or clicking reset to view all items.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-brand-primary text-white px-5 py-2.5 font-headings text-xs font-bold uppercase tracking-wider hover:bg-brand-red transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-brand-primary hover:text-brand-red shadow-sm transition-all duration-200 z-10"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="w-4 h-4 text-brand-primary" />
                      </button>
                    </div>

                    {/* Product Info (Left-Aligned) */}
                    <div className="flex-grow flex flex-col pt-4 pb-4">
                      {/* Brand name in Red Text */}
                      <span className="text-[10px] font-extrabold text-brand-red uppercase tracking-widest mb-1.5">
                        {product.brand}
                      </span>

                      {/* Title */}
                      <h3 className="font-headings font-extrabold text-sm text-brand-primary tracking-tight uppercase line-clamp-1 mb-1 group-hover:text-brand-red transition-colors">
                        <Link href={`/products/${product.handle}`}>
                          {product.title}
                        </Link>
                      </h3>

                      {/* Compatibility indicator */}
                      <p className="text-[10px] text-brand-muted font-medium mb-3">
                        Fits: {product.compatibility.slice(0, 2).join(", ")}
                        {product.compatibility.length > 2 && " & more"}
                      </p>

                      {/* Price (Left-aligned) */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-sm font-bold text-brand-primary">
                          ₹{parseInt(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                        </span>
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
          </main>

        </div>
      </div>
    </div>
  );
}
