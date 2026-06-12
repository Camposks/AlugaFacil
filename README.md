# AlugaFácil

App Next.js com Prisma e PostgreSQL.

## Executando localmente com Docker

1. Crie um arquivo `.env` baseado em `.env.example`.
2. Ajuste `DATABASE_URL` para apontar ao seu banco PostgreSQL no Contabo ou ao container local.
3. Inicie os serviços:

```bash
docker compose up --build
```

4. Acesse o site em `http://localhost:3010`.

## Comandos úteis

- `npm run dev` - inicia o servidor de desenvolvimento.
- `npm run build` - gera o build de produção.
- `npm start` - inicia o servidor Next.js em produção.

## Variáveis de ambiente necessárias

- `DATABASE_URL` - string de conexão PostgreSQL.
- `NEXTAUTH_URL` - URL base do site (ex: `http://localhost:3010`).
- `NEXTAUTH_SECRET` - segredo para NextAuth.
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`

## Remoção de Vercel/Neon

Este projeto foi ajustado para não depender de configurações Neon nem dos arquivos de deploy da Vercel. A conexão com o banco agora usa o cliente Prisma padrão e a URL de fallback é `http://localhost:3010`.
