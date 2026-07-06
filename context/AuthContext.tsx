"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer, customerLogin, customerRegister, customerGet } from "@/lib/shopify";

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

const TOKEN_KEY = "irani_motohub_access_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          const customer = await customerGet(storedToken);
          if (customer) {
            setUser({ ...customer, accessToken: storedToken });
          } else {
            // Invalid/expired token
            localStorage.removeItem(TOKEN_KEY);
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
      const response = await customerLogin(email, password);
      if (response.customer && response.accessToken) {
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        setUser({ ...response.customer, accessToken: response.accessToken });
        setLoading(false);
        return true;
      } else {
        setError(response.errors[0] || "Failed to log in.");
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
      const registerRes = await customerRegister(firstName, lastName, email, password);
      if (registerRes.customer) {
        // Auto sign in after sign up
        const loginRes = await customerLogin(email, password);
        if (loginRes.customer && loginRes.accessToken) {
          localStorage.setItem(TOKEN_KEY, loginRes.accessToken);
          setUser({ ...loginRes.customer, accessToken: loginRes.accessToken });
          setLoading(false);
          return true;
        }
        setLoading(false);
        return true;
      } else {
        setError(registerRes.errors[0] || "Failed to register.");
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
    localStorage.removeItem(TOKEN_KEY);
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
