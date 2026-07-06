"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ShieldCheck, Check, AlertTriangle, ArrowRight, Truck, RotateCcw, Wrench, Heart } from "lucide-react";
import { getProduct, getProducts, Product } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const MOTORCYCLES = [
  { maker: "KTM", models: ["Duke 390", "RC 390"] },
  { maker: "Royal Enfield", models: ["Himalayan 450", "Interceptor 650", "Continental GT 650"] },
  { maker: "Yamaha", models: ["R15 V4"] },
  { maker: "Triumph", models: ["Speed 400"] }
];

export default function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fitment Check States
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [fitmentResult, setFitmentResult] = useState<{ status: "idle" | "fits" | "nofit" | "universal"; msg: string }>({
    status: "idle",
    msg: ""
  });

  const { addItem, setIsOpen: setCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  // Fetch product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const prodData = await getProduct(handle);
      if (prodData) {
        setProduct(prodData);
        setSelectedVariantId(prodData.variants[0]?.id || "");
        
        // Fetch related products of same category
        const catalog = await getProducts();
        const filtered = catalog.filter((p) => p.id !== prodData.id && p.category === prodData.category);
        setRelatedProducts(filtered.slice(0, 4));
      }
      setLoading(false);
    };
    loadProduct();

    // Load active bike from garage cache on handle change
    const saved = localStorage.getItem("rider_garage");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.maker && parsed.model) {
          setSelectedMaker(parsed.maker);
          setSelectedModel(parsed.model);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setSelectedMaker("");
      setSelectedModel("");
      setFitmentResult({ status: "idle", msg: "" });
    }

    setActiveImageIndex(0);
    setQuantity(1);
  }, [handle]);

  // Sync fitment status if Rider Garage updates in header
  useEffect(() => {
    const syncGarage = () => {
      const saved = localStorage.getItem("rider_garage");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.maker && parsed.model) {
            setSelectedMaker(parsed.maker);
            setSelectedModel(parsed.model);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setSelectedMaker("");
        setSelectedModel("");
        setFitmentResult({ status: "idle", msg: "" });
      }
    };

    window.addEventListener("garage-updated", syncGarage);
    return () => {
      window.removeEventListener("garage-updated", syncGarage);
    };
  }, []);

  // Run compatibility calculations when product or selected bike changes
  useEffect(() => {
    if (!product) return;
    if (!selectedMaker || !selectedModel) {
      setFitmentResult({ status: "idle", msg: "" });
      return;
    }

    const fullBikeName = `${selectedMaker} ${selectedModel}`;
    const isUniversal = product.compatibility.includes("All Motorcycles") || product.category === "Helmets" || product.category === "Riding Gear";

    if (isUniversal) {
      setFitmentResult({
        status: "universal",
        msg: `✓ UNIVERSAL FIT. Confirmed compatibility with your ${fullBikeName}.`
      });
    } else {
      const match = product.compatibility.some(
        (bike) => bike.toLowerCase().trim() === fullBikeName.toLowerCase().trim()
      );
      if (match) {
        setFitmentResult({
          status: "fits",
          msg: `✓ COMPATIBLE. Confirmed 100% fitment for your ${fullBikeName}.`
        });
      } else {
        setFitmentResult({
          status: "nofit",
          msg: `✗ DOES NOT FIT. This part is not configured for a ${fullBikeName}.`
        });
      }
    }
  }, [product, selectedMaker, selectedModel]);

  // Handle fitment update from dropdown selectors
  const handleFitmentCheck = (maker: string, model: string) => {
    setSelectedMaker(maker);
    setSelectedModel(model);

    if (maker && model) {
      const bike = { maker, model };
      localStorage.setItem("rider_garage", JSON.stringify(bike));
      window.dispatchEvent(new Event("garage-updated"));
    } else {
      localStorage.removeItem("rider_garage");
      window.dispatchEvent(new Event("garage-updated"));
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariantId) return;
    const variant = product.variants.find((v) => v.id === selectedVariantId);
    if (!variant) return;

    setIsAdding(true);
    addItem(product, variant, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyItNow = () => {
    if (!product || !selectedVariantId) return;
    const variant = product.variants.find((v) => v.id === selectedVariantId);
    if (!variant) return;

    addItem(product, variant, quantity);
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-brand-bg pt-24">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-brand-muted text-sm font-semibold tracking-wider uppercase">Fetching Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-brand-bg pt-24 text-center px-4">
        <h2 className="text-2xl font-headings font-extrabold text-brand-primary mb-2">PRODUCT NOT FOUND</h2>
        <p className="text-brand-muted text-sm mb-6">The product you requested does not exist in our performance catalog.</p>
        <Link href="/" className="bg-brand-primary text-white px-6 py-3 font-headings text-xs font-bold uppercase tracking-wider hover:bg-brand-red transition-colors">
          Return to Garage
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  return (
    <div className="min-h-screen bg-brand-bg pt-36 md:pt-40 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-brand-muted uppercase tracking-wider mb-8 flex items-center gap-1.5 font-semibold">
          <Link href="/" className="hover:text-brand-primary">Garage</Link>
          <span>/</span>
          <Link href={`/collections/${product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-brand-primary">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-brand-primary font-bold">{product.title}</span>
        </div>

        {/* Product Page Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Gallery, Specifications, Description & Reviews */}
          <div className="lg:col-span-6 space-y-12">
            
            {/* Gallery Wrapper */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full bg-white border border-brand-border rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                <Image
                  src={product.images[activeImageIndex]?.url}
                  alt={product.images[activeImageIndex]?.altText || product.title}
                  fill
                  className="object-contain p-6"
                  priority
                  sizes="(max-w-768px) 100vw, 50vw"
                />
              </div>
              
              {/* Image Thumbnails list */}
              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-20 relative bg-white border rounded overflow-hidden p-1 transition-all ${
                        idx === activeImageIndex ? "border-brand-primary ring-2 ring-brand-primary/10" : "border-brand-border hover:border-brand-muted"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Specs Tabs */}
            <div className="bg-white border border-brand-border p-6 md:p-8 rounded-xl space-y-8 shadow-sm">
              <div className="space-y-4">
                <h3 className="font-headings font-extrabold text-lg tracking-wider text-brand-primary uppercase pb-2 border-b border-brand-border">
                  PRODUCT DESCRIPTION
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed font-body">
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="space-y-4 pt-4">
                <h3 className="font-headings font-extrabold text-lg tracking-wider text-brand-primary uppercase pb-2 border-b border-brand-border">
                  TECHNICAL SPECIFICATIONS
                </h3>
                <div className="border border-brand-border rounded overflow-hidden bg-brand-bg text-sm divide-y divide-brand-border font-body">
                  {product.specifications.map((spec) => (
                    <div key={spec.name} className="grid grid-cols-3 p-3.5">
                      <span className="text-brand-muted font-bold col-span-1">{spec.name}</span>
                      <span className="text-brand-primary font-medium col-span-2">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>



          </div>

          {/* RIGHT COLUMN: Product buy block (Sticky) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-brand-border p-6 md:p-8 rounded-xl shadow-sm space-y-6">
              
              {/* Heading / Brand block */}
              <div>
                <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest block mb-1">
                  {product.brand}
                </span>
                <h1 className="text-lg sm:text-xl font-headings font-extrabold tracking-tight text-brand-primary leading-tight uppercase">
                  {product.title}
                </h1>
                
                {/* Rating star summary */}
                <div className="flex items-center gap-1.5 mt-2 text-sm">
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-brand-primary">{product.rating}</span>
                  <span className="text-brand-muted">•</span>
                  <span className="text-brand-muted font-medium underline cursor-pointer">
                    {product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-2 border-t border-brand-border">
                <span className="text-3xl font-headings font-extrabold text-brand-primary">
                  ₹{parseInt(selectedVariant.price.amount).toLocaleString("en-IN")}
                </span>
                {selectedVariant.compareAtPrice && (
                  <span className="text-sm text-brand-muted line-through font-bold">
                    ₹{parseInt(selectedVariant.compareAtPrice.amount).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Quantity Selector & Stock Indicator (Side-by-side) */}
              <div className="flex items-center gap-6 pt-4 border-t border-brand-border">
                <div className="flex items-center border border-brand-border rounded bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-brand-primary hover:bg-brand-bg transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-brand-primary min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-brand-primary hover:bg-brand-bg transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                
                {/* Stock Availability */}
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock</span>
                </div>
              </div>

              {/* CTAs: Outlined Add to Cart + Heart & Solid Red Buy It Now */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-grow border-2 border-brand-primary hover:bg-brand-primary hover:text-white bg-white text-brand-primary py-3.5 font-headings text-xs uppercase tracking-widest font-extrabold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                        ADDING...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`px-4 border rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isInWishlist(product.id)
                        ? "border-brand-red bg-brand-red/5 text-brand-red hover:bg-brand-red/10"
                        : "border-brand-border hover:border-brand-primary text-brand-primary bg-white"
                    }`}
                    title={isInWishlist(product.id) ? "Remove from Garage Build Planner" : "Add to Garage Build Planner"}
                  >
                    <Heart className={`w-4.5 h-4.5 ${isInWishlist(product.id) ? "fill-brand-red text-brand-red" : ""}`} />
                  </button>
                </div>

                <button
                  onClick={handleBuyItNow}
                  className="w-full bg-brand-red hover:bg-red-750 text-white py-4 font-headings text-xs uppercase tracking-widest font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  Buy It Now
                </button>
              </div>

              {/* Variant Selector / Specifications (Choose Specification) */}
              {product.variants.length > 1 && (
                <div className="space-y-2.5 pt-4 border-t border-brand-border">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">
                    Choose Specification
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`text-left p-3.5 border rounded-lg text-xs font-semibold flex justify-between items-center transition-all ${
                          selectedVariantId === v.id
                            ? "border-brand-primary bg-brand-bg ring-1 ring-brand-primary"
                            : "border-brand-border hover:border-brand-muted bg-white"
                        }`}
                      >
                        <span>{v.title}</span>
                        <span>₹{parseInt(v.price.amount).toLocaleString("en-IN")}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Service banners */}
              <div className="grid grid-cols-3 gap-2.5 text-[10px] text-brand-muted uppercase font-bold tracking-wider pt-4 border-t border-brand-border text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5 text-brand-primary" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-brand-border">
                  <ShieldCheck className="w-5 h-5 text-brand-primary" />
                  <span>Certified Product</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-5 h-5 text-brand-primary" />
                  <span>4-Day Replace</span>
                </div>
              </div>        </div>

            </div>
          </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-brand-border">
            <div className="mb-12">
              <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block mb-1">
                Matching Upgrades
              </span>
              <h2 className="text-2xl font-headings font-extrabold tracking-tight text-brand-primary uppercase">
                RELATED PERFORMANCE PARTS
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white border border-brand-border p-4 rounded-lg hover:shadow-lg hover:border-brand-primary transition-all duration-300 flex flex-col relative"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full bg-brand-bg overflow-hidden rounded mb-4 border border-brand-border">
                    <Image
                      src={p.images[0]?.url}
                      alt={p.images[0]?.altText || p.title}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="200px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow flex flex-col">
                    <span className="text-[9px] font-bold text-brand-red uppercase tracking-wider block mb-1">
                      {p.brand}
                    </span>
                    <h3 className="font-headings font-extrabold text-sm text-brand-primary hover:text-brand-red transition-colors line-clamp-1 mb-2">
                      <Link href={`/products/${p.handle}`}>{p.title}</Link>
                    </h3>
                    <div className="mt-auto pt-3 border-t border-brand-border flex justify-between items-center text-xs">
                      <span className="font-extrabold text-brand-primary">
                        ₹{parseInt(p.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                      </span>
                      <Link
                        href={`/products/${p.handle}`}
                        className="text-[9px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-red transition-colors flex items-center gap-0.5"
                      >
                        View Part <ArrowRight className="w-3 h-3" />
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
  );
}
