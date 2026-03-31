import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-8">

        {/* Grid principal */}
        <div className="grid grid-cols-4 gap-8 mb-8">

          {/* Marca */}
          <div>
            <div className="text-xl font-extrabold text-white tracking-tight mb-1">
              Aluga<span className="text-[#1D9E75]">Fácil</span>
            </div>
            <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-3">
              soluções para sua obra
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[220px] mb-4">
              Locação de máquinas, ferramentas e equipamentos. Simples, rápido e seguro.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Equipamentos */}
          <div>
            <h3 className="text-[10px] font-semibold text-white uppercase tracking-widest mb-3">
              Equipamentos
            </h3>
            <Link href="/equipamentos?categoria=Furadeiras" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Furadeiras</Link>
            <Link href="/equipamentos?categoria=Betoneiras" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Betoneiras</Link>
            <Link href="/equipamentos?categoria=Compressores" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Compressores</Link>
            <Link href="/equipamentos?categoria=Andaimes" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Andaimes</Link>
            <Link href="/equipamentos?categoria=Marteletes" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Marteletes</Link>
            <Link href="/equipamentos" className="block text-xs text-[#1D9E75] mt-1 hover:text-[#0F6E56] transition-colors">Ver todos →</Link>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-[10px] font-semibold text-white uppercase tracking-widest mb-3">
              Empresa
            </h3>
            <a href="#" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Sobre nós</a>
            <a href="#" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Como funciona</a>
            <a href="#" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Blog</a>
            <a href="#" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Contato</a>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-[10px] font-semibold text-white uppercase tracking-widest mb-3">
              Suporte
            </h3>
            <a href="#" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Central de ajuda</a>
            <a href="#" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Termos de uso</a>
            <a href="#" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Privacidade</a>
            <Link href="/minha-conta" className="block text-xs text-gray-500 mb-2 hover:text-[#1D9E75] transition-colors">Minha conta</Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-5" />

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} <span className="text-[#1D9E75]">Campos</span>. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Termos</a>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacidade</a>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}