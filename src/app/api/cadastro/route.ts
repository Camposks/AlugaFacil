import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const cadastroSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
  telefone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cadastroSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { erro: "Dados inválidos" },
        { status: 400 }
      );
    }

    const { nome, email, senha, telefone } = parsed.data;

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { erro: "E-mail já cadastrado" },
        { status: 400 }
      );
    }

    const senhaHash = await hash(senha, 12);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash, telefone },
    });

    return NextResponse.json(
      { mensagem: "Usuário criado com sucesso", id: usuario.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
