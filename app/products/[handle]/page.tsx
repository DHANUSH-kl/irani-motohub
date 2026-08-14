import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getProduct, getRelatedProducts } from "@/lib/shopify";
import ProductClientPage from "./ProductClientPage";

export const revalidate = 60; // Revalidate cache every 60 seconds (ISR)

interface Props {
  params: Promise<{ handle: string }>;
}

// Generate dynamic metadata for SEO on the server
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);
  
  if (!product) {
    return {
      title: "Product Not Found | Irani MotoHub",
      description: "The requested motorcycle part could not be found."
    };
  }

  return {
    title: `${product.title} | Irani MotoHub`,
    description: product.description || `Buy ${product.title} premium motorcycle accessories on Irani MotoHub.`,
    openGraph: {
      title: `${product.title} | Irani MotoHub`,
      description: product.description || `Buy ${product.title} premium motorcycle accessories on Irani MotoHub.`,
      images: product.images.map((img) => ({ url: img.url, alt: img.altText }))
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-brand-bg pt-24 text-center px-4">
        <h2 className="text-2xl font-headings font-extrabold text-brand-primary mb-2">PRODUCT NOT FOUND</h2>
        <p className="text-brand-muted text-sm mb-6">The product you requested does not exist in our performance catalog.</p>
        <Link href="/" className="bg-brand-primary text-white px-6 py-3 font-headings text-xs font-bold uppercase tracking-wider hover:bg-brand-red transition-colors">
          Return to Garage
        </Link>
      </div>
    );
  }

  // Fetch only related products of same category (on the server)
  const relatedProducts = await getRelatedProducts(product.id, product.category, 4);

  return <ProductClientPage product={product} relatedProducts={relatedProducts} />;
}
