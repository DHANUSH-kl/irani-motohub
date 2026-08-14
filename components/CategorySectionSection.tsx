import React from "react";
import CategorySection from "./CategorySection";
import { getCollections } from "@/lib/shopify";

export default async function CategorySectionSection() {
  const collections = await getCollections();
  
  const mapped = collections.map((col, idx) => ({
    title: col.title,
    handle: col.handle,
    imageUrl: col.image?.url || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600",
    count: String(idx + 1).padStart(2, "0")
  }));

  return <CategorySection initialCategories={mapped} />;
}
