import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";

  let equipamentosUrls: any[] = [];

  // Skip database query during build if DATABASE_URL is not reachable
  if (process.env.DATABASE_URL) {
    try {
      const equipamentos = await prisma.equipamento.findMany({
        where: { disponivel: true },
        select: { id: true, criadoEm: true },
      });

      equipamentosUrls = equipamentos.map((eq) => ({
        url: `${baseUrl}/equipamentos/${eq.id}`,
        lastModified: eq.criadoEm,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } catch {
      // Silently fail during build, will be generated at runtime
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/equipamentos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...equipamentosUrls,
  ];
}