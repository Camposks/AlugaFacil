"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  categorias: string[];
  searchParams: {
    busca?: string;
    categoria?: string;
    preco?: string;
    ordem?: string;
    disponivel?: string;
    pagina?: string;
  };
}

export default function FiltrosEquipamentos({ categorias, searchParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [busca, setBusca] = useState(searchParams.busca || "");
  const [categoria, setCategoria] = useState(searchParams.categoria || "");
  const [preco, setPreco] = useState(searchParams.preco || "");

  function handleBusca(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (busca) params.set("busca", busca);
    if (categoria) params.set("categoria", categoria);
    if (preco) params.set("preco", preco);
    if (searchParams.disponivel) params.set("disponivel", searchParams.disponivel);
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleBusca} className="flex items-center gap-2 bg-white rounded-xl p-1.5 pl-4 max-w-2xl mx-auto">
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar equipamentos..."
        className="flex-2 min-w-0 border-none outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
      />
      <div className="w-px h-5 bg-gray-200 shrink-0" />
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="w-36 border-none outline-none text-sm text-gray-500 bg-transparent cursor-pointer"
      >
        <option value="">Todas categorias</option>
        {categorias.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <div className="w-px h-5 bg-gray-200 shrink-0" />
      <select
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        className="w-36 border-none outline-none text-sm text-gray-500 bg-transparent cursor-pointer"
      >
        <option value="">Qualquer preço</option>
        <option value="ate50">Até R$ 50/dia</option>
        <option value="50a100">R$ 50 — R$ 100/dia</option>
        <option value="acima100">Acima de R$ 100/dia</option>
      </select>
      <button
        type="submit"
        className="h-9 px-4 bg-[#1D9E75] text-white text-sm font-medium rounded-lg flex items-center gap-2 shrink-0 hover:bg-[#0F6E56] transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        Buscar
      </button>
    </form>
  );
}