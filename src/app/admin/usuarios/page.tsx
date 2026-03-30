import { prisma } from "@/lib/prisma";
import UsuarioActions from "@/components/admin/UsuarioActions";

export default async function AdminUsuarios() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      _count: {
        select: { alugueis: true },
      },
    },
  });

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium text-gray-800">Usuários</h1>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          Total: <span className="font-medium text-gray-700">{usuarios.length}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Usuário</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Telefone</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Aluguéis</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Perfil</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Cadastro</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm text-gray-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center text-xs font-medium text-[#1D9E75]">
                          {u.nome.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm text-gray-700 font-medium">{u.nome}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {u.telefone || "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {u._count.alugueis}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`h-5 px-2 rounded-full text-[10px] font-medium inline-flex items-center ${
                        u.perfil === "ADMIN"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.perfil === "ADMIN" ? "Admin" : "Cliente"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {new Date(u.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3">
                      <UsuarioActions
                        usuarioId={u.id}
                        perfilAtual={u.perfil}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}