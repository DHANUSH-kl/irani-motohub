"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Filter, SlidersHorizontal, Star, ShoppingBag, RotateCcw, Heart, 
  Search, Bike, Wrench, ChevronDown, X, Sparkles, Layers, Tag, IndianRupee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getProducts, Product, Collection, 
  isProductCompatible, getOptimizedImageUrl, shopifyLoader,
  isProductSoldOut, formatProductPrice, getProductDisplayPrice,
  extractUniqueProductFilters, isProductMatchingQuery, parseBikeNames
} from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductsClientPageProps {
  initialProducts: Product[];
  initialCollections: Collection[];
}

export default function ProductsClientPage({ initialProducts, initialCollections }: ProductsClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlSearchQuery = searchParams.get("search") || "";
  const urlCollection = searchParams.get("collection") || "all";
  const urlCategory = searchParams.get("category") || "all";
  const urlBrand = searchParams.get("brand") || "all";

  // Data states
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [collections] = useState<Collection[]>(initialCollections);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  // Garage / Bike states
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string; year?: string } | null>(null);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Dropdown Filter States
  const [selectedCollection, setSelectedCollection] = useState<string>(urlCollection);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand);
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(24);

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Extract all unique filters dynamically from Shopify products
  const filterOptions = extractUniqueProductFilters(products);
  const availableModels = selectedMaker && filterOptions.makerModelsMap[selectedMaker]
    ? filterOptions.makerModelsMap[selectedMaker]
    : filterOptions.allModels;

  // Load garage configuration on mount
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
        setSelectedMaker("");
        setSelectedModel("");
        setSelectedYear("");
      }
    };

    window.addEventListener("garage-updated", syncGarage);
    return () => {
      window.removeEventListener("garage-updated", syncGarage);
    };
  }, []);

  // Fetch products when selectedCollection changes
  useEffect(() => {
    if (selectedCollection === urlCollection) return; // Prevent double load on mount

    const loadProducts = async () => {
      setLoading(true);
      try {
        const prods = await getProducts({
          collectionHandle: selectedCollection === "all" ? undefined : selectedCollection
        });
        setProducts(prods);
      } catch (e) {
        console.error("Failed to load products for collection", selectedCollection, e);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCollection, urlCollection]);

  // Update local filter state if URL params change
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
    setSelectedCollection(urlCollection || "all");
    setSelectedCategory(urlCategory || "all");
    setSelectedBrand(urlBrand || "all");
  }, [urlSearchQuery, urlCollection, urlCategory, urlBrand]);

  const syncGarageBike = (maker: string, model: string, year: string) => {
    if (maker || model || year) {
      const bike = { maker, model, year: year || undefined };
      setGarageBike(bike);
      localStorage.setItem("rider_garage", JSON.stringify(bike));
      window.dispatchEvent(new Event("garage-updated"));
    } else {
      setGarageBike(null);
      localStorage.removeItem("rider_garage");
      window.dispatchEvent(new Event("garage-updated"));
    }
  };

  const handleMakerChange = (newMaker: string) => {
    setSelectedMaker(newMaker);
    let newModel = selectedModel;
    if (newMaker && filterOptions.makerModelsMap[newMaker]) {
      if (!filterOptions.makerModelsMap[newMaker].includes(selectedModel)) {
        newModel = "";
        setSelectedModel("");
      }
    }
    syncGarageBike(newMaker, newModel, selectedYear);
  };

  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel);
    let maker = selectedMaker;
    if (!maker && newModel) {
      for (const [m, models] of Object.entries(filterOptions.makerModelsMap)) {
        if (models.includes(newModel)) {
          maker = m;
          setSelectedMaker(m);
          break;
        }
      }
    }
    syncGarageBike(maker, newModel, selectedYear);
  };

  const handleYearChange = (newYear: string) => {
    setSelectedYear(newYear);
    syncGarageBike(selectedMaker, selectedModel, newYear);
  };

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...products];

    // Filter by Bike Fitment (either dropdown selection or active garage bike)
    const activeBike = (selectedMaker || selectedModel || selectedYear) 
      ? { maker: selectedMaker, model: selectedModel, year: selectedYear }
      : garageBike;

    if (activeBike && (activeBike.maker || activeBike.model || activeBike.year)) {
      result = result.filter((p) => isProductCompatible(p, activeBike));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const keywords = q.split(/\s+/).filter(Boolean);

      const itemsWithScores = result.map((p) => {
        let score = 0;
        let matchesAllKeywords = true;

        const bikeBrand = (p.bike_brand || p.metafields?.custom?.bike_brand || "").toString().toLowerCase();
        const bikeName = (p.bike_name || p.metafields?.custom?.bike_name || "").toString().toLowerCase();
        const bikeNames = (p.bike_names && p.bike_names.length > 0)
          ? p.bike_names.map((b: string) => b.toLowerCase())
          : parseBikeNames(p.bike_name || p.metafields?.custom?.bike_name).map((b: string) => b.toLowerCase());
        const bikeYear = (p.bike_year || p.metafields?.custom?.bike_year || "").toString().toLowerCase();

        for (const keyword of keywords) {
          const singularKeyword = keyword.endsWith("s") && keyword.length > 3 
            ? keyword.slice(0, -1) 
            : keyword;

          const title = p.title?.toLowerCase() || "";
          const category = p.category?.toLowerCase() || "";
          const brand = p.brand?.toLowerCase() || "";
          const description = p.description?.toLowerCase() || "";
          const tags = p.tags?.map(t => t.toLowerCase()) || [];
          const compatibility = p.compatibility?.map(c => c.toLowerCase()) || [];

          let keywordMatched = false;

          if (title.includes(keyword)) {
            score += 15;
            keywordMatched = true;
          } else if (title.includes(singularKeyword)) {
            score += 10;
            keywordMatched = true;
          }

          if (bikeBrand.includes(keyword) || bikeBrand.includes(singularKeyword)) {
            score += 14;
            keywordMatched = true;
          }

          if (bikeName.includes(keyword) || bikeName.includes(singularKeyword) || bikeNames.some((bn: string) => bn.includes(keyword) || bn.includes(singularKeyword))) {
            score += 14;
            keywordMatched = true;
          }

          if (category.includes(keyword) || category.includes(singularKeyword)) {
            score += 8;
            keywordMatched = true;
          }

          if (compatibility.some(c => c.includes(keyword) || c.includes(singularKeyword))) {
            score += 6;
            keywordMatched = true;
          }

          if (tags.some(t => t.includes(keyword) || t.includes(singularKeyword))) {
            score += 4;
            keywordMatched = true;
          }

          if (brand.includes(keyword) || brand.includes(singularKeyword)) {
            score += 2;
            keywordMatched = true;
          }

          if (description.includes(keyword) || description.includes(singularKeyword)) {
            score += 1;
            keywordMatched = true;
          }

          // Synonym check fallback
          if (!keywordMatched && isProductMatchingQuery(p, keyword)) {
            score += 8;
            keywordMatched = true;
          }

          if (!keywordMatched) {
            matchesAllKeywords = false;
            break;
          }
        }

        return { product: p, score, matchesAllKeywords };
      });

      const matchedItems = itemsWithScores.filter(item => item.matchesAllKeywords);
      
      if (sortBy === "default") {
        matchedItems.sort((a, b) => b.score - a.score);
      }

      result = matchedItems.map(item => item.product);
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
        const price = parseFloat(getProductDisplayPrice(p));
        if (priceRangeFilter === "under-1k") return price < 1000;
        if (priceRangeFilter === "1k-3k") return price >= 1000 && price <= 3000;
        if (priceRangeFilter === "3k-5k") return price >= 3000 && price <= 5000;
        if (priceRangeFilter === "5k-10k") return price >= 5000 && price <= 10000;
        if (priceRangeFilter === "above-10k") return price > 10000;
        return true;
      });
    }

    // Sort products
    if (sortBy === "price-asc") {
      result.sort((a, b) => parseFloat(getProductDisplayPrice(a)) - parseFloat(getProductDisplayPrice(b)));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => parseFloat(getProductDisplayPrice(b)) - parseFloat(getProductDisplayPrice(a)));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProducts(result);
    setVisibleCount(24);
  }, [products, garageBike, selectedMaker, selectedModel, selectedYear, searchQuery, selectedCollection, selectedCategory, selectedBrand, priceRangeFilter, sortBy]);

  // Handle Collection dropdown change with URL sync
  const handleCollectionChange = (newHandle: string) => {
    setSelectedCollection(newHandle);
    const params = new URLSearchParams(searchParams.toString());
    if (newHandle && newHandle !== "all") {
      params.set("collection", newHandle);
    } else {
      params.delete("collection");
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
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
    setSelectedCollection("all");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedMaker("");
    setSelectedModel("");
    setSelectedYear("");
    setPriceRangeFilter("all");
    setSortBy("default");
    setSearchQuery("");
    handleClearGarage();
    router.replace("/products", { scroll: false });
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const variant = product.variants[0];
    if (!variant) return;

    setAddingId(product.id);
    addItem(product, variant, 1);
    setTimeout(() => setAddingId(null), 1000);
  };

  const activeCollectionObj = collections.find((c) => c.handle === selectedCollection);

  const hasActiveFilters =
    selectedCollection !== "all" ||
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    selectedMaker !== "" ||
    selectedModel !== "" ||
    selectedYear !== "" ||
    priceRangeFilter !== "all" ||
    searchQuery.trim() !== "" ||
    garageBike !== null;

  return (
    <div className="min-h-screen bg-brand-bg pt-20">
      
      {/* Dynamic Header Banner */}
      <div className="bg-[#121212] text-white py-14 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red block mb-2">
              Performance Catalog
            </span>
            <h1 className="text-3xl md:text-4xl font-headings font-extrabold tracking-tight uppercase">
              {activeCollectionObj ? activeCollectionObj.title : "ALL PERFORMANCE UPGRADES"}
            </h1>
            <p className="mt-3 text-brand-muted text-sm max-w-2xl leading-relaxed font-body">
              {activeCollectionObj 
                ? activeCollectionObj.description 
                : "Engineered to dominate. Explore racing air filters, custom electronics, and technical street apparel dyno-tested for ultimate single-cylinder response."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Filters Bar */}
        <main className="grid grid-cols-1 gap-8">
          <div className="bg-white border border-brand-border rounded-xl p-5 shadow-lg space-y-5">
            
            {/* Upper: Search and Basic Sorting */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              <div className="relative flex-grow max-w-xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="text"
                  placeholder="Search parts by name, category, or compatibility..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded p-3 pl-11 text-xs text-brand-primary placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Reset All Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] font-bold text-brand-red uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Filters
                  </button>
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-brand-border text-brand-primary rounded p-3 text-xs font-bold focus:outline-none"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rider Rating</option>
                  <option value="title-asc">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="h-px bg-brand-border" />

            {/* Lower: Multi-Dropdown Fitment & Catalog Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Collection Dropdown (First) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Layers className="w-3 h-3 text-brand-primary" />
                  Switch Collection
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => handleCollectionChange(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="all">All Collections</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.handle}>{col.title}</option>
                  ))}
                </select>
              </div>

              {/* Bike Brand (Maker) Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Bike className="w-3 h-3 text-brand-red" />
                  Bike Brand
                </label>
                <select
                  value={selectedMaker}
                  onChange={(e) => handleMakerChange(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="">All Bike Brands</option>
                  {filterOptions.makers.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Bike Name / Model Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-brand-primary" />
                  Bike Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="">All Bike Models</option>
                  {availableModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Bike Year Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Tag className="w-3 h-3 text-brand-primary" />
                  Bike Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="">All Years</option>
                  {filterOptions.years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Layers className="w-3 h-3 text-brand-primary" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="all">All Categories</option>
                  {filterOptions.productCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-brand-primary" />
                  Price Range
                </label>
                <select
                  value={priceRangeFilter}
                  onChange={(e) => setPriceRangeFilter(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="all">Any Price</option>
                  <option value="under-1k">Under ₹1,000</option>
                  <option value="1k-3k">₹1,000 - ₹3,000</option>
                  <option value="3k-5k">₹3,000 - ₹5,000</option>
                  <option value="5k-10k">₹5,000 - ₹10,000</option>
                  <option value="above-10k">Over ₹10,000</option>
                </select>
              </div>

            </div>

            {/* Active Fitment Badge Banner */}
            {(selectedMaker || selectedModel || selectedYear || garageBike) && (
              <div className="bg-brand-red/5 border border-brand-red/20 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-brand-primary font-bold">
                  <Bike className="w-4 h-4 text-brand-red" />
                  <span>
                    Active Compatibility Fitment:{" "}
                    <span className="text-brand-red uppercase font-black">
                      {[selectedMaker || garageBike?.maker, selectedModel || garageBike?.model, selectedYear || garageBike?.year].filter(Boolean).join(" ")}
                    </span>
                  </span>
                </div>
                <button
                  onClick={handleClearGarage}
                  className="text-[10px] font-extrabold text-brand-red hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  <X className="w-3.5 h-3.5" /> Clear Bike Compatibility
                </button>
              </div>
            )}

          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-brand-border rounded-lg overflow-hidden">
                  <div className="aspect-[4/5] w-full bg-gray-100 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-2.5 w-12 bg-red-100 rounded animate-pulse" />
                    <div className="h-3.5 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                    <div className="h-px bg-brand-border" />
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-8 bg-amber-100 rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-brand-border rounded-xl">
              <SlidersHorizontal className="w-12 h-12 mx-auto text-brand-muted mb-4 stroke-1" />
              <h3 className="font-headings font-extrabold text-lg text-brand-primary uppercase">NO COMPATIBLE UPGRADES FOUND</h3>
              <p className="text-brand-muted text-xs font-body max-w-sm mx-auto mt-2 leading-relaxed">
                Adjust your filters or clear your garage compatibility profile to browse other segments of the catalog.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="mt-6 bg-brand-primary text-white px-5 py-2.5 font-headings text-xs font-bold uppercase tracking-wider hover:bg-brand-red transition-all rounded shadow-md"
                >
                  Clear Active Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* Catalog Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => {
                  const soldOut = isProductSoldOut(product);
                  return (
                    <div
                      key={product.id}
                      className={`group bg-white border border-brand-border p-4 rounded-lg hover:shadow-lg hover:border-brand-primary transition-all duration-300 flex flex-col relative ${
                        soldOut ? "opacity-65 grayscale-[40%]" : ""
                      }`}
                    >
                      {/* Image Block */}
                      <div className="relative aspect-square w-full bg-brand-bg overflow-hidden rounded mb-4 border border-brand-border">
                        <Link href={`/products/${product.handle}`}>
                          <Image
                            src={getOptimizedImageUrl(product.images[0]?.url, 400)}
                            alt={product.images[0]?.altText || product.title}
                            fill
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-w-768px) 100vw, 25vw"
                            loader={product.images[0]?.url?.includes("cdn.shopify.com") ? shopifyLoader : undefined}
                          />
                        </Link>
                        {soldOut && (
                          <span className="absolute top-2 left-2 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 z-10 rounded">
                            SOLD OUT
                          </span>
                        )}
                      </div>

                      {/* Details Info Block */}
                      <div className="flex-grow flex flex-col">
                        <span className="text-[9px] font-bold text-brand-red uppercase tracking-wider block mb-1 font-body">
                          {product.category}
                        </span>
                        
                        <h3 className="font-headings font-extrabold text-sm text-brand-primary hover:text-brand-red transition-colors line-clamp-1 mb-2 leading-tight uppercase">
                          <Link href={`/products/${product.handle}`}>{product.title}</Link>
                        </h3>



                        {/* Pricing + Quick buy (At bottom) */}
                        <div className="mt-auto pt-3 border-t border-brand-border space-y-3">
                          <div className="flex justify-between items-baseline">
                            <div className="flex gap-2 items-baseline">
                              <span className="font-headings font-extrabold text-sm text-brand-primary">
                                {formatProductPrice(product)}
                              </span>
                              {product.variants[0]?.compareAtPrice && (
                                <span className="text-[10px] text-brand-muted line-through font-bold">
                                  ₹{parseInt(product.variants[0].compareAtPrice.amount).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            disabled={addingId === product.id || soldOut}
                            className="w-full bg-[#1E1E1E] hover:bg-brand-red text-white py-2.5 rounded font-headings text-[10px] uppercase tracking-wider font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 disabled:hover:bg-[#1E1E1E]"
                          >
                            {soldOut ? (
                              "SOLD OUT"
                            ) : addingId === product.id ? (
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
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="flex justify-center pt-8 border-t border-brand-border">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="bg-[#1E1E1E] hover:bg-brand-red text-white px-8 py-3.5 font-headings text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg rounded"
                  >
                    Load More Upgrades ({filteredProducts.length - visibleCount} Remaining)
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
