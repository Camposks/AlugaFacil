"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ItemCarrinho {
  equipamentoId: string;
  nome: string;
  imagem: string;
  precoPorDia: number;
  dataInicio: Date;
  dataFim: Date;
  entrega: boolean;
  totalDias: number;
  precoTotal: number;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (item: ItemCarrinho) => void;
  removerItem: (equipamentoId: string) => void;
  limparCarrinho: () => void;
  totalItens: number;
  totalPreco: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  
  // Carrega do localStorage ao iniciar
 const [itens, setItens] = useState<ItemCarrinho[]>(() => {
    if (typeof window === "undefined") return [];
   const salvo = localStorage.getItem("carrinho");
    if (!salvo) return [];
    const parsed = JSON.parse(salvo);
    return parsed.map((item: ItemCarrinho & { dataInicio: string; dataFim: string }) => ({
      ...item,
      dataInicio: new Date(item.dataInicio),
      dataFim: new Date(item.dataFim),
    }));
  });

  // Salva no localStorage quando muda
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(itens));
  }, [itens]);

  function adicionarItem(item: ItemCarrinho) {
    setItens((prev) => {
      const existe = prev.find((i) => i.equipamentoId === item.equipamentoId);
      if (existe) {
        return prev.map((i) =>
          i.equipamentoId === item.equipamentoId ? item : i
        );
      }
      return [...prev, item];
    });
  }

  function removerItem(equipamentoId: string) {
    setItens((prev) => prev.filter((i) => i.equipamentoId !== equipamentoId));
  }

  function limparCarrinho() {
    setItens([]);
  }

  const totalItens = itens.length;
  const totalPreco = itens.reduce((acc, item) => acc + item.precoTotal, 0);

  return (
    <CarrinhoContext.Provider value={{
      itens,
      adicionarItem,
      removerItem,
      limparCarrinho,
      totalItens,
      totalPreco,
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  return context;
}