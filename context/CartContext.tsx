"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant, Cart, CartItem, createCart } from "@/lib/shopify";

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
  const [cart, setCart] = useState<Cart>({
    id: "",
    checkoutUrl: "",
    lines: [],
    subtotalAmount: { amount: "0", currencyCode: "INR" }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage or create new
  useEffect(() => {
    const initCart = async () => {
      try {
        const storedCart = localStorage.getItem("irani_motohub_cart");
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          setCart(parsed);
        } else {
          const newCart = await createCart();
          setCart(newCart);
          localStorage.setItem("irani_motohub_cart", JSON.stringify(newCart));
        }
      } catch (e) {
        console.error("Error initializing cart:", e);
      } finally {
        setIsInitialized(true);
      }
    };
    initCart();
  }, []);

  // Update localStorage and subtotal whenever lines change
  useEffect(() => {
    if (!isInitialized) return;

    const subtotal = cart.lines.reduce((acc, line) => {
      const price = parseFloat(line.selectedVariant.price.amount);
      return acc + price * line.quantity;
    }, 0);

    const updatedCart = {
      ...cart,
      subtotalAmount: {
        amount: subtotal.toFixed(2),
        currencyCode: "INR"
      }
    };

    localStorage.setItem("irani_motohub_cart", JSON.stringify(updatedCart));
  }, [cart.lines, isInitialized]);

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
