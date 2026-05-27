export const dynamic = "force-dynamic";
// =============================================================================
// src/app/api/health/route.ts — Endpoint de healthcheck
// Usado pelo Docker para verificar se a aplicação está saudável
// Retorna 200 se tudo estiver OK, 500 se houver algum problema
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const inicio = Date.now();

  try {
    // Verifica se o banco de dados está acessível
    await prisma.$queryRaw`SELECT 1`;
    
    const tempo = Date.now() - inicio;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
      responseTime: `${tempo}ms`,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    // Se o banco falhar, retorna 500
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: String(error),
      },
      { status: 500 }
    );
  }
}