import React from "react";
import FeaturedProducts from "./FeaturedProducts";
import { getProducts } from "@/lib/shopify";

export default async function FeaturedProductsSection() {
  const products = await getProducts({ limit: 24 });

  return <FeaturedProducts initialProducts={products} />;
}
