"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, User, ShoppingBag, Menu, X, ChevronDown, 
  ArrowRight, ShieldCheck, Wrench, Trash2, Plus, Bike, Check, Heart
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { getCollections, getProducts, Collection, Product, getActiveMotorcycleGroups, getActiveYears } from "@/lib/shopify";

export default function Header() {
  const { setIsOpen: openCart, cartCount, clearCart } = useCart();
  const { wishlist } = useWishlist();
  const { user, signIn, signUp, signOut, error: authError, clearError } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Dialog & drawer states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isGarageOpen, setIsGarageOpen] = useState(false);

  // Auth form states inside the drawer
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Rider Garage states
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string; year?: string } | null>(null);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [motorcycles, setMotorcycles] = useState<{ maker: string; models: string[] }[]>([
    { maker: "KTM", models: ["Duke 390", "RC 390"] },
    { maker: "Royal Enfield", models: ["Himalayan 450", "Interceptor 650", "Continental GT 650"] }
  ]);
  const [years, setYears] = useState<string[]>(["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"]);

  // Fetch collections & products
  useEffect(() => {
    const loadData = async () => {
      const cols = await getCollections();
      setCollections(cols);
      const prods = await getProducts();
      setAllProducts(prods);
      setMotorcycles(getActiveMotorcycleGroups(prods));
      setYears(getActiveYears(prods));
    };
    loadData();
  }, []);

  // Load selected bike from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("rider_garage");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.maker && parsed.model) {
          setGarageBike(parsed);
          setSelectedMaker(parsed.maker);
          setSelectedModel(parsed.model);
          setSelectedYear(parsed.year || "");
        }
      } catch (e) {
        console.error("Failed to parse garage cache", e);
      }
    }

    // Listen for fitment updates from other pages
    const handleGarageUpdate = () => {
      const savedUpdate = localStorage.getItem("rider_garage");
      if (savedUpdate) {
        try {
          const parsed = JSON.parse(savedUpdate);
          setGarageBike(parsed);
          setSelectedMaker(parsed.maker);
          setSelectedModel(parsed.model);
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

    window.addEventListener("garage-updated", handleGarageUpdate);
    return () => {
      window.removeEventListener("garage-updated", handleGarageUpdate);
    };
  }, []);

  // Real-time search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery, allProducts]);

  // Reset overlay panels on page change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
    setIsGarageOpen(false);
    setSearchQuery("");
    // Reset auth form fields
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setFormError(null);
    setAuthMode("login");
    clearError();
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections/performance-air-filters?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const handleSaveGarage = () => {
    if (selectedMaker && selectedModel) {
      const bike = { maker: selectedMaker, model: selectedModel, year: selectedYear || undefined };
      setGarageBike(bike);
      localStorage.setItem("rider_garage", JSON.stringify(bike));
      setIsGarageOpen(false);
      window.dispatchEvent(new Event("garage-updated"));
    }
  };

  const handleClearGarage = () => {
    setGarageBike(null);
    setSelectedMaker("");
    setSelectedModel("");
    setSelectedYear("");
    localStorage.removeItem("rider_garage");
    setIsGarageOpen(false);
    window.dispatchEvent(new Event("garage-updated"));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    clearError();

    if (authMode === "login") {
      if (!email || !password) {
        setFormError("Please fill in all fields.");
        setSubmitting(false);
        return;
      }
      const success = await signIn(email, password);
      if (success) {
        setEmail("");
        setPassword("");
      }
    } else {
      if (!firstName || !lastName || !email || !password) {
        setFormError("Please fill in all fields.");
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setFormError("Password must be at least 6 characters.");
        setSubmitting(false);
        return;
      }
      const success = await signUp(firstName, lastName, email, password);
      if (success) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* Top Banner & Header Wrapper (Sticky) */}
      <div className="fixed top-0 left-0 right-0 z-40 flex flex-col shadow-lg">
        
        {/* Top Ticker Banner */}
        <div className="bg-[#0A0A0A] text-gray-300 py-2.5 px-4 text-[9px] font-headings font-extrabold uppercase tracking-[0.25em] text-center border-b border-white/5 flex items-center justify-center gap-6">
          <span>FREE SHIPPING ON PREPAID ORDERS</span>
          <span className="hidden sm:inline text-brand-red">•</span>
          <span className="hidden sm:inline">CERTIFIED PERFORMANCE GUARANTEE</span>
        </div>

        {/* Main Navigation Header (Premium Off-White Glassmorphic Panel) */}
        <header className="bg-white/80 backdrop-blur-md border-b border-black/10 text-gray-900 h-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            
            {/* Left Box: Logo */}
            <div className="h-full flex items-center pr-2 sm:pr-6 lg:pr-8 md:border-r md:border-black/10">
              <Link href="/" className="flex items-center">
                {/* CSS wrapper to crop transparent boundaries of 1024x1024 square image */}
                <div className="relative w-28 h-12 sm:w-40 sm:h-16 overflow-hidden flex items-center justify-center">
                  <div className="absolute w-[150px] h-[150px] sm:w-[220px] sm:h-[220px] flex items-center justify-center">
                    <Image
                      src="/imhlogo.png"
                      alt="IRANI MOTOHUB Logo"
                      width={220}
                      height={220}
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center h-full flex-grow px-8 gap-8">
              {/* Shop Link (Mega Menu Trigger) */}
              <div className="group h-full flex items-center relative">
                <button className="flex items-center gap-1 font-body text-xs font-bold uppercase tracking-widest text-gray-850 hover:text-brand-red transition-colors h-full">
                  Shop
                  <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Sliding active top border indicator */}
                <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-brand-red transition-all duration-300" />

                {/* Desktop Mega Menu Dropdown */}
                <div className="absolute top-full left-0 pt-0 hidden group-hover:block w-[880px] z-50">
                  <div className="bg-white/95 backdrop-blur-md border border-black/10 shadow-2xl p-8 grid grid-cols-12 gap-8 rounded-b-lg text-gray-900">
                    
                    {/* Catalog collections columns */}
                    <div className="col-span-8 grid grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <h4 className="font-headings font-extrabold text-[10px] tracking-[0.2em] text-brand-red uppercase">
                          Performance & Tuning
                        </h4>
                        <ul className="space-y-4 text-xs font-semibold text-gray-600">
                          {collections
                            .filter((col) =>
                              ["performance-air-filters", "engine-performance", "ecu-tuners-piggybacks", "bike-care"].includes(col.handle)
                            )
                            .map((col) => (
                              <li key={col.id} className="group/item">
                                <Link
                                  href={`/collections/${col.handle}`}
                                  className="hover:text-brand-red transition-colors block"
                                >
                                  <span>{col.title}</span>
                                  <span className="block text-[10px] text-gray-500 font-normal mt-0.5 normal-case font-body">
                                    {col.handle === "performance-air-filters" ? "BMC & K&N Italian high-flow race upgrades." : 
                                     (col.handle === "engine-performance" || col.handle === "ecu-tuners-piggybacks") ? "FuelX ECU piggyback tuning maps." : "Premium lubricants & chain care sprays."}
                                  </span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-5">
                        <h4 className="font-headings font-extrabold text-[10px] tracking-[0.2em] text-brand-red uppercase">
                          Riding Gear & Protection
                        </h4>
                        <ul className="space-y-4 text-xs font-semibold text-gray-600">
                          {collections
                            .filter((col) =>
                              ["riding-gear", "technical-apparel-gear", "touring-accessories", "touring-gear"].includes(col.handle)
                            )
                            .map((col) => (
                              <li key={col.id} className="group/item">
                                <Link
                                  href={`/collections/${col.handle}`}
                                  className="hover:text-brand-red transition-colors block"
                                >
                                  <span>{col.title}</span>
                                  <span className="block text-[10px] text-gray-500 font-normal mt-0.5 normal-case font-body">
                                    {(col.handle === "riding-gear" || col.handle === "technical-apparel-gear") ? "Abrasion-resistant jackets, gloves and boots." :
                                     "Viaterra adventure waterproof saddlebags."}
                                  </span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Visual Spotlight Banner */}
                    <div className="col-span-4 bg-gray-50 border border-black/5 p-5 rounded-lg flex flex-col justify-between relative overflow-hidden group/spot">
                      <div className="relative w-full h-28 bg-white border border-black/5 rounded mb-3 overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?q=80&w=300&auto=format&fit=crop"
                          alt="Featured Product Spotlight"
                          fill
                          className="object-contain p-2 group-hover/spot:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h5 className="font-headings font-extrabold text-xs text-gray-900 uppercase tracking-wider mb-1">
                          BMC Italian Filters
                        </h5>
                        <p className="text-gray-600 text-[10px] leading-relaxed font-body">
                          Formula 1 spec air filtration now in stock for all Indian performance singles.
                        </p>
                      </div>
                      <Link
                        href="/collections/performance-air-filters"
                        className="text-brand-red font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:gap-2 transition-all mt-4"
                      >
                        Browse Filters <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

              <a
                href="#brands-section"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    document.getElementById("brands-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="font-body text-xs font-bold uppercase tracking-widest text-gray-800 hover:text-brand-red transition-colors h-full flex items-center relative group"
              >
                Brands
                <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-brand-red transition-all duration-300" />
              </a>

              <Link
                href="/about"
                className="font-body text-xs font-bold uppercase tracking-widest text-gray-800 hover:text-brand-red transition-colors h-full flex items-center relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-brand-red transition-all duration-300" />
              </Link>

              <a
                href="#footer-section"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    document.getElementById("footer-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="font-body text-xs font-bold uppercase tracking-widest text-gray-800 hover:text-brand-red transition-colors h-full flex items-center relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-brand-red transition-all duration-300" />
              </a>
            </nav>            {/* Middle/Right Box: Active Rider Garage Pill */}
            <div className="hidden lg:flex items-center h-full px-6 border-l border-black/10 relative">
              <button 
                onClick={() => setIsGarageOpen(!isGarageOpen)}
                className={`flex items-center gap-2.5 px-4 py-2 border rounded-full text-xs font-headings font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  garageBike 
                    ? "bg-brand-red/5 border-brand-red/30 text-brand-red hover:bg-brand-red/10" 
                    : "bg-black/5 border-black/10 text-gray-700 hover:bg-black/10 hover:text-black"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>
                  {garageBike ? `Garage: ${garageBike.maker} ${garageBike.model}${garageBike.year ? ` (${garageBike.year})` : ""}` : "Select Motorcycle"}
                </span>
                {/* Live Status indicator light */}
                <span className={`w-1.5 h-1.5 rounded-full ${garageBike ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`} />
              </button>

              {/* Rider Garage Dialog Dropdown */}
              <AnimatePresence>
                {isGarageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-6 mt-2 w-80 bg-white border border-black/10 shadow-2xl p-5 rounded-lg text-gray-900 z-50 space-y-4"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-black/5">
                      <span className="text-[10px] font-headings font-bold uppercase tracking-wider text-gray-500">
                        Rider Garage Setup
                      </span>
                      <button 
                        onClick={() => setIsGarageOpen(false)}
                        className="text-gray-500 hover:text-black"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selector Selectors */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-gray-500 mb-1">
                          Motorcycle Manufacturer
                        </label>
                        <select
                          value={selectedMaker}
                          onChange={(e) => {
                            setSelectedMaker(e.target.value);
                            setSelectedModel("");
                            setSelectedYear("");
                          }}
                          className="w-full bg-gray-50 border border-black/10 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-red text-gray-900"
                        >
                          <option value="">Choose Maker</option>
                          {motorcycles.map((m) => (
                            <option key={m.maker} value={m.maker}>{m.maker}</option>
                          ))}
                        </select>
                      </div>
 
                      <div>
                        <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-gray-500 mb-1">
                          Model Designation
                        </label>
                        <select
                          value={selectedModel}
                          disabled={!selectedMaker}
                          onChange={(e) => {
                            setSelectedModel(e.target.value);
                            setSelectedYear("");
                          }}
                          className="w-full bg-gray-50 border border-black/10 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-red text-gray-900 disabled:opacity-40"
                        >
                          <option value="">Choose Model</option>
                          {motorcycles.find((m) => m.maker === selectedMaker)?.models.map((mod) => (
                            <option key={mod} value={mod}>{mod}</option>
                          ))}
                        </select>
                      </div>
 
                      <div>
                        <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-gray-500 mb-1">
                          Model Year
                        </label>
                        <select
                          value={selectedYear}
                          disabled={!selectedModel}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="w-full bg-gray-50 border border-black/10 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-red text-gray-900 disabled:opacity-40"
                        >
                          <option value="">Choose Year (Optional)</option>
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Form Controls */}
                    <div className="flex gap-2.5 pt-2">
                      <button
                        onClick={handleSaveGarage}
                        disabled={!selectedMaker || !selectedModel}
                        className="flex-1 bg-brand-red hover:bg-red-700 text-white py-2 px-3 rounded text-[10px] font-headings font-bold uppercase tracking-wider transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Save Bike
                      </button>
                      {garageBike && (
                        <button
                          onClick={handleClearGarage}
                          className="bg-black/5 hover:bg-black/10 text-gray-600 hover:text-black p-2 rounded transition-colors"
                          title="Clear Garage Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {garageBike && (
                      <div className="pt-3 border-t border-black/5 text-center">
                        <Link
                          href="/garage"
                          onClick={() => setIsGarageOpen(false)}
                          className="text-[10px] font-bold text-brand-red uppercase tracking-wider hover:underline flex items-center justify-center gap-1"
                        >
                          Configure Custom Build <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Box: Action Icons */}
            <div className="h-full flex-shrink-0 flex items-center pl-2 sm:pl-6 lg:pl-8 border-l border-black/10 gap-1 sm:gap-4">
              
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Open Search Catalog"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Garage Build/Wishlist Icon Link */}
              <Link
                href="/garage"
                className="p-2 text-gray-700 hover:text-black transition-colors relative flex items-center"
                aria-label="View Garage Dashboard"
              >
                <Heart className="w-4.5 h-4.5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Toggle */}
              <button
                onClick={() => setIsAccountOpen(true)}
                className="p-1 text-gray-700 hover:text-black transition-colors hidden sm:flex items-center justify-center"
                aria-label="Open Account Portal"
              >
                {user ? (
                  <span className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] font-headings font-extrabold uppercase tracking-tight shadow-md border border-brand-red/10 hover:scale-105 transition-transform duration-200">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                ) : (
                  <User className="w-4.5 h-4.5" />
                )}
              </button>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={() => openCart(true)}
                className="p-2 text-gray-700 hover:text-black transition-colors relative"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-700 hover:text-black transition-colors md:hidden"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-5.5 h-5.5" />
              </button>
            </div>

          </div>
        </header>
      </div>

      {/* Real-time Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-start pt-28 px-4"
          >
            <div className="max-w-2xl mx-auto w-full bg-[#181818] border border-white/10 rounded-lg shadow-2xl p-6 relative text-white">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
                aria-label="Close search overlay"
              >
                <X className="w-6 h-6" />
              </button>

              <form onSubmit={handleSearchSubmit} className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search filters, ECU tuners, riding gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-red text-sm font-body"
                  autoFocus
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </form>

              {/* Instant Product Match Previews */}
              {searchResults.length > 0 && (
                <div className="mt-6 space-y-4 border-t border-white/10 pt-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Instant Product Matches
                  </h4>
                  <div className="divide-y divide-white/5">
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.handle}`}
                        className="flex items-center gap-4 py-3 group"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <div className="w-12 h-12 relative bg-[#121212] rounded overflow-hidden flex-shrink-0 border border-white/5">
                          <Image
                            src={prod.images[0]?.url}
                            alt={prod.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-brand-red font-bold uppercase tracking-wider text-[9px] mb-0.5">
                            {prod.brand}
                          </p>
                          <h5 className="text-sm font-bold text-white truncate group-hover:text-brand-red transition-colors">
                            {prod.title}
                          </h5>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          ₹{parseInt(prod.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="mt-6 text-center py-6 text-gray-500 text-sm">
                  No matching performance products found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Panel Drawer (Rider Dashboard) */}
      <AnimatePresence>
        {isAccountOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccountOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-[#121212] text-white shadow-2xl z-50 flex flex-col border-l border-white/10"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#181818]">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-red" />
                  <h3 className="text-md font-headings font-extrabold text-white tracking-tight">
                    RIDER DASHBOARD
                  </h3>
                </div>
                <button
                  onClick={() => setIsAccountOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                  aria-label="Close dashboard"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {user ? (
                  // LOGGED IN: Rider Dashboard
                  <div className="space-y-6">
                    {/* Rider Info Card */}
                    <div className="border border-white/5 p-5 rounded-lg bg-[#181818] flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-red text-white font-headings font-extrabold flex items-center justify-center text-lg">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <h4 className="font-headings font-extrabold text-sm text-white">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-xs text-gray-400 font-body">{user.email}</p>
                      </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-headings font-extrabold text-[10px] tracking-wider text-gray-400 uppercase">
                          RECENT GARAGE SHIPMENTS
                        </h5>
                        <Link
                          href="/account"
                          onClick={() => setIsAccountOpen(false)}
                          className="text-[9px] font-bold text-brand-red uppercase tracking-wider hover:underline"
                        >
                          View All
                        </Link>
                      </div>

                      {user.orders && user.orders.length > 0 ? (
                        <div className="border border-white/5 rounded divide-y divide-white/5 bg-[#181818] text-xs">
                          {user.orders.slice(0, 3).map((order) => (
                            <div key={order.id} className="p-4 space-y-2">
                              <div className="flex justify-between font-semibold">
                                <span>#{order.orderNumber}</span>
                                <span className={`font-bold uppercase tracking-wider text-[9px] flex items-center gap-1 ${
                                  order.fulfillmentStatus.toUpperCase() === "FULFILLED" || order.fulfillmentStatus.toUpperCase() === "DELIVERED"
                                    ? "text-emerald-500"
                                    : "text-amber-500"
                                }`}>
                                  {order.fulfillmentStatus.toUpperCase() === "FULFILLED" || order.fulfillmentStatus.toUpperCase() === "DELIVERED" ? (
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                  ) : null}
                                  {order.fulfillmentStatus}
                                </span>
                              </div>
                              <p className="text-gray-400 font-body truncate">
                                {order.lineItems.map((item) => `${item.title} x${item.quantity}`).join(", ")}
                              </p>
                              <div className="flex justify-between text-[9.5px] text-gray-500">
                                <span>{new Date(order.processedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <span className="font-semibold text-white">₹{parseFloat(order.totalPrice.amount).toLocaleString("en-IN")}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-white/5 border-dashed p-6 rounded-lg text-center bg-[#181818]/30">
                          <p className="text-xs text-gray-400">No recent shipments found.</p>
                          <button
                            onClick={() => {
                              setIsAccountOpen(false);
                              router.push("/collections/performance-air-filters");
                            }}
                            className="mt-3 text-[10px] font-bold text-brand-red uppercase tracking-wider hover:underline"
                          >
                            Explore Performance Upgrades
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // LOGGED OUT: Beautiful Tabbed Authentication Forms
                  <div className="space-y-6">
                    {/* Tab Selection */}
                    <div className="grid grid-cols-2 border-b border-white/10 pb-1">
                      <button
                        onClick={() => {
                          setAuthMode("login");
                          setFormError(null);
                          clearError();
                        }}
                        className={`pb-2.5 text-xs font-headings font-extrabold uppercase tracking-wider text-center transition-colors ${
                          authMode === "login"
                            ? "text-brand-red border-b-2 border-brand-red"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        SIGN IN
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode("signup");
                          setFormError(null);
                          clearError();
                        }}
                        className={`pb-2.5 text-xs font-headings font-extrabold uppercase tracking-wider text-center transition-colors ${
                          authMode === "signup"
                            ? "text-brand-red border-b-2 border-brand-red"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        CREATE ACCOUNT
                      </button>
                    </div>

                    {/* Display Errors */}
                    {(formError || authError) && (
                      <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 rounded text-xs font-semibold">
                        {formError || authError}
                      </div>
                    )}

                    {/* Form Fields */}
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      {authMode === "signup" && (
                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="Rider"
                              className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-brand-red font-body"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Singh"
                              className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-brand-red font-body"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.name@rider.in"
                          className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-brand-red font-body"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-headings font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-brand-red font-body"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-brand-red hover:bg-red-700 text-white py-3 rounded text-[10px] font-headings font-bold uppercase tracking-wider transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 mt-2 shadow-lg shadow-brand-red/10"
                      >
                        {submitting ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : authMode === "login" ? (
                          "Sign In to Hub"
                        ) : (
                          "Register Account"
                        )}
                      </button>
                    </form>

                    <div className="text-center pt-2">
                      <p className="text-[10px] text-gray-400 font-body">
                        {authMode === "login" ? (
                          <>
                            Don&apos;t have an account?{" "}
                            <button
                              onClick={() => {
                                setAuthMode("signup");
                                setFormError(null);
                                clearError();
                              }}
                              className="text-brand-red hover:underline font-bold"
                            >
                              Create one
                            </button>
                          </>
                        ) : (
                          <>
                            Already registered?{" "}
                            <button
                              onClick={() => {
                                setAuthMode("login");
                                setFormError(null);
                                clearError();
                              }}
                              className="text-brand-red hover:underline font-bold"
                            >
                              Sign in instead
                            </button>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-[#181818] text-center">
                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      clearCart();
                      setIsAccountOpen(false);
                    }}
                    className="text-xs font-bold text-brand-red uppercase tracking-wider hover:underline"
                  >
                    Sign Out from Hub
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAccountOpen(false)}
                    className="text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Continue Browsing
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-[320px] bg-[#121212] text-white shadow-2xl z-50 flex flex-col border-r border-white/10"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#181818]">
                <span className="font-headings font-extrabold text-lg tracking-tight text-white">
                  MENU
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                  aria-label="Close mobile navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {/* Mobile Rider Garage select */}
                <div className="border border-white/5 p-4 rounded-lg bg-[#181818] space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-headings font-bold uppercase tracking-wider text-brand-red flex items-center gap-1.5">
                      <Bike className="w-3.5 h-3.5" /> Mobile Garage
                    </span>
                    {garageBike && (
                      <button 
                        onClick={handleClearGarage}
                        className="text-[9px] uppercase tracking-wider text-gray-500 hover:text-white font-bold"
                      >
                        Reset
                      </button>
                    )}
                                    <div className="space-y-2">
                    <select
                      value={selectedMaker}
                      onChange={(e) => {
                        setSelectedMaker(e.target.value);
                        setSelectedModel("");
                        setSelectedYear("");
                      }}
                      className="w-full bg-[#121212] border border-white/10 rounded px-2 py-1.5 text-xs font-semibold text-white focus:outline-none"
                    >
                      <option value="">Select Maker</option>
                      {motorcycles.map((m) => (
                        <option key={m.maker} value={m.maker}>{m.maker}</option>
                      ))}
                    </select>
 
                    <select
                      value={selectedModel}
                      disabled={!selectedMaker}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                        setSelectedYear("");
                        const savedBike = { maker: selectedMaker, model: e.target.value };
                        setGarageBike(savedBike);
                        localStorage.setItem("rider_garage", JSON.stringify(savedBike));
                        window.dispatchEvent(new Event("garage-updated"));
                      }}
                      className="w-full bg-[#121212] border border-white/10 rounded px-2 py-1.5 text-xs font-semibold text-white disabled:opacity-40 focus:outline-none"
                    >
                      <option value="">Select Model</option>
                      {motorcycles.find((m) => m.maker === selectedMaker)?.models.map((mod) => (
                        <option key={mod} value={mod}>{mod}</option>
                      ))}
                    </select>
 
                    <select
                      value={selectedYear}
                      disabled={!selectedModel}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        const savedBike = { maker: selectedMaker, model: selectedModel, year: e.target.value || undefined };
                        setGarageBike(savedBike);
                        localStorage.setItem("rider_garage", JSON.stringify(savedBike));
                        window.dispatchEvent(new Event("garage-updated"));
                      }}
                      className="w-full bg-[#121212] border border-white/10 rounded px-2 py-1.5 text-xs font-semibold text-white disabled:opacity-40 focus:outline-none"
                    >
                      <option value="">Select Year (Optional)</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
 </div>
                  {garageBike && (
                    <p className="text-[9px] text-emerald-500 font-semibold text-center italic">
                      ✓ Garage profile is synchronized across catalog!
                    </p>
                  )}
                </div>

                {/* Collections block */}
                <div className="space-y-4">
                  <h4 className="font-headings font-extrabold text-[10px] tracking-wider text-brand-red uppercase">
                    COLLECTIONS
                  </h4>
                  <ul className="space-y-3.5 text-sm font-semibold">
                    {collections.map((col) => (
                      <li key={col.id}>
                        <Link
                          href={`/collections/${col.handle}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-gray-300 hover:text-white transition-colors block py-1 font-body"
                        >
                          {col.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Secondary navigation */}
                <div className="border-t border-white/5 pt-6 space-y-4 text-sm font-bold uppercase tracking-wider">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAccountOpen(true);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white transition-colors uppercase font-bold text-sm tracking-wider cursor-pointer"
                  >
                    {user ? `Rider: ${user.firstName}` : "Sign In / Register"}
                  </button>

                  <Link
                    href="/garage"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-brand-red hover:text-white transition-colors"
                  >
                    Rider Garage & Build Planner
                  </Link>

                  <a
                    href="#brands-section"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (pathname !== "/") router.push("/#brands-section");
                      else document.getElementById("brands-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    BRANDS
                  </a>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    ABOUT US
                  </Link>
                  <a
                    href="#footer-section"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (pathname !== "/") router.push("/#footer-section");
                      else document.getElementById("footer-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    CONTACT
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
