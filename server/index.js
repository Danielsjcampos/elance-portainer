import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import evolutionWebhookHandler from '../api/evolution/webhook.js';
import bulkDispatchHandler from '../api/evolution/bulk-dispatch.js';
import { scrapeLatestAuctions } from './services/scraperService.js';
import { generateAuctionNewsletter } from './services/aiMarketingService.js';
import { supabase } from './lib/supabase.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(bodyParser.json());

// ─── Health Check ─────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── Diagnóstico do Backend (verifica Supabase key + SMTP + contatos) ─────────
app.get('/api/debug/status', async (req, res) => {
    const isServiceKey = !!(process.env.SUPABASE_SERVICE_KEY);
    const keyRole = (() => {
        try {
            const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
            const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString());
            return payload.role || 'unknown';
        } catch { return 'invalid_key'; }
    })();

    // Conta contatos sem filtro
    const { data: allContacts, error: contactErr } = await supabase.from('email_contacts').select('id, status');
    const totalContacts = allContacts?.length || 0;
    const activeContacts = (allContacts || []).filter(c => (c.status || '').toLowerCase() === 'ativo').length;

    // Verifica franchise_units
    const { data: units, error: unitsErr } = await supabase.from('franchise_units').select('id, name, smtp_config');
    const unitSummary = (units || []).map(u => ({
        id: u.id,
        name: u.name,
        has_smtp: !!(u.smtp_config?.host || u.smtp_config?.brevo_key),
        smtp_provider: u.smtp_config?.provider || (u.smtp_config?.host ? 'smtp' : 'none'),
        smtp_host: u.smtp_config?.host || null,
        smtp_port: u.smtp_config?.port || null,
    }));

    // Mostra contatos por status para debug
    const statusBreakdown = (allContacts || []).reduce((acc, c) => {
        const s = c.status || 'null';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    res.json({
        supabase: {
            using_service_key: isServiceKey,
            key_role: keyRole,
            rls_bypass: keyRole === 'service_role',
        },
        contacts: {
            total_visible: totalContacts,
            active: activeContacts,
            status_breakdown: statusBreakdown,
            error: contactErr?.message || null,
        },
        franchise_units: unitSummary,
        smtp_unit: unitSummary.find(u => u.has_smtp) || null,
        env: {
            NODE_ENV: process.env.NODE_ENV || 'development',
            SUPABASE_URL: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').substring(0, 40) + '...',
        },
        evolution_api: {
            configured: !!(process.env.EVOLUTION_API_URL && (process.env.EVOLUTION_GLOBAL_API_KEY || process.env.EVOLUTION_INSTANCE_TOKEN)),
            url: process.env.EVOLUTION_API_URL || 'default (https://api.2b.app.br)',
            instance: process.env.EVOLUTION_INSTANCE || 'Elance',
            has_global_key: !!process.env.EVOLUTION_GLOBAL_API_KEY,
            has_instance_token: !!process.env.EVOLUTION_INSTANCE_TOKEN
        }
    });
});

// ─── Servir Frontend Estático ──────────────────
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração de Caminhos para Docker
const rootDir = path.resolve(__dirname, '..');
console.log(`📂 Iniciando servidor no diretório: ${rootDir}`);

// Serve da pasta /app/dist que o Docker criou
app.use(express.static(path.join(rootDir, 'dist')));

// ─── Health Check (usado pelo Docker/Portainer) ──────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'elance-backend' });
});


app.post('/api/email/send', async (req, res) => {
    console.log(`📥 Incoming email request to: ${req.body.to} (Subject: ${req.body.subject})`);
    try {
        const { to, subject, html, config } = req.body;

        // --- BREVO HANDLING ---
        if (config && config.provider === 'brevo') {
            if (!config.brevo_key) return res.status(400).json({ error: 'Missing Brevo API Key' });

            const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': config.brevo_key,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: config.sender_name || 'System',
                        email: config.sender_email || 'noreply@tudosobreleilao.com'
                    },
                    to: [{ email: to }],
                    subject: subject,
                    htmlContent: html
                })
            });
            const data = await brevoResponse.json();
            if (!brevoResponse.ok) throw new Error(data.message || 'Brevo Error');

            console.log('Brevo Message Sent:', data.messageId);
            return res.json({ success: true, messageId: data.messageId });
        }

        // --- SMTP HANDLING ---
        if (!config || !config.host || !config.port) {
            console.error('❌ Missing SMTP config:', config);
            return res.status(400).json({ error: 'Missing SMTP configuration' });
        }

        const host = config.host.trim();
        const port = parseInt(config.port);
        const user = config.user?.trim();
        
        console.log(`📡 SMTP Probe: ${host}:${port} (SSL: ${port === 465}, User: ${user})`);

        // 1. Create transporter with strict settings
        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port === 465, // True for 465
            auth: {
                user: user,
                pass: config.pass,
            },
            tls: {
                rejectUnauthorized: false // Avoid self-signed cert issues
            },
            connectionTimeout: 30000,  // 30s to establish connection
            greetingTimeout: 15000,    // 15s for SMTP greeting
            socketTimeout: 60000,      // 60s idle socket timeout
        });

        // 2. VERIFY connection before sending (Passo 3)
        try {
            await transporter.verify();
            console.log('✅ SMTP Handshake OK');
        } catch (verifyError) {
            console.error('❌ SMTP Auth/Conn Error:', verifyError.message);
            return res.status(500).json({ 
                error: 'Falha na conexão SMTP', 
                details: verifyError.message,
                hint: 'Verifique se o usuário/senha e porta estão corretos no painel de configurações.'
            });
        }

        // 3. Setup Mail Options matching Auth User (Avoid Spam filters)
        const fromEmail = user; 
        const fromName = config.sender_name || 'E-Lance Leilões';
        const replyToEmail = config.sender_email || 'contato@elance.com.br';

        console.log(`📤 Dispatching: "${fromName}" <${fromEmail}> (Reply-To: ${replyToEmail})`);

        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`, // Must match user
            to,
            replyTo: replyToEmail,                 // Real contact email
            subject,
            html,
        });

        console.log('✨ Success! Message ID:', info.messageId);
        res.json({ success: true, messageId: info.messageId });

    } catch (error) {
        console.error('🔥 SMTP Send Error:', error);
        res.status(500).json({ error: `Erro no servidor de e-mail: ${error.message}` });
    }
});

// --- MARKETING & AI ENDPOINTS ---
app.get('/api/marketing/scrape-auctions', async (req, res) => {
    console.log('GET /api/marketing/scrape-auctions');
    try {
        const result = await scrapeLatestAuctions();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/marketing/ai-newsletter', async (req, res) => {
    console.log('POST /api/marketing/ai-newsletter');
    try {
        const { auctions, aiConfig } = req.body;
        const result = await generateAuctionNewsletter(auctions, aiConfig);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- TRIGGER NEWSLETTER (Disparo Imediato) ---
app.post('/api/marketing/trigger-newsletter', async (req, res) => {
    console.log('POST /api/marketing/trigger-newsletter');
    try {
        const { franchise_unit_id, segment_id, html, subject, mode } = req.body;

        if (!franchise_unit_id) {
            return res.status(400).json({ error: 'franchise_unit_id is required' });
        }
        if (!html) {
            return res.status(400).json({ error: 'HTML do informativo é obrigatório. Gere a prévia antes de disparar.' });
        }

        // 1. Get SMTP config
        const { data: franchise, error: franchiseError } = await supabase
            .from('franchise_units')
            .select('smtp_config, name')
            .eq('id', franchise_unit_id)
            .single();

        if (franchiseError || !franchise?.smtp_config) {
            return res.status(400).json({ error: 'SMTP config not found for this franchise' });
        }

        const smtpConfig = franchise.smtp_config;

        // 2. Get contacts from segment
        let contacts = [];
        if (segment_id && segment_id !== 'all') {
            const { data: segment } = await supabase
                .from('email_segments')
                .select('*')
                .eq('id', segment_id)
                .single();

            // regras pode ser array [{...}] ou objeto {...} — normaliza para objeto
            const regras = Array.isArray(segment?.regras) ? segment.regras[0] : segment?.regras;
            const segmentInterests = regras?.interests || [];

            console.log(`🔍 Segmento: "${segment?.nome_segmento}", Interesses: ${JSON.stringify(segmentInterests)}`);

            // Busca todos contatos da franquia (filtra status em JS para evitar case-sensitive)
            let { data: allContacts } = await supabase
                .from('email_contacts')
                .select('*');

            // Filtro de status case-insensitive (aceita 'ativo', 'Ativo', 'active')
            const isActive = (s) => {
                const v = (s || '').toLowerCase().trim();
                return v === 'ativo' || v === 'active';
            };
            allContacts = (allContacts || []).filter(c => isActive(c.status));

            console.log(`📋 Contatos ativos na base: ${allContacts.length}`);

            if (allContacts.length === 0) {
                console.log('⚠️ Nenhum contato ativo encontrado na base.');
                contacts = [];
            } else if (segmentInterests.length > 0) {
                // Filtra por interests (case-insensitive, aceita campo 'interesses' ou 'interests')
                contacts = allContacts.filter(contact => {
                    const raw = contact.interesses || contact.interests || [];
                    const contactInterests = (Array.isArray(raw) ? raw : [raw]).map((i) => String(i).toLowerCase().trim());
                    const match = segmentInterests.some(i => contactInterests.includes(i.toLowerCase().trim()));
                    if (!match) console.log(`  ⤷ Excluído ${contact.email}: interesses=${JSON.stringify(contactInterests)}`);
                    return match;
                });
                console.log(`👥 Após filtro de interesse "${segmentInterests}": ${contacts.length} de ${allContacts.length} contatos`);
            } else {
                contacts = allContacts;
                console.log(`👥 Sem filtro de interesse: usando todos os ${contacts.length} contatos ativos`);
            }
        } else {
            let { data } = await supabase.from('email_contacts').select('*');
            const isActive = (s) => { const v = (s || '').toLowerCase().trim(); return v === 'ativo' || v === 'active'; };
            contacts = (data || []).filter(c => isActive(c.status));
            console.log(`👥 Modo "todos": ${contacts.length} contatos ativos`);
        }

        if (contacts.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'Nenhum contato ativo encontrado no segmento selecionado.',
                sent: 0, errors: 0, total: 0
            });
        }

        console.log(`📬 Dispatching newsletter to ${contacts.length} contacts...`);

        // 3. Send emails with throttling
        let sentCount = 0;
        let errorCount = 0;
        const errors = [];
        const emailSubject = subject || 'Informativo Semanal - E-Lance Leilões';

        // Create SMTP transporter ONCE outside the loop (reuse connection)
        let smtpTransporter = null;
        if (smtpConfig.provider !== 'brevo') {
            smtpTransporter = nodemailer.createTransport({
                host: smtpConfig.host?.trim(),
                port: parseInt(smtpConfig.port),
                secure: parseInt(smtpConfig.port) === 465,
                auth: { user: smtpConfig.user?.trim(), pass: smtpConfig.pass },
                tls: { rejectUnauthorized: false },
                pool: true,         // use connection pool
                maxConnections: 3,  // max parallel connections
                maxMessages: 100    // max messages per connection
            });
            try {
                await smtpTransporter.verify();
                console.log('✅ SMTP Handshake OK — iniciando envio em massa');
            } catch (verifyErr) {
                console.error('❌ SMTP Auth/Conn Error:', verifyErr.message);
                return res.status(500).json({
                    error: 'Falha na conexão SMTP antes do envio em massa',
                    details: verifyErr.message
                });
            }
        }

        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            try {
                if (i > 0) await new Promise(resolve => setTimeout(resolve, 2000));

                const unsubUrl = `${req.headers.origin || 'https://elance.com.br'}/api/email/unsubscribe?contactId=${contact.id}`;
                const finalHtml = html + `
                    <div style="font-size: 11px; color: #999; margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-family: sans-serif;">
                        <p>Este e-mail foi enviado por E-Lance.</p>
                        <p>Para não receber mais, <a href="${unsubUrl}" style="color: #3a7ad1; text-decoration: underline;">clique aqui para se descadastrar</a>.</p>
                    </div>`;

                if (smtpConfig.provider === 'brevo') {
                    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'api-key': smtpConfig.brevo_key,
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            sender: { name: smtpConfig.sender_name || 'E-Lance', email: smtpConfig.sender_email || 'noreply@elance.com.br' },
                            to: [{ email: contact.email }],
                            subject: emailSubject,
                            htmlContent: finalHtml
                        })
                    });
                    const brevoData = await brevoResponse.json();
                    if (!brevoResponse.ok) throw new Error(brevoData.message || 'Brevo Error');
                } else {
                    await smtpTransporter.sendMail({
                        from: `"${smtpConfig.sender_name || 'E-Lance'}" <${smtpConfig.user?.trim()}>`,
                        to: contact.email,
                        replyTo: smtpConfig.sender_email || 'contato@elance.com.br',
                        subject: emailSubject,
                        html: finalHtml
                    });
                }

                // Log to email_queue
                await supabase.from('email_queue').insert({
                    contato_id: contact.id,
                    template_id: null,
                    status: 'enviado',
                    sent_at: new Date().toISOString(),
                    scheduled_for: new Date().toISOString()
                });

                sentCount++;
                console.log(`  ✅ ${sentCount}/${contacts.length} → ${contact.email}`);
            } catch (err) {
                errorCount++;
                errors.push({ email: contact.email, error: err.message });
                console.error(`  ❌ Error → ${contact.email}: ${err.message}`);
            }
        }

        // 4. Log dispatch
        await supabase.from('email_automations').upsert({
            type: 'weekly_auctions',
            franchise_unit_id,
            last_run: new Date().toISOString(),
            last_result: { sent: sentCount, errors: errorCount, total: contacts.length, timestamp: new Date().toISOString() }
        }, { onConflict: 'type,franchise_unit_id' });

        // Close SMTP pool gracefully
        if (smtpTransporter) smtpTransporter.close();

        console.log(`📊 Dispatch complete: ${sentCount} sent, ${errorCount} errors, ${contacts.length} total`);

        return res.json({
            success: true,
            message: `Disparo concluído! ${sentCount} e-mails enviados com sucesso.`,
            sent: sentCount, errors: errorCount, total: contacts.length,
            errorDetails: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('🔥 Trigger Newsletter Error:', error);
        return res.status(500).json({ error: error.message });
    }
});

app.post('/api/ai/generate', async (req, res) => {
    console.log('POST /api/ai/generate');
    const { prompt, aiConfig, systemPrompt } = req.body;

    if (!prompt || !aiConfig) {
        return res.status(400).json({ error: 'Faltam parâmetros obrigatórios (prompt, aiConfig)' });
    }

    const provider = aiConfig.provider || 'gemini';

    try {
        let text = '';

        if (provider === 'gemini') {
            const apiKey = aiConfig.gemini_key;
            if (!apiKey) throw new Error('API Key do Gemini não configurada.');
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt);
            const response = await result.response;
            text = response.text();
        } else if (provider === 'openai') {
            const apiKey = aiConfig.openai_key;
            if (!apiKey) throw new Error('API Key da OpenAI não configurada.');
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: aiConfig.openai_model || 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt || 'Você é um assistente prestativo.' },
                    { role: 'user', content: prompt }
                ]
            }, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            text = response.data.choices[0].message.content;
        } else if (provider === 'openrouter') {
            const apiKey = aiConfig.openrouter_key;
            if (!apiKey) throw new Error('API Key do OpenRouter não configurada.');
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: aiConfig.openrouter_model || 'anthropic/claude-3.5-sonnet',
                messages: [
                    { role: 'system', content: systemPrompt || 'Você é um assistente prestativo.' },
                    { role: 'user', content: prompt }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://elance.com.br',
                    'X-Title': 'E-Lance Portal'
                }
            });
            text = response.data.choices[0].message.content;
        }

        // Clean up common AI markdown wrappers
        text = text.replace(/```json/g, '').replace(/```html/g, '').replace(/```/g, '').trim();

        return res.json({ success: true, text });

    } catch (error) {
        console.error('AI API Error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            error: error.response?.data?.error?.message || error.message 
        });
    }
});

app.post('/api/evolution/webhook', async (req, res) => {
    // Wrapper to make Express req/res act like Vercel req/res if needed, 
    // but the handler is written generically enough to work with express.
    try {
        await evolutionWebhookHandler(req, res);
    } catch (error) {
        console.error('Error in evolution webhook locally:', error);
        if (!res.headersSent) res.status(500).json({ error: error.message });
    }
});

app.post('/api/evolution/bulk-dispatch', async (req, res) => {
    try {
        await bulkDispatchHandler(req, res);
    } catch (error) {
        console.error('Error in bulk dispatch locally:', error);
        if (!res.headersSent) res.status(500).json({ error: error.message });
    }
});

import { runNewsletterAutomation } from './services/automation.js';

// --- MANUAL CRON TRIGGER (pipeline completo: scrape → AI → envio) ---
app.post('/api/cron/run-now', async (req, res) => {
    const secret = req.headers['x-cron-secret'] || req.headers['authorization']?.replace('Bearer ', '');
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized: invalid CRON_SECRET' });
    }

    const { franchise_unit_id } = req.body;
    if (!franchise_unit_id) {
        return res.status(400).json({ error: 'franchise_unit_id is required' });
    }

    console.log(`🔧 Manual cron trigger for unit: ${franchise_unit_id}`);
    try {
        // 1. Scrape auctions
        const scrapeResult = await scrapeLatestAuctions();
        if (!scrapeResult.success || !scrapeResult.auctions?.length) {
            return res.status(500).json({ error: 'Scrape falhou ou sem leilões', details: scrapeResult.error });
        }

        // 2. Get unit AI config
        const { data: unit } = await supabase
            .from('franchise_units')
            .select('smtp_config, ai_config, logo_url, name')
            .eq('id', franchise_unit_id)
            .single();

        if (!unit?.smtp_config) {
            return res.status(400).json({ error: 'SMTP não configurado para esta unidade' });
        }

        // 3. Generate AI newsletter
        const { html, success, error: aiErr } = await generateAuctionNewsletter(
            scrapeResult.auctions, unit.ai_config, unit.logo_url
        );
        if (!success) {
            return res.status(500).json({ error: 'Falha na geração AI', details: aiErr });
        }

        // 4. Get segment from automation config
        const { data: automation } = await supabase
            .from('email_automations')
            .select('config')
            .eq('franchise_unit_id', franchise_unit_id)
            .eq('type', 'weekly_auctions')
            .single();

        const segmentId = automation?.config?.segment_id || 'all';
        const emailSubject = automation?.config?.subject || 'Informativo Semanal - E-Lance Leilões';

        // 5. Delegate to trigger-newsletter (reuses existing send logic)
        const triggerRes = await fetch(`http://localhost:${PORT}/api/marketing/trigger-newsletter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ franchise_unit_id, segment_id: segmentId, html, subject: emailSubject, mode: 'send_now' })
        });
        const result = await triggerRes.json();

        // 6. Update last_run_at
        await supabase
            .from('email_automations')
            .update({ last_run_at: new Date().toISOString(), last_result: result })
            .eq('franchise_unit_id', franchise_unit_id)
            .eq('type', 'weekly_auctions');

        console.log(`✅ Manual cron done for unit ${franchise_unit_id}:`, result);
        return res.json({ success: true, ...result });
    } catch (err) {
        console.error('🔥 Manual cron error:', err);
        return res.status(500).json({ error: err.message });
    }
});

// --- BACKGROUND SCHEDULER ---
// Polls every 5 minutes, but only fires when the configured day/hour matches
const DAY_MAP = {
    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5, 'saturday': 6
};

function getMinimumIntervalMs(frequency) {
    switch (frequency) {
        case 'biweekly': return 13 * 24 * 60 * 60 * 1000; // ~13 days
        case 'monthly':  return 27 * 24 * 60 * 60 * 1000;  // ~27 days
        case 'weekly':
        default:         return 6 * 24 * 60 * 60 * 1000;   // ~6 days
    }
}

const startScheduler = () => {
    console.log('⏰ Starting Automation Scheduler (5min poll)...');

    const checkAutomations = async () => {
        try {
            const now = new Date();
            const currentDay = now.getDay();      // 0=Sun..6=Sat
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            console.log(`🔍 Scheduler check at ${now.toLocaleString('pt-BR')} (day=${currentDay}, ${currentHour}:${String(currentMinute).padStart(2,'0')})`);

            const { data: activeAutomations } = await supabase
                .from('email_automations')
                .select('id, franchise_unit_id, config, last_run_at')
                .eq('active', true)
                .eq('type', 'weekly_auctions');

            if (!activeAutomations || activeAutomations.length === 0) {
                console.log('📭 No active automations found.');
                return;
            }

            for (const auto of activeAutomations) {
                const cfg = auto.config || {};
                const scheduledDay = DAY_MAP[cfg.day] ?? 1; // default monday
                const [scheduledHour, scheduledMinute] = (cfg.hour || '09:00').split(':').map(Number);
                const frequency = cfg.frequency || 'weekly';

                // 1. Check if today is the scheduled day
                if (currentDay !== scheduledDay) continue;

                // 2. Check if we are within the scheduled hour window (±15 min tolerance)
                const scheduledTotalMin = scheduledHour * 60 + scheduledMinute;
                const currentTotalMin = currentHour * 60 + currentMinute;
                if (Math.abs(currentTotalMin - scheduledTotalMin) > 15) continue;

                // 3. Check last_run_at to avoid duplicate sends
                if (auto.last_run_at) {
                    const lastRun = new Date(auto.last_run_at);
                    const elapsed = now.getTime() - lastRun.getTime();
                    const minInterval = getMinimumIntervalMs(frequency);
                    if (elapsed < minInterval) {
                        console.log(`⏭️ Automation ${auto.id} already ran at ${lastRun.toLocaleString('pt-BR')}. Skipping.`);
                        continue;
                    }
                }

                // 4. All checks passed — run the automation!
                console.log(`🚀 Triggering automation ${auto.id} for unit ${auto.franchise_unit_id}`);
                try {
                    await runNewsletterAutomation(auto.franchise_unit_id);

                    // 5. Update last_run_at to prevent re-runs
                    await supabase
                        .from('email_automations')
                        .update({ last_run_at: now.toISOString() })
                        .eq('id', auto.id);

                    console.log(`✅ Automation ${auto.id} completed and last_run_at updated.`);
                } catch (runErr) {
                    console.error(`🔥 Automation ${auto.id} failed:`, runErr);
                }
            }
        } catch (err) {
            console.error('Scheduler Error:', err);
        }
    };

    // Run once on startup after a short delay
    setTimeout(checkAutomations, 10000);
    // Then poll every 5 minutes
    setInterval(checkAutomations, 5 * 60 * 1000);
};

// ─── SPA Fallback (deve ficar DEPOIS de todas as rotas de API) ────────────────
app.use((req, res) => {
    const indexPath = path.join(rootDir, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('❌ Erro ao enviar index.html:', err.message);
            res.status(500).send('Frontend não encontrado. Execute o build primeiro.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`📨 API Server running on port ${PORT}`);
    if (process.env.DISABLE_INTERNAL_SCHEDULER === 'true') {
        console.log('⏸️  Internal scheduler disabled — usando container cron dedicado.');
    } else {
        startScheduler();
    }
});
