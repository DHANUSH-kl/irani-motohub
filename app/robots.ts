import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/account/private"],
    },
    sitemap: "https://iranimotohub.com/sitemap.xml",
  };
}
