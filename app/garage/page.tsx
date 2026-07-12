"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Product, ProductVariant, isProductCompatible as checkProductCompatibility, MASTER_MOTORCYCLES, getActiveYears, BikeProfile } from "@/lib/shopify";
import { 
  Bike, Heart, Trash2, ShoppingCart, Plus, Check, 
  ArrowRight, ShieldCheck, Wrench, Sparkles, HelpCircle, Info, Flame, AlertCircle, ArrowUpRight
} from "lucide-react";

// Product Tuning Spec mappings (HP and weight effects)
// Shopify metafields will be used dynamically instead of static db.

export default function GaragePage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  // Garage Profile state
  const [garageBike, setGarageBike] = useState<(BikeProfile & { year?: string }) | null>(null);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [motorcycles, setMotorcycles] = useState<BikeProfile[]>(
    MASTER_MOTORCYCLES.filter(b => b.maker === "KTM" || b.maker === "Royal Enfield")
  );
  const [years, setYears] = useState<string[]>(["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"]);

  // Install State for Wishlist parts (to toggle dyno inclusion)
  const [installedItems, setInstalledItems] = useState<string[]>([]);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [addingAll, setAddingAll] = useState(false);

  // Fetch garage state on load and load products
  useEffect(() => {
    const saved = localStorage.getItem("rider_garage");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = MASTER_MOTORCYCLES.find(
          (b) => b.maker.toLowerCase() === parsed.maker.toLowerCase() && b.model.toLowerCase() === parsed.model.toLowerCase()
        );
        if (match) {
          setGarageBike({ ...match, year: parsed.year });
          setSelectedMaker(match.maker);
          setSelectedModel(match.model);
          setSelectedYear(parsed.year || "");
        }
      } catch (e) {
        console.error("Failed to parse rider garage", e);
      }
    }

    const loadProductsAndBikes = async () => {
      const { getProducts } = await import("@/lib/shopify");
      const prods = await getProducts();
      
      const activeBikes = MASTER_MOTORCYCLES.filter(bike => {
        const makerLower = bike.maker.toLowerCase().trim();
        const modelLower = bike.model.toLowerCase().trim();
        return prods.some(product => {
          const compLower = product.compatibility.map(c => c.toLowerCase().trim());
          const hasMaker = compLower.some(c => c === makerLower || c.includes(makerLower) || makerLower.includes(c));
          const hasModel = compLower.some(c => c === modelLower || c.includes(modelLower) || modelLower.includes(c));
          return hasMaker && hasModel;
        });
      });

      if (activeBikes.length > 0) {
        setMotorcycles(activeBikes);
      }
      setYears(getActiveYears(prods));
    };

    loadProductsAndBikes();
  }, []);

  // Listen to header garage state updates
  useEffect(() => {
    const handleGarageUpdate = () => {
      const saved = localStorage.getItem("rider_garage");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const match = MASTER_MOTORCYCLES.find(
            (b) => b.maker.toLowerCase() === parsed.maker.toLowerCase() && b.model.toLowerCase() === parsed.model.toLowerCase()
          );
          if (match) {
            setGarageBike({ ...match, year: parsed.year });
            setSelectedMaker(match.maker);
            setSelectedModel(match.model);
            setSelectedYear(parsed.year || "");
          }
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
    window.addEventListener("garage-updated", handleGarageUpdate);
    return () => {
      window.removeEventListener("garage-updated", handleGarageUpdate);
    };
  }, []);

  // Handle saving garage profile
  const handleSaveBike = (maker: string, model: string) => {
    const match = MASTER_MOTORCYCLES.find(
      (b) => b.maker.toLowerCase() === maker.toLowerCase() && b.model.toLowerCase() === model.toLowerCase()
    );
    if (match) {
      setGarageBike({ ...match, year: selectedYear || undefined });
      localStorage.setItem("rider_garage", JSON.stringify({ maker: match.maker, model: match.model, year: selectedYear || undefined }));
      window.dispatchEvent(new Event("garage-updated"));
      setShowConfigurator(false);
    }
  };

  const handleRemoveBike = () => {
    setGarageBike(null);
    setSelectedMaker("");
    setSelectedModel("");
    setSelectedYear("");
    localStorage.removeItem("rider_garage");
    window.dispatchEvent(new Event("garage-updated"));
  };

  // Toggle installation of a part (factors into dyno calculation)
  const toggleInstallation = (productId: string) => {
    setInstalledItems((prev) => 
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Calculate tuning improvements
  const getTuningEffects = () => {
    let totalHpGain = 0;
    let totalWeightSaved = 0;
    let totalSafety = 0;

    // Only count items in wishlist that are NOT yet fully installed but are marked "installing/planning" in builder
    // Or we can count all wishlist items that fit this bike
    wishlist.forEach((item) => {
      const fits = isProductCompatible(item);
      const isConfigured = installedItems.includes(item.id);
      
      if (fits && isConfigured) {
        const hp = parseFloat(String(item.metafields?.custom?.hp_gain ?? item.hp_gain ?? 0));
        const wt = parseFloat(String(item.metafields?.custom?.weight_saved ?? item.weight_saved ?? 0));
        const sf = parseFloat(String(item.metafields?.custom?.safety_rating ?? item.safety_rating ?? 0));
        totalHpGain += hp;
        totalWeightSaved += wt;
        totalSafety += sf;
      }
    });

    return {
      hpGain: totalHpGain,
      weightSaved: totalWeightSaved,
      safetyGained: totalSafety
    };
  };

  const isProductCompatible = (product: Product) => {
    return checkProductCompatibility(product, garageBike);
  };

  // Quick Add To Cart handler
  const handleQuickAdd = async (product: Product) => {
    const variant = product.variants[0];
    if (!variant) return;

    setAddingToCartId(product.id);
    addItem(product, variant, 1);
    setTimeout(() => setAddingToCartId(null), 1000);
  };

  // Add all active planned parts in build planner to cart
  const handleAddAllPlanned = () => {
    const plannedParts = wishlist.filter(item => isProductCompatible(item) && installedItems.includes(item.id));
    if (plannedParts.length === 0) return;

    setAddingAll(true);
    plannedParts.forEach((item) => {
      const variant = item.variants[0];
      if (variant) {
        addItem(item, variant, 1);
      }
    });

    setTimeout(() => {
      setAddingAll(false);
    }, 1500);
  };

  const { hpGain, weightSaved, safetyGained } = getTuningEffects();
  const currentHP = garageBike ? garageBike.stockHP + hpGain : 0;
  const currentWeight = garageBike ? garageBike.stockWeight - weightSaved : 0;

  // Mock recommendations (products that fit the bike but are not in wishlist/cart)
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      // Mock fetching compatible products not in wishlist
      const { getProducts } = await import("@/lib/shopify");
      const allProds = await getProducts();
      
      const filtered = allProds.filter((prod) => {
        // Not in wishlist
        const inWishlist = wishlist.some((w) => w.id === prod.id);
        if (inWishlist) return false;

        // Is compatible
        if (!garageBike) return true;
        const fullBikeName = `${garageBike.maker} ${garageBike.model}`;
        return (
          prod.compatibility.includes("All Motorcycles") ||
          prod.compatibility.some((bike) => bike.toLowerCase().trim() === fullBikeName.toLowerCase().trim()) ||
          prod.category === "Helmets" ||
          prod.category === "Riding Gear"
        );
      });
      
      setRecommendations(filtered.slice(0, 3));
    };

    fetchRecommendations();
  }, [garageBike, wishlist]);

  return (
    <div className="min-h-screen bg-brand-bg pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
          <div>
            <span className="text-[10px] font-headings font-extrabold tracking-[0.25em] text-brand-red uppercase block mb-1">
              Rider Profile Center
            </span>
            <h1 className="text-3xl sm:text-4xl font-headings font-extrabold text-brand-primary uppercase tracking-tight">
              RIDER GARAGE <span className="text-stroke">& BUILD PLANNER</span>
            </h1>
            <p className="text-brand-muted text-sm max-w-xl mt-2 font-body font-medium">
              Configure your project bike, plan modular upgrade phases, and analyze horsepower boosts and weight savings with real-time dyno mapping.
            </p>
          </div>

          {garageBike && (
            <button
              onClick={handleRemoveBike}
              className="text-xs font-bold text-brand-red uppercase tracking-wider hover:underline flex items-center gap-1.5 self-start md:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset Garage Profile
            </button>
          )}
        </div>

        {/* 1. SELECT BIKE STATE (EMPTY GARAGE) */}
        {!garageBike && !showConfigurator && (
          <div className="bg-white border border-brand-border rounded-xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-sm py-16">
            <div className="w-16 h-16 bg-[#F8F5F0] rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <Bike className="w-8 h-8 stroke-[1.2]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-headings font-extrabold text-brand-primary uppercase tracking-tight">
                No Motorcycle in Garage
              </h2>
              <p className="text-brand-muted text-sm max-w-sm mx-auto font-body">
                Select your machine to activate personalized performance suggestions and calculate horsepower increments for your upgrades.
              </p>
            </div>
            <button
              onClick={() => setShowConfigurator(true)}
              className="bg-brand-primary hover:bg-brand-red text-white py-3.5 px-6 font-headings text-xs font-bold uppercase tracking-widest transition-colors duration-300 shadow-md"
            >
              Select Motorcycle
            </button>
          </div>
        )}

        {/* 2. BIKE CONFIGURATOR DIALOG / SCREEN */}
        {(showConfigurator || (!garageBike && showConfigurator)) && (
          <div className="bg-white border border-brand-border rounded-xl p-8 max-w-2xl mx-auto shadow-md mb-10 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-brand-border">
              <h3 className="font-headings font-extrabold text-md uppercase text-brand-primary flex items-center gap-2">
                <Bike className="w-5 h-5 text-brand-red" /> Select Active Project Bike
              </h3>
              {garageBike && (
                <button 
                  onClick={() => setShowConfigurator(false)}
                  className="text-brand-muted hover:text-brand-primary text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-headings font-extrabold uppercase tracking-wider text-brand-muted mb-2">
                  1. Choose Brand
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {Array.from(new Set(motorcycles.map(b => b.maker))).map((maker) => (
                    <button
                      key={maker}
                      onClick={() => {
                        setSelectedMaker(maker);
                        setSelectedModel("");
                        setSelectedYear("");
                      }}
                      className={`py-3 px-4 border rounded-lg text-center transition-all ${
                        selectedMaker === maker
                          ? "border-brand-primary bg-brand-bg text-brand-primary font-bold ring-1 ring-brand-primary"
                          : "border-brand-border text-brand-muted hover:border-brand-primary hover:text-brand-primary bg-white"
                      }`}
                    >
                      {maker}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-headings font-extrabold uppercase tracking-wider text-brand-muted mb-2">
                  2. Choose Model
                </label>
                <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                  {!selectedMaker ? (
                    <div className="h-28 border border-dashed border-brand-border rounded-lg flex items-center justify-center text-brand-muted italic text-[11px]">
                      Select maker first...
                    </div>
                  ) : (
                    motorcycles.filter(b => b.maker === selectedMaker).map((bike) => (
                      <button
                        key={bike.model}
                        onClick={() => {
                          setSelectedModel(bike.model);
                          setSelectedYear("");
                        }}
                        className={`py-3 px-4 border rounded-lg text-left flex justify-between items-center transition-all ${
                          selectedModel === bike.model
                            ? "border-brand-primary bg-brand-bg text-brand-primary font-bold ring-1 ring-brand-primary"
                            : "border-brand-border text-brand-muted hover:border-brand-primary hover:text-brand-primary bg-white"
                        }`}
                      >
                        <span>{bike.model}</span>
                        <span className="text-[10px] text-brand-muted normal-case font-normal">{bike.engine}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-headings font-extrabold uppercase tracking-wider text-brand-muted mb-2">
                  3. Choose Year (Optional)
                </label>
                <div>
                  <select
                    value={selectedYear}
                    disabled={!selectedModel}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-white border border-brand-border rounded-lg p-3 text-xs font-semibold focus:outline-none focus:border-brand-primary text-brand-primary disabled:opacity-40"
                  >
                    <option value="">Select Year (Optional)</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border flex gap-3">
              <button
                onClick={() => handleSaveBike(selectedMaker, selectedModel)}
                disabled={!selectedMaker || !selectedModel}
                className="flex-1 bg-brand-primary hover:bg-brand-red text-white py-3 px-6 font-headings text-xs font-bold uppercase tracking-widest disabled:opacity-40 transition-colors"
              >
                Confirm Setup
              </button>
            </div>
          </div>
        )}

        {/* 3. CORE GARAGE DASHBOARD */}
        {garageBike && !showConfigurator && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: Bike Summary Card & Interactive Dyno Gauge */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Bike Details Summary */}
              <div className="bg-white border border-brand-border p-6 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-8 -bottom-8 opacity-5 text-brand-primary pointer-events-none">
                  <Bike className="w-48 h-48 stroke-[1]" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-brand-red uppercase tracking-widest block">
                        Project Build Profile
                      </span>
                      <h2 className="text-2xl font-headings font-extrabold text-brand-primary uppercase tracking-tight mt-1">
                        {garageBike.maker} <span className="text-stroke">{garageBike.model}</span>{garageBike.year ? ` (${garageBike.year})` : ""}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowConfigurator(true)}
                      className="text-[10px] font-bold bg-[#F8F5F0] hover:bg-brand-primary hover:text-white px-2.5 py-1.5 rounded transition-all font-headings uppercase tracking-wider"
                    >
                      Change Bike
                    </button>
                  </div>

                  <div className="border-t border-brand-border pt-4 grid grid-cols-2 gap-4 text-xs font-body">
                    <div>
                      <span className="text-brand-muted block font-semibold">Engine Config</span>
                      <span className="text-brand-primary font-bold">{garageBike.engine}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted block font-semibold">Stock Output</span>
                      <span className="text-brand-primary font-bold">{garageBike.stockHP} HP @ Crank</span>
                    </div>
                    <div>
                      <span className="text-brand-muted block font-semibold">Stock Dry Weight</span>
                      <span className="text-brand-primary font-bold">{garageBike.stockWeight} kg</span>
                    </div>
                    <div>
                      <span className="text-brand-muted block font-semibold">Compatible Upgrades</span>
                      <span className="text-brand-primary font-bold text-brand-red">Active & Fitted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIVE DYNO PERFORMANCE ANALYZER */}
              <div className="bg-brand-footer text-white p-6 md:p-8 rounded-xl shadow-lg space-y-6 relative overflow-hidden">
                <div className="absolute right-4 top-4 bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 rounded text-[8px] font-bold text-brand-red uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current text-brand-red animate-pulse" /> Live Dyno Map
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-headings font-extrabold text-xs tracking-wider uppercase text-gray-400">
                    Calculated Power-to-Weight Spec
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium">
                    (Updates dynamically as you check parts in the Build Checklist below)
                  </p>
                </div>

                {/* Dynamic SVG Gauges */}
                <div className="flex flex-col sm:flex-row justify-around items-center gap-8 py-4">
                  {/* HP Output Gauge */}
                  <div className="relative flex flex-col items-center">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      {/* Background circle track */}
                      <circle cx="50" cy="50" r="40" stroke="#2D231B" strokeWidth="6" fill="none" />
                      {/* Active level circle track */}
                      <circle 
                        cx="50" cy="50" r="40" 
                        stroke="#B91C1C" strokeWidth="6" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(1, currentHP / 60))}`}
                        className="transition-all duration-1000 ease-out"
                        transform="rotate(-90 50 50)"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                      <span className="text-2xl font-headings font-extrabold text-white leading-none">
                        {currentHP.toFixed(1)}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mt-1">HP Output</span>
                    </div>
                    {hpGain > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400 mt-2 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded">
                        +{hpGain.toFixed(1)} HP Gain
                      </span>
                    )}
                  </div>

                  {/* Weight Saver Gauge */}
                  <div className="relative flex flex-col items-center">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#2D231B" strokeWidth="6" fill="none" />
                      <circle 
                        cx="50" cy="50" r="40" 
                        stroke="#D97706" strokeWidth="6" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        // Inverse offset since lower weight is better
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(1, currentWeight / 220))}`}
                        className="transition-all duration-1000 ease-out"
                        transform="rotate(-90 50 50)"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                      <span className="text-2xl font-headings font-extrabold text-white leading-none">
                        {currentWeight.toFixed(1)}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mt-1">Weight kg</span>
                    </div>
                    {weightSaved > 0 && (
                      <span className="text-[10px] font-bold text-amber-400 mt-2 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded">
                        -{weightSaved.toFixed(2)} kg Saved
                      </span>
                    )}
                  </div>
                </div>

                {/* Custom tuning notes based on configuration */}
                <div className="bg-[#1C1510] border border-white/5 p-4 rounded-lg text-xs space-y-2 font-body text-gray-300">
                  <div className="flex gap-2 items-start">
                    <Info className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      {hpGain === 0 ? (
                        <p>No engine upgrades active in build. Check items in the build planner to see dyno changes.</p>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-semibold text-white">Stage 1 Tuning Active:</p>
                          <p className="text-[11px] leading-relaxed">
                            Adding a high-flow air filter and FuelX optimization remaps the fuel map. Experience a 
                            smoother low-end torque curve, cooler engine temperatures, and snappier throttle feedback.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {safetyGained > 0 && (
                    <div className="flex gap-2 items-start pt-2 border-t border-white/5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-emerald-400 font-semibold text-[11px]">
                        Rider Safety Factor Increased by +{safetyGained}% (Premium Certified Gear)
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: Wishlist & Project Phase Planner Table */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Build Phases list */}
              <div className="bg-white border border-brand-border p-6 md:p-8 rounded-xl shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-border">
                  <div>
                    <h3 className="font-headings font-extrabold text-lg uppercase text-brand-primary tracking-tight">
                      PROJECT BUILD PLANNER
                    </h3>
                    <p className="text-brand-muted text-xs font-body font-semibold uppercase mt-0.5 tracking-wider">
                      Active wishlist upgrades for your {garageBike.maker} {garageBike.model}
                    </p>
                  </div>

                  {wishlist.filter(isProductCompatible).length > 0 && (
                    <button
                      onClick={handleAddAllPlanned}
                      disabled={addingAll || installedItems.length === 0}
                      className="bg-brand-primary hover:bg-brand-red disabled:bg-brand-muted text-white text-xs font-bold font-headings uppercase py-2.5 px-4 rounded tracking-wider transition-all duration-300 flex items-center gap-1.5"
                    >
                      {addingAll ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ADDING BUNDLE...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" /> Add Selected Upgrade Phase to Cart
                        </>
                      )}
                    </button>
                  )}
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-16 space-y-4 font-body">
                    <Heart className="w-12 h-12 text-brand-muted mx-auto stroke-[1.2]" />
                    <h4 className="text-brand-primary font-bold font-headings uppercase text-sm">Build checklist is empty</h4>
                    <p className="text-brand-muted text-xs max-w-sm mx-auto">
                      Explore the shop catalog and hit the heart icon on performance components or gear to add them to your custom builder.
                    </p>
                    <Link
                      href="/collections/performance-air-filters"
                      className="inline-block bg-[#1E1E1E] text-white hover:bg-brand-red text-xs font-bold font-headings py-2.5 px-5 uppercase tracking-wider transition-colors"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : wishlist.filter(isProductCompatible).length === 0 ? (
                  <div className="p-5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold uppercase tracking-wider text-amber-900 font-headings">Compatibility Conflict</h4>
                      <p className="font-body text-[11px] leading-relaxed">
                        You have {wishlist.length} item{wishlist.length > 1 ? "s" : ""} in your wishlist, but none are configured to fit your active {garageBike.maker} {garageBike.model}. 
                        Change your garage bike or browse collections for matching parts!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* List Grid */}
                    <div className="divide-y divide-brand-border">
                      {wishlist.filter(isProductCompatible).map((item) => {
                        const isInstalledInBuilder = installedItems.includes(item.id);
                        const hp = parseFloat(String(item.metafields?.custom?.hp_gain ?? item.hp_gain ?? 0));
                        const wt = parseFloat(String(item.metafields?.custom?.weight_saved ?? item.weight_saved ?? 0));
                        const variant = item.variants[0];

                        return (
                          <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            
                            {/* Left Side: Thumbnail, Title, Spec metrics */}
                            <div className="flex gap-4 min-w-0">
                              <div className="relative w-16 h-16 bg-[#F3F3F0] rounded overflow-hidden flex-shrink-0 border border-brand-border">
                                <Image
                                  src={item.images[0]?.url || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=300"}
                                  alt={item.title}
                                  fill
                                  className="object-contain p-2"
                                  sizes="64px"
                                />
                              </div>

                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-brand-red uppercase tracking-wider block">
                                  {item.brand}
                                </span>
                                <h4 className="font-headings font-extrabold text-sm text-brand-primary uppercase truncate group-hover:text-brand-red transition-colors">
                                  <Link href={`/products/${item.handle}`}>{item.title}</Link>
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wide">
                                    <Check className="w-3 h-3" /> Compatible
                                  </span>
                                  {(hp > 0 || wt > 0) && (
                                    <span className="text-[9.5px] text-brand-muted font-body font-semibold">
                                      ({hp > 0 ? `+${hp} HP` : ""}{hp > 0 && wt > 0 ? " • " : ""}{wt > 0 ? `-${wt} kg` : ""})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Checkbox to Include in Dyno, Price, Add, Remove */}
                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-brand-border">
                              
                              {/* Dyno toggle */}
                              <div className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  id={`install-${item.id}`}
                                  checked={isInstalledInBuilder}
                                  onChange={() => toggleInstallation(item.id)}
                                  className="rounded border-brand-border text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                                />
                                <label 
                                  htmlFor={`install-${item.id}`} 
                                  className="text-[10px] font-headings font-bold text-brand-muted uppercase tracking-wider cursor-pointer hover:text-brand-primary"
                                >
                                  Tuning Build
                                </label>
                              </div>

                              <div className="text-right">
                                <span className="block text-xs text-brand-muted font-medium">Estimated</span>
                                <span className="font-bold text-sm text-brand-primary">
                                  ₹{parseInt(variant?.price.amount || item.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleQuickAdd(item)}
                                  disabled={addingToCartId === item.id}
                                  className="p-2.5 bg-[#1E1E1E] text-white hover:bg-brand-red rounded transition-colors disabled:opacity-40"
                                  title="Add Part to Cart"
                                >
                                  {addingToCartId === item.id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <ShoppingCart className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="p-2.5 border border-brand-border text-brand-muted hover:text-brand-red bg-white hover:bg-red-50 rounded transition-colors"
                                  title="Remove from Build"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                            </div>

                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 bg-brand-bg rounded-lg border border-brand-border text-[11px] font-body text-brand-muted leading-relaxed flex gap-2">
                      <Info className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                      <p>
                        Check the **Tuning Build** box on any compatible item to include its power boosts and weight reductions in the dynamic gauge statistics. Click the cart icon to purchase individually, or add the entire custom build at once.
                      </p>
                    </div>

                  </div>
                )}
              </div>

              {/* RECOMMENDED PERFORMANCE UPGRADES */}
              {recommendations.length > 0 && (
                <div className="bg-white border border-brand-border p-6 md:p-8 rounded-xl shadow-sm space-y-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block">
                      Recommended Upgrades
                    </span>
                    <h3 className="text-md font-headings font-extrabold text-brand-primary uppercase tracking-tight">
                      Fitted For Your {garageBike.maker} {garageBike.model}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map((prod) => (
                      <div 
                        key={prod.id}
                        className="group flex flex-col border border-brand-border bg-brand-bg rounded-lg p-3 relative"
                      >
                        <div className="relative aspect-square w-full bg-white rounded overflow-hidden border border-brand-border mb-3">
                          <Image
                            src={prod.images[0]?.url}
                            alt={prod.title}
                            fill
                            className="object-contain p-3 transition-transform group-hover:scale-105"
                            sizes="120px"
                          />
                        </div>
                        
                        <div className="flex-grow flex flex-col">
                          <span className="text-[8px] font-bold text-brand-red uppercase tracking-wider">
                            {prod.brand}
                          </span>
                          <h4 className="font-headings font-bold text-xs text-brand-primary line-clamp-1 group-hover:text-brand-red transition-colors mt-0.5">
                            <Link href={`/products/${prod.handle}`}>{prod.title}</Link>
                          </h4>
                          
                          <div className="mt-auto pt-2 flex justify-between items-center text-[10px] border-t border-brand-border border-dashed">
                            <span className="font-bold text-brand-primary">
                              ₹{parseInt(prod.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                            </span>
                            
                            <Link
                              href={`/products/${prod.handle}`}
                              className="text-brand-red hover:underline font-extrabold uppercase flex items-center gap-0.5"
                            >
                              Configure <ArrowUpRight className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
