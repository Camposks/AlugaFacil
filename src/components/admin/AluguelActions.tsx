"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  aluguelId: string;
  statusAtual: string;
}

const proximoStatus: Record<string, { label: string; status: string; classe: string }> = {
  PENDENTE:   { label: "Confirmar reserva",  status: "CONFIRMADO", classe: "bg-[#1D9E75] text-white hover:bg-[#0F6E56]" },
  CONFIRMADO: { label: "Marcar como ativo",  status: "ATIVO",      classe: "bg-blue-600 text-white hover:bg-blue-700" },
  ATIVO:      { label: "Marcar como devolvido", status: "DEVOLVIDO", classe: "bg-gray-700 text-white hover:bg-gray-800" },
};

export default function AluguelActions({ aluguelId, statusAtual }: Props) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const proximo = proximoStatus[statusAtual];

  async function handleStatus(novoStatus: string) {
    setCarregando(true);
    await fetch(`/api/admin/alugueis/${aluguelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    setCarregando(false);
    router.refresh();
  }

  async function handleCancelar() {
    if (!confirm("Tem certeza que deseja cancelar este aluguel?")) return;
    setCarregando(true);
    await fetch(`/api/admin/alugueis/${aluguelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELADO" }),
    });
    setCarregando(false);
    router.refresh();
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
      <h2 className="text-sm font-medium text-gray-700">Ações</h2>

      {proximo && (
        <button
          onClick={() => handleStatus(proximo.status)}
          disabled={carregando}
          className={`w-full h-10 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${proximo.classe}`}
        >
          {carregando ? "Processando..." : proximo.label}
        </button>
      )}

      {!["DEVOLVIDO", "CANCELADO"].includes(statusAtual) && (
        <button
          onClick={handleCancelar}
          disabled={carregando}
          className="w-full h-10 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          Cancelar aluguel
        </button>
      )}

      {["DEVOLVIDO", "CANCELADO"].includes(statusAtual) && (
        <p className="text-xs text-gray-400 text-center">
          Este aluguel foi encerrado
        </p>
      )}
    </div>
  );
}