import React from "react";
import { Metadata } from "next";
import { getProducts, getCollections } from "@/lib/shopify";
import ProductsClientPage from "./ProductsClientPage";

export const revalidate = 60; // Revalidate cache every 60 seconds (ISR)

export const metadata: Metadata = {
  title: "Performance Catalog | Premium Upgrades | Irani MotoHub",
  description: "Browse premium motorcycle performance upgrades, custom air filters, spark plugs, electronics, and technical street riding gear."
};

export default async function AllProductsPage() {
  const [initialProducts, initialCollections] = await Promise.all([
    getProducts(),
    getCollections()
  ]);

  return (
    <ProductsClientPage 
      initialProducts={initialProducts} 
      initialCollections={initialCollections} 
    />
  );
}
