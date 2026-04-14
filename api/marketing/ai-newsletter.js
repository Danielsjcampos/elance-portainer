import { generateAuctionNewsletter } from '../../server/services/aiMarketingService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { auctions, aiConfig, logoUrl } = req.body;

    try {
        const result = await generateAuctionNewsletter(auctions, aiConfig, logoUrl);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('AI Newsletter API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
