import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const INCENTIVE_MESSAGES = [
    "Comprar em leilão é acessar oportunidades que o mercado tradicional nunca oferece. Imóveis com descontos reais, muitas vezes abaixo de 50% do valor de mercado. Você está aproveitando isso?",
    "Os melhores negócios não estão nas imobiliárias — estão nos leilões. Quem chega primeiro, compra melhor. Não fique de fora.",
    "Você sabia que é possível adquirir imóveis com valores muito abaixo da avaliação? O leilão é o caminho mais rápido para isso.",
    "Enquanto muitos pagam preço cheio, investidores compram com desconto em leilões. A diferença está na informação.",
    "Leilão não é risco — é oportunidade para quem sabe como funciona. E nós estamos aqui para te ajudar em cada etapa.",
    "Já pensou em comprar um imóvel com 30%, 40% ou até 60% de desconto? Isso acontece todos os dias nos leilões.",
    "Os melhores investidores do mercado utilizam leilões como estratégia. Talvez esteja na hora de você fazer o mesmo.",
    "Imóveis de bancos, judiciais e particulares — todos com preços competitivos. Oportunidades reais esperando por você.",
    "O segredo não é ganhar mais, é comprar melhor. E o leilão é a forma mais inteligente de fazer isso.",
    "Quem entende leilão, compra abaixo do mercado. Quem não entende, paga mais caro. De que lado você quer estar?",
    "Leilão não é apenas para investidores — é para qualquer pessoa que quer economizar na compra de um imóvel.",
    "Todos os dias surgem novas oportunidades em leilões. Quem acompanha de perto, encontra verdadeiras joias.",
    "Comprar bem é mais importante do que vender bem. E o leilão te coloca exatamente nesse ponto de vantagem.",
    "Muitas pessoas ainda têm receio de leilão — e é justamente por isso que existem tantas oportunidades disponíveis.",
    "Se você quer pagar menos e investir melhor, precisa conhecer o mercado de leilões. O próximo negócio pode estar aqui."
];

export const generateAuctionNewsletter = async (auctions, aiConfig, logoUrl) => {
    try {
        const randomMessage = INCENTIVE_MESSAGES[Math.floor(Math.random() * INCENTIVE_MESSAGES.length)];
        const officialLogo = logoUrl || "https://static.s4bdigital.net/logos_empresas/logoELance.jpg";

        console.log('Generating newsletter with provider:', aiConfig?.provider || 'gemini (default)');
        const prompt = `
        Você é um especialista em marketing imobiliário e leilões da "E-Lance Leilões".
        Crie um informativo de e-mail (HTML) atraente e profissional seguindo rigorosamente estas instruções.

        MENSAGEM DE INCENTIVO (Colocar em destaque após o título):
        "${randomMessage}"
        
        DADOS DOS LEILÕES:
        ${JSON.stringify(auctions, null, 2)}
        
        INSTRUÇÕES DE ESTRUTURA:
        1. CATEGORIZAÇÃO: Separe os leilões em seções: "Imóveis", "Veículos" e "Outros". Se uma categoria não tiver itens, não a mostre.
        2. DETALHES POR ITEM: Para cada leilão, você DEVE mostrar:
           - 1ª Praça: "1ª Praça: VALOR - DATA". Se "isFirstStageClosed" for true, aplique strikethrough (riscado) em TODO este conjunto (valor e data).
           - 2ª Praça: "2ª Praça: VALOR - DATA". Destaque este conjunto.
           - Desconto: "X% de DESCONTO" em destaque verde.
           - Vendedor (Comitente): Mostre o nome do vendedor (campo "seller") logo abaixo do desconto.
        3. DESIGN: 
           - Use o cabeçalho azul marinho (#151d38) com a logo oficial: ${officialLogo}
           - Adicione ícones sociais logo abaixo da logo (Site, WhatsApp, Instagram). Links fornecidos no contexto.
           - Use cards em grid de 2 colunas para cada categoria.
           - Botões de "VER LEILÃO" em azul marinho (#151d38) com design moderno e compatível com Outlook (use VML roundrect).
           - O link do leilão deve estar no botão E TAMBÉM na imagem do imóvel.
           - Rodapé com contatos e link de descadastro.

        REQUISITOS DE COMPATIBILIDADE (Outlook):
        - IMPORTANTÍSSIMO: Para as imagens dos leilões, garanta que elas não fiquem esticadas. Se a foto for vertical, use um container de altura fixa (ex: 160px) e centralize a imagem (simulando object-fit: cover).
        - Use tabelas (table-based layout).
        - Não use border-radius ou box-shadow diretamente em divs/imgs (não funciona no Outlook), use VML se necessário para os botões.
        
        Modelo de Estrutura Sugerido:
        <div style="background: #eff0f1; padding: 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <!-- Cabeçalho -->
                <div style="background: #151d38; padding: 30px 20px; text-align: center;">
                    <img src="${officialLogo}" width="180" style="display: block; margin: 0 auto;" />
                    <!-- ... icones sociais ... -->
                </div>
                
                <div style="padding: 30px;">
                    <h1 style="color: #151d38; text-align: center;">Oportunidades E-Lance</h1>
                    <p style="font-style: italic; color: #475569; text-align: center; border-bottom: 2px solid #3a7ad1; padding-bottom: 20px;">
                        "${randomMessage}"
                    </p>

                    <!-- Exemplo de Card de Leilão Grid -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td width="50%" style="padding: 5px;">
                                <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
                                    <a href="{{link}}" style="display: block; text-decoration: none;">
                                        <div style="height: 160px; overflow: hidden; background: #f8fafc; text-align: center;">
                                            <img src="{{imagem}}" style="width: 100%; height: auto; min-height: 160px;" />
                                        </div>
                                    </a>
                                    <div style="padding: 15px;">
                                        <!-- Detalhes e Botão VML -->
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        Retorne APENAS o código HTML completo.
        `;

        const provider = aiConfig?.provider || 'gemini';
        let html = '';

        if (provider === 'gemini') {
            const apiKey = aiConfig?.gemini_key || process.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error('Chave Gemini não configurada.');
            
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            html = response.text();
        } else if (provider === 'openai') {
            const apiKey = aiConfig?.openai_key;
            if (!apiKey) throw new Error('Chave OpenAI não configurada.');

            console.log('Sending request to OpenAI with model:', aiConfig.openai_model);
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: aiConfig.openai_model || 'gpt-4o',
                messages: [{ role: 'user', content: prompt }]
            }, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            html = response.data.choices[0].message.content;
        } else if (provider === 'openrouter') {
            const apiKey = aiConfig?.openrouter_key;
            if (!apiKey) throw new Error('Chave OpenRouter não configurada.');

            console.log('Sending request to OpenRouter with model:', aiConfig.openrouter_model);
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: aiConfig.openrouter_model || 'anthropic/claude-3.5-sonnet',
                messages: [{ role: 'user', content: prompt }]
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://elance.com.br',
                    'X-Title': 'E-Lance Portal'
                }
            });
            html = response.data.choices[0].message.content;
        }
        
        // Clean up markdown if AI returned it
        html = html.replace(/```html/g, '').replace(/```/g, '').trim();

        return { success: true, html };
    } catch (error) {
        console.error('AI Generation Error:', error.response?.data || error.message);
        return { success: false, error: error.response?.data?.error?.message || error.message };
    }
};
