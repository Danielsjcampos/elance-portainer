
-- Limpeza e Configuração de Templates de Alta Qualidade
DELETE FROM public.email_templates;

INSERT INTO public.email_templates (nome_template, tipo, assunto, corpo_html, variaveis)
VALUES 
(
  'Boas-vindas Premium', 
  'comunicado', 
  'Bem-vindo(a) à Elite dos Leilões! 🚀',
  '<div style="background: #eff0f1; padding: 20px; font-family: sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: #151d38; padding: 40px 20px; text-align: center;">
            <img src="https://www.elance.com.br/logo.png" alt="E-Lance Leilões" style="height: 60px; margin-bottom: 20px;" />
            <div style="height: 2px; width: 40px; background: #3a7ad1; margin: 0 auto;"></div>
        </div>
        <div style="padding: 40px 30px;">
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
                <a href="https://e-lance.com.br/portal" style="display: inline-block; background: #3a7ad1; color: #ffffff; padding: 18px 35px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 16px;">EXPLORAR PORTAL AGORA</a>
            </div>
        </div>
        <div style="background: #f8fafc; padding: 40px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
            <div style="margin-bottom: 25px;">
                <a href="https://wa.me/5511941660975" style="display: inline-block; margin: 0 12px; color: #151d38; text-decoration: none; font-size: 14px; font-weight: 700;">WHATSAPP</a>
                <a href="https://e-lance.com.br" style="display: inline-block; margin: 0 12px; color: #151d38; text-decoration: none; font-size: 14px; font-weight: 700;">WEBSITE</a>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 25px;">
                <p style="font-size: 11px; color: #94a3b8; font-weight: 500;">
                    © 2026 E-Lance. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </div>
</div>',
  ARRAY['nome']
),
(
  'Alerta de Leilão Premium', 
  'leilao', 
  'URGENTE: Nova Oportunidade com Alto Desconto! 🏠',
  '<div style="background: #eff0f1; padding: 20px; font-family: sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: #151d38; padding: 40px 20px; text-align: center;">
            <img src="https://www.elance.com.br/logo.png" alt="E-Lance Leilões" style="height: 60px; margin-bottom: 20px;" />
            <div style="height: 2px; width: 40px; background: #3a7ad1; margin: 0 auto;"></div>
        </div>
        <div style="padding: 40px 30px;">
            <div style="display: inline-block; background: #fee2e2; color: #ef4444; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; margin-bottom: 15px;">OPORTUNIDADE DETECTADA</div>
            <h1 style="color: #151d38; font-size: 24px; font-weight: 800; margin-bottom: 15px;">{{titulo_leilao}}</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Identificamos uma oportunidade que se encaixa no seu perfil. Este lote possui um potencial de valorização excepcional.
            </p>
            <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-bottom: 30px;">
                <div style="padding: 20px;">
                    <p style="color: #64748b; font-size: 14px; margin: 0;">Localização: {{localizacao}}</p>
                    <div style="font-size: 24px; font-weight: 800; color: #3a7ad1; margin: 15px 0;">Lance Min: {{lance_minimo}}</div>
                    <a href="{{link_leilao}}" style="display: block; text-align: center; background: #151d38; color: #ffffff; padding: 15px; border-radius: 10px; text-decoration: none; font-weight: 700;">VER DETALHES NO PORTAL</a>
                </div>
            </div>
        </div>
        <div style="background: #f8fafc; padding: 40px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="font-size: 12px; color: #64748b;">© 2026 E-Lance Leilões Brasil.</p>
        </div>
    </div>
</div>',
  ARRAY['nome', 'titulo_leilao', 'localizacao', 'lance_minimo', 'link_leilao']
),
(
  'Newsletter Semanal (AI)', 
  'blog', 
  '📰 E-Lance News: As Oportunidades de Ouro da Semana',
  '<div style="background: #eff0f1; padding: 20px; font-family: sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: #151d38; padding: 40px 20px; text-align: center;">
            <img src="https://www.elance.com.br/logo.png" alt="E-Lance Leilões" style="height: 60px; margin-bottom: 20px;" />
            <div style="height: 2px; width: 40px; background: #3a7ad1; margin: 0 auto;"></div>
        </div>
        <div style="padding: 40px 30px;">
            <h1 style="color: #151d38; font-size: 24px; font-weight: 800; margin-bottom: 15px; text-align: center;">Seu Resumo Semanal</h1>
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-bottom: 30px;">
                Olá {{nome}}, aqui está o que nossa inteligência artificial selecionou de mais relevante no mercado hoje.
            </p>
            
            {{conteudo_ai}}

            <div style="background: #f8fafc; border-radius: 12px; padding: 30px; text-align: center; margin-top: 30px;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #151d38;">Quer saber mais?</h3>
                <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">Participe das nossas mentorias e domine os leilões.</p>
                <a href="https://e-lance.com.br" style="display: inline-block; background: #3a7ad1; color: #ffffff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: 700;">VER CURSOS</a>
            </div>
        </div>
        <div style="background: #f8fafc; padding: 40px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="font-size: 11px; color: #94a3b8;">© 2026 E-Lance. Powered by AI.</p>
        </div>
    </div>
</div>',
  ARRAY['nome', 'conteudo_ai']
);
