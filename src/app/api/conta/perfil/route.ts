import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const { nome, telefone, endereco } = await request.json();

    const usuario = await prisma.usuario.update({
      where: { id: session.user.id },
      data: { nome, telefone, endereco },
    });

    return NextResponse.json(usuario);
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}