import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.perfil !== "ADMIN") {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { perfil } = await request.json();

    const usuario = await prisma.usuario.update({
      where: { id },
      data: { perfil },
    });

    return NextResponse.json(usuario);
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}