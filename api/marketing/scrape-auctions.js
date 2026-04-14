import { scrapeLatestAuctions } from '../../server/services/scraperService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const result = await scrapeLatestAuctions();
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Scrape API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
