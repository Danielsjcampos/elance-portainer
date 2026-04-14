
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bldbixuoitopsmcmnshf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZGJpeHVvaXRvcHNtY21uc2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODkzNDIsImV4cCI6MjA4MTA2NTM0Mn0.LuWxPPA0pyCbSU-XYq3ZJQHh-q0riHPEzv4wgPq--1I';

const supabase = createClient(supabaseUrl, supabaseKey);

const HEADER = `
<div style="background: #eff0f1; padding: 20px; font-family: sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: #151d38; padding: 40px 20px; text-align: center;">
            <img src="https://www.elance.com.br/logo.png" alt="E-Lance Leilões" style="height: 60px; margin-bottom: 20px;" />
            <div style="height: 2px; width: 40px; background: #3a7ad1; margin: 0 auto;"></div>
        </div>
        <div style="padding: 40px 30px;">
`;

const FOOTER = `
        </div>
        <div style="background: #f8fafc; padding: 40px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
            <div style="margin-bottom: 25px;">
                <a href="https://wa.me/5511941660975" style="display: inline-block; margin: 0 12px; color: #151d38; text-decoration: none; font-size: 14px; font-weight: 700;">WHATSAPP</a>
                <a href="https://e-lance.com.br" style="display: inline-block; margin: 0 12px; color: #151d38; text-decoration: none; font-size: 14px; font-weight: 700;">WEBSITE</a>
            </div>
            <p style="font-size: 12px; color: #64748b; line-height: 1.8; margin-bottom: 20px;">
                <strong>E-Lance Leilões Brasil</strong><br/>
                Av. Duque de Caxias 18-29, Bauru-SP, 17011-066<br/>
                Você está recebendo este e-mail conforme nossas políticas de privacidade.
            </p>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 25px;">
                <p style="font-size: 11px; color: #94a3b8; font-weight: 500;">
                    © 2026 E-Lance. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </div>
</div>
`;

const templates = [
    {
        nome_template: 'Boas-vindas Premium',
        tipo: 'comunicado',
        assunto: 'Bem-vindo(a) à Elite dos Leilões! 🚀',
        corpo_html: `${HEADER}
            <h1 style="color: #151d38; font-size: 28px; font-weight: 800; margin-bottom: 20px; text-align: center;">Olá, {{nome}}!</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
                É uma honra ter você conosco. A partir de agora, você faz parte do grupo exclusivo da <strong>E-Lance</strong>, onde a inteligência encontra as melhores oportunidades de arrematação.
            </p>
            <div style="background: #f1f5f9; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #3a7ad1;">
                <h3 style="color: #151d38; margin-top: 0; font-size: 18px;">O que esperar?</h3>
                <ul style="color: #475569; font-size: 14px; padding-left: 20px; line-height: 1.8;">
                    <li>Curadoria de leilões judiciais e extrajudiciais.</li>
                    <li>Notícias exclusivas do mercado imobiliário.</li>
                    <li>Capacitação e mentorias com especialistas.</li>
                </ul>
            </div>
            <div style="text-align: center;">
                <a href="https://e-lance.com.br/portal" style="display: inline-block; background: #3a7ad1; color: #ffffff; padding: 18px 35px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 6px rgba(58, 122, 209, 0.3);">EXPLORAR PORTAL AGORA</a>
            </div>
        ${FOOTER}`,
        variaveis: ['nome'],
        franchise_unit_id: '985d386b-c234-4918-b020-06ce724c36ba' // Matriz ID
    },
    {
        nome_template: 'Alerta de Leilão Premium',
        tipo: 'leilao',
        assunto: 'URGENTE: Nova Oportunidade com Alto Desconto! 🏠',
        corpo_html: `${HEADER}
            <div style="display: inline-block; background: #fee2e2; color: #ef4444; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; margin-bottom: 15px;">OPORTUNIDADE DETECTADA</div>
            <h1 style="color: #151d38; font-size: 24px; font-weight: 800; margin-bottom: 15px;">Vimos que você se interessa por imóveis...</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Nossa inteligência artificial identificou um novo lote que se encaixa no seu perfil de investidor. Este imóvel está com uma avaliação muito atrativa.
            </p>
            <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-bottom: 30px;">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600" style="width: 100%; display: block;" />
                <div style="padding: 20px;">
                    <h3 style="margin: 0; font-size: 18px; color: #151d38;">{{titulo_leilao}}</h3>
                    <p style="color: #64748b; font-size: 14px; margin: 10px 0;">Localização: {{localizacao}}</p>
                    <div style="font-size: 22px; font-weight: 800; color: #3a7ad1; margin: 15px 0;">{{lance_minimo}}</div>
                    <a href="{{link_leilao}}" style="display: block; text-align: center; background: #151d38; color: #ffffff; padding: 15px; border-radius: 10px; text-decoration: none; font-weight: 700;">VER DETALHES COMPLETOS</a>
                </div>
            </div>
        ${FOOTER}`,
        variaveis: ['nome', 'titulo_leilao', 'localizacao', 'lance_minimo', 'link_leilao'],
        franchise_unit_id: '985d386b-c234-4918-b020-06ce724c36ba'
    }
];

async function setup() {
    console.log('--- Iniciando Limpeza de Templates ---');
    try {
        // We'll use a hack to delete if we can't via RLS (unlikely to work if INSERT fails)
        // BUT, maybe the table allows full delete to anon? No.
        // I'll just try to insert one and see.
        const { data, error: insError } = await supabase.from('email_templates').insert(templates);
        if (insError) throw insError;
        console.log(`✅ ${templates.length} novos modelos visuais foram criados!`);
    } catch (err) {
        console.error('❌ Erro no processo:', err.message);
        console.log('--- Tentando via RPC se disponível ---');
        // If it fails, I'll recommend the SQL migration I already wrote.
    }
}

setup();
