"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem, cartSubtotal, clearCart } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API checkout or redirect
    setTimeout(() => {
      if (cart.checkoutUrl && !cart.id.startsWith("mock-")) {
        window.location.href = cart.checkoutUrl;
      } else {
        // Mock checkout experience
        setIsCheckingOut(false);
        setCheckoutSuccess(true);
      }
    }, 1500);
  };

  const closeSuccessAndCart = () => {
    setCheckoutSuccess(false);
    clearCart();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isCheckingOut) setIsOpen(false);
            }}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Cart Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-brand-card shadow-2xl z-50 flex flex-col border-l border-brand-border h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-border flex justify-between items-center bg-brand-bg">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand-primary" />
                <h2 className="text-xl font-headings font-extrabold tracking-tight text-brand-primary">YOUR CART</h2>
                <span className="bg-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.lines.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-brand-primary hover:text-brand-red transition-colors duration-200"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Success Overlay inside Cart */}
            {checkoutSuccess ? (
              <div className="flex-1 flex flex-col justify-center items-center p-8 text-center bg-brand-bg">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-emerald-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-headings font-extrabold text-brand-primary mb-2">ORDER PLACED!</h3>
                <p className="text-brand-muted text-sm max-w-sm mb-8">
                  Your premium motorcycle parts are locked in. We have generated order <span className="font-mono text-brand-primary font-bold">#IMH-2026-{Math.floor(1000 + Math.random() * 9000)}</span>. Thank you for riding with Irani MotoHub!
                </p>
                <div className="bg-white p-4 rounded-lg border border-brand-border w-full text-left mb-8 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-brand-border pb-2">
                    <span className="text-brand-muted">Shipping Status</span>
                    <span className="text-brand-red font-bold flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Express Dispatch</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-brand-muted">Estimated Delivery</span>
                    <span className="text-brand-primary font-semibold">2 - 4 Business Days</span>
                  </div>
                </div>
                <button
                  onClick={closeSuccessAndCart}
                  className="w-full bg-brand-primary text-white py-4 font-headings text-sm uppercase tracking-wider font-bold hover:bg-brand-red transition-all duration-300"
                >
                  Continue Exploring
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.lines.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center py-12">
                      <ShoppingBag className="w-12 h-12 text-brand-muted mb-4 stroke-[1.2]" />
                      <p className="text-brand-primary font-bold font-headings text-lg mb-1">Your cart is empty</p>
                      <p className="text-brand-muted text-sm max-w-[280px] mb-6">Explore our performance catalog and add some gear to start.</p>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="bg-brand-primary text-white px-6 py-3 font-headings text-xs font-bold uppercase tracking-wider hover:bg-brand-red transition-all duration-300"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    cart.lines.map((line) => (
                      <div key={line.selectedVariant.id} className="flex gap-4 border-b border-brand-border pb-6 last:border-b-0 last:pb-0">
                        {/* Image */}
                        <div className="w-20 h-20 relative bg-brand-bg border border-brand-border overflow-hidden flex-shrink-0 group rounded">
                          <Image
                            src={line.product.images[0]?.url || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=300"}
                            alt={line.product.images[0]?.altText || line.product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-bold text-brand-primary truncate hover:text-brand-red transition-colors duration-200">
                                <Link href={`/products/${line.product.handle}`} onClick={() => setIsOpen(false)}>
                                  {line.product.title}
                                </Link>
                              </h4>
                              <button
                                onClick={() => removeItem(line.selectedVariant.id)}
                                className="text-brand-muted hover:text-brand-red p-1 transition-colors duration-200"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-brand-muted mt-0.5 truncate">{line.selectedVariant.title}</p>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-brand-border rounded">
                              <button
                                onClick={() => updateQuantity(line.selectedVariant.id, line.quantity - 1)}
                                className="px-2 py-1 text-brand-primary hover:bg-brand-bg transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 py-0.5 text-xs font-semibold text-brand-primary min-w-[24px] text-center">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(line.selectedVariant.id, line.quantity + 1)}
                                className="px-2 py-1 text-brand-primary hover:bg-brand-bg transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            {/* Price */}
                            <span className="text-sm font-semibold text-brand-primary">
                              ₹{(parseFloat(line.selectedVariant.price.amount) * line.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer / Summary */}
                {cart.lines.length > 0 && (
                  <div className="p-6 border-t border-brand-border bg-brand-bg space-y-4">
                    <div className="space-y-2 text-sm text-brand-primary">
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Shipping</span>
                        <span className="font-semibold text-emerald-600">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">GST (included)</span>
                        <span className="font-semibold">Calculated at Checkout</span>
                      </div>
                      <div className="flex justify-between border-t border-brand-border pt-3 text-base font-bold font-headings">
                        <span>ESTIMATED SUBTOTAL</span>
                        <span className="text-brand-red">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-brand-primary text-white py-4 font-headings text-sm uppercase tracking-wider font-bold hover:bg-brand-red disabled:bg-brand-muted transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          Proceed to Checkout
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <div className="flex justify-center items-center gap-4 text-[10px] text-brand-muted uppercase tracking-wider font-semibold">
                      <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-brand-primary" /> Secure Gateway</span>
                      <span>•</span>
                      <span>Certified Products Guarantee</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
