import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditarPerfilForm from "@/components/account/EditarPerfilForm";

export default async function EditarPerfilPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
  });

  if (!usuario) redirect("/login");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-[#1D9E75] px-8 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-medium text-white mb-1">Editar perfil</h1>
          <p className="text-[#9FE1CB] text-sm">Atualize suas informações pessoais</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        <EditarPerfilForm
          usuario={{
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone || "",
            endereco: usuario.endereco || "",
          }}
        />
      </div>
    </div>
  );
}