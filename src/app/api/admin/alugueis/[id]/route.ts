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
    const { status } = await request.json();

    const aluguel = await prisma.aluguel.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(aluguel);
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}