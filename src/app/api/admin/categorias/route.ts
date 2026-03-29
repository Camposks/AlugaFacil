import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.perfil !== "ADMIN") {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const { nome } = await request.json();
    if (!nome) return NextResponse.json({ erro: "Nome obrigatório" }, { status: 400 });

    const categoria = await prisma.categoria.create({ data: { nome } });
    return NextResponse.json(categoria, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}