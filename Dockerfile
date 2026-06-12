FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
<<<<<<< HEAD

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
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dummy
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV AUTH_SECRET=$AUTH_SECRET
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET

# Desativa telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Gera o Prisma Client antes do build
RUN npx prisma generate

# Compila o projeto em modo standalone (necessário para Docker)
=======
>>>>>>> cbdb4db (Preparar projeto para deploy Docker no Contabo)
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3010

RUN apk add --no-cache openssl

COPY --from=deps /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/public ./public
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/prisma.config.ts ./prisma.config.ts
COPY --from=deps /app/next.config.ts ./next.config.ts
COPY --from=deps /app/next-env.d.ts ./next-env.d.ts
COPY --from=deps /app/src ./src

EXPOSE 3010
CMD ["npm", "start"]
