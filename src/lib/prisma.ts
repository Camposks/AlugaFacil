import { PrismaClient } from "@prisma/client";

// 1. Declara a tipagem do objeto global corretamente para o TypeScript
declare global {
  var prisma: PrismaClient | undefined;
}

// 2. Instancia o cliente reaproveitando a conexão global se ela já existir
const client =
  globalThis.prisma ??
  new PrismaClient({
    errorFormat: "minimal", // Mantém os logs de erro limpos no terminal do Docker
  });

// 3. Em ambiente de desenvolvimento, salva a instância no escopo global
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client;
}

// 4. Exporta o cliente para você usar nos seus Server Actions / API Routes
export const prisma = client;