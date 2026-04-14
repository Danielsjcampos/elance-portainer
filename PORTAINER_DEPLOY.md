# 🚀 Deploy E-Lance no Portainer

## Arquitetura dos Containers

```
┌─────────────────────────────────────────────┐
│             Portainer Stack: elance          │
│                                             │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │   frontend   │    │     backend      │   │
│  │  nginx:alpine│    │  node:20-alpine  │   │
│  │  porta: 3000 │───▶│  porta: 3010     │   │
│  └──────────────┘    └────────┬─────────┘   │
│                               │             │
│  ┌──────────────┐    ┌────────▼─────────┐   │
│  │     cron     │    │     redis        │   │
│  │  node:alpine │───▶│ redis:7-alpine   │   │
│  │  (scheduler) │    │  porta: 6379     │   │
│  └──────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────┘
```

## Pré-requisitos no servidor

- Docker 24+ instalado
- Portainer CE instalado e acessível
- Git instalado

## Passo 1 — Build da imagem no servidor

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/elance.git /opt/elance
cd /opt/elance

# Preencha as variáveis de ambiente
cp .env.example .env
nano .env

# Build
docker build -t elance-backend:latest \
  --build-arg VITE_SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d= -f2) \
  --build-arg VITE_SUPABASE_ANON_KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d= -f2) \
  --build-arg VITE_GEMINI_API_KEY=$(grep VITE_GEMINI_API_KEY .env | cut -d= -f2) \
  .
```

## Passo 2 — Stack no Portainer

1. Portainer → Stacks → Add stack → Nome: `elance`
2. Cole o conteúdo do `docker-compose.yml`
3. Adicione as Environment variables:

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon (pública) |
| `SUPABASE_SERVICE_KEY` | Chave de serviço (privada!) |
| `VITE_GEMINI_API_KEY` | Chave Google Gemini |
| `EVOLUTION_GLOBAL_API_KEY` | Chave Evolution API |
| `EVOLUTION_API_URL` | https://api.2b.app.br |
| `EVOLUTION_INSTANCE` | Elance |
| `CRON_SECRET` | Gere com: openssl rand -hex 32 |

4. Deploy the stack

## Passo 3 — Verificar funcionamento

```bash
# Health check do backend
curl http://SEU_SERVIDOR:3010/health
# Esperado: {"status":"ok",...}

# Logs do cron
docker logs elance-cron -f
```

## Como o Cron da Newsletter funciona

O container `cron` roda `server/cron-runner.js` de forma isolada:

1. A cada 5 minutos verifica automações ativas no Supabase
2. Verifica: dia da semana + horário (+-15min) + frequência mínima
3. Se ok, chama o backend via HTTP interno (http://backend:3010)
4. Backend: scrape leilões → gera HTML → envia e-mails
5. Atualiza `last_run_at` no Supabase para evitar duplo envio

Configure no painel Admin → Marketing → Automações:
- Dia: segunda (ou outro dia)
- Horário: 09:00 (horário de Brasília)
- Frequência: weekly / biweekly / monthly

## Atualizar o sistema

```bash
cd /opt/elance
git pull
docker compose build && docker compose up -d
docker compose logs -f
```

## Troubleshooting

```bash
# Frontend não abre — gere o dist manualmente e reinicie
npm ci && npm run build
docker compose restart frontend

# Cron não dispara
docker logs elance-cron --tail 100

# Redis com problema
docker compose restart redis
```
