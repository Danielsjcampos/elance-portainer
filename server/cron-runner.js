/**
 * =============================================
 * E-Lance — Cron Runner Dedicado
 * =============================================
 * Este processo roda ISOLADO no container "cron" do Portainer.
 * Responsabilidades:
 *   - Polling a cada 5 minutos
 *   - Verificar automações ativas de newsletter semanal
 *   - Chamar o backend interno para disparar os e-mails
 *   - Registrar logs detalhados para debug no Portainer
 * 
 * Lógica de agendamento:
 *   - Verifica dia da semana e hora configurada (±15 min de tolerância)
 *   - Controla frequência: weekly / biweekly / monthly
 *   - Atualiza last_run_at no Supabase para evitar duplo envio
 * =============================================
 */

import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS  = 5 * 60 * 1000;   // 5 minutos
const STARTUP_DELAY_MS  = 15 * 1000;        // 15s após iniciar
const BACKEND_URL       = process.env.BACKEND_INTERNAL_URL || 'http://backend:3010';
const CRON_SECRET       = process.env.CRON_SECRET || '';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ FATAL: SUPABASE_URL ou SUPABASE_SERVICE_KEY não definidos!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Mapa de dias ────────────────────────────────────────────────────────────
const DAY_MAP = {
    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5, 'saturday': 6,
    // suporte ao português também
    'domingo': 0, 'segunda': 1, 'terca': 2, 'quarta': 3,
    'quinta': 4, 'sexta': 5, 'sabado': 6,
};

function getMinimumIntervalMs(frequency) {
    switch (frequency) {
        case 'biweekly': return 13 * 24 * 60 * 60 * 1000;  // 13 dias
        case 'monthly':  return 27 * 24 * 60 * 60 * 1000;  // 27 dias
        case 'weekly':
        default:         return 6  * 24 * 60 * 60 * 1000;  // 6 dias
    }
}

// ─── Core: verificar e disparar automações ───────────────────────────────────
async function checkAndRunAutomations() {
    const now        = new Date();
    const currentDay = now.getDay();               // 0=Dom..6=Sab
    const currentH   = now.getHours();
    const currentMin = now.getMinutes();
    const tz         = Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(now);

    console.log(`\n🔍 [${now.toISOString()}] Checando automações... (São Paulo: ${tz})`);

    let automations;
    try {
        const { data, error } = await supabase
            .from('email_automations')
            .select('id, franchise_unit_id, config, last_run_at')
            .eq('active', true)
            .eq('type', 'weekly_auctions');

        if (error) throw error;
        automations = data || [];
    } catch (err) {
        console.error('❌ Erro ao buscar automações:', err.message);
        return;
    }

    if (automations.length === 0) {
        console.log('📭 Nenhuma automação ativa encontrada.');
        return;
    }

    console.log(`📋 ${automations.length} automação(ões) ativa(s) encontrada(s).`);

    for (const auto of automations) {
        const cfg = auto.config || {};
        await processAutomation(auto, cfg, now, currentDay, currentH, currentMin);
    }
}

async function processAutomation(auto, cfg, now, currentDay, currentH, currentMin) {
    const label = `[Unit:${auto.franchise_unit_id}|ID:${auto.id}]`;

    // 1. Está habilitado na config?
    if (cfg.enabled === false) {
        console.log(`  ⏸️  ${label} Config.enabled=false. Pulando.`);
        return;
    }

    // 2. Dia da semana correto?
    const scheduledDayStr = (cfg.day || 'monday').toLowerCase();
    const scheduledDay    = DAY_MAP[scheduledDayStr] ?? 1;
    if (currentDay !== scheduledDay) {
        console.log(`  ⏭️  ${label} Hoje não é ${cfg.day} (hoje=${currentDay}, esperado=${scheduledDay}). Pulando.`);
        return;
    }

    // 3. Horário correto (±15 min de tolerância)?
    const [schedH, schedMin] = (cfg.hour || '09:00').split(':').map(Number);
    const scheduledTotal = schedH * 60 + schedMin;
    const currentTotal   = currentH * 60 + currentMin;
    if (Math.abs(currentTotal - scheduledTotal) > 15) {
        console.log(`  ⏭️  ${label} Fora da janela de horário (agora=${currentH}:${String(currentMin).padStart(2,'0')}, programado=${cfg.hour || '09:00'}). Pulando.`);
        return;
    }

    // 4. Frequência (evitar envio duplo)
    if (auto.last_run_at) {
        const lastRun    = new Date(auto.last_run_at);
        const elapsed    = now.getTime() - lastRun.getTime();
        const minInterval = getMinimumIntervalMs(cfg.frequency || 'weekly');
        if (elapsed < minInterval) {
            const daysAgo = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            console.log(`  ⏭️  ${label} Já executado há ${daysAgo} dia(s). Frequência: ${cfg.frequency || 'weekly'}. Pulando.`);
            return;
        }
    }

    // 5. Todos os checks passaram — disparar!
    console.log(`  🚀 ${label} Disparando newsletter automática...`);
    try {
        const result = await triggerBackend(auto.franchise_unit_id, cfg);
        
        // 6. Atualizar last_run_at no Supabase
        await supabase
            .from('email_automations')
            .update({ 
                last_run_at: now.toISOString(),
                last_result: result
            })
            .eq('id', auto.id);

        console.log(`  ✅ ${label} Concluído! Resultado:`, JSON.stringify(result));
    } catch (err) {
        console.error(`  ❌ ${label} Falha no disparo:`, err.message);
        
        // Registra o erro sem atualizar last_run_at (para tentar novamente)
        await supabase
            .from('email_automations')
            .update({ 
                last_result: { error: err.message, timestamp: now.toISOString() }
            })
            .eq('id', auto.id);
    }
}

async function triggerBackend(franchiseUnitId, cfg) {
    // Passo 1: Scrape de leilões via backend interno
    const scrapeRes = await fetch(`${BACKEND_URL}/api/marketing/scrape-auctions`, {
        headers: CRON_SECRET ? { Authorization: `Bearer ${CRON_SECRET}` } : {}
    });
    if (!scrapeRes.ok) {
        throw new Error(`Scrape falhou: HTTP ${scrapeRes.status}`);
    }
    const scrapeData = await scrapeRes.json();

    if (!scrapeData.success || !scrapeData.auctions?.length) {
        throw new Error(`Scrape sem resultados: ${scrapeData.error || 'lista vazia'}`);
    }

    console.log(`    🕷️  ${scrapeData.auctions.length} leilões raspados.`);

    // Passo 2: Disparar newsletter via backend
    const triggerRes = await fetch(`${BACKEND_URL}/api/marketing/trigger-newsletter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(CRON_SECRET ? { Authorization: `Bearer ${CRON_SECRET}` } : {})
        },
        body: JSON.stringify({
            franchise_unit_id: franchiseUnitId,
            segment_id: cfg.segment_id || 'all',
            subject: cfg.subject || 'Informativo Semanal - Oportunidades E-Lance',
            html: generateStaticNewsletter(scrapeData.auctions),
            mode: 'send_now'
        })
    });

    if (!triggerRes.ok) {
        const errData = await triggerRes.json().catch(() => ({}));
        throw new Error(`Trigger falhou: HTTP ${triggerRes.status} — ${errData.error || 'erro desconhecido'}`);
    }

    return await triggerRes.json();
}

// ─── HTML estático da newsletter (idêntico ao api/cron/newsletter.js) ────────
function generateStaticNewsletter(auctions) {
    const incentives = [
        "Comprar em leilão é acessar oportunidades que o mercado tradicional nunca oferece.",
        "Os melhores negócios não estão nas imobiliárias — estão nos leilões.",
        "Você sabia que é possível adquirir imóveis com valores muito abaixo da avaliação?",
        "Leilão não é risco — é oportunidade para quem sabe como funciona.",
        "Os melhores investidores do mercado utilizam leilões como estratégia."
    ];
    const randomIncentive = incentives[Math.floor(Math.random() * incentives.length)];

    const HEADER = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Informativo E-Lance</title>
    <!--[if mso]>
    <style type="text/css">table{border-collapse:collapse;}td,th{font-family:Arial,sans-serif;}</style>
    <![endif]-->
    <style type="text/css">
        body,table,td{font-family:'Segoe UI',Tahoma,Geneva,Verdana,Arial,sans-serif;}
        img{border:0;outline:none;text-decoration:none;}
        table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}
    </style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:#eff0f1;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#eff0f1">
    <tr><td align="center" style="padding:20px 10px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="width:600px;background-color:#ffffff;">
            <tr><td align="center" bgcolor="#151d38" style="background-color:#151d38;padding:30px 20px;">
                <img src="https://static.s4bdigital.net/logos_empresas/logoELance.jpg" alt="E-Lance" width="180" style="display:block;width:180px;height:auto;" />
                <p style="color:#ffffff;font-size:12px;font-family:Arial,sans-serif;margin:10px 0 0;">(11) 94166-0975 | contato@elance.com.br</p>
            </td></tr>
            <tr><td style="padding:40px 30px 0 30px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr><td align="center" style="font-size:28px;font-weight:800;color:#151d38;font-family:Arial,sans-serif;padding-bottom:10px;">Oportunidades E-Lance</td></tr>
                    <tr><td align="center" style="font-style:italic;color:#475569;font-size:14px;line-height:22px;font-family:Arial,sans-serif;padding-bottom:25px;border-bottom:2px solid #3a7ad1;">&ldquo;${randomIncentive}&rdquo;</td></tr>
                </table>
            </td></tr>
            <tr><td style="padding:10px 30px 40px 30px;">`;

    let bodyHtml = '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
    for (let i = 0; i < auctions.length; i += 2) {
        bodyHtml += '<tr>';
        [auctions[i], auctions[i + 1]].forEach(auc => {
            if (auc) {
                bodyHtml += `
                <td width="50%" valign="top" style="padding:8px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;">
                        <tr><td align="center" bgcolor="#f8fafc">
                            <img src="${auc.image}" width="260" height="140" alt="${auc.title}" style="display:block;width:100%;height:140px;border:0;" />
                        </td></tr>
                        <tr><td style="padding:12px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr><td style="font-size:12px;color:#151d38;font-weight:700;font-family:Arial,sans-serif;line-height:16px;height:35px;overflow:hidden;">${auc.title}</td></tr>
                                <tr><td style="font-size:13px;color:#3a7ad1;font-weight:800;font-family:Arial,sans-serif;padding-top:8px;">2ª Praça: ${auc.secondPrice || '---'} - ${auc.secondDate || '---'}</td></tr>
                                <tr><td align="center" style="padding-top:10px;">
                                    <a href="${auc.link}" target="_blank" style="display:block;text-align:center;background-color:#151d38;color:#ffffff;padding:10px 8px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;font-family:Arial,sans-serif;">VER LEILÃO</a>
                                </td></tr>
                            </table>
                        </td></tr>
                    </table>
                </td>`;
            } else {
                bodyHtml += '<td width="50%" valign="top" style="padding:8px;">&nbsp;</td>';
            }
        });
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table>';

    const FOOTER = `
            </td></tr>
            <tr><td align="center" bgcolor="#f8fafc" style="padding:40px 30px;border-top:1px solid #f1f5f9;">
                <p style="font-size:11px;color:#94a3b8;font-family:Arial,sans-serif;">&copy; 2026 E-Lance Leilões Brasil.<br/>Av. Duque de Caxias 18-29, Bauru-SP.</p>
            </td></tr>
        </table>
    </td></tr>
</table>
</body></html>`;

    return HEADER + bodyHtml + FOOTER;
}

// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM recebido — encerrando cron runner graciosamente...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT recebido — encerrando cron runner graciosamente...');
    process.exit(0);
});

// ─── Bootstrap ───────────────────────────────────────────────────────────────
console.log('');
console.log('╔══════════════════════════════════════════╗');
console.log('║  E-Lance Cron Runner — Newsletter Weekly ║');
console.log('╚══════════════════════════════════════════╝');
console.log(`📅 Backend URL: ${BACKEND_URL}`);
console.log(`⏱️  Poll interval: ${POLL_INTERVAL_MS / 1000 / 60} minutos`);
console.log(`🔐 CRON_SECRET: ${CRON_SECRET ? '✅ configurado' : '⚠️  não configurado'}`);
console.log('');

// Primeira verificação após delay de startup
setTimeout(() => {
    checkAndRunAutomations();
    // Loop a cada 5 minutos
    setInterval(checkAndRunAutomations, POLL_INTERVAL_MS);
}, STARTUP_DELAY_MS);

console.log(`⏳ Aguardando ${STARTUP_DELAY_MS / 1000}s para a primeira verificação...`);
