import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar ou Criar conta",
  description: "Faça login ou crie sua conta para alugar equipamentos no AlugaFácil.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}