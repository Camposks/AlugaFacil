import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://aluga-facil-alpha.vercel.app";

  const equipamentos = await prisma.equipamento.findMany({
    where: { disponivel: true },
    select: { id: true, criadoEm: true },
  });

  const equipamentosUrls = equipamentos.map((eq) => ({
    url: `${baseUrl}/equipamentos/${eq.id}`,
    lastModified: eq.criadoEm,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

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