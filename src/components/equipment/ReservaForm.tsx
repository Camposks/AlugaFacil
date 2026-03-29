"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
  equipamentoId: string;
  precoPorDia: number;
  disponivel: boolean;
}

export default function ReservaForm({ equipamentoId, precoPorDia, disponivel }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [entrega, setEntrega] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const diasSemana = ["D","S","T","Q","Q","S","S"];

  function getDiasDoMes(mes: number, ano: number) {
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    return { primeiroDia, totalDias };
  }

  function handleDiaClick(dia: number) {
    const data = new Date(anoAtual, mesAtual, dia);
    if (data < hoje) return;

    if (!dataInicio || (dataInicio && dataFim)) {
      setDataInicio(data);
      setDataFim(null);
    } else {
      if (data < dataInicio) {
        setDataInicio(data);
        setDataFim(null);
      } else {
        setDataFim(data);
      }
    }
  }

  function getDiaStatus(dia: number) {
    const data = new Date(anoAtual, mesAtual, dia);
    if (data < hoje) return "disabled";
    if (dataInicio && data.toDateString() === dataInicio.toDateString()) return "selected";
    if (dataFim && data.toDateString() === dataFim.toDateString()) return "selected";
    if (dataInicio && dataFim && data > dataInicio && data < dataFim) return "range";
    return "normal";
  }

  const totalDias = dataInicio && dataFim
    ? Math.ceil((dataFim.getTime() - dataInicio.getTime()) / 86400000)
    : 0;

  const totalPreco = totalDias * precoPorDia;

  async function handleReserva() {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!dataInicio || !dataFim) return;

    setCarregando(true);
    const res = await fetch("/api/alugueis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        equipamentoId,
        dataInicio,
        dataFim,
        entrega,
      }),
    });

    setCarregando(false);

    if (res.ok) {
      router.push("/minha-conta");
    }
  }

  const { primeiroDia, totalDias: totalDiasNoMes } = getDiasDoMes(mesAtual, anoAtual);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 sticky top-20">
      {/* Preço */}
      <div className="flex items-baseline gap-1.5 mb-5">
        <span className="text-2xl font-medium text-[#1D9E75]">
          R$ {precoPorDia.toFixed(2)}
        </span>
        <span className="text-sm text-gray-400">/dia</span>
      </div>

      {/* Calendário */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
          <button
            onClick={() => {
              if (mesAtual === 0) { setMesAtual(11); setAnoAtual(anoAtual - 1); }
              else setMesAtual(mesAtual - 1);
            }}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >‹</button>
          <span className="text-sm font-medium text-gray-700">
            {meses[mesAtual]} {anoAtual}
          </span>
          <button
            onClick={() => {
              if (mesAtual === 11) { setMesAtual(0); setAnoAtual(anoAtual + 1); }
              else setMesAtual(mesAtual + 1);
            }}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >›</button>
        </div>

        <div className="p-2">
          <div className="grid grid-cols-7 mb-1">
            {diasSemana.map((d, i) => (
              <div key={i} className="text-center text-[10px] text-gray-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: primeiroDia }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: totalDiasNoMes }).map((_, i) => {
              const dia = i + 1;
              const status = getDiaStatus(dia);
              return (
                <button
                  key={dia}
                  onClick={() => handleDiaClick(dia)}
                  disabled={status === "disabled"}
                  className={`text-center text-xs py-1.5 rounded transition-colors ${
                    status === "selected" ? "bg-[#1D9E75] text-white font-medium" :
                    status === "range" ? "bg-[#E1F5EE] text-[#1D9E75]" :
                    status === "disabled" ? "text-gray-300 cursor-default" :
                    "text-gray-700 hover:bg-[#E1F5EE] hover:text-[#1D9E75]"
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Datas selecionadas */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-[10px] text-gray-400 mb-0.5">Início</div>
          <div className="text-sm text-gray-700">
            {dataInicio ? dataInicio.toLocaleDateString("pt-BR") : "—"}
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-[10px] text-gray-400 mb-0.5">Devolução</div>
          <div className="text-sm text-gray-700">
            {dataFim ? dataFim.toLocaleDateString("pt-BR") : "—"}
          </div>
        </div>
      </div>

      {/* Entrega */}
      <div
        onClick={() => setEntrega(!entrega)}
        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer mb-4 transition-colors ${
          entrega ? "border-[#1D9E75] bg-[#E1F5EE]" : "border-gray-200"
        }`}
      >
        <div>
          <div className="text-sm font-medium text-gray-700">Entrega em casa</div>
          <div className="text-xs text-gray-400">Receba em até 24h</div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          entrega ? "border-[#1D9E75] bg-[#1D9E75]" : "border-gray-300"
        }`}>
          {entrega && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      </div>

      {/* Total */}
      {totalDias > 0 && (
        <div className="border-t border-gray-100 pt-3 mb-4 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>R$ {precoPorDia.toFixed(2)} × {totalDias} dias</span>
            <span>R$ {totalPreco.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-800">
            <span>Total</span>
            <span>R$ {totalPreco.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleReserva}
        disabled={!disponivel || !dataInicio || !dataFim || carregando}
        className="w-full h-10 bg-[#1D9E75] text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0F6E56] transition-colors"
      >
        {!disponivel ? "Indisponível" :
         carregando ? "Processando..." :
         !session ? "Entrar para reservar" :
         !dataInicio || !dataFim ? "Selecione as datas" :
         "Reservar agora"}
      </button>
    </div>
  );
}