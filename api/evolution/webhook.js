import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

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
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, quiz_data, source, timestamp } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Missing phone parameter' });
    }

    const API_URL = process.env.EVOLUTION_API_URL || 'https://api.2b.app.br';
    const GLOBAL_API_KEY = process.env.EVOLUTION_GLOBAL_API_KEY;
    const INSTANCE_TOKEN = process.env.EVOLUTION_INSTANCE_TOKEN;
    const INSTANCE = process.env.EVOLUTION_INSTANCE || 'Elance';

    // Prioritize the specific Instance Token if provided, otherwise use the Global API Key
    const API_KEY = INSTANCE_TOKEN || GLOBAL_API_KEY;

    if (!API_URL) {
        console.error('❌ EVOLUTION_API_URL is NOT configured in the environment.');
    }
    if (!API_KEY) {
        console.error('❌ Neither EVOLUTION_INSTANCE_TOKEN nor EVOLUTION_GLOBAL_API_KEY is configured in the environment.');
    }
    if (!INSTANCE) {
        console.warn('⚠️ EVOLUTION_INSTANCE not defined, defaulting to "Elance"');
    }

    console.log(`[Webhook] Incoming lead: ${name} (${phone}) from source: ${source}`);

    try {
        const results = {};

        // 1. Send Welcome Message to Lead
        if (API_KEY) {
            try {
                // Ensure phone has country code and strip non-numeric
                const cleanPhone = phone.replace(/\D/g, '');
                // It assumes Brazilian number logic from the original node 55{{Telefone}}
                const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

                const welcomeResponse = await fetch(`${API_URL}/message/sendText/${INSTANCE}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': API_KEY
                    },
                    body: JSON.stringify({
                        number: `${fullPhone}@s.whatsapp.net`,
                        text: `Olá ${name || ''}! 👋\n\nRecebemos seu contato.\n\nPodemos continuar nossa conversa por aqui!`
                    })
                });

                const welcomeData = await welcomeResponse.json().catch(() => ({}));
                results.welcomeMessage = welcomeResponse.ok ? 'success' : 'failed';
                if (!welcomeResponse.ok) {
                    console.error('Error sending welcome message:', welcomeData);
                    results.welcomeError = welcomeData;
                }
            } catch (err) {
                console.error('Failed to send welcome message:', err);
                results.welcomeMessage = 'error';
            }
        }

        // 2. Send Notification to Internal Group
        if (API_KEY) {
            try {
                let groupText = `🤖 Novo Lead Chegou! 📢\n\nNome: ${name || 'N/A'}\n\nTelefone: https://wa.me/${phone}\n\n1- Você já conhece algo sobre leilões?\n${quiz_data?.knowledge || 'N/A'}\n\n2- Qual valor para investimento?\n${quiz_data?.investment || 'N/A'}\n\n3- Seu interesse é mais para?\n${quiz_data?.interest || 'N/A'}\n\nSite: ${source || 'N/A'}`;

                // Customize message for specific Indication source
                if (source === "Indicação Direta - Site") {
                    groupText = `🔔 *Nova Indicação de Advogado!* 📢\n\n👤 *Nome:* ${name || 'N/A'}\n📱 *WhatsApp:* https://wa.me/${phone}\n📧 *E-mail:* ${email || 'N/A'}\n\n📍 *Origem:* ${source}`;
                }

                const groupResponse = await fetch(`${API_URL}/message/sendText/${INSTANCE}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': API_KEY
                    },
                    body: JSON.stringify({
                        number: "120363404779069824@g.us",
                        text: groupText
                    })
                });

                const groupData = await groupResponse.json().catch(() => ({}));
                results.groupMessage = groupResponse.ok ? 'success' : 'failed';
                
                if (!groupResponse.ok) {
                    console.error('❌ Error sending notification to WhatsApp Group:', {
                        status: groupResponse.status,
                        data: groupData,
                        instance: INSTANCE,
                        apiKey: API_KEY ? 'Present' : 'Missing'
                    });
                    results.groupError = groupData;
                } else {
                    console.log('✅ Notification sent to WhatsApp group successfully.');
                }
            } catch (err) {
                console.error('❌ Failed to connect to Evolution API for group notification:', err.message);
                results.groupMessage = 'error';
            }
        }

        // 3. Save to Google Sheets
        if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            try {
                // Target Sheet ID from the n8n JSON
                const SHEET_ID = '1JUDby8gZP_NB9oePj_Il6_XLCeQpjRRyZihOZogGqmw';

                const serviceAccountAuth = new JWT({
                    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    scopes: [
                        'https://www.googleapis.com/auth/spreadsheets',
                    ],
                });

                const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
                await doc.loadInfo();

                // Note: The n8n JSON used "gid=0".
                const sheet = doc.sheetsByIndex[0];

                await sheet.addRow({
                    "Nome": name || '',
                    "Telefone": phone || '',
                    "Você já conhece algo sobre leilões?": quiz_data?.knowledge || '',
                    "Seu interesse é mais para:": quiz_data?.interest || '',
                    "Qual valor para investimento?": quiz_data?.investment || '',
                    "URL_SITE": source || ''
                });

                results.googleSheets = 'success';
            } catch (err) {
                console.error('Failed to save to Google Sheets:', err);
                results.googleSheets = 'error';
            }
        } else {
            console.warn('Google Sheets credentials not provided.');
            results.googleSheets = 'skipped (missing credentials)';
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Webhook processed',
            results,
            debug: {
                instance: INSTANCE,
                apiUrl: API_URL,
                hasKey: !!API_KEY
            }
        });

    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to process webhook', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
