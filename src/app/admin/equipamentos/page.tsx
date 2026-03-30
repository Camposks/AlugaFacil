import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminEquipamentos() {
  const equipamentos = await prisma.equipamento.findMany({
    include: { categoria: true },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium text-gray-800">Equipamentos</h1>
        <Link
          href="/admin/equipamentos/novo"
          className="h-8 px-4 bg-[#1D9E75] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 hover:bg-[#0F6E56] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo equipamento
        </Link>
      </div>

      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Nome</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Categoria</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Preço/dia</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Estoque</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipamentos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm text-gray-400">
                    Nenhum equipamento cadastrado.{" "}
                    <Link href="/admin/equipamentos/novo" className="text-[#1D9E75]">
                      Cadastrar agora →
                    </Link>
                  </td>
                </tr>
              ) : (
                equipamentos.map((eq) => (
                  <tr key={eq.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-700 font-medium">{eq.nome}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{eq.categoria.nome}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">R$ {eq.precoPorDia.toFixed(2)}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{eq.estoque}</td>
                    <td className="px-5 py-3">
                      <span className={`h-5 px-2 rounded-full text-[10px] font-medium inline-flex items-center gap-1 ${
                        eq.disponivel ? "bg-[#E1F5EE] text-[#0F6E56]" : "bg-red-50 text-red-700"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${eq.disponivel ? "bg-[#1D9E75]" : "bg-red-500"}`}/>
                        {eq.disponivel ? "Disponível" : "Indisponível"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/equipamentos/${eq.id}/editar`}
                          className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </Link>
                        <Link
                          href={`/equipamentos/${eq.id}`}
                          className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                          target="_blank"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}