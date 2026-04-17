# Changelog — E-Lance Admin System

Todas as mudanças notáveis do sistema são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [2.7.1] — 2026-04-17

### 🔧 Melhorias no Raspador & Informativos
Otimização do motor de busca de leilões e classificação automática inteligente.

#### Melhorado
- **Motor de Busca**: Aumentado o limite de captura de 600 para **3.000 anúncios** (100 páginas).
- **Classificador Inteligente**: Nova lógica de categorização que agrupa automaticamente `carros`, `caminhões`, `motos`, `tratores` e `reboques` sob a categoria **Veículos**, e `terrenos`, `fazendas` e `imóveis rurais` sob a categoria **Imóveis**.
- **Opção "Todos"**: Adicionada a opção de exibir **todos** os leilões capturados no informativo por e-mail, removendo o limite anterior de 12 itens.
- **Configuração Padrão**: Categoria "Outros" agora vem habilitada por padrão no painel de automação.

---

## [2.7.0] — 2026-04-09

### 🎨 Novo — Editor Visual de Templates de E-mail
Funcionalidade completa para personalização do informativo semanal sem precisar tocar em código.

#### Adicionado
- **Aba "🎨 Personalizar"** na tela de E-mail & Fluxos → Informativos Inteligentes  
- **Design Dark Mode (OLED)** na tela completa de email-marketing, com tokens de cor profissionais  
- **Editor de Identidade Visual**: logo com preview em tempo real, 6 presets de paleta de cores prontos (E-Lance, Royal Blue, Forest, Midnight, Bourbon, Crimson) + color pickers individuais para cor de cabeçalho e cor de destaque  
- **Editor de Contatos & Redes**: telefone, e-mail, URL do site, WhatsApp (número direto com DDI), Instagram  
- **Editor de Conteúdo**: frase de abertura fixa ou aleatória rotativa (10 frases pré-cadastradas), texto do botão CTA personalizável, seletor de quantidade de anúncios (4 / 6 / 8 / 10 / 12), toggles de categorias (Imóveis / Veículos / Outros)  
- **Editor de Rodapé**: texto legal e endereço com suporte a múltiplas linhas  
- **Botão "Aplicar ao Preview"**: regenera o HTML do informativo com as configurações atuais e exibe no iframe  
- **Botão "Salvar Template"**: persiste todas as configurações no campo `config` do Supabase (`email_automations`), dentro de uma nova chave `template`  
- **Persistência automática**: ao carregar a tela, o template salvo é restaurado automaticamente  
- Seções colapsáveis com ícones contextuais (Identidade / Contatos / Conteúdo / Rodapé)  
- Tipografia **Cinzel** (headings) + **Josefin Sans** (body) via Google Fonts — estética real estate premium  

#### Melhorado
- Função `buildEmailHtml()` centralizada e parametrizada: agora todas as configurações do template são injetadas no HTML do e-mail (logo, cores, contatos, redes, CTA, categorias, quantidade de itens)  
- Header da página com badge de status animado (glow verde quando ativo)  
- Barra de resultado de disparo com visual dark-mode e contadores coloridos  
- Barra de envio de teste integrada ao preview com feedback imediato  
- Botões com hover states, transições 150ms, cursors corretos (accessibility: WCAG AA)  
- Zero emojis como ícones — todos substituídos por Lucide React SVGs  

#### Técnico
- `EmailAutomations.tsx` completamente refatorado com design system tokens inline  
- Compatibilidade total com TypeScript (zero erros no `tsc --noEmit`)  
- Design system gerado via **UI-UX Pro Max Skill** (Dark Mode OLED + Real Estate Luxury palette)  

---

## [2.6.2] — 2026-04-08

### 🔧 Correções
- **Fix**: debug endpoint adicionado para diagnóstico de problemas de autenticação  
- **Fix**: `SUPABASE_SERVICE_KEY` corretamente referenciada no backend para bypass de RLS  
- **Fix**: timeout de SMTP aumentado para evitar falhas em envios lentos  

---

## [2.6.1] — 2026-04-08

### 🔧 Correções
- **Fix**: service key do Supabase corretamente configurada no ambiente do servidor  
- **Fix**: endpoint `/api/debug` adicionado para diagnóstico em produção  
- **Fix**: SMTP timeout configurável via variável de ambiente  

---

## [2.6.0] — 2026-04-08

### ✨ Novo
- **Fix**: timeout de SMTP reduzido + filtro de segmento case-insensitive  
- Melhoria no sistema de filas de envio de e-mail (BullMQ)  
- Suporte a múltiplos segmentos de e-mail no disparo de informativos  

---

## [2.5.x] — histórico anterior

Ver commits anteriores no repositório para histórico completo de versões.

---

## Estrutura do Sistema

```
E-Lance Admin System
├── Frontend (React + Vite + Tailwind)
│   ├── Painel Admin (Dashboard, Leads, Marketing, Clientes...)
│   ├── Email Marketing + Informativos Inteligentes ← v2.7.0
│   ├── Automações + Templates Visuais          ← NOVO v2.7.0
│   └── Landing Pages, Blog, Configurações
│
├── Backend (Node.js + Express)
│   ├── API REST (/api/marketing/*, /api/email/*, /api/evolution/*)
│   ├── Scraper de Leilões (Cheerio)
│   ├── Gerador de Newsletter com IA (Gemini)
│   └── SMTP + Nodemailer
│
└── Infraestrutura (Docker + Portainer)
    ├── frontend (nginx:alpine — porta 3000)
    ├── backend (node:20-alpine — porta 3010)
    ├── cron (node:alpine — scheduler 5min)
    └── redis (redis:7-alpine — porta 6379)
```

---

_Mantido pela equipe E-Lance · deploy via Portainer em `elance-portainer.git`_
