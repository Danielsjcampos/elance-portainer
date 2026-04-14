import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

/**
 * Vercel Cron Job Endpoint
 * This is called automatically by Vercel's cron scheduler.
 * It checks if there's a scheduled automation that should run now and triggers it.
 * 
 * Schedule: Daily at 08:00 UTC (configured in vercel.json)
 */
export default async function handler(req, res) {
    // Vercel Cron sends GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify this is from Vercel Cron (optional security header)
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const results = [];

    try {
        // 1. Find all active weekly_auctions automations
        const { data: automations, error } = await supabase
            .from('email_automations')
            .select('*')
            .eq('type', 'weekly_auctions')
            .eq('active', true);

        if (error) throw error;
        if (!automations || automations.length === 0) {
            return res.status(200).json({ 
                message: 'No active automations found.',
                triggered: 0 
            });
        }

        const now = new Date();
        const dayMap = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 
            'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0
        };
        const currentDay = now.getDay(); // 0=Sun, 1=Mon, ...
        const currentHour = now.getHours();

        for (const auto of automations) {
            const config = auto.config;
            if (!config || !config.enabled) continue;

            // Check if today matches the configured day
            const targetDay = dayMap[config.day] ?? -1;
            if (currentDay !== targetDay) {
                results.push({ 
                    franchise_unit_id: auto.franchise_unit_id, 
                    skipped: true, 
                    reason: `Today is not ${config.day}` 
                });
                continue;
            }

            // Check if we haven't already run today
            if (auto.last_run) {
                const lastRun = new Date(auto.last_run);
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (lastRun >= today) {
                    results.push({ 
                        franchise_unit_id: auto.franchise_unit_id, 
                        skipped: true, 
                        reason: 'Already ran today' 
                    });
                    continue;
                }
            }

            // Check frequency (biweekly / monthly)
            if (config.frequency === 'biweekly' && auto.last_run) {
                const daysSinceLastRun = Math.floor((now - new Date(auto.last_run)) / (1000 * 60 * 60 * 24));
                if (daysSinceLastRun < 13) {
                    results.push({ 
                        franchise_unit_id: auto.franchise_unit_id, 
                        skipped: true, 
                        reason: `Biweekly: only ${daysSinceLastRun} days since last run` 
                    });
                    continue;
                }
            }

            if (config.frequency === 'monthly' && auto.last_run) {
                const daysSinceLastRun = Math.floor((now - new Date(auto.last_run)) / (1000 * 60 * 60 * 24));
                if (daysSinceLastRun < 27) {
                    results.push({ 
                        franchise_unit_id: auto.franchise_unit_id, 
                        skipped: true, 
                        reason: `Monthly: only ${daysSinceLastRun} days since last run` 
                    });
                    continue;
                }
            }

            // Trigger the newsletter dispatch
            try {
                // Step 1: Scrape auctions
                const baseUrl = `https://${req.headers.host}`;
                const scrapeRes = await fetch(`${baseUrl}/api/marketing/scrape-auctions`);
                const scrapeData = await scrapeRes.json();

                if (!scrapeData.success || !scrapeData.auctions?.length) {
                    results.push({ 
                        franchise_unit_id: auto.franchise_unit_id, 
                        error: 'Failed to scrape auctions' 
                    });
                    continue;
                }

                // Step 2: Generate static model HTML (simplified for cron)
                const auctions = scrapeData.auctions;
                const html = generateStaticNewsletter(auctions);

                // Step 3: Send via trigger-newsletter
                const triggerRes = await fetch(`${baseUrl}/api/marketing/trigger-newsletter`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        franchise_unit_id: auto.franchise_unit_id,
                        segment_id: config.segment_id || 'all',
                        html: html,
                        subject: 'Informativo Semanal - Oportunidades E-Lance',
                        mode: 'send_now'
                    })
                });
                const triggerData = await triggerRes.json();

                results.push({ 
                    franchise_unit_id: auto.franchise_unit_id, 
                    success: true,
                    ...triggerData
                });

            } catch (err) {
                results.push({ 
                    franchise_unit_id: auto.franchise_unit_id, 
                    error: err.message 
                });
            }
        }

        return res.status(200).json({
            message: 'Cron job completed',
            timestamp: now.toISOString(),
            results
        });

    } catch (error) {
        console.error('🔥 Cron Newsletter Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Generates an Outlook-compatible static 2-column newsletter HTML.
 * Uses 100% table-based layout for compatibility with Microsoft Word HTML engine.
 */
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
    <!--[if gte mso 9]>
    <xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
    <![endif]-->
    <!--[if mso]>
    <style type="text/css">table{border-collapse:collapse;}td,th{font-family:Arial,sans-serif;}</style>
    <![endif]-->
    <style type="text/css">
        body,table,td{font-family:'Segoe UI',Tahoma,Geneva,Verdana,Arial,sans-serif;}
        img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
        a img{border:none;}
        table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}
    </style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:#eff0f1;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#eff0f1" style="background-color:#eff0f1;">
    <tr>
        <td align="center" style="padding:20px 10px;">
            <!--[if (gte mso 9)|(IE)]><table width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
            <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="width:600px;background-color:#ffffff;" bgcolor="#ffffff">
                <tr>
                    <td align="center" bgcolor="#eff0f1" style="background-color:#eff0f1;padding:10px;font-size:11px;">
                        <a href="https://www.elance.com.br" style="color:#94a3b8;font-size:11px;text-decoration:underline;font-family:Arial,sans-serif;">Visualizar no navegador</a>
                    </td>
                </tr>
                <tr>
                    <td align="center" bgcolor="#151d38" style="background-color:#151d38;padding:30px 20px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center">
                                    <img src="https://static.s4bdigital.net/logos_empresas/logoELance.jpg" alt="E-Lance" width="180" height="80" style="display:block;width:180px;height:auto;max-height:80px;" />
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding-top:20px;padding-bottom:10px;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="padding:0 5px;">
                                                <a href="https://www.elance.com.br/" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" width="24" height="24" alt="Site" style="display:block;width:24px;height:24px;" /></a>
                                            </td>
                                            <td align="center" style="padding:0 5px;">
                                                <a href="https://api.whatsapp.com/send/?phone=5514998536254&amp;text=Quero+saber+mais&amp;type=phone_number" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" width="24" height="24" alt="WhatsApp" style="display:block;width:24px;height:24px;" /></a>
                                            </td>
                                            <td align="center" style="padding:0 5px;">
                                                <a href="https://www.instagram.com/leiloeselance/" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/3955/3955024.png" width="24" height="24" alt="Instagram" style="display:block;width:24px;height:24px;" /></a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="color:#ffffff;font-size:12px;font-family:Arial,sans-serif;padding-top:5px;">(11) 94166-0975 | contato@elance.com.br</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:40px 30px 0 30px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr><td align="center" style="font-size:28px;font-weight:800;color:#151d38;font-family:Arial,sans-serif;padding-bottom:10px;">Oportunidades E-Lance</td></tr>
                            <tr><td align="center" style="font-style:italic;color:#475569;font-size:14px;line-height:22px;font-family:Arial,sans-serif;padding-bottom:25px;border-bottom:2px solid #3a7ad1;">&ldquo;${randomIncentive}&rdquo;</td></tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:10px 30px 40px 30px;">`;

    const FOOTER = `
                    </td>
                </tr>
                <tr>
                    <td align="center" bgcolor="#f8fafc" style="background-color:#f8fafc;padding:40px 30px;border-top:1px solid #f1f5f9;">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr><td align="center" style="font-size:11px;color:#94a3b8;line-height:18px;font-family:Arial,sans-serif;">&copy; 2026 E-Lance Leil&otilde;es Brasil.<br/>Av. Duque de Caxias 18-29, Bauru-SP.</td></tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
        </td>
    </tr>
</table>
</body></html>`;

    let bodyHtml = '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
    for (let i = 0; i < auctions.length; i += 2) {
        bodyHtml += '<tr>';
        [auctions[i], auctions[i + 1]].forEach(auc => {
            if (auc) {
                bodyHtml += `
                <td width="50%" valign="top" style="padding:8px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;">
                        <tr>
                            <td align="center" bgcolor="#f8fafc" style="background-color:#f8fafc;">
                                <img src="${auc.image}" width="260" height="140" alt="${auc.title}" style="display:block;width:100%;height:140px;border:0;" />
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr><td style="font-size:12px;color:#151d38;font-weight:700;font-family:Arial,sans-serif;line-height:16px;height:35px;overflow:hidden;">${auc.title}</td></tr>
                                    <tr><td style="font-size:13px;color:#3a7ad1;font-weight:800;font-family:Arial,sans-serif;padding-top:8px;">2&ordf; Pra&ccedil;a: ${auc.secondPrice || '---'} - ${auc.secondDate || '---'}</td></tr>
                                    <tr>
                                        <td align="center" style="padding-top:10px;">
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr>
                                                    <td align="center" bgcolor="#151d38" style="background-color:#151d38;">
                                                        <!--[if mso]>
                                                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${auc.link}" style="height:36px;v-text-anchor:middle;width:100%;" fillcolor="#151d38" stroke="f">
                                                        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;">VER LEIL&Atilde;O</center>
                                                        </v:roundrect>
                                                        <![endif]-->
                                                        <!--[if !mso]><!-->
                                                        <a href="${auc.link}" target="_blank" style="display:block;text-align:center;background-color:#151d38;color:#ffffff;padding:10px 8px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;font-family:Arial,sans-serif;line-height:16px;">VER LEIL&Atilde;O</a>
                                                        <!--<![endif]-->
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>`;
            } else {
                bodyHtml += '<td width="50%" valign="top" style="padding:8px;">&nbsp;</td>';
            }
        });
        bodyHtml += '</tr>';
    }
    bodyHtml += '</table>';

    return HEADER + bodyHtml + FOOTER;
}
