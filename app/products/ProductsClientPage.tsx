"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Filter, SlidersHorizontal, Star, ShoppingBag, RotateCcw, Heart, 
  Search, Bike, Wrench, ChevronDown, X, Sparkles, Layers, Tag, DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getProducts, Product, Collection, 
  isProductCompatible, getActiveMotorcycleGroups, getActiveYears, getOptimizedImageUrl 
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

  // Garage states
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string; year?: string } | null>(null);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [motorcycles, setMotorcycles] = useState<{ maker: string; models: string[] }[]>([]);
  const [years, setYears] = useState<string[]>([]);

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

        // Extract makers, models, and years from products to keep garage lists updated
        const makerModelsMap: Record<string, Set<string>> = {};
        const yearsSet = new Set<string>();

        prods.forEach((product) => {
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
                  if (!makerModelsMap[maker]) {
                    makerModelsMap[maker] = new Set();
                  }
                  makerModelsMap[maker].add(model);
                }
              }

              const yearMatch = comp.match(/\b(20\d{2})\b/);
              if (yearMatch) {
                yearsSet.add(yearMatch[1]);
              }
            });
          }

          if (product.tags) {
            product.tags.forEach((tag) => {
              const yearMatch = tag.match(/\b(20\d{2})\b/);
              if (yearMatch) {
                yearsSet.add(yearMatch[1]);
              }
            });
          }
        });

        const extractedMotorcycles = Object.entries(makerModelsMap).map(([maker, modelsSet]) => ({
          maker,
          models: Array.from(modelsSet)
        }));
        setMotorcycles(extractedMotorcycles.length > 0 ? extractedMotorcycles : getActiveMotorcycleGroups(prods));

        const extractedYears = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
        setYears(extractedYears.length > 0 ? extractedYears : getActiveYears(prods));

      } catch (e) {
        console.error("Failed to load products for collection", selectedCollection, e);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCollection, urlCollection]);

  // Extract motorcycles & years from initial products on mount
  useEffect(() => {
    if (products.length > 0) {
      const makerModelsMap: Record<string, Set<string>> = {};
      const yearsSet = new Set<string>();

      products.forEach((product) => {
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
            const yearMatch = comp.match(/\b(20\d{2})\b/);
            if (yearMatch) yearsSet.add(yearMatch[1]);
          });
        }
        if (product.tags) {
          product.tags.forEach((tag) => {
            const yearMatch = tag.match(/\b(20\d{2})\b/);
            if (yearMatch) yearsSet.add(yearMatch[1]);
          });
        }
      });

      const extractedMotorcycles = Object.entries(makerModelsMap).map(([maker, modelsSet]) => ({
        maker,
        models: Array.from(modelsSet)
      }));
      setMotorcycles(extractedMotorcycles.length > 0 ? extractedMotorcycles : getActiveMotorcycleGroups(products));

      const extractedYears = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
      setYears(extractedYears.length > 0 ? extractedYears : getActiveYears(products));
    }
  }, [initialProducts]);

  // Update local filter state if URL params change
  useEffect(() => {
    if (urlSearchQuery) setSearchQuery(urlSearchQuery);
    if (urlCollection) setSelectedCollection(urlCollection);
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlBrand) setSelectedBrand(urlBrand);
  }, [urlSearchQuery, urlCollection, urlCategory, urlBrand]);

  // Extract unique brands & categories for filter options
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).sort();

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...products];

    // Filter by Active Garage Bike / Fitted Bike
    if (garageBike) {
      result = result.filter((p) => isProductCompatible(p, garageBike));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.compatibility.some((c) => c.toLowerCase().includes(q))
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

    // Sort products
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
  }, [products, garageBike, searchQuery, selectedCollection, selectedCategory, selectedBrand, priceRangeFilter, sortBy]);

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

  const handleSaveGarage = () => {
    if (selectedMaker && selectedModel) {
      const bike = { maker: selectedMaker, model: selectedModel, year: selectedYear || undefined };
      setGarageBike(bike);
      localStorage.setItem("rider_garage", JSON.stringify(bike));
      window.dispatchEvent(new Event("garage-updated"));
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
    setSelectedCollection("all");
    setSelectedCategory("all");
    setSelectedBrand("all");
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

            {/* Lower: Detailed Filters & Rider Garage Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Collection Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Layers className="w-3 h-3 text-brand-primary" />
                  Collection
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => handleCollectionChange(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-3 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Collections</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.handle}>{col.title}</option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Tag className="w-3 h-3 text-brand-primary" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-3 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Brand Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-primary" />
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-3 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Brands</option>
                  {uniqueBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-brand-primary" />
                  Price Range
                </label>
                <select
                  value={priceRangeFilter}
                  onChange={(e) => setPriceRangeFilter(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border text-brand-primary rounded p-3 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Any Price</option>
                  <option value="under-1k">Under ₹1,000</option>
                  <option value="1k-3k">₹1,000 - ₹3,000</option>
                  <option value="3k-5k">₹3,000 - ₹5,000</option>
                  <option value="5k-10k">₹5,000 - ₹10,000</option>
                  <option value="above-10k">Over ₹10,000</option>
                </select>
              </div>

              {/* Garage compatibility filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                  <Bike className="w-3 h-3 text-brand-primary" />
                  Fitted to Bike
                </label>
                {garageBike ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 rounded p-2 text-xs font-bold shadow-inner">
                    <span className="truncate pr-1">✓ {garageBike.maker} {garageBike.model}</span>
                    <button
                      onClick={handleClearGarage}
                      className="text-emerald-800 hover:text-brand-red focus:outline-none"
                      title="Clear Fitted Bike"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <select
                      value={selectedMaker}
                      onChange={(e) => {
                        setSelectedMaker(e.target.value);
                        setSelectedModel("");
                      }}
                      className="flex-grow bg-brand-bg border border-brand-border text-brand-primary rounded p-2 text-[10px] font-bold focus:outline-none"
                    >
                      <option value="">Maker</option>
                      {motorcycles.map((m) => (
                        <option key={m.maker} value={m.maker}>{m.maker}</option>
                      ))}
                    </select>
                    <select
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                      }}
                      disabled={!selectedMaker}
                      className="flex-grow bg-brand-bg border border-brand-border text-brand-primary rounded p-2 text-[10px] font-bold focus:outline-none disabled:opacity-50"
                    >
                      <option value="">Model</option>
                      {selectedMaker &&
                        motorcycles.find((m) => m.maker === selectedMaker)?.models.map((mod) => (
                          <option key={mod} value={mod}>{mod}</option>
                        ))}
                    </select>
                    {selectedMaker && selectedModel && (
                      <button
                        onClick={handleSaveGarage}
                        className="bg-brand-primary text-white p-2 rounded hover:bg-brand-red transition-all cursor-pointer font-bold text-xs"
                      >
                        Fit
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white border border-brand-border p-4 rounded-lg hover:shadow-lg hover:border-brand-primary transition-all duration-300 flex flex-col relative"
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
                        />
                      </Link>
                      
                      {/* Brand Label Overlay */}
                      <span className="absolute top-2.5 left-2.5 bg-brand-primary text-white text-[8px] font-extrabold px-2 py-1 uppercase tracking-widest rounded-sm">
                        {product.brand}
                      </span>
                    </div>

                    {/* Details Info Block */}
                    <div className="flex-grow flex flex-col">
                      <span className="text-[9px] font-bold text-brand-red uppercase tracking-wider block mb-1 font-body">
                        {product.category}
                      </span>
                      
                      <h3 className="font-headings font-extrabold text-sm text-brand-primary hover:text-brand-red transition-colors line-clamp-1 mb-2 leading-tight uppercase">
                        <Link href={`/products/${product.handle}`}>{product.title}</Link>
                      </h3>

                      {/* Rating star summary */}
                      <div className="flex items-center gap-1 text-[11px] mb-3">
                        <div className="flex text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="font-bold text-brand-primary">{product.rating}</span>
                        <span className="text-brand-muted">({product.reviews.length})</span>
                      </div>

                      {/* Pricing + Quick buy (At bottom) */}
                      <div className="mt-auto pt-3 border-t border-brand-border space-y-3">
                        <div className="flex justify-between items-baseline">
                          <div className="flex gap-2 items-baseline">
                            <span className="font-headings font-extrabold text-sm text-brand-primary">
                              ₹{parseInt(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
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
                          disabled={addingId === product.id}
                          className="w-full bg-[#1E1E1E] hover:bg-brand-red text-white py-2.5 rounded font-headings text-[10px] uppercase tracking-wider font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
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
