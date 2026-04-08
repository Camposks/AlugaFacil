"use client";

import { useCarrinho } from "@/contexts/CarrinhoContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CarrinhoPage() {
  const { itens, removerItem, limparCarrinho, totalPreco } = useCarrinho();
  const { data: session } = useSession();
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleConfirmar() {
    if (!session) {
      router.push("/login?callbackUrl=/carrinho");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      for (const item of itens) {
        const res = await fetch("/api/alugueis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            equipamentoId: item.equipamentoId,
            dataInicio: item.dataInicio.toISOString(),
            dataFim: item.dataFim.toISOString(),
            entrega: item.entrega,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setErro(data.erro || "Erro ao realizar reserva.");
          setCarregando(false);
          return;
        }
      }

      limparCarrinho();
      router.push("/minha-conta");
    } catch {
      setErro("Erro ao realizar reservas.");
      setCarregando(false);
    }
  }

  if (itens.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center gap-4">
        <svg className="w-16 h-16 stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p className="text-gray-500 text-sm">Seu carrinho está vazio</p>
        <Link
          href="/equipamentos"
          className="h-10 px-6 bg-[#1D9E75] text-white text-sm font-medium rounded-lg flex items-center hover:bg-[#0F6E56] transition-colors"
        >
          Ver equipamentos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-[#1D9E75] px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-medium text-white">Carrinho</h1>
          <p className="text-[#9FE1CB] text-sm">{itens.length} item(s) selecionado(s)</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 grid grid-cols-[1fr_300px] gap-6">
        {/* Lista de itens */}
        <div className="flex flex-col gap-3">
          {itens.map((item) => (
            <div key={item.equipamentoId} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4">
              <div className="relative w-24 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                {item.imagem ? (
                  <Image
                    src={item.imagem}
                    alt={item.nome}
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
                <div className="text-sm font-medium text-gray-800 mb-1">{item.nome}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {item.dataInicio.toLocaleDateString("pt-BR")} —{" "}
                  {item.dataFim.toLocaleDateString("pt-BR")} · {item.totalDias} dias
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-5 px-2 rounded-full text-[10px] font-medium inline-flex items-center ${
                    item.entrega ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {item.entrega ? "Entrega" : "Retirada"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removerItem(item.equipamentoId)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                  </svg>
                </button>
                <span className="text-sm font-medium text-[#1D9E75]">
                  R$ {item.precoTotal.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 h-fit sticky top-20">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Resumo</h2>

          <div className="flex flex-col gap-2 mb-4">
            {itens.map((item) => (
              <div key={item.equipamentoId} className="flex justify-between text-xs text-gray-500">
                <span className="truncate mr-2">{item.nome}</span>
                <span>R$ {item.precoTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 mb-4 flex justify-between text-sm font-medium text-gray-800">
            <span>Total</span>
            <span>R$ {totalPreco.toFixed(2)}</span>
          </div>

          {erro && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-3">{erro}</p>
          )}

          <button
            onClick={handleConfirmar}
            disabled={carregando}
            className="w-full h-10 bg-[#1D9E75] text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-[#0F6E56] transition-colors"
          >
            {carregando ? "Processando..." : "Confirmar reservas"}
          </button>

          <button
            onClick={limparCarrinho}
            className="w-full h-9 mt-2 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpar carrinho
          </button>
        </div>
      </div>
    </div>
  );
}