import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const avaliacaoSchema = z.object({
  equipamentoId: z.string(),
  aluguelId: z.string(),
  nota: z.number().min(1).max(5),
  comentario: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = avaliacaoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
    }

    const { equipamentoId, aluguelId, nota, comentario } = parsed.data;

    // Verifica se o aluguel pertence ao usuário e foi devolvido
    const aluguel = await prisma.aluguel.findFirst({
      where: {
        id: aluguelId,
        usuarioId: session.user.id,
        status: "DEVOLVIDO",
      },
    });

    if (!aluguel) {
      return NextResponse.json(
        { erro: "Aluguel não encontrado ou não finalizado" },
        { status: 400 }
      );
    }

    // Verifica se já avaliou
    const avaliacaoExistente = await prisma.avaliacao.findUnique({
      where: { aluguelId },
    });

    if (avaliacaoExistente) {
      return NextResponse.json(
        { erro: "Você já avaliou este aluguel" },
        { status: 400 }
      );
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        usuarioId: session.user.id,
        equipamentoId,
        aluguelId,
        nota,
        comentario,
      },
    });

    return NextResponse.json(avaliacao, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}