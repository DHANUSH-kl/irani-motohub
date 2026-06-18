"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, SlidersHorizontal, Star, ShoppingBag, RotateCcw, Heart, Search, Bike, Wrench } from "lucide-react";
import { getProducts, Product, isProductCompatible, getActiveMotorcycleGroups, getActiveYears } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Garage states
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string; year?: string } | null>(null);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [motorcycles, setMotorcycles] = useState<{ maker: string; models: string[] }[]>([
    { maker: "KTM", models: ["Duke 390", "RC 390"] },
    { maker: "Royal Enfield", models: ["Himalayan 450", "Interceptor 650", "Continental GT 650"] }
  ]);
  const [years, setYears] = useState<string[]>(["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"]);

  // Product Filter States
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setMotorcycles(getActiveMotorcycleGroups(data));
      setYears(getActiveYears(data));
      setLoading(false);
    };
    fetchAllProducts();

    // Load active bike from garage cache
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

  // Update local search state if URL search param changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...products];

    // Filter by Active Garage Bike
    if (garageBike) {
      result = result.filter((p) => isProductCompatible(p, garageBike));
    }

    // Filter by Search Input Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.compatibility.some(c => c.toLowerCase().includes(q))
      );
    }

    // Filter by Brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by Categories
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
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

    // Sort products
    if (sortBy === "price-asc") {
      result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, garageBike, searchQuery, selectedBrands, selectedCategories, selectedPriceTier, sortBy]);

  // Extract unique brands & categories for filter options
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));

  // Handlers for selection
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedPriceTier("all");
    setSortBy("default");
    setSearchQuery("");
    
    // Reset garage local states too if we want a full reset, or keep garage selected
    setSelectedMaker("");
    setSelectedModel("");
    setSelectedYear("");
    setGarageBike(null);
    localStorage.removeItem("rider_garage");
    window.dispatchEvent(new Event("garage-updated"));
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
        <p className="text-brand-muted text-sm font-semibold tracking-wider uppercase">Loading Catalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pt-20">
      {/* Banner */}
      <div className="bg-brand-footer text-white py-16 border-b border-[#3a3028] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block">
              Performance Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headings font-extrabold tracking-tight uppercase leading-none text-white">
              ALL UPGRADES & PARTS
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
              Browse our complete catalog of certified riding gear, racing filters, fuel tuners, and high-performance components.
            </p>
            {garageBike && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red/10 border border-brand-red/20 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                Fitted for: {garageBike.maker} {garageBike.model} {garageBike.year ? `(${garageBike.year})` : ""}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            
            {/* SEARCH BOX */}
            <div className="bg-white border border-brand-border p-5 rounded-lg space-y-2">
              <label className="block text-[10px] font-headings font-extrabold uppercase tracking-wider text-brand-primary">
                Search Catalog
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 pl-9 pr-3 text-brand-primary placeholder-gray-400 focus:outline-none focus:border-brand-primary text-xs font-semibold"
                />
                <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* MOTORCYCLE COMPATIBILITY SELECTOR */}
            <div className="bg-white border border-brand-border p-5 rounded-lg space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-brand-border">
                <span className="font-headings font-extrabold text-[11px] text-brand-primary tracking-wider uppercase flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-brand-red" />
                  Rider Garage Fitment
                </span>
                {garageBike && (
                  <button
                    onClick={handleClearGarage}
                    className="text-[9px] font-bold text-brand-red hover:underline uppercase"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted mb-1">
                    Maker
                  </label>
                  <select
                    value={selectedMaker}
                    onChange={(e) => {
                      setSelectedMaker(e.target.value);
                      setSelectedModel("");
                      setSelectedYear("");
                    }}
                    className="w-full bg-brand-bg border border-brand-border rounded p-2 text-xs font-semibold text-brand-primary focus:outline-none focus:border-brand-primary"
                  >
                    <option value="">Choose Maker</option>
                    {motorcycles.map((m) => (
                      <option key={m.maker} value={m.maker}>{m.maker}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted mb-1">
                    Model
                  </label>
                  <select
                    value={selectedModel}
                    disabled={!selectedMaker}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      setSelectedYear("");
                    }}
                    className="w-full bg-brand-bg border border-brand-border rounded p-2 text-xs font-semibold text-brand-primary focus:outline-none focus:border-brand-primary disabled:opacity-50"
                  >
                    <option value="">Choose Model</option>
                    {motorcycles.find((m) => m.maker === selectedMaker)?.models.map((mod) => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-brand-muted mb-1">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    disabled={!selectedModel}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-border rounded p-2 text-xs font-semibold text-brand-primary focus:outline-none focus:border-brand-primary disabled:opacity-50"
                  >
                    <option value="">Choose Year (Optional)</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveGarage}
                  disabled={!selectedMaker || !selectedModel}
                  className="w-full bg-brand-primary hover:bg-brand-red disabled:bg-brand-muted text-white text-[10px] font-bold font-headings uppercase py-2.5 rounded tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" /> Filter entire page
                </button>
              </div>
            </div>

            {/* SIDEBAR FILTERS (CATEGORIES, BRANDS, PRICE) */}
            <div className="bg-white border border-brand-border p-5 rounded-lg space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-brand-border">
                <span className="font-headings font-extrabold text-[11px] text-brand-primary tracking-wider uppercase flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-brand-red" />
                  Product Filters
                </span>
                {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedPriceTier !== "all" || searchQuery || garageBike) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[9px] font-bold text-brand-red hover:underline uppercase tracking-wider flex items-center gap-0.5"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Reset
                  </button>
                )}
              </div>

              {/* Categories */}
              {uniqueCategories.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-headings font-extrabold text-[10px] tracking-wider text-brand-primary uppercase">
                    CATEGORIES
                  </h4>
                  <div className="space-y-1.5 text-xs text-brand-primary">
                    {uniqueCategories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                          className="rounded border-brand-border text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {uniqueBrands.length > 0 && (
                <div className="space-y-2 border-t border-brand-border pt-4">
                  <h4 className="font-headings font-extrabold text-[10px] tracking-wider text-brand-primary uppercase">
                    BRANDS
                  </h4>
                  <div className="space-y-1.5 text-xs text-brand-primary">
                    {uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="rounded border-brand-border text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Tier */}
              <div className="space-y-2 border-t border-brand-border pt-4">
                <h4 className="font-headings font-extrabold text-[10px] tracking-wider text-brand-primary uppercase">
                  PRICE RANGE
                </h4>
                <div className="space-y-1.5 text-xs text-brand-primary">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="all-price-tier"
                      checked={selectedPriceTier === "all"}
                      onChange={() => setSelectedPriceTier("all")}
                      className="text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                    />
                    All Prices
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="all-price-tier"
                      checked={selectedPriceTier === "under-2k"}
                      onChange={() => setSelectedPriceTier("under-2k")}
                      className="text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                    />
                    Under ₹2,000
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="all-price-tier"
                      checked={selectedPriceTier === "2k-5k"}
                      onChange={() => setSelectedPriceTier("2k-5k")}
                      className="text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                    />
                    ₹2,000 - ₹5,000
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="all-price-tier"
                      checked={selectedPriceTier === "over-5k"}
                      onChange={() => setSelectedPriceTier("over-5k")}
                      className="text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                    />
                    Over ₹5,000
                  </label>
                </div>
              </div>

            </div>
          </aside>

          {/* PRODUCT RESULTS GRID */}
          <main className="flex-1 space-y-6">
            
            {/* Top Controls Bar */}
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

            {/* Results Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-brand-border rounded-lg text-center py-20 px-4 space-y-4">
                <SlidersHorizontal className="w-12 h-12 text-brand-muted mx-auto stroke-[1.2]" />
                <h3 className="text-lg font-headings font-extrabold text-brand-primary uppercase">No upgrades found</h3>
                <p className="text-brand-muted text-sm max-w-sm mx-auto">
                  Try adjusting your filters, selecting another brand/category, or resetting to view all items.
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
                    {/* Image */}
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

                      {/* Wishlist toggle */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-brand-primary hover:text-brand-red shadow-sm transition-all duration-200 z-10"
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
                    </div>

                    {/* Product details info */}
                    <div className="flex-grow flex flex-col pt-4 pb-4">
                      {/* Brand */}
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

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-sm font-bold text-brand-primary">
                          ₹{parseInt(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Add to cart CTA */}
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

export default function AllProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-center items-center bg-brand-bg pt-24">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-brand-muted text-sm font-semibold tracking-wider uppercase">Loading Catalog...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

