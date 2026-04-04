import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://aluga-facil-alpha.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/minha-conta", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}