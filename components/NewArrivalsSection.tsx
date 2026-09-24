import React from "react";
import NewArrivals from "./NewArrivals";
import { getProducts } from "@/lib/shopify";

export default async function NewArrivalsSection() {
  const products = await getProducts({ limit: 8 });

  return <NewArrivals initialProducts={products} />;
}
