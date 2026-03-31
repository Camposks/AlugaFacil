"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  usuario: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
  };
}

export default function EditarPerfilForm({ usuario }: Props) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const [form, setForm] = useState({
    nome: usuario.nome,
    telefone: usuario.telefone,
    endereco: usuario.endereco,
  });

  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  async function handlePerfil(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setSucesso(false);

    const res = await fetch("/api/conta/perfil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setCarregando(false);

    if (!res.ok) {
      setErro("Erro ao atualizar perfil.");
      return;
    }

    setSucesso(true);
    router.refresh();
  }

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    if (senhaForm.novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    const res = await fetch("/api/conta/senha", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(senhaForm),
    });

    const data = await res.json();
    setCarregando(false);

    if (!res.ok) {
      setErro(data.erro || "Erro ao alterar senha.");
      return;
    }

    setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    setSucesso(true);
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Dados pessoais */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-medium text-gray-800 mb-5">Dados pessoais</h2>
        <form onSubmit={handlePerfil} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nome completo</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">E-mail</label>
            <input
              type="email"
              value={usuario.email}
              disabled
              className="w-full h-10 border border-gray-100 rounded-lg px-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400 mt-1">O e-mail não pode ser alterado</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Telefone</label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              placeholder="(00) 00000-0000"
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Endereço</label>
            <input
              type="text"
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              placeholder="Rua, número, bairro, cidade"
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
            />
          </div>

          {sucesso && (
            <p className="text-xs text-[#1D9E75] bg-[#E1F5EE] px-3 py-2 rounded-lg">
              Perfil atualizado com sucesso!
            </p>
          )}

          {erro && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
          )}

          <div className="flex gap-3 pt-1">
            <Link
              href="/minha-conta"
              className="h-10 px-5 border border-gray-200 text-gray-500 text-sm rounded-lg flex items-center hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={carregando}
              className="h-10 px-6 bg-[#1D9E75] text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-[#0F6E56] transition-colors"
            >
              {carregando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>

      {/* Alterar senha */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-medium text-gray-800 mb-5">Alterar senha</h2>
        <form onSubmit={handleSenha} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Senha atual</label>
            <input
              type="password"
              value={senhaForm.senhaAtual}
              onChange={(e) => setSenhaForm({ ...senhaForm, senhaAtual: e.target.value })}
              placeholder="••••••••"
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Nova senha</label>
            <input
              type="password"
              value={senhaForm.novaSenha}
              onChange={(e) => setSenhaForm({ ...senhaForm, novaSenha: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Confirmar nova senha</label>
            <input
              type="password"
              value={senhaForm.confirmarSenha}
              onChange={(e) => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })}
              placeholder="Repita a nova senha"
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#1D9E75]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="h-10 px-6 bg-gray-800 text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-gray-900 transition-colors w-fit"
          >
            {carregando ? "Alterando..." : "Alterar senha"}
          </button>
        </form>
      </div>

    </div>
  );
}