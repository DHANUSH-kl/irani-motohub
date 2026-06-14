import { MetadataRoute } from "next";
import { getProducts, getCollections } from "@/lib/shopify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://iranimotohub.com";

  // Static root URL
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  try {
    // Dynamic collections URLs
    const collections = await getCollections();
    const collectionRoutes = collections.map((col) => ({
      url: `${baseUrl}/collections/${col.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Dynamic products URLs
    const products = await getProducts();
    const productRoutes = products.map((prod) => ({
      url: `${baseUrl}/products/${prod.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...routes, ...collectionRoutes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap dynamic URLs:", error);
    return routes;
  }
}
