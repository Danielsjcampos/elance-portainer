import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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

            return res.status(200).json({ success: true, messageId: data.messageId });
        }

        // --- SMTP HANDLING ---
        if (!config || !config.host || !config.port) {
            return res.status(400).json({ error: 'Missing SMTP configuration' });
        }

        const host = config.host.trim();
        const port = parseInt(config.port);
        const user = config.user?.trim();
        
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
            }
        });

        // 2. VERIFY connection before sending
        try {
            await transporter.verify();
        } catch (verifyError) {
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

        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`, // Must match user
            to,
            replyTo: replyToEmail,                 // Real contact email
            subject,
            html,
        });

        return res.status(200).json({ success: true, messageId: info.messageId });

    } catch (error) {
        console.error('🔥 Serverless SMTP Error:', error);
        return res.status(500).json({ error: `Erro no servidor de e-mail: ${error.message}` });
    }
}
