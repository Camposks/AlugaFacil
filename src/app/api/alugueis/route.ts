import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const aluguelSchema = z.object({
  equipamentoId: z.string(),
  dataInicio: z.string(),
  dataFim: z.string(),
  entrega: z.boolean().optional().default(false),
  endereco: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = aluguelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
    }

    const { equipamentoId, dataInicio, dataFim, entrega, endereco } = parsed.data;

    const equipamento = await prisma.equipamento.findUnique({
      where: { id: equipamentoId },
    });

    if (!equipamento) {
      return NextResponse.json({ erro: "Equipamento não encontrado" }, { status: 404 });
    }

    if (!equipamento.disponivel) {
      return NextResponse.json({ erro: "Equipamento indisponível" }, { status: 400 });
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const dias = Math.ceil((fim.getTime() - inicio.getTime()) / 86400000);

    if (dias <= 0) {
      return NextResponse.json({ erro: "Datas inválidas" }, { status: 400 });
    }

    const precoTotal = dias * equipamento.precoPorDia;

    // Verifica conflito de datas
    const conflito = await prisma.aluguel.findFirst({
      where: {
        equipamentoId,
        status: { in: ["PENDENTE", "CONFIRMADO", "ATIVO"] },
        OR: [
          { dataInicio: { lte: fim }, dataFim: { gte: inicio } },
        ],
      },
    });

    if (conflito) {
      return NextResponse.json(
        { erro: "Equipamento já reservado neste período" },
        { status: 400 }
      );
    }

    const aluguel = await prisma.aluguel.create({
      data: {
        usuarioId: session.user.id,
        equipamentoId,
        dataInicio: inicio,
        dataFim: fim,
        precoTotal,
        entrega,
        endereco,
        status: "PENDENTE",
      },
    });

    return NextResponse.json(aluguel, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const alugueis = await prisma.aluguel.findMany({
      where: { usuarioId: session.user.id },
      include: { equipamento: { include: { categoria: true } } },
      orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json(alugueis);
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}