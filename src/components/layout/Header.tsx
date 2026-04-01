"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import BotaoLogout from "./BotaoLogout";

const categorias = [
  "Todos",
  "Furadeiras",
  "Betoneiras",
  "Andaimes",
  "Compressores",
  "Lixadeiras",
  "Marteletes",
];

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");

  function handleBusca(e: React.FormEvent) {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/equipamentos?busca=${encodeURIComponent(busca)}`);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 w-full">
      {/* Linha principal */}
      <div className="flex items-center justify-between px-8 h-16 gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="AlugaFácil"
            width={120}
            height={50}
            className="object-contain"
            style={{ width: 120, height: "auto" }}
          />
        </Link>

        {/* Busca */}
        <form onSubmit={handleBusca} className="flex-1 max-w-xl relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 stroke-gray-400"
            viewBox="0 0 24 24" fill="none" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar"
            className="w-full h-9 bg-gray-50 border border-gray-200 rounded-full pl-9 pr-4 text-sm focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10"
          />
        </form>

        {/* Ações */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Carrinho */}
          <Link href="/carrinho" className="relative w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1D9E75] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Login ou conta */}
          {session ? (
          <div className="flex items-center gap-2">
            <Link
              href="/minha-conta"
              className="h-9 px-4 bg-[#1D9E75] text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-[#0F6E56] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {session.user?.name?.split(" ")[0]}
            </Link>
            <BotaoLogout />
          </div>
        ) : (
          <Link
            href="/login"
            className="h-9 px-4 bg-[#1D9E75] text-white text-sm font-medium rounded-lg flex items-center hover:bg-[#0F6E56] transition-colors"
          >
            Entrar
          </Link>
        )}
        </div>
      </div>

      {/* Menu de categorias */}
      <nav className="border-t border-gray-100 px-8 flex items-center justify-center h-10 gap-0 overflow-x-auto scrollbar-hide">
        {categorias.map((cat) => (
        <Link
          key={cat}
          href={cat === "Todos" ? "/equipamentos" : `/equipamentos?categoria=${cat}`}
          className={`px-4 h-full text-sm whitespace-nowrap border-b-2 transition-all flex items-center ${
            categoriaAtiva === cat
              ? "border-[#1D9E75] text-[#1D9E75] font-medium"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setCategoriaAtiva(cat)}
        >
          {cat}
        </Link>
      ))}
        <Link
          href="/equipamentos"
          className="px-4 h-full text-sm whitespace-nowrap border-b-2 border-transparent text-gray-400 hover:text-[#1D9E75] flex items-center transition-all"
        >
          Ver todos →
        </Link>
      </nav>
    </header>
  );
}