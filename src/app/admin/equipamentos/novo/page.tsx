import { prisma } from "@/lib/prisma";
import FormEquipamento from "@/components/admin/FormEquipamento";

export default async function NovoEquipamento() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
  });

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center gap-3">
        <a href="/admin/equipamentos" className="text-gray-400 hover:text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </a>
        <h1 className="text-base font-medium text-gray-800">Novo equipamento</h1>
      </div>
      <div className="p-6 max-w-2xl">
        <FormEquipamento categorias={categorias} />
      </div>
    </div>
  );
}