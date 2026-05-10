"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Categoria {
  id: string;
  nome: string;
}

interface Props {
  categorias: Categoria[];
  equipamento?: {
    id: string;
    nome: string;
    descricao: string;
    categoriaId: string;
    precoPorDia: number;
    estoque: number;
    disponivel: boolean;
    imagens: string[];
  };
}

export default function FormEquipamento({ categorias, equipamento }: Props) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    nome: equipamento?.nome || "",
    descricao: equipamento?.descricao || "",
    categoriaId: equipamento?.categoriaId || "",
    precoPorDia: equipamento?.precoPorDia || "",
    estoque: equipamento?.estoque || 1,
    disponivel: equipamento?.disponivel ?? true,
  });

  const [imagens, setImagens] = useState<string[]>(equipamento?.imagens || []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadando(true);
    setErro("");

    const novasUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || "Erro ao fazer upload.");
        setUploadando(false);
        return;
      }

      novasUrls.push(data.url);
    }

    setImagens((prev) => [...prev, ...novasUrls]);
    setUploadando(false);
    e.target.value = "";
  }

  function removerImagem(url: string) {
    setImagens((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    const body = {
      ...form,
      precoPorDia: Number(form.precoPorDia),
      estoque: Number(form.estoque),
      imagens,
    };

    const url = equipamento
      ? `/api/admin/equipamentos/${equipamento.id}`
      : "/api/admin/equipamentos";

    const res = await fetch(url, {
      method: equipamento ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setCarregando(false);

    if (!res.ok) {
      setErro("Erro ao salvar equipamento.");
      return;
    }

    router.push("/admin/equipamentos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col gap-4">

      <div>
        <label className="text-xs text-gray-500 block mb-1">Nome</label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="Ex: Furadeira de Impacto 800W"
          className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
          required
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 block mb-1">Descrição</label>
        <textarea
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          placeholder="Descreva o equipamento..."
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75] resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Categoria</label>
          <select
            value={form.categoriaId}
            onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
            className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
            required
          >
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Preço por dia (R$)</label>
          <input
            type="number"
            value={form.precoPorDia}
            onChange={(e) => setForm({ ...form, precoPorDia: e.target.value })}
            placeholder="0,00"
            min="0"
            step="0.01"
            className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Estoque</label>
          <input
            type="number"
            value={form.estoque}
            onChange={(e) => setForm({ ...form, estoque: Number(e.target.value) })}
            min="0"
            className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Disponível</label>
          <div
            onClick={() => setForm({ ...form, disponivel: !form.disponivel })}
            className={`h-10 rounded-lg border px-3 flex items-center gap-2 cursor-pointer transition-colors ${
              form.disponivel ? "bg-[#E1F5EE] border-[#1D9E75]" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              form.disponivel ? "bg-[#1D9E75] border-[#1D9E75]" : "border-gray-300"
            }`}>
              {form.disponivel && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <span className={`text-sm ${form.disponivel ? "text-[#0F6E56]" : "text-gray-400"}`}>
              {form.disponivel ? "Disponível" : "Indisponível"}
            </span>
          </div>
        </div>
      </div>

      {/* Upload de imagens */}
      <div>
        <label className="text-xs text-gray-500 block mb-2">Imagens</label>

        {/* Preview das imagens */}
        {imagens.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {imagens.map((url, i) => (
              <div key={i} className="relative group">
                <div className="relative h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={url}
                    alt={`Imagem ${i + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removerImagem(url)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Área de upload */}
        <label className={`flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          uploadando ? "border-[#1D9E75] bg-[#E1F5EE]" : "border-gray-200 hover:border-[#1D9E75] hover:bg-gray-50"
        }`}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploadando}
          />
          {uploadando ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-[#1D9E75]">Fazendo upload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className="text-xs text-gray-400">Clique para enviar imagens</span>
              <span className="text-[10px] text-gray-300">PNG, JPG, WEBP — múltiplos arquivos</span>
            </div>
          )}
        </label>
      </div>

      {erro && <p className="text-sm text-red-500">{erro}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 px-5 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={carregando || uploadando}
          className="h-10 px-6 bg-[#1D9E75] text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-[#0F6E56] transition-colors"
        >
          {carregando ? "Salvando..." : equipamento ? "Salvar alterações" : "Cadastrar equipamento"}
        </button>
      </div>
    </form>
  );
}