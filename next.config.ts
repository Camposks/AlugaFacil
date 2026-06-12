import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. OBRIGATÓRIO PARA O DOCKERFILE STANDALONE
  // Reduz drasticamente o tamanho da imagem final no Contabo
  output: "standalone",

  // 2. Mantido conforme sua necessidade atual
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. Ajuste de Imagens Externas
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // 🔒 Recomendado restringir ao seu provedor
      },
      {
        protocol: "https",
        hostname: "**", // Permite qualquer imagem externa (mantenha se for usar avatares do Google/GitHub etc.)
      },
    ],
  },
};

export default nextConfig;