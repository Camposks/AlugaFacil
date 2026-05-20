# =============================================================================
# Dockerfile — AlugaFácil (Next.js 16 + Prisma + PostgreSQL)
# Multi-stage build: deps → builder → runner
# Imagem final baseada em alpine para minimizar tamanho
# =============================================================================

# =============================================================================
# STAGE 1: deps
# Instala apenas as dependências de produção e desenvolvimento
# Separado para aproveitar o cache do Docker layer
# =============================================================================
FROM node:20-alpine AS deps

# Instala dependências nativas necessárias para alguns pacotes npm
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copia arquivos de dependências e os arquivos de configuração do Prisma
# para permitir postinstall e geração do client durante npm ci.
COPY package.json package-lock.json prisma prisma.config.ts ./

ARG DATABASE_URL=postgresql://dummy:dummy@dummy:5432/dummy
ENV DATABASE_URL=$DATABASE_URL

# Instala todas as dependências, mas IGNORA scripts (evita rodar `prisma generate` aqui)
# O Prisma Client será gerado explicitamente no stage `builder` onde todo o código
# fonte (incluindo `prisma/schema.prisma`) já foi copiado.
RUN npm ci --ignore-scripts


# =============================================================================
# STAGE 2: builder
# Compila o projeto Next.js em modo produção
# =============================================================================
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copia node_modules do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia todo o código fonte
COPY . .

# ⚠️ ADAPTE: Defina aqui apenas variáveis NEXT_PUBLIC_* necessárias no build
# Variáveis sensíveis (API secrets) usam valores dummy durante build
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ARG DATABASE_URL=postgresql://dummy:dummy@dummy:5432/dummy
ARG RESEND_API_KEY=dummy_key_for_build
ARG AUTH_SECRET=dummy_secret_for_build
ARG CLOUDINARY_API_KEY=dummy_key_for_build
ARG CLOUDINARY_API_SECRET=dummy_secret_for_build

ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=$NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ENV DATABASE_URL=$DATABASE_URL
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV AUTH_SECRET=$AUTH_SECRET
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET

# Desativa telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Gera o Prisma Client antes do build
RUN npx prisma generate

# Compila o projeto em modo standalone (necessário para Docker)
RUN npm run build


# =============================================================================
# STAGE 3: runner
# Imagem final mínima — apenas o necessário para rodar em produção
# NÃO contém código fonte, devDependencies ou cache de build
# =============================================================================
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl curl

WORKDIR /app

# Define modo produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ─── Segurança: cria usuário não-root ────────────────────────────────────────
# O container NÃO roda como root (boa prática de segurança)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ─── Copia apenas os artefatos necessários do stage builder ──────────────────

# Arquivos estáticos públicos (imagens, favicon, etc.)
COPY --from=builder /app/public ./public

# Output standalone do Next.js (server.js + dependências mínimas)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copia node_modules gerado no builder para garantir runtime completo do Prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Arquivos estáticos gerados (_next/static)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Schema do Prisma (necessário em runtime para migrations)
COPY --from=builder /app/prisma ./prisma

# Copia scripts de healthcheck (se presente) e garante executável
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
RUN chmod +x ./scripts/healthcheck.sh || true

# ─── Usuário não-root ─────────────────────────────────────────────────────────
USER nextjs

# Porta exposta pelo Next.js
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ─── Healthcheck ──────────────────────────────────────────────────────────────
# Verifica se a aplicação está respondendo a cada 30s
# 3 falhas consecutivas marcam o container como unhealthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD ["./scripts/healthcheck.sh","http://localhost:3000","/api/health"]

# Inicia o servidor Next.js em modo standalone
CMD ["node", "server.js"]