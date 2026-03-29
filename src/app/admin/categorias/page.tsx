import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FormCategoria from "@/components/admin/FormCategoria";

export default async function AdminCategorias() {
  const categorias = await prisma.categoria.findMany({
    include: { _count: { select: { itens: true } } },
    orderBy: { nome: "asc" },
  });

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium text-gray-800">Categorias</h1>
      </div>

      <div className="p-6 grid grid-cols-[1fr_320px] gap-6">
        {/* Lista */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Nome</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Equipamentos</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-sm text-gray-400">
                    Nenhuma categoria cadastrada
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm text-gray-700 font-medium">{cat.nome}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{cat._count.itens} equipamentos</td>
                    <td className="px-5 py-3">
                      <form action={async () => {
                        "use server";
                        await prisma.categoria.delete({ where: { id: cat.id } });
                      }}>
                        <button
                          type="submit"
                          className="w-7 h-7 border border-red-100 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                          </svg>
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Formulário */}
        <FormCategoria />
      </div>
    </div>
  );
}