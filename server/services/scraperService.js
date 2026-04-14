import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeLatestAuctions = async () => {
    try {
        // Direct API from Superbid SBX used by Elance
        const url = 'https://offer-query.superbid.net/offers/?filter=stores.id:16396&locale=pt_BR&orderBy=endDate:asc&pageNumber=1&pageSize=30&portalId=[2,15]&preOrderBy=orderByFirstOpenedOffers&requestOrigin=store&searchType=opened&timeZoneId=America%2FSao_Paulo';
        
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Origin': 'https://www.elance.com.br',
                'Referer': 'https://www.elance.com.br/'
            }
        });

        if (!data || !data.offers) {
            throw new Error('Formato de resposta da API inválido');
        }

        const auctions = data.offers.slice(0, 10).map(offer => {
            const description = offer.product?.shortDesc || offer.auction?.desc || 'Leilão';
            
            // Extract stages
            const stages = offer.auction?.eventPipeline?.stages || [];
            const currentStage = offer.auction?.eventPipeline?.currentStage || 1;
            
            const firstStage = stages[0] || {};
            const secondStage = stages[1] || {};

            const firstPrice = firstStage.initialBidValue || 0;
            const secondPrice = secondStage.initialBidValue || 0;
            
            // Format currency helper
            const formatCurrency = (val) => val ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val) : 'Sob consulta';
            
            // Category mapping
            const rawCat = offer.product?.productType?.description || '';
            let category = 'Outros';
            if (rawCat.includes('Imóveis')) category = 'Imóveis';
            else if (rawCat.includes('Carros') || rawCat.includes('Motos') || rawCat.includes('Veículos')) category = 'Veículos';

            // Slugify description for the link
            const slug = description.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            // Try many fields for the Comitente/Seller name
            const seller = offer.auction?.seller?.description || 
                           offer.auction?.seller?.name || 
                           offer.product?.brand?.name ||
                           offer.product?.manufacturer?.name ||
                           'E-Lance Leilões';
            
            return {
                id: offer.id,
                title: description,
                image: offer.product?.thumbnailUrl || '',
                link: `https://www.elance.com.br/oferta/${slug}-${offer.id}`,
                category,
                seller: seller.toUpperCase(), // Judicial names are usually uppercase
                firstPrice: formatCurrency(firstPrice),
                secondPrice: formatCurrency(secondPrice),
                firstDate: firstStage.endDate ? new Date(firstStage.endDate).toLocaleDateString('pt-BR') : 'A definir',
                secondDate: secondStage.endDate ? new Date(secondStage.endDate).toLocaleDateString('pt-BR') : 'A definir',
                isFirstStageClosed: currentStage > 1,
                discount: firstPrice && secondPrice ? Math.round(((firstPrice - secondPrice) / firstPrice) * 100) : 0
            };
        });

        return { success: true, auctions };
    } catch (error) {
        console.error('API Fetch Error:', error);
        return { success: false, error: error.message };
    }
};
