import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚠️ CRÍTICO: Modo standalone necessário para rodar em Docker
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;