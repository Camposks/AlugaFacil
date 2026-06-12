# --- ESTÁGIO 1: Dependências ---
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma

# Instala as dependências de forma limpa e gera o Prisma Client
RUN npm ci && npx prisma generate

# --- ESTÁGIO 2: Builder (Apenas Produção) ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desativa telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Variáveis de Build (Injetadas no HTML/JS do Client-side)
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=$NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

# Compila o projeto (Certifique-se de ter 'output: "standalone"' no seu next.config.ts)
RUN npm run build

# --- ESTÁGIO 3: Runner (Produção Final) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3010
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache openssl

# Cria usuário de sistema por segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia apenas os artefatos gerados pelo standalone do Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3010

# Executa o servidor otimizado nativo do Node
CMD ["node", "server.js"]