import Link from "next/link";
import { prisma } from "@/lib/prisma";


async function getEquipamentos() {
  try {
    return await prisma.equipamento.findMany({
      where: { disponivel: true },
      include: { categoria: true },
      take: 8,
      orderBy: { criadoEm: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const equipamentos = await getEquipamentos();

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <section className="bg-[#1D9E75] py-16 flex flex-col items-center text-center gap-5 px-4">
        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5">
          <span className="text-[#E1F5EE] text-sm">Aluguel simples e rápido</span>
        </div>
        <h1 className="text-[#E1F5EE] text-3xl font-medium leading-snug max-w-xl">
          Tudo que você precisa para sua obra ou reforma
        </h1>
        <p className="text-[#9FE1CB] text-sm leading-relaxed max-w-md">
          Alugue máquinas, ferramentas e equipamentos com entrega rápida e preço justo.
        </p>
        <Link
  href="/equipamentos"
  className="h-11 px-7 bg-transparent border-2 border-white/60 text-[#E1F5EE] text-sm font-medium rounded-full hover:bg-white/10 hover:border-white transition-colors flex items-center justify-center gap-2"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E1F5EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
  Ver equipamentos
</Link>
        <div className="flex gap-10 mt-2">
          {[
            { num: "500+", label: "Equipamentos" },
            { num: "2k+", label: "Clientes" },
            { num: "24h", label: "Entrega" },
            { num: "4.9", label: "Avaliação" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[#E1F5EE] text-xl font-medium">{s.num}</div>
              <div className="text-[#9FE1CB] text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipamentos em destaque */}
      <section className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-800">Equipamentos em destaque</h2>
          <Link href="/equipamentos" className="text-sm text-[#1D9E75]">
            Ver todos →
          </Link>
        </div>

        {equipamentos.length === 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <div className="h-36 bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-7 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {equipamentos.map((eq) => (
              <div key={eq.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                <div className="h-36 bg-gray-50 flex items-center justify-center">
                  {eq.imagens[0] ? (
                    <img src={eq.imagens[0]} alt={eq.nome} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                    {eq.categoria.nome}
                  </div>
                  <div className="text-sm font-medium text-gray-800 mb-2">{eq.nome}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-[#1D9E75]">
                      R$ {eq.precoPorDia.toFixed(2)}
                      <span className="text-xs font-normal text-gray-400"> /dia</span>
                    </div>
                    <Link
                      href={`/equipamentos/${eq.id}`}
                      className="h-8 px-3 bg-[#1D9E75] text-white text-xs rounded-lg flex items-center gap-1.5 hover:bg-[#0F6E56] transition-colors"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      </section>

      {/* Como funciona */}
      <section className="bg-white border-t border-b border-gray-100 px-8 py-10">
        <h2 className="text-lg font-medium text-gray-800 text-center mb-8">Como funciona</h2>
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            {
              num: "1",
              titulo: "Escolha o equipamento",
              descricao: "Navegue pelo catálogo e encontre o equipamento ideal para sua obra ou reforma.",
            },
            {
              num: "2",
              titulo: "Reserve as datas",
              descricao: "Selecione o período de aluguel e escolha entre entrega em casa ou retirada na loja.",
            },
            {
              num: "3",
              titulo: "Pague e receba",
              descricao: "Pague online com segurança e receba o equipamento pronto para usar.",
            },
          ].map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-10 h-10 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-base font-medium flex items-center justify-center mx-auto mb-3">
                {step.num}
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-2">{step.titulo}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{step.descricao}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}