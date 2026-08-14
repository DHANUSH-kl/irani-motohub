import React from "react";
import { Metadata } from "next";
import { getCollection, getCollections, getProducts } from "@/lib/shopify";
import CollectionClientPage from "./CollectionClientPage";

export const revalidate = 60; // Revalidate cache every 60 seconds (ISR)

interface Props {
  params: Promise<{ handle: string }>;
}

// Generate dynamic metadata on the server
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const col = await getCollection(resolvedParams.handle);

  if (!col) {
    return {
      title: "Collection Not Found | Irani MotoHub",
      description: "The requested collection could not be found."
    };
  }

  return {
    title: `${col.title} | Premium Performance | Irani MotoHub`,
    description: col.description || `Browse our exclusive collection of ${col.title} on Irani MotoHub.`,
    openGraph: {
      title: `${col.title} | Premium Performance | Irani MotoHub`,
      description: col.description || `Browse our exclusive collection of ${col.title} on Irani MotoHub.`,
      images: col.image ? [{ url: col.image.url, alt: col.image.altText }] : []
    }
  };
}

export default async function CollectionPage({ params }: Props) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;

  const [initialCollection, initialCollections, initialProducts] = await Promise.all([
    getCollection(handle),
    getCollections(),
    getProducts({ collectionHandle: handle })
  ]);

  return (
    <CollectionClientPage
      handle={handle}
      initialCollection={initialCollection}
      initialCollections={initialCollections}
      initialProducts={initialProducts}
    />
  );
}
