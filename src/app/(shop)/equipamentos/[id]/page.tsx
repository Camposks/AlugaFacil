import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReservaForm from "@/components/equipment/ReservaForm";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const equipamento = await prisma.equipamento.findUnique({
    where: { id },
    include: { categoria: true },
  });

  if (!equipamento) {
    return { title: "Equipamento não encontrado" };
  }

  return {
    title: equipamento.nome,
    description: `Alugue ${equipamento.nome} por R$ ${equipamento.precoPorDia.toFixed(2)}/dia. ${equipamento.descricao}`,
    openGraph: {
      title: equipamento.nome,
      description: `Alugue ${equipamento.nome} por R$ ${equipamento.precoPorDia.toFixed(2)}/dia.`,
      images: equipamento.imagens[0] ? [{ url: equipamento.imagens[0] }] : [],
    },
  };
}

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    dataInicio?: string;
    dataFim?: string;
    entrega?: string;
  }>;
}
interface EquipamentoRelacionado {
  id: string;
  nome: string;
  precoPorDia: number;
  imagens: string[];
}

export default async function DetalhesEquipamento({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const equipamento = await prisma.equipamento.findUnique({
    where: { id },
    include: {
      categoria: true,
      avaliacoes: {
        include: { usuario: true },
        orderBy: { criadoEm: "desc" },
        take: 5,
      },
    },
  });

  if (!equipamento) notFound();

  const relacionados = await prisma.equipamento.findMany({
    where: {
      categoriaId: equipamento.categoriaId,
      id: { not: equipamento.id },
      disponivel: true,
    },
    take: 3,
  });

  const mediaAvaliacao =
    equipamento.avaliacoes.length > 0
      ? equipamento.avaliacoes.reduce((acc: number, a: { nota: number }) => acc + a.nota, 0) /
        equipamento.avaliacoes.length
      : 0;

  const agora = new Date();

function tempoRelativo(data: Date) {
  const diff = agora.getTime() - data.getTime();
    const dias = Math.floor(diff / 86400000);
    if (dias === 0) return "hoje";
    if (dias === 1) return "há 1 dia";
    if (dias < 7) return `há ${dias} dias`;
    if (dias < 30) return `há ${Math.floor(dias / 7)} semana(s)`;
    return `há ${Math.floor(dias / 30)} mês(es)`;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="text-[#1D9E75]">Início</Link>
        <span>›</span>
        <Link href="/equipamentos" className="text-[#1D9E75]">Equipamentos</Link>
        <span>›</span>
        <span className="text-gray-600">{equipamento.nome}</span>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6 grid grid-cols-[1fr_340px] gap-6">

        {/* Coluna esquerda */}
        <div className="flex flex-col gap-5">

          {/* Galeria */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="relative h-72 bg-gray-50 flex items-center justify-center">
              {equipamento.imagens[0] ? (
                <Image
                  src={equipamento.imagens[0]}
                  alt={equipamento.nome}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <svg className="w-14 h-14 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              )}
            </div>
            {equipamento.imagens.length > 1 && (
              <div className="flex gap-2 p-3">
                {equipamento.imagens.map((img: string, i: number) => (
                  <div key={i} className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200 cursor-pointer">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              {equipamento.categoria.nome}
            </div>
            <h1 className="text-xl font-medium text-gray-800 mb-3">
              {equipamento.nome}
            </h1>
            {mediaAvaliacao > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill={s <= Math.round(mediaAvaliacao) ? "#1D9E75" : "#e5e7eb"}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {mediaAvaliacao.toFixed(1)} · {equipamento.avaliacoes.length} avaliações
                </span>
              </div>
            )}
            <p className="text-sm text-gray-500 leading-relaxed">
              {equipamento.descricao}
            </p>
          </div>

          {/* Avaliações */}
          {equipamento.avaliacoes.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h2 className="text-base font-medium text-gray-800 mb-4">
                Avaliações dos clientes
              </h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {equipamento.avaliacoes.map((av: { id: string; usuario: { nome: string }; criadoEm: Date; nota: number; comentario: string | null }) => (
                  <div key={av.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center text-[11px] font-medium text-[#1D9E75]">
                          {av.usuario.nome.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {av.usuario.nome}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {tempoRelativo(av.criadoEm)}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-3 h-3" viewBox="0 0 24 24" fill={s <= av.nota ? "#1D9E75" : "#e5e7eb"}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    {av.comentario && (
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {av.comentario}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relacionados */}
          {relacionados.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h2 className="text-base font-medium text-gray-800 mb-4">
                Equipamentos relacionados
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {relacionados.map((rel: EquipamentoRelacionado) => (
                  <Link
                    key={rel.id}
                    href={`/equipamentos/${rel.id}`}
                    className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    <div className="relative h-20 bg-gray-50 flex items-center justify-center">
                      {rel.imagens[0] ? (
                        <Image src={rel.imagens[0]} alt={rel.nome} fill className="object-contain p-2"/>
                      ) : (
                        <svg className="w-8 h-8 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      )}
                    </div>
                    <div className="p-2.5">
                      <div className="text-xs font-medium text-gray-700 mb-1">{rel.nome}</div>
                      <div className="text-xs text-[#1D9E75]">R$ {rel.precoPorDia.toFixed(2)}/dia</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna direita — formulário de reserva */}
        <div>
          <ReservaForm
            equipamentoId={equipamento.id}
            precoPorDia={equipamento.precoPorDia}
            disponivel={equipamento.disponivel}
            dataInicioInicial={sp.dataInicio ? new Date(sp.dataInicio) : null}
            dataFimInicial={sp.dataFim ? new Date(sp.dataFim) : null}
            entregaInicial={sp.entrega === "true"}
          />
        </div>
      </div>
    </div>
  );
}