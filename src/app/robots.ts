import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/minha-conta", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}