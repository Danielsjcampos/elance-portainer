import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { 
            franchise_unit_id, 
            segment_id, 
            html, 
            subject,
            mode = 'send_now' // 'send_now' = usar HTML fornecido, 'auto' = gerar automaticamente
        } = req.body;

        if (!franchise_unit_id) {
            return res.status(400).json({ error: 'franchise_unit_id is required' });
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
            // Get segment rules
            const { data: segment } = await supabase
                .from('email_segments')
                .select('*')
                .eq('id', segment_id)
                .single();

            if (segment) {
                // Get contacts matching segment
                let query = supabase
                    .from('email_contacts')
                    .select('*')
                    .eq('status', 'ativo')
                    .eq('franchise_unit_id', franchise_unit_id);
                
                const { data } = await query;
                
                // Filter by segment rules
                if (data && segment.regras) {
                    contacts = data.filter(contact => {
                        if (segment.regras.interests && segment.regras.interests.length > 0) {
                            const contactInterests = contact.interesses || [];
                            return segment.regras.interests.some(i => contactInterests.includes(i));
                        }
                        return true;
                    });
                } else {
                    contacts = data || [];
                }
            }
        } else {
            // All active contacts
            const { data } = await supabase
                .from('email_contacts')
                .select('*')
                .eq('status', 'ativo')
                .eq('franchise_unit_id', franchise_unit_id);
            contacts = data || [];
        }

        if (contacts.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'Nenhum contato ativo encontrado no segmento selecionado.',
                sent: 0,
                errors: 0
            });
        }

        // 3. If no HTML was provided and mode is 'auto', generate it
        let emailHtml = html;
        let emailSubject = subject || 'Informativo Semanal - E-Lance Leilões';

        if (!emailHtml) {
            return res.status(400).json({ error: 'HTML do informativo é obrigatório. Gere a prévia antes de disparar.' });
        }

        // 4. Send emails with throttling
        let sentCount = 0;
        let errorCount = 0;
        const errors = [];
        const baseUrl = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://elance.com.br';

        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            
            try {
                // Throttle: wait 2 seconds between sends
                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                // Add unsubscribe footer
                const unsubUrl = `${baseUrl}/api/email/unsubscribe?contactId=${contact.id}`;
                const finalHtml = emailHtml + `
                    <div style="font-size: 11px; color: #999; margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-family: sans-serif;">
                        <p>Este e-mail foi enviado por E-Lance.</p>
                        <p>Para não receber mais este tipo de conteúdo, <a href="${unsubUrl}" style="color: #3a7ad1; text-decoration: underline;">clique aqui para se descadastrar</a>.</p>
                    </div>
                `;

                // Send via the appropriate provider
                const sendPayload = {
                    to: contact.email,
                    subject: emailSubject,
                    html: finalHtml,
                    config: smtpConfig
                };

                // Use internal fetch to /api/email/send or directly send
                if (smtpConfig.provider === 'brevo') {
                    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'api-key': smtpConfig.brevo_key,
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            sender: {
                                name: smtpConfig.sender_name || 'E-Lance',
                                email: smtpConfig.sender_email || 'noreply@elance.com.br'
                            },
                            to: [{ email: contact.email }],
                            subject: emailSubject,
                            htmlContent: finalHtml
                        })
                    });
                    const brevoData = await brevoResponse.json();
                    if (!brevoResponse.ok) throw new Error(brevoData.message || 'Brevo Error');
                } else {
                    // SMTP via nodemailer
                    const { default: nodemailer } = await import('nodemailer');
                    const transporter = nodemailer.createTransport({
                        host: smtpConfig.host?.trim(),
                        port: parseInt(smtpConfig.port),
                        secure: parseInt(smtpConfig.port) === 465,
                        auth: {
                            user: smtpConfig.user?.trim(),
                            pass: smtpConfig.pass
                        },
                        tls: { rejectUnauthorized: false }
                    });

                    await transporter.sendMail({
                        from: `"${smtpConfig.sender_name || 'E-Lance'}" <${smtpConfig.user?.trim()}>`,
                        to: contact.email,
                        replyTo: smtpConfig.sender_email || 'contato@elance.com.br',
                        subject: emailSubject,
                        html: finalHtml
                    });
                }

                // Log to email_queue for tracking
                await supabase.from('email_queue').insert({
                    contato_id: contact.id,
                    template_id: null,
                    status: 'enviado',
                    sent_at: new Date().toISOString(),
                    scheduled_for: new Date().toISOString()
                });

                sentCount++;
                console.log(`✅ Sent newsletter to ${contact.email} (${sentCount}/${contacts.length})`);

            } catch (err) {
                errorCount++;
                errors.push({ email: contact.email, error: err.message });
                console.error(`❌ Error sending to ${contact.email}:`, err.message);
            }
        }

        // 5. Log the dispatch in email_automations
        await supabase.from('email_automations').upsert({
            type: 'weekly_auctions',
            franchise_unit_id: franchise_unit_id,
            last_run: new Date().toISOString(),
            last_result: {
                sent: sentCount,
                errors: errorCount,
                total_contacts: contacts.length,
                timestamp: new Date().toISOString()
            }
        }, { onConflict: 'type,franchise_unit_id' });

        return res.status(200).json({
            success: true,
            message: `Disparo concluído! ${sentCount} e-mails enviados com sucesso.`,
            sent: sentCount,
            errors: errorCount,
            total: contacts.length,
            errorDetails: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('🔥 Trigger Newsletter Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
