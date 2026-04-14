import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, aiConfig, systemPrompt } = req.body;

    if (!prompt || !aiConfig) {
        return res.status(400).json({ error: 'Faltam parâmetros obrigatórios (prompt, aiConfig)' });
    }

    const provider = aiConfig.provider || 'gemini';

    try {
        let text = '';

        if (provider === 'gemini') {
            const apiKey = aiConfig.gemini_key;
            if (!apiKey) throw new Error('API Key do Gemini não configurada.');
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt);
            const response = await result.response;
            text = response.text();
        } else if (provider === 'openai') {
            const apiKey = aiConfig.openai_key;
            if (!apiKey) throw new Error('API Key da OpenAI não configurada.');
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: aiConfig.openai_model || 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt || 'Você é um assistente prestativo.' },
                    { role: 'user', content: prompt }
                ]
            }, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            text = response.data.choices[0].message.content;
        } else if (provider === 'openrouter') {
            const apiKey = aiConfig.openrouter_key;
            if (!apiKey) throw new Error('API Key do OpenRouter não configurada.');
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: aiConfig.openrouter_model || 'anthropic/claude-3.5-sonnet',
                messages: [
                    { role: 'system', content: systemPrompt || 'Você é um assistente prestativo.' },
                    { role: 'user', content: prompt }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://elance.com.br',
                    'X-Title': 'E-Lance Portal'
                }
            });
            text = response.data.choices[0].message.content;
        }

        // Clean up common AI markdown wrappers
        text = text.replace(/```json/g, '').replace(/```html/g, '').replace(/```/g, '').trim();

        return res.status(200).json({ success: true, text });

    } catch (error) {
        console.error('AI API Error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            error: error.response?.data?.error?.message || error.message 
        });
    }
}
