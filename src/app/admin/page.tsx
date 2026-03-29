import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalEquipamentos,
    equipamentosIndisponiveis,
    totalAlugueis,
    alugueisAtivos,
    totalUsuarios,
    alugueisRecentes,
  ] = await Promise.all([
    prisma.equipamento.count(),
    prisma.equipamento.count({ where: { disponivel: false } }),
    prisma.aluguel.count(),
    prisma.aluguel.count({ where: { status: "ATIVO" } }),
    prisma.usuario.count(),
    prisma.aluguel.findMany({
      take: 8,
      orderBy: { criadoEm: "desc" },
      include: { usuario: true, equipamento: true },
    }),
  ]);

  const statusLabel: Record<string, { label: string; classe: string }> = {
    PENDENTE:    { label: "Pendente",    classe: "bg-yellow-50 text-yellow-700" },
    CONFIRMADO:  { label: "Confirmado",  classe: "bg-[#E1F5EE] text-[#0F6E56]" },
    ATIVO:       { label: "Ativo",       classe: "bg-blue-50 text-blue-700" },
    DEVOLVIDO:   { label: "Devolvido",   classe: "bg-gray-100 text-gray-600" },
    CANCELADO:   { label: "Cancelado",   classe: "bg-red-50 text-red-700" },
  };

  return (
    <div>
      {/* Topbar */}
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium text-gray-800">Dashboard</h1>
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
        {/* Métricas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Equipamentos", valor: totalEquipamentos, sub: `${equipamentosIndisponiveis} indisponíveis`, href: "/admin/equipamentos" },
            { label: "Aluguéis ativos", valor: alugueisAtivos, sub: `${totalAlugueis} no total`, href: "/admin/alugueis" },
            { label: "Usuários", valor: totalUsuarios, sub: "cadastrados", href: "/admin/usuarios" },
            { label: "Total aluguéis", valor: totalAlugueis, sub: "desde o início", href: "/admin/alugueis" },
          ].map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="text-xs text-gray-400 mb-2">{m.label}</div>
              <div className="text-2xl font-medium text-gray-800 mb-1">{m.valor}</div>
              <div className="text-xs text-[#1D9E75]">{m.sub}</div>
            </Link>
          ))}
        </div>

        {/* Aluguéis recentes */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800">Aluguéis recentes</span>
            <Link href="/admin/alugueis" className="text-xs text-[#1D9E75]">Ver todos →</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Equipamento</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Cliente</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Período</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Total</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {alugueisRecentes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm text-gray-400">
                    Nenhum aluguel encontrado
                  </td>
                </tr>
              ) : (
                alugueisRecentes.map((al) => (
                  <tr key={al.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-700">{al.equipamento.nome}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{al.usuario.nome}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(al.dataInicio).toLocaleDateString("pt-BR")} —{" "}
                      {new Date(al.dataFim).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      R$ {al.precoTotal.toFixed(2)}
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