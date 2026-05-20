# =============================================================================
# DOCKER — Guia de uso do AlugaFácil
# =============================================================================

## Arquitetura

AlugaFácil roda em **3 containers**:

| Serviço    | Tipo         | Descrição                                      |
| ---------- | ------------ | ---------------------------------------------- |
| `frontend` | Nginx 1.25   | Reverse proxy + assets estáticos               |
| `app`      | Node 20      | Next.js 16 (backend + SSR)                     |
| `db`       | PostgreSQL   | Banco de dados (local em dev, produção em prod)|

---

## Pré-requisitos

- Docker Desktop instalado
- Docker Compose V2
- Arquivo `.env.local` (dev) ou `.env.prod` (prod)

---

## Desenvolvimento (com hot reload)

### Suba os containers

```bash
docker-compose up -d
```

Isso inicia:
- **Frontend**: Nginx em `http://localhost:3000`
- **App**: Next.js em `http://app:3000` (interno, via Nginx)
- **DB**: PostgreSQL em `postgres://db:5432`

### Rode as migrations do Prisma

```bash
docker-compose exec app npx prisma migrate dev
```

### Acesse a aplicação

```
http://localhost:3000
```

### Ver logs em tempo real

```bash
docker-compose logs -f app
```

### Parar os containers

```bash
docker-compose down
```

---

## Produção

### 1. Crie o arquivo `.env.prod`

```bash
cp .env .env.prod
# Edite .env.prod com os valores de produção
```

Variáveis **obrigatórias**:

```env
# Banco de dados (PostgreSQL local)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<senha_segura>
POSTGRES_DB=alugafacil

# Next.js / NextAuth
AUTH_SECRET=<gerado_com_openssl_rand_-_hex_32>
NEXTAUTH_URL=https://seu-dominio.com

# Resend (e-mails)
RESEND_API_KEY=<sua_chave>
EMAIL_FROM=noreply@seu-dominio.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=<seu_cloud>
CLOUDINARY_API_KEY=<sua_chave>
CLOUDINARY_API_SECRET=<seu_secret>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<seu_cloud>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<seu_preset>
```

### 2. Suba os containers

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### 3. Rode as migrations

```bash
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### 4. Verifique o status

```bash
docker-compose -f docker-compose.prod.yml ps
```

### 5. Ver logs

```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

---

## Comandos úteis

### Rebuild sem cache

```bash
docker-compose build --no-cache
```

### Acessar terminal do container

```bash
docker-compose exec app sh
```

### Rodar Prisma Studio

```bash
docker-compose exec app npx prisma studio
```

### Verificar healthcheck

```bash
curl http://localhost:3000/api/health
```

### Remover tudo (containers, redes, volumes)

```bash
docker-compose down -v
```

### Limpar imagens não usadas

```bash
docker image prune -a
```

---

## Variáveis de ambiente necessárias

### Banco de dados

```env
DATABASE_URL=postgresql://user:password@localhost:5432/alugafacil
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha
POSTGRES_DB=alugafacil
```

### NextAuth

```env
AUTH_SECRET=<gerado_com_openssl_rand_-_hex_32>
NEXTAUTH_URL=http://localhost:3000  # local
NEXTAUTH_URL=https://seu-dominio.com # produção
```

### Resend (e-mails)

```env
RESEND_API_KEY=<sua_chave_api>
EMAIL_FROM=noreply@seu-dominio.com
```

### Cloudinary (imagens)

```env
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud_name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<upload_preset>
```

---

## Segurança (Checklist)

- ✅ Container roda como usuário não-root (`nextjs`)
- ✅ Imagem baseada em `alpine` (tamanho mínimo)
- ✅ Build multi-stage (código fonte não vai para imagem final)
- ✅ `.env*` ignorados no build (`.dockerignore`)
- ✅ Banco exposto apenas internamente
- ✅ Nginx com headers de segurança (adicione conforme necessário)
- ✅ Healthcheck em ambos os ambientes
- ⚠️ **IMPORTANTE**: Configure SSL/TLS em produção (veja próxima seção)

---

## SSL/TLS em Produção (HTTPS)

### Usando Let's Encrypt com Certbot

```bash
# 1. Gere certificados
sudo certbot certonly --standalone -d seu-dominio.com

# 2. Copie para o projeto
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./nginx/certs/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./nginx/certs/

# 3. Atualize nginx/default.conf para usar SSL (veja exemplo abaixo)
```

### Exemplo de nginx/default.conf com SSL

```nginx
server {
  listen 443 ssl http2;
  server_name seu-dominio.com;

  ssl_certificate /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  # ... resto da configuração
}

# Redireciona HTTP para HTTPS
server {
  listen 80;
  server_name seu-dominio.com;
  return 301 https://$server_name$request_uri;
}
```

---

## Troubleshooting

### Porta 3000 já está em uso

```bash
# Linux/Mac: encontre e mate o processo
lsof -i :3000
kill -9 <PID>

# Windows: use o Task Manager ou
netstat -ano | findstr :3000
```

### Banco não conecta

```bash
# Verifique se o container db está rodando
docker-compose ps db

# Verifique os logs
docker-compose logs db

# Teste a conexão manualmente
docker-compose exec db psql -U postgres -d alugafacil -c "SELECT 1;"
```

### Hot reload não funciona (dev)

```bash
# Verifique se os volumes estão corretos
docker-compose config

# Reinicie os containers
docker-compose restart app
```

### Próximo rebuild falha por cache

```bash
docker system prune -a
docker-compose build --no-cache
```

---

## Deploy em Produção

### Opção 1: VPS com Docker (recomendado)

```bash
# 1. SSH em seu servidor
ssh user@seu-servidor

# 2. Clone o repositório
git clone https://github.com/seu-usuario/aluga-facil.git
cd aluga-facil

# 3. Crie .env.prod com variáveis
nano .env.prod

# 4. Suba os containers
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 5. Configure Nginx/Certbot para HTTPS
sudo certbot certonly --nginx -d seu-dominio.com
```

### Opção 2: Platforms (Render, Railway, Fly.io)

- Use o `Dockerfile` diretamente
- Variáveis de ambiente via dashboard da plataforma
- Banco PostgreSQL gerenciado pela plataforma

---

## Performance (Dicas)

1. **Cache de build**: Limpe `docker-compose down -v` apenas se necessário
2. **Recursos**: Ajuste `cpus` e `memory` no `docker-compose.prod.yml`
3. **Logging**: Mude `logging.driver` para limitar crescimento de logs
4. **Nginx**: Configure caching headers para assets estáticos (já no `default.conf`)

