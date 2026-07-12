"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant, Cart, CartItem, createCart } from "@/lib/shopify";
import { useAuth } from "@/context/AuthContext";

interface CartContextType {
  cart: Cart;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (product: Product, selectedVariant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  cartCount: number;
  cartSubtotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart>({
    id: "",
    checkoutUrl: "",
    lines: [],
    subtotalAmount: { amount: "0", currencyCode: "INR" }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to determine the storage key depending on user state
  const getCartKey = (u: any) => u ? `irani_motohub_cart_${u.email}` : "irani_motohub_cart";

  // Switch and merge carts based on auth state changes
  useEffect(() => {
    if (authLoading) return; // Wait until authentication state is determined

    const initOrSwitchCart = async () => {
      try {
        const guestCartStr = localStorage.getItem("irani_motohub_cart");
        const guestCart = guestCartStr ? JSON.parse(guestCartStr) : null;

        if (user) {
          // USER LOGGED IN
          const userKey = `irani_motohub_cart_${user.email}`;
          const storedUserCartStr = localStorage.getItem(userKey);
          let userCart: Cart;

          if (storedUserCartStr) {
            userCart = JSON.parse(storedUserCartStr);
          } else {
            const newCart = await createCart();
            userCart = newCart;
          }

          // If there were items in the guest cart, merge them into user's cart
          if (guestCart && guestCart.lines.length > 0) {
            const mergedLines = [...userCart.lines];
            
            guestCart.lines.forEach((guestLine: CartItem) => {
              const existingIndex = mergedLines.findIndex(
                (userLine) => userLine.selectedVariant.id === guestLine.selectedVariant.id
              );
              if (existingIndex > -1) {
                mergedLines[existingIndex] = {
                  ...mergedLines[existingIndex],
                  quantity: mergedLines[existingIndex].quantity + guestLine.quantity
                };
              } else {
                mergedLines.push(guestLine);
              }
            });

            userCart.lines = mergedLines;
            
            // Clear the guest cart so it is empty on subsequent signouts
            localStorage.removeItem("irani_motohub_cart");
          }

          // Force update subtotal for safety
          const subtotal = userCart.lines.reduce((acc, line) => {
            const price = parseFloat(line.selectedVariant.price.amount);
            return acc + price * line.quantity;
          }, 0);
          userCart.subtotalAmount.amount = subtotal.toFixed(2);

          setCart(userCart);
          localStorage.setItem(userKey, JSON.stringify(userCart));
        } else {
          // USER LOGGED OUT (OR GUEST)
          // Load or initialize guest cart
          if (guestCart) {
            setCart(guestCart);
          } else {
            const newCart = await createCart();
            setCart(newCart);
            localStorage.setItem("irani_motohub_cart", JSON.stringify(newCart));
          }
        }
      } catch (e) {
        console.error("Error swapping/initializing cart on auth change:", e);
      } finally {
        setIsInitialized(true);
      }
    };

    initOrSwitchCart();
  }, [user, authLoading]);

  // Sync active cart to local storage whenever cart state changes
  useEffect(() => {
    if (!isInitialized || authLoading) return;

    const subtotal = cart.lines.reduce((acc, line) => {
      const price = parseFloat(line.selectedVariant.price.amount);
      return acc + price * line.quantity;
    }, 0);

    const updatedCart = {
      ...cart,
      subtotalAmount: {
        amount: subtotal.toFixed(2),
        currencyCode: cart.subtotalAmount.currencyCode || "INR"
      }
    };

    const key = getCartKey(user);
    localStorage.setItem(key, JSON.stringify(updatedCart));
  }, [cart, isInitialized, user, authLoading]);

  // Helper to sync local lines with Shopify cart
  const syncWithShopify = async (linesToSync: CartItem[]) => {
    if (!isInitialized || authLoading) return;

    // If there are no lines, clear cart session fields
    if (linesToSync.length === 0) {
      setCart((prev) => ({
        ...prev,
        checkoutUrl: "",
        subtotalAmount: { amount: "0.00", currencyCode: "INR" }
      }));
      return;
    }

    try {
      console.log("[CartSync] Synchronizing local cart items to Shopify...", linesToSync);
      const reqLines = linesToSync.map(line => ({
        variantId: line.selectedVariant.id,
        quantity: line.quantity
      }));

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: reqLines })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cart) {
          console.log("[CartSync] Shopify cart synced. Cart ID:", data.cart.id, "Checkout URL:", data.cart.checkoutUrl);
          setCart((prev) => ({
            ...prev,
            id: data.cart.id,
            checkoutUrl: data.cart.checkoutUrl,
            subtotalAmount: data.cart.subtotalAmount
          }));
        }
      } else {
        console.error("[CartSync] Failed to sync cart with Shopify. Status:", response.status);
      }
    } catch (e) {
      console.error("[CartSync] Error syncing cart with Shopify:", e);
    }
  };

  // Sync active cart to Shopify whenever lines change
  useEffect(() => {
    if (!isInitialized || authLoading) return;

    const timer = setTimeout(() => {
      syncWithShopify(cart.lines);
    }, 500); // 500ms debounce to bundle rapid quantity clicks

    return () => clearTimeout(timer);
  }, [cart.lines, isInitialized, authLoading]);

  const addItem = (product: Product, selectedVariant: ProductVariant, quantity = 1) => {
    setCart((prevCart) => {
      const existingLineIndex = prevCart.lines.findIndex(
        (line) => line.selectedVariant.id === selectedVariant.id
      );

      let newLines = [...prevCart.lines];

      if (existingLineIndex > -1) {
        // Increment quantity
        newLines[existingLineIndex] = {
          ...newLines[existingLineIndex],
          quantity: newLines[existingLineIndex].quantity + quantity
        };
      } else {
        // Add new line
        newLines.push({
          id: `line-${Math.random().toString(36).substr(2, 9)}`,
          product,
          selectedVariant,
          quantity
        });
      }

      return {
        ...prevCart,
        lines: newLines
      };
    });
    // Open cart drawer on addition
    setIsOpen(true);
  };

  const removeItem = (variantId: string) => {
    setCart((prevCart) => {
      const newLines = prevCart.lines.filter(
        (line) => line.selectedVariant.id !== variantId
      );
      return {
        ...prevCart,
        lines: newLines
      };
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setCart((prevCart) => {
      const newLines = prevCart.lines.map((line) => {
        if (line.selectedVariant.id === variantId) {
          return { ...line, quantity };
        }
        return line;
      });
      return {
        ...prevCart,
        lines: newLines
      };
    });
  };

  const clearCart = () => {
    setCart((prevCart) => ({
      ...prevCart,
      lines: []
    }));
  };

  const cartCount = cart.lines.reduce((acc, line) => acc + line.quantity, 0);
  const cartSubtotal = parseFloat(cart.subtotalAmount.amount);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        cartCount,
        cartSubtotal,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
