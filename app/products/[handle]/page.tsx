import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/shopify";
import ProductClientPage from "./ProductClientPage";

export const revalidate = 3600; // Revalidate cache every hour (ISR)

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
    alternates: {
      canonical: `https://iranimotohub.in/products/${resolvedParams.handle}`
    },
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images.map((img) => img.url),
    "description": product.description,
    "sku": product.variants[0]?.id || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Irani MotoHub"
    },
    "offers": {
      "@type": "Offer",
      "price": product.variants[0]?.price.amount || product.priceRange.minVariantPrice.amount,
      "priceCurrency": "INR",
      "availability": product.variants[0]?.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://iranimotohub.in/products/${product.handle}`
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://iranimotohub.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category,
        "item": `https://iranimotohub.in/collections/${product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://iranimotohub.in/products/${product.handle}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductClientPage product={product} relatedProducts={relatedProducts} />
    </>
  );
}

// Pre-render top-selling catalog products at build time (limit to top 30)
export async function generateStaticParams() {
  const products = await getProducts({ limit: 30 });
  return products.map((prod) => ({
    handle: prod.handle,
  }));
}
