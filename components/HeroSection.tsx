import React from "react";
import Hero from "./Hero";
import { getProductLightweight } from "@/lib/shopify";

export default async function HeroSection() {
  // Fetch a lightweight product to highlight on the homepage.
  // This is highly targeted and does not load specifications, reviews, or other metadata.
  const product = await getProductLightweight("bmc-air-filter");

  return <Hero product={product} />;
}
