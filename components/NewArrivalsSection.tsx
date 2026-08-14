import React from "react";
import NewArrivals from "./NewArrivals";
import { getProducts } from "@/lib/shopify";

export default async function NewArrivalsSection() {
  const products = await getProducts();

  return <NewArrivals initialProducts={products} />;
}
