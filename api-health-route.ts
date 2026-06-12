export const dynamic = "force-dynamic";
// =============================================================================
// src/app/api/health/route.ts
// Coloque este arquivo em: src/app/api/health/route.ts
// Endpoint usado pelo Docker healthcheck
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const inicio = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
      responseTime: `${Date.now() - inicio}ms`,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", database: "disconnected", error: String(error) },
      { status: 500 }
    );
  }
}
