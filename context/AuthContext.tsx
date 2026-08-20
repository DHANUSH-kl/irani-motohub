"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer } from "@/lib/shopify";

interface AuthContextType {
  user: Customer | null;
  loading: boolean;
  error: string | null;
  signIn: (email?: string, password?: string) => Promise<boolean>;
  signUp: (firstName?: string, lastName?: string, email?: string, password?: string) => Promise<boolean>;
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

  const signIn = async (email?: string, password?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      window.location.href = "/api/auth/login";
      return true;
    } catch (e) {
      console.error("Error during sign in redirection:", e);
      setError("Failed to redirect to the secure sign-in portal.");
      setLoading(false);
      return false;
    }
  };

  const signUp = async (
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      window.location.href = "/api/auth/login";
      return true;
    } catch (e) {
      console.error("Error during sign up redirection:", e);
      setError("Failed to redirect to the secure registration portal.");
      setLoading(false);
      return false;
    }
  };

  const signOut = () => {
    setLoading(true);
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          setUser(null);
          setLoading(false);
          window.location.href = "/";
        }
      })
      .catch((e) => {
        console.error("Error signing out:", e);
        setUser(null);
        setLoading(false);
        window.location.href = "/";
      });
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
