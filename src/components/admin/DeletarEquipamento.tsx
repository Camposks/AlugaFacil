"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  equipamentoId: string;
  nome: string;
}

export default function DeletarEquipamento({ equipamentoId, nome }: Props) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function handleDeletar() {
    if (!confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;

    setCarregando(true);
    await fetch(`/api/admin/equipamentos/${equipamentoId}`, {
      method: "DELETE",
    });
    setCarregando(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDeletar}
      disabled={carregando}
      className="w-7 h-7 border border-red-100 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6"/>
      </svg>
    </button>
  );
}