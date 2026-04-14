import { supabase } from '../../server/lib/supabase.js';

export default async function handler(req, res) {
    // Basic CORS & Method check
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { leadIds } = req.body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
        return res.status(400).json({ error: 'leadIds must be a non-empty array' });
    }

    const API_URL = process.env.EVOLUTION_API_URL || 'https://api.2b.app.br';
    const API_KEY = process.env.EVOLUTION_INSTANCE_TOKEN || process.env.EVOLUTION_GLOBAL_API_KEY;
    const INSTANCE = process.env.EVOLUTION_INSTANCE || 'Elance';

    if (!API_KEY) {
        return res.status(500).json({ error: 'Evolution API Key not configured' });
    }

    try {
        // Fetch all selected leads
        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .in('id', leadIds);

        if (error) throw error;

        const results = {
            total: leads.length,
            success: 0,
            failed: 0,
            details: []
        };

        // Process each lead
        for (const lead of leads) {
            try {
                // Parse variables from notes
                // Format expected: "Conhecimento: ...\nInteresse: ...\nInvestimento: ..."
                const notes = lead.notes || '';
                const extractVar = (regex) => {
                    const match = notes.match(regex);
                    return match ? match[1].trim() : 'N/A';
                };

                const quiz_data = {
                    knowledge: extractVar(/Conhecimento:\s*(.*)/i),
                    interest: extractVar(/Interesse:\s*(.*)/i),
                    investment: extractVar(/Investimento:\s*(.*)/i)
                };

                const groupText = `🤖 [RE-DISPARO] Novo Lead! 📢\n\nNome: ${lead.name || 'N/A'}\n\nTelefone: https://wa.me/${lead.phone?.replace(/\D/g, '') || ''}\n\n1- Você já conhece algo sobre leilões?\n${quiz_data.knowledge}\n\n2- Qual valor para investimento?\n${quiz_data.investment}\n\n3- Seu interesse é mais para?\n${quiz_data.interest}\n\nSite: ${lead.source || 'N/A'}`;

                const response = await fetch(`${API_URL}/message/sendText/${INSTANCE}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': API_KEY
                    },
                    body: JSON.stringify({
                        number: "120363404779069824@g.us",
                        text: groupText,
                        delay: 1500,
                        linkPreview: false
                    })
                });

                if (response.ok) {
                    results.success++;
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    results.failed++;
                    results.details.push({ id: lead.id, error: errorData });
                }
            } catch (err) {
                results.failed++;
                results.details.push({ id: lead.id, error: err.message });
            }
        }

        return res.status(200).json({ success: true, results });

    } catch (error) {
        console.error('Bulk dispatch error:', error);
        return res.status(500).json({ error: 'Failed to process bulk dispatch', details: error.message });
    }
}
