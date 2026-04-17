import axios from 'axios';

const PAGE_SIZE = 30;
const MAX_PAGES = 100; // teto de segurança (3000 leilões máx)

const SUPERBID_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Origin': 'https://www.elance.com.br',
    'Referer': 'https://www.elance.com.br/'
};

function buildUrl(pageNumber) {
    return `https://offer-query.superbid.net/offers/?filter=stores.id:16396&locale=pt_BR&orderBy=endDate:asc&pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}&portalId=[2,15]&preOrderBy=orderByFirstOpenedOffers&requestOrigin=store&searchType=opened&timeZoneId=America%2FSao_Paulo`;
}

function parseOffer(offer) {
    const description = offer.product?.shortDesc || offer.auction?.desc || 'Leilão';
    const stages = offer.auction?.eventPipeline?.stages || [];
    const currentStage = offer.auction?.eventPipeline?.currentStage || 1;
    const firstStage = stages[0] || {};
    const secondStage = stages[1] || {};
    const firstPrice = firstStage.initialBidValue || 0;
    const secondPrice = secondStage.initialBidValue || 0;

    const formatCurrency = (val) => val
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
        : 'Sob consulta';

    const rawCat = offer.product?.productType?.description || '';
    let category = 'Outros';
    const rc = rawCat.toLowerCase();
    if (rc.includes('imóve') || rc.includes('imove') || rc.includes('terreno') || rc.includes('casa') || rc.includes('apartamento') || rc.includes('fazenda') || rc.includes('rural')) {
        category = 'Imóveis';
    } else if (rc.includes('carro') || rc.includes('moto') || rc.includes('veículo') || rc.includes('veiculo') || rc.includes('caminh') || rc.includes('ônibus') || rc.includes('onibus') || rc.includes('trator') || rc.includes('reboque')) {
        category = 'Veículos';
    }

    const slug = description.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

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
        seller: seller.toUpperCase(),
        firstPrice: formatCurrency(firstPrice),
        secondPrice: formatCurrency(secondPrice),
        firstDate: firstStage.endDate ? new Date(firstStage.endDate).toLocaleDateString('pt-BR') : 'A definir',
        secondDate: secondStage.endDate ? new Date(secondStage.endDate).toLocaleDateString('pt-BR') : 'A definir',
        isFirstStageClosed: currentStage > 1,
        discount: firstPrice && secondPrice ? Math.round(((firstPrice - secondPrice) / firstPrice) * 100) : 0
    };
}

export const scrapeLatestAuctions = async () => {
    try {
        const allOffers = [];
        let pageNumber = 1;
        let totalCount = null;

        while (pageNumber <= MAX_PAGES) {
            const { data } = await axios.get(buildUrl(pageNumber), { headers: SUPERBID_HEADERS });

            if (!data || !data.offers) {
                throw new Error('Formato de resposta da API inválido');
            }

            // Captura o total na primeira página
            if (pageNumber === 1) {
                totalCount = data.total || data.totalOffers || data.offers.length;
            }

            allOffers.push(...data.offers);

            const hasMore = data.offers.length === PAGE_SIZE && allOffers.length < (totalCount || Infinity);
            if (!hasMore) break;

            pageNumber++;
        }

        const auctions = allOffers.map(parseOffer);
        return { success: true, auctions };
    } catch (error) {
        console.error('API Fetch Error:', error);
        return { success: false, error: error.message };
    }
};
