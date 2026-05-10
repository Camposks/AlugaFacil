import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.perfil !== "ADMIN") {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ erro: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Converte o arquivo para base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Faz o upload para o Cloudinary
    const resultado = await cloudinary.uploader.upload(base64, {
      folder: "alugafacil/equipamentos",
      transformation: [
        { width: 800, height: 600, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return NextResponse.json({ url: resultado.secure_url }, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao fazer upload" }, { status: 500 });
  }
}