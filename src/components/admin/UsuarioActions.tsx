"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  usuarioId: string;
  perfilAtual: string;
}

export default function UsuarioActions({ usuarioId, perfilAtual }: Props) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function handleTogglePerfil() {
    const novoPerfil = perfilAtual === "ADMIN" ? "CLIENTE" : "ADMIN";
    const confirmMsg = novoPerfil === "ADMIN"
      ? "Tem certeza que deseja tornar este usuário Admin?"
      : "Tem certeza que deseja remover o acesso Admin deste usuário?";

    if (!confirm(confirmMsg)) return;

    setCarregando(true);
    await fetch(`/api/admin/usuarios/${usuarioId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ perfil: novoPerfil }),
    });
    setCarregando(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleTogglePerfil}
      disabled={carregando}
      title={perfilAtual === "ADMIN" ? "Remover admin" : "Tornar admin"}
      className={`w-7 h-7 border rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${
        perfilAtual === "ADMIN"
          ? "border-purple-200 hover:bg-purple-50"
          : "border-gray-200 hover:bg-gray-100"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={perfilAtual === "ADMIN" ? "#7c3aed" : "#6b7280"} strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </button>
  );
}