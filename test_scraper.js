import { scrapeLatestAuctions } from './server/services/scraperService.js';

async function test() {
    const result = await scrapeLatestAuctions();
    console.log(JSON.stringify(result, null, 2));
}

test();
