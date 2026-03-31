"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  aluguelId: string;
  equipamentoId: string;
  equipamentoNome: string;
}

export default function FormAvaliacao({ aluguelId, equipamentoId, equipamentoNome }: Props) {
  const router = useRouter();
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nota === 0) {
      setErro("Selecione uma nota.");
      return;
    }

    setCarregando(true);
    setErro("");

    const res = await fetch("/api/avaliacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aluguelId, equipamentoId, nota, comentario }),
    });

    const data = await res.json();
    setCarregando(false);

    if (!res.ok) {
      setErro(data.erro || "Erro ao enviar avaliação.");
      return;
    }

    setSucesso(true);
    router.refresh();
  }

  if (sucesso) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-sm text-gray-700 font-medium">Avaliação enviada!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-xs text-gray-500">
        Avalie o equipamento: <span className="font-medium text-gray-700">{equipamentoNome}</span>
      </p>

      {/* Estrelas */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setNota(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={s <= (hover || nota) ? "#1D9E75" : "#e5e7eb"}
              className="transition-colors"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
        ))}
        {nota > 0 && (
          <span className="text-xs text-gray-400 ml-2 self-center">
            {["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"][nota]}
          </span>
        )}
      </div>

      {/* Comentário */}
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Conte sua experiência com o equipamento (opcional)"
        rows={3}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75] resize-none"
      />

      {erro && <p className="text-xs text-red-500">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="h-9 px-5 bg-[#1D9E75] text-white text-xs font-medium rounded-lg disabled:opacity-60 hover:bg-[#0F6E56] transition-colors w-fit"
      >
        {carregando ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}