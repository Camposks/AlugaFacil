import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "AlugaFácil",
  description: "Aluguel de máquinas, ferramentas e equipamentos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthSessionProvider>
          <Header />
          <main>{children}</main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}