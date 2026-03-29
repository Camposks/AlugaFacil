"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormCategoria() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });

    setCarregando(false);

    if (!res.ok) {
      setErro("Erro ao criar categoria.");
      return;
    }

    setNome("");
    router.refresh();
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-800 mb-4">Nova categoria</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Furadeiras"
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
            required
          />
        </div>
        {erro && <p className="text-xs text-red-500">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="h-9 bg-[#1D9E75] text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-[#0F6E56] transition-colors"
        >
          {carregando ? "Salvando..." : "Salvar categoria"}
        </button>
      </form>
    </div>
  );
}