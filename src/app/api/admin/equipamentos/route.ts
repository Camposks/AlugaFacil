import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.perfil !== "ADMIN") {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, descricao, categoriaId, precoPorDia, estoque, disponivel, imagens } = body;

    const equipamento = await prisma.equipamento.create({
      data: { nome, descricao, categoriaId, precoPorDia, estoque, disponivel, imagens },
    });

    return NextResponse.json(equipamento, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}