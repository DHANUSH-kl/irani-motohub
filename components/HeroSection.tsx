import React from "react";
import Hero from "./Hero";
import { getProductLightweight } from "@/lib/shopify";

export default async function HeroSection() {
  // Fetch the main trending product
  const trendingProduct = await getProductLightweight("bmc-air-filter");

  // Fetch the requested bestseller products by handle
  const bestsellerHandles = [
    "oval-barend-mirrors",
    "dimaond-barend-mirrors",
    "bsddp-aluminium-mirrors-black",
    "duke-gen-3-tail-tidy"
  ];

  const bestsellers = await Promise.all(
    bestsellerHandles.map(handle => getProductLightweight(handle))
  );

  // Filter out any null products if they fail to load from the Shopify API
  const validBestsellers = bestsellers.filter((p): p is any => p !== null);

  return <Hero product={trendingProduct} bestsellers={validBestsellers} />;
}
