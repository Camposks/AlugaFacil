import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FormAvaliacao from "@/components/account/FormAvaliacao";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Conta",
  description: "Gerencie seus aluguéis, avaliações e dados pessoais.",
  robots: { index: false, follow: false },
};

interface AluguelItem {
  id: string;
  status: string;
  dataInicio: Date;
  dataFim: Date;
  precoTotal: number;
  entrega: boolean;
  equipamentoId: string;
  equipamento: {
    nome: string;
    imagens: string[];
    categoria: { nome: string };
  };
  avaliacao: { nota: number } | null;
}

const statusLabel: Record<string, { label: string; classe: string }> = {
  PENDENTE:   { label: "Pendente",    classe: "bg-yellow-50 text-yellow-700" },
  CONFIRMADO: { label: "Confirmado",  classe: "bg-[#E1F5EE] text-[#0F6E56]" },
  ATIVO:      { label: "Ativo",       classe: "bg-blue-50 text-blue-700" },
  DEVOLVIDO:  { label: "Devolvido",   classe: "bg-gray-100 text-gray-600" },
  CANCELADO:  { label: "Cancelado",   classe: "bg-red-50 text-red-700" },
};

export default async function MinhaContaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
  });

  const alugueis = await prisma.aluguel.findMany({
    where: { usuarioId: session.user.id },
    include: {
      equipamento: {
        include: { categoria: true },
      },
      avaliacao: true,
    },
    orderBy: { criadoEm: "desc" },
  });

  const ativos = alugueis.filter((a: AluguelItem) =>
    ["PENDENTE", "CONFIRMADO", "ATIVO"].includes(a.status)
  );
  const historico = alugueis.filter((a: AluguelItem) =>
    ["DEVOLVIDO", "CANCELADO"].includes(a.status)
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header da conta */}
      <div className="bg-[#1D9E75] px-8 py-10">
        <div className="max-w-4xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-medium text-white">
            {usuario?.nome.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-medium text-white">{usuario?.nome}</h1>
            <p className="text-[#9FE1CB] text-sm">{usuario?.email}</p>
            <Link
              href="/minha-conta/editar"
              className="h-8 px-4 bg-white/20 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 hover:bg-white/30 transition-colors mt-3 w-fit"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar perfil
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 flex flex-col gap-6">

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total de aluguéis", valor: alugueis.length },
            { label: "Aluguéis ativos", valor: ativos.length },
            { label: "Concluídos", valor: historico.filter((a: AluguelItem) => a.status === "DEVOLVIDO").length },
          ].map((m) => (
            <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-1">{m.label}</div>
              <div className="text-2xl font-medium text-gray-800">{m.valor}</div>
            </div>
          ))}
        </div>

        {/* Aluguéis ativos */}
        {ativos.length > 0 && (
          <div>
            <h2 className="text-base font-medium text-gray-800 mb-3">Aluguéis ativos</h2>
            <div className="flex flex-col gap-3">
              {ativos.map((al: AluguelItem) => (
                <div key={al.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                  <div className="relative w-20 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                    {al.equipamento.imagens[0] ? (
                      <Image
                        src={al.equipamento.imagens[0]}
                        alt={al.equipamento.nome}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                      {al.equipamento.categoria.nome}
                    </div>
                    <div className="text-sm font-medium text-gray-800 mb-1">
                      {al.equipamento.nome}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(al.dataInicio).toLocaleDateString("pt-BR")} —{" "}
                      {new Date(al.dataFim).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`h-5 px-2 rounded-full text-[10px] font-medium inline-flex items-center ${statusLabel[al.status]?.classe}`}>
                      {statusLabel[al.status]?.label}
                    </span>
                    <span className="text-sm font-medium text-[#1D9E75]">
                      R$ {al.precoTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Histórico */}
        <div>
          <h2 className="text-base font-medium text-gray-800 mb-3">Histórico</h2>
          {historico.length === 0 && ativos.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl p-10 flex flex-col items-center text-center gap-3">
              <svg className="w-12 h-12 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
              </svg>
              <p className="text-sm text-gray-400">Você ainda não fez nenhum aluguel</p>
              <Link
                href="/equipamentos"
                className="h-9 px-5 bg-[#1D9E75] text-white text-sm font-medium rounded-lg flex items-center hover:bg-[#0F6E56] transition-colors"
              >
                Ver equipamentos
              </Link>
            </div>
          ) : historico.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center text-sm text-gray-400">
              Nenhum aluguel no histórico ainda
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {historico.map((al: AluguelItem) => (
                <div key={al.id} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      {al.equipamento.imagens[0] ? (
                        <Image
                          src={al.equipamento.imagens[0]}
                          alt={al.equipamento.nome}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                        {al.equipamento.categoria.nome}
                      </div>
                      <div className="text-sm font-medium text-gray-800">
                        {al.equipamento.nome}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(al.dataInicio).toLocaleDateString("pt-BR")} —{" "}
                        {new Date(al.dataFim).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`h-5 px-2 rounded-full text-[10px] font-medium inline-flex items-center ${statusLabel[al.status]?.classe}`}>
                        {statusLabel[al.status]?.label}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        R$ {al.precoTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Avaliação */}
                  {al.status === "DEVOLVIDO" && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {al.avaliacao ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= al.avaliacao!.nota ? "#1D9E75" : "#e5e7eb"}>
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">Avaliado</span>
                        </div>
                      ) : (
                        <FormAvaliacao
                          aluguelId={al.id}
                          equipamentoId={al.equipamentoId}
                          equipamentoNome={al.equipamento.nome}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}