import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FiltrosEquipamentos from "@/components/equipment/FiltrosEquipamentos";
import Image from "next/image";

interface EquipamentoItem {
  id: string;
  nome: string;
  precoPorDia: number;
  imagens: string[];
  disponivel: boolean;
  categoria: { nome: string };
}

interface Props {
  searchParams: Promise<{
    busca?: string;
    categoria?: string;
    preco?: string;
    ordem?: string;
    disponivel?: string;
    pagina?: string;
  }>;
}

const POR_PAGINA = 8;

export default async function EquipamentosPage({ searchParams }: Props) {
  const params = await searchParams;
  const pagina = Number(params.pagina) || 1;
  const apenasDisponiveis = params.disponivel !== "false";

  const where: {
    disponivel?: boolean;
    nome?: { contains: string; mode: "insensitive" };
    categoria?: { nome: { equals: string; mode: "insensitive" } };
    precoPorDia?: { lte?: number; gte?: number };
  } = {};
  if (apenasDisponiveis) where.disponivel = true;
  if (params.busca) {
    where.nome = { contains: params.busca, mode: "insensitive" };
  }
  if (params.categoria) {
    where.categoria = { nome: { equals: params.categoria, mode: "insensitive" } };
  }
  if (params.preco === "ate50") {
    where.precoPorDia = { lte: 50 };
  } else if (params.preco === "50a100") {
    where.precoPorDia = { gte: 50, lte: 100 };
  } else if (params.preco === "acima100") {
    where.precoPorDia = { gte: 100 };
  }

  let orderBy: { criadoEm?: "desc"; precoPorDia?: "asc" | "desc" } = { criadoEm: "desc" };
  if (params.ordem === "menor") orderBy = { precoPorDia: "asc" };
  if (params.ordem === "maior") orderBy = { precoPorDia: "desc" };

  const [equipamentos, total, categorias] = await Promise.all([
    prisma.equipamento.findMany({
      where,
      orderBy,
      include: { categoria: true },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.equipamento.count({ where }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Banner */}
      <div className="bg-[#1D9E75] py-10 px-4 text-center">
        <h1 className="text-[#E1F5EE] text-2xl font-medium mb-2">
          Encontre o equipamento ideal
        </h1>
        <p className="text-[#9FE1CB] text-sm mb-6">
          Mais de 500 máquinas, ferramentas e equipamentos disponíveis para alugar
        </p>
        <FiltrosEquipamentos
          categorias={categorias.map((c: { id: string; nome: string }) => c.nome)}
          searchParams={params}
        />
      </div>

      {/* Barra de filtros */}
      <div className="bg-white border-b border-gray-100 px-8 py-2.5 flex items-center justify-center gap-2 flex-wrap">
        <Link
          href={{ pathname: "/equipamentos", query: { ...params, disponivel: apenasDisponiveis ? "false" : "true", pagina: 1 } }}
          className={`h-8 px-3 rounded-full border text-xs inline-flex items-center justify-center gap-1.5 transition-colors ${
            apenasDisponiveis
              ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56] font-medium"
              : "border-gray-200 text-gray-500"
          }`}
        >
          {apenasDisponiveis && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
          Disponíveis
        </Link>

        {categorias.map((cat: { id: string; nome: string }) => (
          <Link
            key={cat.id}
            href={{ pathname: "/equipamentos", query: { ...params, categoria: params.categoria === cat.nome ? undefined : cat.nome, pagina: 1 } }}
            className={`h-8 px-3 rounded-full border text-xs inline-flex items-center justify-center transition-colors ${
              params.categoria === cat.nome
                ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56] font-medium"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {cat.nome}
          </Link>
        ))}
      </div>

      {/* Resultados */}
      <div className="px-8 py-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {total} equipamento{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          Ordenar por
          <Link
            href={{ pathname: "/equipamentos", query: { ...params, ordem: "recente", pagina: 1 } }}
            className={params.ordem === "recente" || !params.ordem ? "text-[#1D9E75] font-medium" : ""}
          >Mais recentes</Link>
          <span className="text-gray-300">·</span>
          <Link
            href={{ pathname: "/equipamentos", query: { ...params, ordem: "menor", pagina: 1 } }}
            className={params.ordem === "menor" ? "text-[#1D9E75] font-medium" : ""}
          >Menor preço</Link>
          <span className="text-gray-300">·</span>
          <Link
            href={{ pathname: "/equipamentos", query: { ...params, ordem: "maior", pagina: 1 } }}
            className={params.ordem === "maior" ? "text-[#1D9E75] font-medium" : ""}
          >Maior preço</Link>
        </div>
      </div>

      {/* Grid */}
      {equipamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="w-12 h-12 mb-3 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p className="text-sm">Nenhum equipamento encontrado</p>
          <Link href="/equipamentos" className="mt-3 text-sm text-[#1D9E75]">
            Limpar filtros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 px-8 pb-6">
          {equipamentos.map((eq: EquipamentoItem) => (
            <div key={eq.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
              <div className="relative h-36 bg-gray-50 flex items-center justify-center">
                {eq.imagens[0] ? (
                  <Image src={eq.imagens[0]} alt={eq.nome} fill className="object-contain p-2"/>
                ) : (
                  <svg className="w-10 h-10 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.3">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                )}
                <div className={`absolute top-2.5 left-2.5 h-5 px-2 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                  eq.disponivel ? "bg-[#E1F5EE] text-[#0F6E56]" : "bg-red-50 text-red-700"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${eq.disponivel ? "bg-[#1D9E75]" : "bg-red-500"}`}/>
                  {eq.disponivel ? "Disponível" : "Indisponível"}
                </div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  {eq.categoria.nome}
                </div>
                <div className="text-sm font-medium text-gray-800 mb-2 leading-snug">
                  {eq.nome}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-medium text-[#1D9E75]">
                      R$ {eq.precoPorDia.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">/dia</span>
                  </div>
                  <Link
                    href={`/equipamentos/${eq.id}`}
                    className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      eq.disponivel
                        ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Alugar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-8">
          {pagina > 1 && (
            <Link
              href={{ pathname: "/equipamentos", query: { ...params, pagina: pagina - 1 } }}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 text-sm hover:border-gray-300"
            >‹</Link>
          )}
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <Link
              key={i}
              href={{ pathname: "/equipamentos", query: { ...params, pagina: i + 1 } }}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors ${
                pagina === i + 1
                  ? "bg-[#1D9E75] text-white font-medium"
                  : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {i + 1}
            </Link>
          ))}
          {pagina < totalPaginas && (
            <Link
              href={{ pathname: "/equipamentos", query: { ...params, pagina: pagina + 1 } }}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 text-sm hover:border-gray-300"
            >›</Link>
          )}
        </div>
      )}
    </div>
  );
}