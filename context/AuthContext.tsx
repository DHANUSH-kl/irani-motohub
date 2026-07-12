"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer } from "@/lib/shopify";

interface AuthContextType {
  user: Customer | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session from internal api /api/auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await fetch("/api/auth");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (e) {
        console.error("Error restoring session:", e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.user) {
        setUser(data.user);
        setLoading(false);
        return true;
      } else {
        setError(data.errors?.[0] || data.error || "Failed to log in.");
        setLoading(false);
        return false;
      }
    } catch (e) {
      console.error("Error during sign in:", e);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
      return false;
    }
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", firstName, lastName, email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.user) {
        setUser(data.user);
        setLoading(false);
        return true;
      } else {
        setError(data.errors?.[0] || data.error || "Failed to register.");
        setLoading(false);
        return false;
      }
    } catch (e) {
      console.error("Error during sign up:", e);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
      return false;
    }
  };

  const signOut = () => {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch((e) => console.error("Error signing out:", e));

    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
