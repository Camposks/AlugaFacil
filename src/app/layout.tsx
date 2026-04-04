import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "AlugaFácil — Locação de Ferramentas & Máquinas",
    template: "%s | AlugaFácil",
  },
  description:
    "Alugue máquinas, ferramentas e equipamentos para sua obra ou reforma. Entrega rápida, preço justo e pagamento online seguro.",
  keywords: [
    "aluguel de ferramentas",
    "locação de máquinas",
    "aluguel de equipamentos",
    "ferramentas para obra",
    "reforma",
    "construção",
  ],
  authors: [{ name: "AlugaFácil" }],
  creator: "AlugaFácil",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXTAUTH_URL,
    siteName: "AlugaFácil",
    title: "AlugaFácil — Locação de Ferramentas & Máquinas",
    description:
      "Alugue máquinas, ferramentas e equipamentos para sua obra ou reforma.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlugaFácil — Locação de Ferramentas & Máquinas",
    description:
      "Alugue máquinas, ferramentas e equipamentos para sua obra ou reforma.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}