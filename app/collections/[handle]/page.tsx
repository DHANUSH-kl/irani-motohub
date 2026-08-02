"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Filter, SlidersHorizontal, Star, ShoppingBag, RotateCcw, Heart, 
  Search, Bike, Wrench, ChevronDown, X, Sparkles, Layers, Tag, DollarSign 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getCollection, getCollections, getProducts, Product, Collection, 
  isProductCompatible, getActiveMotorcycleGroups, getActiveYears 
} from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearchQuery = searchParams.get("search") || "";

  // Data states
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Garage states
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string; year?: string } | null>(null);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [motorcycles, setMotorcycles] = useState<{ maker: string; models: string[] }[]>([]);

  // Dropdown Filter States
  const [selectedCollection, setSelectedCollection] = useState<string>(handle);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(24);

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Fetch collection & all products data
  useEffect(() => {
    const loadCollectionData = async () => {
      setLoading(true);
      const [colData, collectionsData, allProdsData, collectionProdsData] = await Promise.all([
        getCollection(handle),
        getCollections(),
        getProducts(),
        getProducts({ collectionHandle: handle })
      ]);

      setCurrentCollection(colData);
      setAllCollections(collectionsData);
      setSelectedCollection(handle);

      // Use collection specific products if available, or fall back to full catalog
      const baseProds = collectionProdsData.length > 0 ? collectionProdsData : allProdsData;
      setProducts(baseProds);
      setFilteredProducts(baseProds);

      // Extract makers for garage filter
      const makerModelsMap: Record<string, Set<string>> = {};
      allProdsData.forEach((product) => {
        if (product.compatibility) {
          product.compatibility.forEach((comp) => {
            if (comp === "All Motorcycles" || comp === "Universal") return;
            const parts = comp.split(" ");
            if (parts.length >= 2) {
              let maker = parts[0];
              let model = parts.slice(1).join(" ");
              if (maker.toLowerCase() === "royal" && parts[1]?.toLowerCase() === "enfield") {
                maker = "Royal Enfield";
                model = parts.slice(2).join(" ");
              }
              if (maker && model) {
                if (!makerModelsMap[maker]) makerModelsMap[maker] = new Set();
                makerModelsMap[maker].add(model);
              }
            }
          });
        }
      });
      const extracted = Object.entries(makerModelsMap).map(([maker, modelsSet]) => ({
        maker,
        models: Array.from(modelsSet)
      }));
      setMotorcycles(extracted.length > 0 ? extracted : getActiveMotorcycleGroups(allProdsData));

      setLoading(false);
    };

    loadCollectionData();
  }, [handle]);

  // Sync Rider Garage state
  useEffect(() => {
    const saved = localStorage.getItem("rider_garage");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGarageBike(parsed);
        setSelectedMaker(parsed.maker || "");
        setSelectedModel(parsed.model || "");
        setSelectedYear(parsed.year || "");
      } catch (e) {
        console.error(e);
      }
    }

    const syncGarage = () => {
      const savedUpdate = localStorage.getItem("rider_garage");
      if (savedUpdate) {
        try {
          const parsed = JSON.parse(savedUpdate);
          setGarageBike(parsed);
          setSelectedMaker(parsed.maker || "");
          setSelectedModel(parsed.model || "");
          setSelectedYear(parsed.year || "");
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

  // Extract unique options
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).sort();

  // Apply filters & sorting
  useEffect(() => {
    let result = [...products];

    // Filter by Active Garage Bike
    if (garageBike) {
      result = result.filter((p) => isProductCompatible(p, garageBike));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Brand
    if (selectedBrand && selectedBrand !== "all") {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Filter by Price Range Dropdown
    if (priceRangeFilter !== "all") {
      result = result.filter((p) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        if (priceRangeFilter === "under-1k") return price < 1000;
        if (priceRangeFilter === "1k-3k") return price >= 1000 && price <= 3000;
        if (priceRangeFilter === "3k-5k") return price >= 3000 && price <= 5000;
        if (priceRangeFilter === "5k-10k") return price >= 5000 && price <= 10000;
        if (priceRangeFilter === "above-10k") return price > 10000;
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
    } else if (sortBy === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProducts(result);
    setVisibleCount(24);
  }, [products, garageBike, searchQuery, selectedCategory, selectedBrand, priceRangeFilter, sortBy]);

  // Handle switching collection via dropdown
  const handleCollectionChange = (newHandle: string) => {
    if (newHandle === "all") {
      router.push("/products");
    } else if (newHandle !== handle) {
      router.push(`/collections/${newHandle}`);
    }
  };

  const handleClearGarage = () => {
    setGarageBike(null);
    setSelectedMaker("");
    setSelectedModel("");
    setSelectedYear("");
    localStorage.removeItem("rider_garage");
    window.dispatchEvent(new Event("garage-updated"));
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRangeFilter("all");
    setSortBy("default");
    setSearchQuery("");
    handleClearGarage();
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
        <p className="text-brand-muted text-sm font-semibold tracking-wider uppercase font-headings">Loading Collection...</p>
      </div>
    );
  }

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    priceRangeFilter !== "all" ||
    searchQuery.trim() !== "" ||
    garageBike !== null;

  return (
    <div className="min-h-screen bg-brand-bg pt-20">
      {/* Banner */}
      <div className="bg-[#121212] text-white py-14 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1px] bg-brand-red" />
              <span className="text-[10px] font-headings font-extrabold tracking-[0.25em] text-brand-red uppercase block">
                Featured Collection
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headings font-extrabold tracking-tight uppercase leading-none text-white">
              {currentCollection ? currentCollection.title : handle.replace(/-/g, " ")}
            </h1>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-body">
              {currentCollection ? currentCollection.description : "Browse certified components and performance upgrades."}
            </p>

            {garageBike && (
              <div className="pt-2 flex items-center gap-2">
                <span className="bg-brand-red/10 border border-brand-red/30 text-white text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider flex items-center gap-2 font-headings">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Filtered for: {garageBike.maker} {garageBike.model} {garageBike.year ? `(${garageBike.year})` : ""}
                </span>
                <button
                  onClick={handleClearGarage}
                  className="text-[9px] text-gray-400 hover:text-brand-red underline uppercase font-bold"
                >
                  Remove Bike Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* COMPACT DROPDOWN FILTER BAR (With Collection Switcher Dropdown) */}
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-lg space-y-4">
          
          {/* Top Bar: Search Input + Results Count + Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-brand-border">
            
            {/* Search Input Box */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search within this collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 pl-9 pr-8 text-xs font-semibold text-brand-primary placeholder-gray-400 focus:outline-none focus:border-brand-red transition-all"
              />
              <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Count & Reset Action */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-headings font-extrabold uppercase text-brand-primary tracking-wider">
                Showing <span className="text-brand-red">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "Product" : "Products"}
              </span>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-headings font-extrabold uppercase text-brand-red hover:text-red-700 tracking-wider flex items-center gap-1 bg-brand-red/5 hover:bg-brand-red/10 px-3 py-1.5 rounded transition-all"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            
            {/* 1. COLLECTION SWITCHER DROPDOWN (Hidden) */}
            <div className="space-y-1 hidden">
              <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                <Layers className="w-3 h-3 text-brand-red" /> Collection
              </label>
              <select
                value={selectedCollection}
                onChange={(e) => handleCollectionChange(e.target.value)}
                className="w-full bg-brand-red/10 border border-brand-red/30 hover:border-brand-red rounded-lg p-2.5 text-xs font-extrabold text-brand-red focus:outline-none cursor-pointer transition-colors"
              >
                <option value="all">⚡ View All Products</option>
                {allCollections.map((col) => (
                  <option key={col.id} value={col.handle}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. CATEGORY DROPDOWN */}
            <div className="space-y-1">
              <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                <Tag className="w-3 h-3 text-brand-red" /> Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-red rounded-lg p-2.5 text-xs font-semibold text-brand-primary focus:outline-none focus:border-brand-red cursor-pointer transition-colors"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. BRAND DROPDOWN */}
            <div className="space-y-1">
              <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-red" /> Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-red rounded-lg p-2.5 text-xs font-semibold text-brand-primary focus:outline-none focus:border-brand-red cursor-pointer transition-colors"
              >
                <option value="all">All Brands</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. MOTORCYCLE FITMENT DROPDOWN (Hidden) */}
            <div className="space-y-1 hidden">
              <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                <Bike className="w-3 h-3 text-brand-red" /> Bike Fitment
              </label>
              <select
                value={selectedMaker ? `${selectedMaker}|${selectedModel}` : ""}
                onChange={(e) => {
                  if (!e.target.value) {
                    handleClearGarage();
                    return;
                  }
                  const [maker, model] = e.target.value.split("|");
                  setSelectedMaker(maker);
                  setSelectedModel(model);
                  const bike = { maker, model };
                  setGarageBike(bike);
                  localStorage.setItem("rider_garage", JSON.stringify(bike));
                  window.dispatchEvent(new Event("garage-updated"));
                }}
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-red rounded-lg p-2.5 text-xs font-semibold text-brand-primary focus:outline-none focus:border-brand-red cursor-pointer transition-colors"
              >
                <option value="">All Motorcycles</option>
                {motorcycles.map((group) => (
                  <optgroup key={group.maker} label={group.maker}>
                    {group.models.map((mod) => (
                      <option key={`${group.maker}-${mod}`} value={`${group.maker}|${mod}`}>
                        {group.maker} {mod}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* 5. PRICE RANGE DROPDOWN */}
            <div className="space-y-1">
              <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-brand-red" /> Price Range
              </label>
              <select
                value={priceRangeFilter}
                onChange={(e) => setPriceRangeFilter(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-red rounded-lg p-2.5 text-xs font-semibold text-brand-primary focus:outline-none focus:border-brand-red cursor-pointer transition-colors"
              >
                <option value="all">All Prices</option>
                <option value="under-1k">Under ₹1,000</option>
                <option value="1k-3k">₹1,000 - ₹3,000</option>
                <option value="3k-5k">₹3,000 - ₹5,000</option>
                <option value="5k-10k">₹5,000 - ₹10,000</option>
                <option value="above-10k">Above ₹10,000</option>
              </select>
            </div>

            {/* 6. SORT ORDER DROPDOWN */}
            <div className="space-y-1">
              <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-brand-red" /> Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-red rounded-lg p-2.5 text-xs font-semibold text-brand-primary focus:outline-none focus:border-brand-red cursor-pointer transition-colors"
              >
                <option value="default">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="title-asc">Name: A to Z</option>
              </select>
            </div>

          </div>

          {/* Active Filter Chips / Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-brand-border">
              <span className="text-[9px] font-headings font-bold uppercase tracking-wider text-brand-muted mr-1">
                Active Filters:
              </span>

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/10 text-brand-red text-[10px] font-bold rounded-full border border-brand-red/20 uppercase font-headings">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrand !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/10 text-brand-red text-[10px] font-bold rounded-full border border-brand-red/20 uppercase font-headings">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand("all")} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {garageBike && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200 uppercase font-headings">
                  Bike: {garageBike.maker} {garageBike.model}
                  <button onClick={handleClearGarage} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {priceRangeFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/10 text-brand-red text-[10px] font-bold rounded-full border border-brand-red/20 uppercase font-headings">
                  Price: {priceRangeFilter}
                  <button onClick={() => setPriceRangeFilter("all")} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

        </div>

        {/* RESULTS GRID */}
        <main className="space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-brand-border rounded-xl text-center py-20 px-4 space-y-4 shadow-sm">
              <SlidersHorizontal className="w-12 h-12 text-brand-muted mx-auto stroke-[1.2]" />
              <h3 className="text-lg font-headings font-extrabold text-brand-primary uppercase">No parts found in this collection</h3>
              <p className="text-brand-muted text-xs sm:text-sm max-w-sm mx-auto font-body">
                Try selecting a different collection from the dropdown or resetting your filter options.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="bg-brand-primary text-white px-5 py-2.5 font-headings text-xs font-bold uppercase tracking-wider hover:bg-brand-red transition-colors rounded"
                >
                  Reset Filters
                </button>
                <Link
                  href="/products"
                  className="border border-brand-primary text-brand-primary px-5 py-2.5 font-headings text-xs font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-colors rounded"
                >
                  View All Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                  <div
                    key={product.id}
                    className="group flex flex-col w-full bg-white border border-brand-border rounded-lg overflow-hidden hover:border-brand-red/40 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] w-full bg-[#F3F3F0] overflow-hidden">
                      <Link href={`/products/${product.handle}`}>
                        <Image
                          src={product.images[0]?.url}
                          alt={product.images[0]?.altText || product.title}
                          fill
                          className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-w-768px) 100vw, 25vw"
                          priority={idx < 8}
                        />
                      </Link>

                      {/* Wishlist toggle */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full text-brand-primary hover:text-brand-red shadow transition-all duration-200 z-10"
                        aria-label="Add to wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isInWishlist(product.id)
                              ? "text-brand-red fill-brand-red"
                              : "text-brand-primary"
                          }`}
                        />
                      </button>

                      {/* Category tag */}
                      <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[8px] font-headings font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                        {product.category}
                      </span>
                    </div>

                    {/* Product details info */}
                    <div className="flex-grow flex flex-col p-4">
                      {/* Brand */}
                      <span className="text-[10px] font-extrabold text-brand-red uppercase tracking-widest mb-1 font-headings">
                        {product.brand}
                      </span>

                      {/* Title */}
                      <h3 className="font-headings font-extrabold text-xs sm:text-sm text-brand-primary tracking-tight uppercase line-clamp-2 mb-2 min-h-[36px] group-hover:text-brand-red transition-colors">
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
                          <p className="text-[9.5px] text-brand-muted font-semibold uppercase tracking-wider truncate">
                            Fits: {product.compatibility.slice(0, 1).join(", ")}
                            {product.compatibility.length > 1 && " & more"}
                          </p>
                        )}
                      </div>

                      {/* Price & Rating */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-border mb-3">
                        <span className="text-sm font-bold text-brand-primary font-headings">
                          ₹{parseInt(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      {/* Add to cart CTA */}
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={addingId === product.id}
                        className="w-full bg-[#1E1E1E] hover:bg-brand-red text-white py-3 font-headings text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2 rounded-sm"
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

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="flex justify-center pt-8 border-t border-brand-border">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="bg-[#1E1E1E] hover:bg-brand-red text-white px-8 py-3.5 font-headings text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg rounded"
                  >
                    Load More Parts ({filteredProducts.length - visibleCount} Remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
