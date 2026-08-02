"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  X,
  Check,
  Star,
  Package,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/shopify";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAddToCart = (product: Product) => {
    const defaultVariant = product.variants[0];
    if (!defaultVariant) return;
    addItem(product, defaultVariant);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeFromWishlist(productId);
      setRemovingId(null);
    }, 300);
  };

  const handleClearAll = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="max-w-[1280px] mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-headings font-extrabold uppercase tracking-[0.25em] text-brand-red">
              Your Collection
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-headings font-extrabold text-gray-900 tracking-tight">
                WISHLIST{" "}
                <span className="text-stroke font-headings">& SAVED ITEMS</span>
              </h1>
              <p className="text-sm text-gray-500 font-body mt-2 max-w-lg">
                Your curated selection of premium motorcycle parts and gear.
                Add items to cart when you&apos;re ready to upgrade.
              </p>
            </div>
            {wishlist.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-400 font-body">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}{" "}
                  saved
                </span>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1.5 text-[10px] font-headings font-bold uppercase tracking-wider text-gray-400 hover:text-brand-red transition-colors border border-gray-200 hover:border-brand-red/30 px-3 py-1.5 rounded-full"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clear All Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border border-black/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-headings font-extrabold text-sm text-gray-900">
                      CLEAR WISHLIST
                    </h3>
                    <p className="text-xs text-gray-500 font-body">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-body mb-6">
                  Are you sure you want to remove all{" "}
                  <strong>{wishlist.length}</strong> items from your wishlist?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-xs font-headings font-bold uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 bg-brand-red hover:bg-red-700 text-white py-2.5 rounded-lg text-xs font-headings font-bold uppercase tracking-wider transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Grid */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product, index) => {
                const isAdded = addedIds.has(product.id);
                const isRemoving = removingId === product.id;
                const price = parseInt(
                  product.priceRange.minVariantPrice.amount
                );
                const comparePrice = product.variants[0]?.compareAtPrice
                  ? parseInt(product.variants[0].compareAtPrice.amount)
                  : null;
                const discount =
                  comparePrice && comparePrice > price
                    ? Math.round(((comparePrice - price) / comparePrice) * 100)
                    : null;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isRemoving ? 0 : 1,
                      y: isRemoving ? -10 : 0,
                      scale: isRemoving ? 0.95 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 relative flex flex-col"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-black/5 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-red hover:border-brand-red/30 hover:bg-brand-red/5 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm"
                      title="Remove from Wishlist"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Wishlist Heart Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="w-8 h-8 bg-brand-red/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-brand-red fill-brand-red" />
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {discount && (
                      <div className="absolute top-3 left-14 z-10">
                        <span className="bg-emerald-500 text-white text-[9px] font-headings font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {discount}% Off
                        </span>
                      </div>
                    )}

                    {/* Product Image */}
                    <Link
                      href={`/products/${product.handle}`}
                      className="block relative aspect-square bg-gray-50 overflow-hidden"
                    >
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </Link>

                    {/* Product Details */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Brand */}
                      <span className="text-[9px] font-headings font-extrabold uppercase tracking-[0.2em] text-brand-red mb-1">
                        {product.brand}
                      </span>

                      {/* Title */}
                      <Link href={`/products/${product.handle}`}>
                        <h3 className="font-headings font-extrabold text-sm text-gray-900 leading-tight mb-2 line-clamp-2 hover:text-brand-red transition-colors">
                          {product.title}
                        </h3>
                      </Link>

                      {/* Rating */}
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.round(product.rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-body">
                            ({product.reviews.length})
                          </span>
                        </div>
                      )}

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Price + Add to Cart */}
                      <div className="flex items-end justify-between mt-3 pt-3 border-t border-black/5">
                        <div>
                          <span className="text-lg font-headings font-extrabold text-gray-900">
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                          {comparePrice && comparePrice > price && (
                            <span className="text-xs text-gray-400 line-through ml-1.5 font-body">
                              ₹{comparePrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdded}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-headings font-bold uppercase tracking-wider transition-all duration-300 ${
                            isAdded
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-900 hover:bg-brand-red text-white"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative mb-8">
              {/* Decorative rings */}
              <div className="absolute inset-0 w-32 h-32 border-2 border-dashed border-gray-200 rounded-full animate-spin-slow" style={{ animationDuration: "20s" }} />
              <div className="absolute inset-2 w-28 h-28 border border-gray-100 rounded-full" />
              <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center border border-black/5 shadow-inner">
                <Heart className="w-12 h-12 text-gray-300" />
              </div>
            </div>
            <h2 className="font-headings font-extrabold text-xl text-gray-900 uppercase tracking-wider mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm text-gray-500 font-body max-w-md mb-8 leading-relaxed">
              Save your favorite performance parts and riding gear for later.
              Browse our catalog and tap the heart icon on any product to add it here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-brand-red text-white px-6 py-3 rounded-lg text-xs font-headings font-bold uppercase tracking-wider transition-colors duration-300 shadow-lg shadow-black/10"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse All Products
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 px-6 py-3 rounded-lg text-xs font-headings font-bold uppercase tracking-wider transition-all duration-300"
              >
                Back to Home
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Bottom CTA when items exist */}
        {wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center border-t border-black/5 pt-10"
          >
            <p className="text-xs text-gray-400 font-body mb-4">
              Looking for more performance upgrades?
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-brand-red hover:text-red-700 text-xs font-headings font-bold uppercase tracking-wider transition-colors group"
            >
              Continue Shopping
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
