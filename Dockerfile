# =============================================
# E-Lance Site — Multi-stage Dockerfile
# Stage 1: build do frontend React/Vite
# Stage 2: imagem final com Node + servidor Express + variáveis em runtime
# =============================================

# ---------- Stage 1: Build Frontend ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (cache layer)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copia o restante do código
COPY . .

# Build do frontend (Vite)
# As variáveis VITE_ precisam estar disponíveis em build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GEMINI_API_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Instala apenas dependências de produção + servidor estático
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copia o build do frontend
COPY --from=builder /app/dist ./dist

# Copia todo o código do servidor
COPY server ./server
COPY api ./api

# Porta do servidor Express (backend)
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:3010/health || exit 1

# Inicia o servidor Express (que inclui o scheduler embutido)
CMD ["node", "server/index.js"]
