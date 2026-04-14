import { scrapeLatestAuctions } from './server/services/scraperService.js';

async function test() {
    console.log('Testing scraper...');
    const result = await scrapeLatestAuctions();
    if (result.success) {
        console.log('Found', result.auctions.length, 'auctions.');
        console.log('First auction data:', JSON.stringify(result.auctions[0], null, 2));
    } else {
        console.error('Error:', result.error);
    }
}

test();
