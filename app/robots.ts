import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account/private", "/api/"],
      },
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
          "Bytespider",
          "PetalBot",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://iranimotohub.in/sitemap.xml",
  };
}
