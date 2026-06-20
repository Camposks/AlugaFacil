"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  userName: string;
  userEmail: string;
}

export default function AdminSidebar({ userName, userEmail }: Props) {
  const [aberto, setAberto] = useState(false);

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    },
    {
      href: "/admin/equipamentos",
      label: "Equipamentos",
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    },
    {
      href: "/admin/categorias",
      label: "Categorias",
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    },
    {
      href: "/admin/alugueis",
      label: "Aluguéis",
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>,
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
  ];

  return (
    <>
      {/* Botão hambúrguer — só no mobile */}
      <button
        onClick={() => setAberto(true)}
        className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10 bg-[#1D9E75] rounded-lg flex items-center justify-center shadow-md"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Overlay — fecha o menu ao clicar fora, só no mobile */}
      {aberto && (
        <div
          onClick={() => setAberto(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <aside className={`w-56 bg-[#1D9E75] flex flex-col fixed top-0 left-0 h-full z-50 transition-transform duration-200 ${
        aberto ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setAberto(false)}>
            <Image
              src="/logo.png"
              alt="AlugaFácil"
              width={120}
              height={50}
              className="object-contain brightness-0 invert"
              style={{ width: 120, height: "auto" }}
            />
          </Link>
          <button onClick={() => setAberto(false)} className="lg:hidden text-white/70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <span className="text-[9px] text-white/50 tracking-widest uppercase mt-1 block px-5">
          painel admin
        </span>

        <nav className="flex flex-col py-4 flex-1">
          <span className="px-5 text-[10px] text-white/40 uppercase tracking-widest mb-2">Menu</span>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAberto(false)}
              className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 border-l-2 border-transparent hover:border-white transition-all"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium text-white shrink-0">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-xs text-white font-medium truncate">{userName}</span>
              <span className="text-[10px] text-white/50 truncate">{userEmail}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}