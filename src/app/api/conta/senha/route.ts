import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { compare, hash } from "bcryptjs";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const { senhaAtual, novaSenha } = await request.json();

    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
    });

    if (!usuario || !usuario.senha) {
      return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });
    }

    const senhaCorreta = await compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      return NextResponse.json({ erro: "Senha atual incorreta" }, { status: 400 });
    }

    const senhaHash = await hash(novaSenha, 12);

    await prisma.usuario.update({
      where: { id: session.user.id },
      data: { senha: senhaHash },
    });

    return NextResponse.json({ mensagem: "Senha alterada com sucesso" });
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}