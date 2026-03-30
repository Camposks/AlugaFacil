import { prisma } from "@/lib/prisma";
import Link from "next/link";

const statusLabel: Record<string, { label: string; classe: string }> = {
  PENDENTE:   { label: "Pendente",   classe: "bg-yellow-50 text-yellow-700" },
  CONFIRMADO: { label: "Confirmado", classe: "bg-[#E1F5EE] text-[#0F6E56]" },
  ATIVO:      { label: "Ativo",      classe: "bg-blue-50 text-blue-700" },
  DEVOLVIDO:  { label: "Devolvido",  classe: "bg-gray-100 text-gray-600" },
  CANCELADO:  { label: "Cancelado",  classe: "bg-red-50 text-red-700" },
};

export default async function AdminAlugueis() {
  const alugueis = await prisma.aluguel.findMany({
    include: {
      usuario: true,
      equipamento: true,
    },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium text-gray-800">Aluguéis</h1>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          Total: <span className="font-medium text-gray-700">{alugueis.length}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Equipamento</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Cliente</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Período</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Total</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Entrega</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {alugueis.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-sm text-gray-400">
                    Nenhum aluguel encontrado
                  </td>
                </tr>
              ) : (
                alugueis.map((al) => (
                  <tr key={al.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-700 font-medium">
                      {al.equipamento.nome}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm text-gray-700">{al.usuario.nome}</div>
                      <div className="text-xs text-gray-400">{al.usuario.email}</div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(al.dataInicio).toLocaleDateString("pt-BR")} —{" "}
                      {new Date(al.dataFim).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      R$ {al.precoTotal.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`h-5 px-2 rounded-full text-[10px] font-medium inline-flex items-center ${
                        al.entrega ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {al.entrega ? "Entrega" : "Retirada"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`h-5 px-2 rounded-full text-[10px] font-medium inline-flex items-center ${statusLabel[al.status]?.classe}`}>
                        {statusLabel[al.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/alugueis/${al.id}`}
                        className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </Link>
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