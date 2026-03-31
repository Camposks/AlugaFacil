import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.perfil !== "ADMIN") {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, descricao, categoriaId, precoPorDia, estoque, disponivel, imagens } = body;

    const { id } = await params;
    const equipamento = await prisma.equipamento.update({
    where: { id },
      data: { nome, descricao, categoriaId, precoPorDia, estoque, disponivel, imagens },
    });

    return NextResponse.json(equipamento);
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.perfil !== "ADMIN") {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.equipamento.delete({ where: { id } });
    return NextResponse.json({ mensagem: "Deletado com sucesso" });
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}