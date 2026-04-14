# Regras do Projeto E-Lance

## 1. Exclusão de Arquivos (Ignore Rules)
Sempre ignore os seguintes tipos de arquivos para economizar tokens e evitar processamento desnecessário:
- `node_modules/`, `dist/`, `build/`, `.git/`
- Arquivos de mídia: `.jpg`, `.jpeg`, `.png`, `.webp`, `.mp4`, `.mov`, `.gif`, `.svg`
- Logs de build: `build_output*.log`, `npm-debug.log`
- Arquivos temporários: `temp_*.html`, `raw.html`, `*.tmp`
- Dados brutos: `.csv`, `.xlsx`, `.pdf` (exceto se explicitamente solicitado para análise)

## 2. Padrões de Sistema de E-mail
- **Serviço Centralizado:** Sempre use o serviço `sendEmail` em `services/emailService.ts`.
- **Verificação SMTP:** No backend (`server/index.js`), todo envio deve ser precedido por `await transporter.verify()` para garantir a saúde da conexão.
- **Identidade do Remetente:** O campo `from` deve obrigatoriamente coincidir com o e-mail de autenticação SMTP para evitar bloqueios por SPAM. 
- **Resposta:** O e-mail de contato real (`contato@elance.com.br`) deve ser configurado no campo `replyTo`.

## 3. Estética e Design (Dashboard Premium)
- **Frontend:** Use HTML, TypeScript e React com Tailwind CSS.
- **Visual:** Siga o padrão "Navy" (#151d38) e "Azul Vibrante" (#3a7ad1) para manter a identidade da E-Lance.
- **Imagens:** Use a logo oficial pública: `https://static.s4bdigital.net/logos_empresas/logoELance.jpg`

## 4. Web Crawler (Scraper)
- Sempre utilize o `scrapeLatestAuctions` em `server/services/scraperService.js` para garantir dados atualizados com 1ª e 2ª praças diretamente da API Superbid.
