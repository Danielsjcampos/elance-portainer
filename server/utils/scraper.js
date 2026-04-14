
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes the latest news from a given URL to be used in newsletter
 * @param {string} url 
 * @returns {Promise<Array<{title: string, link: string, summary: string, image: string}>>}
 */
export async function scrapeNews(url = 'https://tudosobreleilao.com.br/') {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const news = [];

        // Example selector (generic news site structure)
        $('article, .post-item, .news-item').slice(0, 5).each((i, el) => {
            const title = $(el).find('h1, h2, h3, .title').first().text().trim();
            const link = $(el).find('a').first().attr('href');
            const summary = $(el).find('p, .excerpt, .description').first().text().trim();
            const image = $(el).find('img').first().attr('src');

            if (title && link) {
                news.push({
                    title,
                    link: link.startsWith('http') ? link : new URL(link, url).href,
                    summary: summary.substring(0, 200) + '...',
                    image: image?.startsWith('http') ? image : (image ? new URL(image, url).href : null)
                });
            }
        });

        return news;
    } catch (error) {
        console.error('Error scraping news:', error.message);
        return [];
    }
}
