import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AluguelActions from "@/components/admin/AluguelActions";

const statusLabel: Record<string, { label: string; classe: string }> = {
  PENDENTE:   { label: "Pendente",   classe: "bg-yellow-50 text-yellow-700" },
  CONFIRMADO: { label: "Confirmado", classe: "bg-[#E1F5EE] text-[#0F6E56]" },
  ATIVO:      { label: "Ativo",      classe: "bg-blue-50 text-blue-700" },
  DEVOLVIDO:  { label: "Devolvido",  classe: "bg-gray-100 text-gray-600" },
  CANCELADO:  { label: "Cancelado",  classe: "bg-red-50 text-red-700" },
};

export default async function DetalhesAluguel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const aluguel = await prisma.aluguel.findUnique({
    where: { id },
    include: {
      usuario: true,
      equipamento: { include: { categoria: true } },
    },
  });

  if (!aluguel) notFound();

  const dias = Math.ceil(
    (new Date(aluguel.dataFim).getTime() - new Date(aluguel.dataInicio).getTime()) / 86400000
  );

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center gap-3">
        <a href="/admin/alugueis" className="text-gray-400 hover:text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </a>
        <h1 className="text-base font-medium text-gray-800">Detalhes do aluguel</h1>
        <span className={`h-5 px-2 rounded-full text-[10px] font-medium inline-flex items-center ml-auto ${statusLabel[aluguel.status]?.classe}`}>
          {statusLabel[aluguel.status]?.label}
        </span>
      </div>

      <div className="p-6 grid grid-cols-[1fr_300px] gap-6 max-w-5xl">
        {/* Info principal */}
        <div className="flex flex-col gap-4">

          {/* Equipamento */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Equipamento</h2>
            <div className="flex items-center gap-3">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                {aluguel.equipamento.categoria.nome}
              </div>
            </div>
            <div className="text-base font-medium text-gray-800 mt-1">
              {aluguel.equipamento.nome}
            </div>
            <div className="text-sm text-[#1D9E75] mt-1">
              R$ {aluguel.equipamento.precoPorDia.toFixed(2)}/dia
            </div>
          </div>

          {/* Cliente */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Cliente</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center text-sm font-medium text-[#1D9E75]">
                {aluguel.usuario.nome.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{aluguel.usuario.nome}</div>
                <div className="text-xs text-gray-400">{aluguel.usuario.email}</div>
                {aluguel.usuario.telefone && (
                  <div className="text-xs text-gray-400">{aluguel.usuario.telefone}</div>
                )}
              </div>
            </div>
          </div>

          {/* Período */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Período</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Início</div>
                <div className="text-sm font-medium text-gray-800">
                  {new Date(aluguel.dataInicio).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Devolução</div>
                <div className="text-sm font-medium text-gray-800">
                  {new Date(aluguel.dataFim).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Duração</div>
                <div className="text-sm font-medium text-gray-800">{dias} dias</div>
              </div>
            </div>
          </div>

          {/* Entrega */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Modalidade</h2>
            <div className="flex items-center gap-2">
              <span className={`h-6 px-3 rounded-full text-xs font-medium inline-flex items-center ${
                aluguel.entrega ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
              }`}>
                {aluguel.entrega ? "Entrega em domicílio" : "Retirada na loja"}
              </span>
            </div>
            {aluguel.endereco && (
              <p className="text-sm text-gray-500 mt-2">{aluguel.endereco}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Total */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Resumo financeiro</h2>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>R$ {aluguel.equipamento.precoPorDia.toFixed(2)} × {dias} dias</span>
              <span>R$ {aluguel.precoTotal.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-medium text-gray-800">
              <span>Total</span>
              <span>R$ {aluguel.precoTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Ações */}
          <AluguelActions aluguelId={aluguel.id} statusAtual={aluguel.status} />
        </div>
      </div>
    </div>
  );
}