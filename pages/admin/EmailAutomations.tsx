import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Brain, Sparkles, Mail, RefreshCw, Send, Check,
    AlertCircle, Settings, Layout, Zap, Loader2, CheckCircle2,
    XCircle, Rocket, Palette, Phone, Save, Eye,
    Image as ImageIcon, Type, Hash, ChevronDown, ChevronUp,
    Globe, Calendar, Bell, Play, Wand2, Sliders
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sendEmail } from '../../services/emailService';

/* ─── Google Fonts ──────────────────────────────────────────────────────────── */
const FONT_LINK = document.createElement('link');
FONT_LINK.rel = 'stylesheet';
FONT_LINK.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Josefin+Sans:wght@300;400;500;600;700&display=swap';
document.head.appendChild(FONT_LINK);

/* ─── Design Tokens ──────────────────────────────────────────────────────────
   Based on UI-UX Pro Max: Dark Mode (OLED) + Real Estate Luxury palette
   Primary: #2563EB  |  CTA: #F97316  |  Accent: #E2B842
   Background: #0B0F1A (midnight)  |  Surface: #111827  |  Border: #1F2937
   Text-primary: #F9FAFB  |  Text-muted: #6B7280
────────────────────────────────────────────────────────────────────────────── */

const DEFAULT_TEMPLATE = {
    logoUrl: 'https://static.s4bdigital.net/logos_empresas/logoELance.jpg',
    headerColor: '#151d38',
    accentColor: '#3a7ad1',
    title: 'Oportunidades E-Lance',
    incentive: '',
    phone: '(11) 94166-0975',
    email: 'contato@elance.com.br',
    siteUrl: 'https://www.elance.com.br',
    whatsappNumber: '5511941660975',
    instagramUrl: 'https://www.instagram.com/leiloeselance/',
    footer: '© 2026 E-Lance Leilões Brasil.\nAv. Duque de Caxias 18-29, Bauru-SP.',
    ctaText: 'VER LEILÃO',
    maxItems: 8,
    columns: 2 as 1 | 2 | 3 | 4,
    categories: { imoveis: true, veiculos: true, outros: false },
    // Banner de destaque
    bannerEnabled: false,
    bannerImageUrl: '',
    bannerTitle: '',
    bannerSubtitle: '',
    bannerCtaText: 'Confira >>>',
    bannerCtaLink: '',
    bannerOverlay: true,
};

const INCENTIVES = [
    "Comprar em leilão é acessar oportunidades que o mercado tradicional nunca oferece. Imóveis com descontos reais, muitas vezes abaixo de 50% do valor de mercado.",
    "Os melhores negócios não estão nas imobiliárias — estão nos leilões. Quem chega primeiro, compra melhor.",
    "Você sabia que é possível adquirir imóveis com valores muito abaixo da avaliação? O leilão é o caminho mais rápido para isso.",
    "Enquanto muitos pagam preço cheio, investidores compram com desconto em leilões. A diferença está na informação.",
    "Leilão não é risco — é oportunidade para quem sabe como funciona. E nós estamos aqui para te ajudar em cada etapa.",
    "Já pensou em comprar um imóvel com 30%, 40% ou até 60% de desconto? Isso acontece todos os dias nos leilões.",
    "Quem entende leilão, compra abaixo do mercado. Quem não entende, paga mais caro. De que lado você quer estar?",
    "O segredo não é ganhar mais, é comprar melhor. E o leilão é a forma mais inteligente de fazer isso.",
    "Todos os dias surgem novas oportunidades em leilões. Quem acompanha de perto, encontra verdadeiras joias.",
    "Se você quer pagar menos e investir melhor, precisa conhecer o mercado de leilões. O próximo negócio pode estar aqui."
];

const COLOR_PRESETS = [
    { name: 'E-Lance',      header: '#151d38', accent: '#3a7ad1' },
    { name: 'Royal Blue',   header: '#1a237e', accent: '#42a5f5' },
    { name: 'Forest',       header: '#1b5e20', accent: '#43a047' },
    { name: 'Midnight',     header: '#212121', accent: '#f97316' },
    { name: 'Bourbon',      header: '#4a148c', accent: '#ce93d8' },
    { name: 'Crimson',      header: '#7f1d1d', accent: '#ef5350' },
];

/* ─── Styled sub-components ─────────────────────────────────────────────────── */

const CollapseSection: React.FC<{
    icon: React.ReactNode; title: string; subtitle?: string;
    children: React.ReactNode; defaultOpen?: boolean;
}> = ({ icon, title, subtitle, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            overflow: 'hidden',
            transition: 'box-shadow 200ms'
        }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '14px 18px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(37,99,235,0.15)', color: '#60a5fa', flexShrink: 0
                    }}>{icon}</div>
                    <div>
                        <div style={{ color: '#F9FAFB', fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: '0.02em' }}>{title}</div>
                        {subtitle && <div style={{ color: '#6B7280', fontSize: 11, marginTop: 1 }}>{subtitle}</div>}
                    </div>
                </div>
                <div style={{ color: '#4B5563', transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown size={16} />
                </div>
            </button>
            {open && (
                <div style={{ padding: '4px 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
    <div>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Josefin Sans', sans-serif" }}>
            {label}
        </label>
        {children}
        {hint && <p style={{ fontSize: 11, color: '#374151', marginTop: 4, lineHeight: 1.4 }}>{hint}</p>}
    </div>
);

const DarkInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        style={{
            width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '9px 12px', color: '#F9FAFB', fontSize: 13,
            outline: 'none', fontFamily: "'Josefin Sans', sans-serif", boxSizing: 'border-box',
            transition: 'border-color 150ms',
            ...props.style
        }}
        onFocus={e => { e.target.style.borderColor = '#2563EB'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
    />
);

const DarkTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        style={{
            width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '9px 12px', color: '#F9FAFB', fontSize: 13,
            outline: 'none', fontFamily: "'Josefin Sans', sans-serif", resize: 'none',
            boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 150ms',
            ...props.style
        }}
        onFocus={e => { e.target.style.borderColor = '#2563EB'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
    />
);

/* ─── Email HTML Builder ────────────────────────────────────────────────────── */
const buildEmailHtml = (auctions: any[], tpl: typeof DEFAULT_TEMPLATE): string => {
    const incentive = tpl.incentive?.trim()
        ? tpl.incentive
        : INCENTIVES[Math.floor(Math.random() * INCENTIVES.length)];
    const footerHtml = tpl.footer.split('\n').join('<br/>');

    const HEADER = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${tpl.title}</title>
<style>body,table,td{font-family:'Segoe UI',Arial,sans-serif;}img{border:0;outline:none;}table{border-collapse:collapse;}</style>
</head>
<body style="margin:0;padding:0;background:#eff0f1;">
<table width="100%" cellspacing="0" cellpadding="0" bgcolor="#eff0f1">
<tr><td align="center" style="padding:20px 10px;">
<table width="600" cellspacing="0" cellpadding="0" align="center" style="background:#fff;width:600px;">
  <tr><td align="center" bgcolor="#eff0f1" style="padding:10px;font-size:11px;">
    <a href="${tpl.siteUrl}" style="color:#94a3b8;font-size:11px;text-decoration:underline;">Visualizar no navegador</a>
  </td></tr>
  <tr><td align="center" bgcolor="${tpl.headerColor}" style="padding:30px 20px;">
    <table cellspacing="0" cellpadding="0">
      <tr><td align="center"><img src="${tpl.logoUrl}" width="180" height="auto" style="display:block;width:180px;"/></td></tr>
      <tr><td align="center" style="padding-top:18px;">
        <table cellspacing="0" cellpadding="0"><tr>
          <td style="padding:0 5px;"><a href="${tpl.siteUrl}"><img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" width="24" height="24"/></a></td>
          <td style="padding:0 5px;"><a href="https://api.whatsapp.com/send/?phone=${tpl.whatsappNumber}&text=Quero+saber+mais"><img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" width="24" height="24"/></a></td>
          <td style="padding:0 5px;"><a href="${tpl.instagramUrl}"><img src="https://cdn-icons-png.flaticon.com/512/3955/3955024.png" width="24" height="24"/></a></td>
        </tr></table>
      </td></tr>
      <tr><td align="center" style="color:#fff;font-size:12px;padding-top:8px;">${tpl.phone} | ${tpl.email}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:40px 30px 0;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr><td align="center" style="font-size:28px;font-weight:800;color:${tpl.headerColor};padding-bottom:10px;">${tpl.title}</td></tr>
      <tr><td align="center" style="font-style:italic;color:#475569;font-size:14px;line-height:22px;padding-bottom:25px;border-bottom:2px solid ${tpl.accentColor};">&ldquo;${incentive}&rdquo;</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:10px 30px 40px;">`;

    // ── Banner de destaque (opcional, full-width) ──────────────────────────────
    const BANNER = tpl.bannerEnabled && tpl.bannerImageUrl ? `
  <tr><td style="padding:0;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr><td style="padding:0;position:relative;">
        <!-- Imagem banner -->
        <a href="${tpl.bannerCtaLink || tpl.siteUrl}" target="_blank" style="display:block;text-decoration:none;">
          <div style="width:100%;min-height:220px;background:url('${tpl.bannerImageUrl}') center/cover no-repeat;position:relative;">
            ${tpl.bannerOverlay ? `<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.15) 60%,transparent 100%);"></div>` : ''}
            ${(tpl.bannerTitle || tpl.bannerSubtitle || tpl.bannerCtaText) ? `
            <table cellspacing="0" cellpadding="0" style="position:absolute;top:0;left:0;width:55%;height:100%;">
              <tr><td valign="middle" style="padding:30px 20px 30px 30px;">
                ${tpl.bannerTitle ? `<p style="margin:0 0 8px;font-size:26px;font-weight:900;color:#fff;line-height:1.2;text-shadow:0 2px 8px rgba(0,0,0,0.4);">${tpl.bannerTitle}</p>` : ''}
                ${tpl.bannerSubtitle ? `<p style="margin:0 0 18px;font-size:13px;color:rgba(255,255,255,0.85);line-height:1.4;">${tpl.bannerSubtitle}</p>` : ''}
                ${tpl.bannerCtaText ? `
                <table cellspacing="0" cellpadding="0"><tr>
                  <td bgcolor="${tpl.accentColor}" style="border-radius:30px;padding:10px 24px;">
                    <a href="${tpl.bannerCtaLink || tpl.siteUrl}" target="_blank" style="color:#fff;font-size:13px;font-weight:800;text-decoration:none;white-space:nowrap;">${tpl.bannerCtaText}</a>
                  </td>
                </tr></table>` : ''}
              </td></tr>
            </table>` : ''}
          </div>
        </a>
      </td></tr>
    </table>
  </td></tr>` : '';

    const FULL_HEADER = HEADER + BANNER;

    const FOOTER = `</td></tr>
  <tr><td align="center" bgcolor="#f8fafc" style="padding:40px 30px;border-top:1px solid #f1f5f9;">
    <p style="font-size:11px;color:#94a3b8;line-height:18px;margin:0;">${footerHtml}</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const catMap: Record<string, keyof typeof tpl.categories> = {
        'Imóveis': 'imoveis', 'Veículos': 'veiculos', 'Outros': 'outros'
    };
    const allCats: Record<string, any[]> = {
        'Imóveis': auctions.filter(a => a.category === 'Imóveis' || !a.category),
        'Veículos': auctions.filter(a => a.category === 'Veículos'),
        'Outros': auctions.filter(a => a.category === 'Outros')
    };

    let body = ''; let shown = 0;
    const emojis: Record<string, string> = { 'Imóveis': '&#127968;', 'Veículos': '&#128663;', 'Outros': '&#128230;' };
    const cols = tpl.columns ?? 2;
    // Width per column (email-safe percentages)
    const colWidthMap: Record<number, string> = { 1: '100%', 2: '50%', 3: '33%', 4: '25%' };
    const imgHeightMap: Record<number, number> = { 1: 220, 2: 160, 3: 130, 4: 110 };
    const colWidth = colWidthMap[cols] || '50%';
    const imgHeight = imgHeightMap[cols] || 160;
    const titleSize = cols >= 3 ? '10px' : '12px';
    const priceSize = cols >= 3 ? '11px' : '13px';

    Object.entries(allCats).forEach(([name, items]) => {
        if (!tpl.categories[catMap[name]]) return;
        const limited = items.slice(0, Math.max(0, tpl.maxItems - shown));
        if (!limited.length) return;
        shown += limited.length;

        body += `<table width="100%" cellspacing="0" cellpadding="0" style="margin-top:25px;"><tr>
          <td width="4" bgcolor="${tpl.headerColor}" style="width:4px;">&nbsp;</td>
          <td style="padding:8px 12px;font-size:16px;font-weight:800;color:${tpl.accentColor};text-transform:uppercase;letter-spacing:1px;">${emojis[name]} ${name}</td>
        </tr></table><table width="100%" cellspacing="0" cellpadding="0">`;

        for (let i = 0; i < limited.length; i += cols) {
            body += '<tr>';
            for (let j = 0; j < cols; j++) {
                const auc = limited[i + j];
                if (!auc) { body += `<td width="${colWidth}" style="padding:4px;">&nbsp;</td>`; continue; }
                body += `<td width="${colWidth}" valign="top" style="padding:4px;">
                  <table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;">
                    <tr><td align="center" bgcolor="#f8fafc" style="height:${imgHeight}px;">
                      <a href="${auc.link}" target="_blank" style="display:block;text-decoration:none;">
                        <div style="width:100%;height:${imgHeight}px;background:url('${auc.image}') center/cover;">&nbsp;</div>
                      </a>
                    </td></tr>
                    <tr><td style="padding:${cols >= 3 ? '8px' : '12px'};">
                      <p style="margin:0;font-size:${titleSize};color:${tpl.headerColor};font-weight:700;line-height:14px;min-height:28px;">${auc.title}</p>
                      <p style="margin:6px 0 0;font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;">1&ordf; Pra&ccedil;a: <span style="${auc.isFirstStageClosed ? 'text-decoration:line-through;' : ''}">${auc.firstPrice || '---'} - ${auc.firstDate || '---'}</span></p>
                      <p style="margin:2px 0 0;font-size:${priceSize};color:${tpl.accentColor};font-weight:800;">2&ordf; Pra&ccedil;a: ${auc.secondPrice || '---'} - ${auc.secondDate || '---'}</p>
                      ${auc.discount > 0 ? `<p style="margin:3px 0 0;font-size:10px;color:#10b981;font-weight:700;">${auc.discount}% DESC.</p>` : ''}
                      <p style="margin:4px 0;"><span style="background:#f1f5f9;padding:2px 6px;font-size:9px;color:${tpl.headerColor};font-weight:800;text-transform:uppercase;">${auc.seller || 'E-Lance'}</span></p>
                      <table width="100%" cellspacing="0" cellpadding="0"><tr>
                        <td align="center" bgcolor="${tpl.headerColor}" style="border-radius:6px;">
                          <a href="${auc.link}" target="_blank" style="display:block;color:#fff;padding:${cols >= 3 ? '8px' : '11px'};text-decoration:none;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">${tpl.ctaText}</a>
                        </td>
                      </tr></table>
                    </td></tr>
                  </table>
                </td>`;
            }
            body += '</tr>';
        }
        body += '</table>';
    });

    return FULL_HEADER + body + FOOTER;
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
const EmailAutomations: React.FC = () => {
    const { profile } = useAuth();
    const [activeTab, setActiveTab] = useState<'preview' | 'template'>('preview');
    const [loading, setLoading] = useState(false);
    const [lastAuctions, setLastAuctions] = useState<any[]>([]);
    const [composing, setComposing] = useState(false);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [config, setConfig] = useState<any>({ enabled: false, frequency: 'weekly', day: 'monday', hour: '09:00', segment_id: 'all' });
    const [templateConfig, setTemplateConfig] = useState<typeof DEFAULT_TEMPLATE>({ ...DEFAULT_TEMPLATE });
    const [testEmail, setTestEmail] = useState('');
    const [sendingTest, setSendingTest] = useState(false);
    const [aiConfig, setAiConfig] = useState<any>(null);
    const [unitSettings, setUnitSettings] = useState<any>(null);
    const [segments, setSegments] = useState<any[]>([]);
    const [dispatching, setDispatching] = useState(false);
    const [dispatchResult, setDispatchResult] = useState<any>(null);
    const [savingTemplate, setSavingTemplate] = useState(false);
    const [savedOk, setSavedOk] = useState(false);
    const [savingConfig, setSavingConfig] = useState(false);

    const setTpl = (patch: Partial<typeof DEFAULT_TEMPLATE>) =>
        setTemplateConfig(prev => ({ ...prev, ...patch }));

    useEffect(() => {
        if (profile?.franchise_unit_id) {
            fetchSegments(); fetchConfig(); fetchAiConfig();
        }
    }, [profile]);

    const fetchSegments = async () => {
        const { data } = await supabase.from('email_segments').select('*').eq('ativo', true);
        setSegments(data || []);
    };

    const fetchConfig = async () => {
        if (!profile?.franchise_unit_id) return;
        const { data } = await supabase.from('email_automations').select('*')
            .eq('type', 'weekly_auctions').eq('franchise_unit_id', profile.franchise_unit_id).single();
        if (data) {
            const { template, ...rest } = data.config || {};
            setConfig(rest);
            if (template) setTemplateConfig({ ...DEFAULT_TEMPLATE, ...template });
        }
    };

    const fetchAiConfig = async () => {
        if (!profile?.franchise_unit_id) return;
        const { data } = await supabase.from('franchise_units')
            .select('ai_config, smtp_config, name, logo_url').eq('id', profile.franchise_unit_id).single();
        if (data) {
            setAiConfig(data.ai_config); setUnitSettings(data);
            if (data.logo_url && templateConfig.logoUrl === DEFAULT_TEMPLATE.logoUrl) setTpl({ logoUrl: data.logo_url });
        }
    };

    const safeJson = async (r: Response) => {
        const text = await r.text();
        try { return JSON.parse(text); }
        catch { throw new Error(`Servidor retornou erro (HTTP ${r.status}). Verifique se o backend está online.`); }
    };

    const handleScrapePreview = async () => {
        setLoading(true);
        try {
            const r = await fetch('/api/marketing/scrape-auctions');
            const d = await safeJson(r);
            if (d.success) setLastAuctions(d.auctions);
            else alert('Erro ao buscar leilões: ' + d.error);
        } catch (e: any) { alert('Erro: ' + e.message); }
        finally { setLoading(false); }
    };

    const handleGenerateStaticModel = () => {
        if (!lastAuctions.length) { alert('Primeiro busque os leilões.'); return; }
        setPreviewHtml(buildEmailHtml(lastAuctions, templateConfig));
    };

    const handleApplyTemplate = () => {
        if (!lastAuctions.length) { alert('Primeiro busque os leilões (botão "Buscar Leilões") e depois aplique.'); return; }
        setPreviewHtml(buildEmailHtml(lastAuctions, templateConfig));
        setActiveTab('preview');
    };

    const handleComposeEmail = async () => {
        if (!lastAuctions.length) { alert('Primeiro busque os leilões.'); return; }
        setComposing(true);
        try {
            const r = await fetch('/api/marketing/ai-newsletter', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ auctions: lastAuctions, aiConfig, logoUrl: templateConfig.logoUrl })
            });
            const d = await safeJson(r);
            if (d.success) setPreviewHtml(d.html);
            else alert('Erro na IA: ' + d.error);
        } catch (e: any) { alert('Erro: ' + e.message); }
        finally { setComposing(false); }
    };

    const persist = async (configToSave: any) => {
        const { error } = await supabase.from('email_automations').upsert({
            type: 'weekly_auctions', franchise_unit_id: profile?.franchise_unit_id,
            config: { ...config, ...configToSave, template: templateConfig }, active: config.enabled
        }, { onConflict: 'type,franchise_unit_id' });
        if (error) throw error;
    };

    const handleSaveConfig = async () => {
        setSavingConfig(true);
        try { await persist({}); alert('Configuração salva!'); }
        catch (e: any) { alert('Erro: ' + e.message); }
        finally { setSavingConfig(false); }
    };

    const handleSaveTemplate = async () => {
        setSavingTemplate(true);
        try { await persist({}); setSavedOk(true); setTimeout(() => setSavedOk(false), 3000); }
        catch (e: any) { alert('Erro ao salvar: ' + e.message); }
        finally { setSavingTemplate(false); }
    };

    const handleSendTestEmail = async () => {
        if (!testEmail) { alert('Insira um e-mail para teste.'); return; }
        if (!previewHtml) { alert('Gere a prévia primeiro.'); return; }
        const list = testEmail.split(',').map(e => e.trim()).filter(e => e.includes('@'));
        if (!list.length) { alert('E-mail inválido.'); return; }
        setSendingTest(true);
        try {
            for (const email of list) await sendEmail({ to: email, subject: `Teste - ${templateConfig.title}`, html: previewHtml, smtpConfig: unitSettings?.smtp_config });
            alert(`${list.length} e-mail(s) enviados!`);
        } catch (e: any) { alert('Erro: ' + e.message); }
        finally { setSendingTest(false); }
    };

    const handleDispatchNow = async () => {
        if (!previewHtml) { alert('⚠️ Gere a prévia antes de disparar.'); return; }
        const segName = config.segment_id === 'all' ? 'toda a base ativa' : segments.find(s => s.id === config.segment_id)?.nome_segmento || 'segmento';
        if (!confirm(`⚡ Disparar AGORA para ${segName}?`)) return;
        setDispatching(true); setDispatchResult(null);
        try {
            const r = await fetch('/api/marketing/trigger-newsletter', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ franchise_unit_id: profile?.franchise_unit_id, segment_id: config.segment_id, html: previewHtml, subject: `Informativo - ${templateConfig.title}`, mode: 'send_now' })
            });
            const d = await safeJson(r);
            setDispatchResult(r.ok ? { success: true, ...d } : { success: false, message: d.error || 'Erro no disparo.' });
        } catch (e: any) { setDispatchResult({ success: false, message: 'Erro: ' + e.message }); }
        finally { setDispatching(false); }
    };

    /* ─── Styles (dark-mode token-based) ─────────────────────────────── */
    const S = {
        page: { background: '#0B0F1A', minHeight: '100vh', color: '#F9FAFB', fontFamily: "'Josefin Sans', sans-serif" } as React.CSSProperties,
        selectDark: {
            width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '9px 12px', color: '#F9FAFB', fontSize: 13,
            outline: 'none', fontFamily: "'Josefin Sans', sans-serif", cursor: 'pointer', appearance: 'auto' as const
        } as React.CSSProperties,
        card: {
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 24, backdropFilter: 'blur(4px)'
        } as React.CSSProperties,
        btnPrimary: {
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '11px 18px', background: '#2563EB', color: '#fff',
            border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            fontFamily: "'Josefin Sans', sans-serif", letterSpacing: '0.04em', transition: 'background 150ms'
        } as React.CSSProperties,
        btnGhost: {
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '9px 16px', background: 'rgba(255,255,255,0.06)', color: '#D1D5DB',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontWeight: 600,
            fontSize: 12, cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif",
            letterSpacing: '0.04em', transition: 'background 150ms, border-color 150ms'
        } as React.CSSProperties,
        btnOrange: {
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '12px 18px',
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13,
            cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif",
            letterSpacing: '0.04em', boxShadow: '0 4px 24px rgba(249,115,22,0.3)', transition: 'opacity 150ms'
        } as React.CSSProperties,
        label: { display: 'block', fontSize: 10, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 },
        muted: { fontSize: 12, color: '#6B7280', lineHeight: 1.5 },
        heading: { fontFamily: "'Cinzel', serif", letterSpacing: '0.06em', color: '#F9FAFB' },
    };

    /* ─── Template Editor ────────────────────────────────────────────────── */
    const renderTemplateEditor = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Save bar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 10, background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(124,58,237,0.1) 100%)',
                border: '1px solid rgba(37,99,235,0.3)', borderRadius: 14, padding: '14px 18px'
            }}>
                <div>
                    <div style={{ ...S.heading, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Palette size={15} style={{ color: '#818cf8' }} /> Editor de Template
                    </div>
                    <div style={{ ...S.muted, fontSize: 11, marginTop: 2 }}>Configure o visual do seu informativo — fácil para qualquer pessoa editar</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleApplyTemplate} style={{ ...S.btnGhost, fontSize: 12 }}>
                        <Eye size={14} /> Ver Preview
                    </button>
                    <button
                        onClick={handleSaveTemplate} disabled={savingTemplate}
                        style={{
                            ...S.btnPrimary, width: 'auto', padding: '9px 18px',
                            background: savedOk ? '#059669' : '#2563EB', fontSize: 12
                        }}
                    >
                        {savingTemplate ? <Loader2 size={14} className="animate-spin" /> : savedOk ? <Check size={14} /> : <Save size={14} />}
                        {savingTemplate ? 'Salvando...' : savedOk ? 'Salvo!' : 'Salvar Template'}
                    </button>
                </div>
            </div>

            {/* ── Identidade ── */}
            <CollapseSection icon={<ImageIcon size={15} />} title="Identidade Visual" subtitle="Logo, cores e nome da empresa">
                <Field label="URL do Logo" hint="Cole o link direto da imagem (JPG, PNG). Use a URL pública do logo.">
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <DarkInput type="url" placeholder="https://..." value={templateConfig.logoUrl} onChange={e => setTpl({ logoUrl: e.target.value })} />
                        {templateConfig.logoUrl && (
                            <img src={templateConfig.logoUrl} alt="preview" style={{
                                height: 40, width: 72, objectFit: 'contain', borderRadius: 8, flexShrink: 0,
                                background: '#151d38', border: '1px solid rgba(255,255,255,0.1)', padding: 4
                            }} />
                        )}
                    </div>
                </Field>

                <Field label="Título do Informativo">
                    <DarkInput value={templateConfig.title} onChange={e => setTpl({ title: e.target.value })} placeholder="Oportunidades E-Lance" />
                </Field>

                <Field label="Paleta de Cores — Presets Prontos">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {COLOR_PRESETS.map(p => {
                            const active = templateConfig.headerColor === p.header && templateConfig.accentColor === p.accent;
                            return (
                                <button key={p.name} onClick={() => setTpl({ headerColor: p.header, accentColor: p.accent })}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                                        borderRadius: 10, border: active ? '1.5px solid #2563EB' : '1px solid rgba(255,255,255,0.08)',
                                        background: active ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)',
                                        cursor: 'pointer', transition: 'all 150ms'
                                    }}>
                                    <div style={{ display: 'flex', flexShrink: 0 }}>
                                        <div style={{ width: 12, height: 24, borderRadius: '4px 0 0 4px', background: p.header }} />
                                        <div style={{ width: 12, height: 24, borderRadius: '0 4px 4px 0', background: p.accent }} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: active ? '#93C5FD' : '#9CA3AF', fontFamily: "'Josefin Sans', sans-serif" }}>{p.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Cor do Cabeçalho" hint="Fundo do header e botões">
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input type="color" value={templateConfig.headerColor} onChange={e => setTpl({ headerColor: e.target.value })}
                                style={{ width: 40, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', padding: 2 }} />
                            <DarkInput value={templateConfig.headerColor} onChange={e => setTpl({ headerColor: e.target.value })}
                                style={{ fontFamily: 'monospace', fontSize: 12 }} />
                        </div>
                    </Field>
                    <Field label="Cor de Destaque" hint="Preços e links">
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input type="color" value={templateConfig.accentColor} onChange={e => setTpl({ accentColor: e.target.value })}
                                style={{ width: 40, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', padding: 2 }} />
                            <DarkInput value={templateConfig.accentColor} onChange={e => setTpl({ accentColor: e.target.value })}
                                style={{ fontFamily: 'monospace', fontSize: 12 }} />
                        </div>
                    </Field>
                </div>
            </CollapseSection>

            {/* ── Contatos ── */}
            <CollapseSection icon={<Phone size={15} />} title="Contatos & Redes Sociais" subtitle="Informações exibidas no rodapé do cabeçalho">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Telefone">
                        <DarkInput value={templateConfig.phone} onChange={e => setTpl({ phone: e.target.value })} placeholder="(11) 99999-9999" />
                    </Field>
                    <Field label="E-mail">
                        <DarkInput type="email" value={templateConfig.email} onChange={e => setTpl({ email: e.target.value })} placeholder="contato@empresa.com.br" />
                    </Field>
                </div>
                <Field label="Site (URL completa)">
                    <DarkInput type="url" value={templateConfig.siteUrl} onChange={e => setTpl({ siteUrl: e.target.value })} placeholder="https://www.elance.com.br" />
                </Field>
                <Field label="WhatsApp" hint="Número completo com código do país, sem espaços (ex: 5511941660975)">
                    <DarkInput value={templateConfig.whatsappNumber} onChange={e => setTpl({ whatsappNumber: e.target.value.replace(/\D/g, '') })} placeholder="5511941660975" />
                </Field>
                <Field label="Instagram (link do perfil)">
                    <DarkInput type="url" value={templateConfig.instagramUrl} onChange={e => setTpl({ instagramUrl: e.target.value })} placeholder="https://www.instagram.com/seuperfil/" />
                </Field>
            </CollapseSection>

            {/* ── Banner de Destaque ── */}
            <CollapseSection icon={<ImageIcon size={15} />} title="Banner de Destaque" subtitle="Imagem full-width entre o header e os cards" defaultOpen={false}>
                {/* Toggle ativo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: templateConfig.bannerEnabled ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${templateConfig.bannerEnabled ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 200ms' }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: templateConfig.bannerEnabled ? '#93C5FD' : '#9CA3AF', fontFamily: "'Josefin Sans', sans-serif" }}>
                            {templateConfig.bannerEnabled ? '✅ Banner Ativado' : '⬜ Banner Desativado'}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Imagem grande de destaque igual ao modelo Superbid</div>
                    </div>
                    <button onClick={() => setTpl({ bannerEnabled: !templateConfig.bannerEnabled })}
                        style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative', background: templateConfig.bannerEnabled ? '#2563EB' : '#374151', transition: 'background 200ms' }}>
                        <div style={{ position: 'absolute', top: 3, width: 18, height: 18, background: '#fff', borderRadius: '50%', left: templateConfig.bannerEnabled ? 23 : 3, transition: 'left 200ms' }} />
                    </button>
                </div>

                {templateConfig.bannerEnabled && (<>
                    <Field label="URL da Imagem do Banner" hint="Imagem larga (recomendado: 600x250px ou maior). Use uma URL pública de imagem JPG/PNG.">
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <DarkInput type="url" placeholder="https://..." value={templateConfig.bannerImageUrl} onChange={e => setTpl({ bannerImageUrl: e.target.value })} />
                        </div>
                        {templateConfig.bannerImageUrl && (
                            <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', maxHeight: 120 }}>
                                <img src={templateConfig.bannerImageUrl} alt="preview banner" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                            </div>
                        )}
                    </Field>

                    <Field label="Título sobre o Banner (opcional)" hint="Texto grande em branco sobreposto na imagem. Ex: 'Seu próximo imóvel está aqui'">
                        <DarkInput value={templateConfig.bannerTitle} onChange={e => setTpl({ bannerTitle: e.target.value })} placeholder="Seu próximo imóvel está aqui" />
                    </Field>

                    <Field label="Subtítulo (opcional)" hint="Texto menor abaixo do título. Ex: 'variedade, localização e desconto'">
                        <DarkInput value={templateConfig.bannerSubtitle} onChange={e => setTpl({ bannerSubtitle: e.target.value })} placeholder="variedade, localização e desconto" />
                    </Field>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Field label="Texto do Botão no Banner">
                            <DarkInput value={templateConfig.bannerCtaText} onChange={e => setTpl({ bannerCtaText: e.target.value })} placeholder="Confira >>>" />
                        </Field>
                        <Field label="Link do Botão no Banner">
                            <DarkInput type="url" value={templateConfig.bannerCtaLink} onChange={e => setTpl({ bannerCtaLink: e.target.value })} placeholder="https://..." />
                        </Field>
                    </div>

                    <Field label="Overlay escuro sobre a imagem">
                        <button onClick={() => setTpl({ bannerOverlay: !templateConfig.bannerOverlay })}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${templateConfig.bannerOverlay ? '#2563EB' : 'rgba(255,255,255,0.08)'}`, background: templateConfig.bannerOverlay ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 150ms' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: templateConfig.bannerOverlay ? '#60a5fa' : '#374151' }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: templateConfig.bannerOverlay ? '#93C5FD' : '#6B7280', fontFamily: "'Josefin Sans', sans-serif" }}>
                                {templateConfig.bannerOverlay ? 'Overlay ativo — texto mais legível sobre a foto' : 'Sem overlay — imagem pura'}
                            </span>
                        </button>
                    </Field>
                </>)}
            </CollapseSection>

            {/* ── Conteúdo ── */}
            <CollapseSection icon={<Type size={15} />} title="Conteúdo do E-mail" subtitle="Texto, quantidade de imóveis e categorias">
                <Field label="Frase de Abertura" hint="Deixe vazio para usar uma das 10 frases motivacionais de forma aleatória a cada envio — ótimo para variar!">
                    <DarkTextarea rows={3} value={templateConfig.incentive} onChange={e => setTpl({ incentive: e.target.value })}
                        placeholder="Deixe vazio para frases automáticas rotativas..." />
                </Field>

                <Field label="Texto do Botão CTA (Call-to-Action)">
                    <DarkInput value={templateConfig.ctaText} onChange={e => setTpl({ ctaText: e.target.value })} placeholder="VER LEILÃO" />
                </Field>

                <Field label="Número de Imóveis/Anúncios no E-mail">
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[4, 6, 8, 10, 12].map(n => (
                            <button key={n} onClick={() => setTpl({ maxItems: n })}
                                style={{
                                    flex: 1, padding: '9px 0', borderRadius: 8, fontWeight: 700, fontSize: 13,
                                    border: templateConfig.maxItems === n ? '2px solid #2563EB' : '1px solid rgba(255,255,255,0.1)',
                                    background: templateConfig.maxItems === n ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.03)',
                                    color: templateConfig.maxItems === n ? '#93C5FD' : '#6B7280',
                                    cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif", transition: 'all 150ms'
                                }}>{n}</button>
                        ))}
                    </div>
                </Field>

                <Field label="Layout de Colunas do Corpo" hint="Quantos cards por linha no e-mail. 2 colunas funciona em todos os clientes. 3-4 colunas são ótimas para muitos itens.">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                        {([1, 2, 3, 4] as const).map(n => {
                            const active = (templateConfig.columns ?? 2) === n;
                            // Mini visual preview of the grid
                            const previewCols = Array.from({ length: n });
                            return (
                                <button key={n} onClick={() => setTpl({ columns: n })}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                        padding: '10px 8px', borderRadius: 10,
                                        border: active ? '2px solid #2563EB' : '1px solid rgba(255,255,255,0.1)',
                                        background: active ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)',
                                        cursor: 'pointer', transition: 'all 150ms'
                                    }}>
                                    {/* Mini grid preview */}
                                    <div style={{ display: 'flex', gap: 3, width: '100%', justifyContent: 'center' }}>
                                        {previewCols.map((_, i) => (
                                            <div key={i} style={{
                                                flex: 1, height: 28, borderRadius: 3, maxWidth: 18,
                                                background: active ? 'rgba(37,99,235,0.5)' : 'rgba(255,255,255,0.12)',
                                                transition: 'background 150ms'
                                            }} />
                                        ))}
                                    </div>
                                    <span style={{
                                        fontSize: 12, fontWeight: 700,
                                        color: active ? '#93C5FD' : '#6B7280',
                                        fontFamily: "'Josefin Sans', sans-serif"
                                    }}>{n} {n === 1 ? 'Coluna' : 'Colunas'}</span>
                                </button>
                            );
                        })}
                    </div>
                </Field>

                <Field label="Categorias Ativas">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {([
                            { key: 'imoveis', label: 'Imóveis', icon: '🏠' },
                            { key: 'veiculos', label: 'Veículos', icon: '🚗' },
                            { key: 'outros', label: 'Outros', icon: '📦' }
                        ] as const).map(({ key, label, icon }) => {
                            const on = templateConfig.categories[key];
                            return (
                                <button key={key}
                                    onClick={() => setTpl({ categories: { ...templateConfig.categories, [key]: !on } })}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                                        border: on ? '1.5px solid #059669' : '1px solid rgba(255,255,255,0.08)',
                                        background: on ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.03)',
                                        cursor: 'pointer', transition: 'all 150ms'
                                    }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: on ? '#10b981' : '#374151', transition: 'background 150ms' }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: on ? '#6EE7B7' : '#6B7280', fontFamily: "'Josefin Sans', sans-serif" }}>{icon} {label}</span>
                                </button>
                            );
                        })}
                    </div>
                </Field>
            </CollapseSection>

            {/* ── Rodapé ── */}
            <CollapseSection icon={<Hash size={15} />} title="Rodapé Legal" subtitle="Endereço e informações da empresa" defaultOpen={false}>
                <Field label="Texto do Rodapé" hint="Use quebra de linha para separar o nome da empresa do endereço">
                    <DarkTextarea rows={3} value={templateConfig.footer} onChange={e => setTpl({ footer: e.target.value })} style={{ fontFamily: 'monospace', fontSize: 12 }} />
                </Field>
            </CollapseSection>

            {/* Bottom apply */}
            <button onClick={handleApplyTemplate}
                style={{ ...S.btnPrimary, background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', boxShadow: '0 4px 24px rgba(37,99,235,0.25)', padding: '14px 18px' }}>
                <Eye size={18} /> Aplicar ao Preview e Ver Resultado
            </button>
        </div>
    );

    /* ─── Render ─────────────────────────────────────────────────────────────── */
    return (
        <div style={S.page}>
            <div style={{ padding: '32px 32px 0', maxWidth: 1400, margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={18} color="#fff" />
                            </div>
                            <h1 style={{ ...S.heading, fontSize: 22, fontWeight: 700, margin: 0 }}>Informativos Inteligentes</h1>
                        </div>
                        <p style={{ ...S.muted, margin: 0 }}>Automatize e personalize seus e-mails de leilões semanais com IA</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: config.enabled ? '#22C55E' : '#374151', boxShadow: config.enabled ? '0 0 8px #22C55E' : 'none', transition: 'all 300ms' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: config.enabled ? '#86EFAC' : '#6B7280' }}>{config.enabled ? 'Automação Ativa' : 'Pausada'}</span>
                    </div>
                </div>

                {/* ── Dispatch Result ── */}
                {dispatchResult && (
                    <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px',
                        borderRadius: 14, marginBottom: 24,
                        background: dispatchResult.success ? 'rgba(5,150,105,0.12)' : 'rgba(239,68,68,0.12)',
                        border: `1px solid ${dispatchResult.success ? 'rgba(5,150,105,0.3)' : 'rgba(239,68,68,0.3)'}`
                    }}>
                        <div style={{ padding: 8, borderRadius: 8, background: dispatchResult.success ? 'rgba(5,150,105,0.2)' : 'rgba(239,68,68,0.2)' }}>
                            {dispatchResult.success ? <CheckCircle2 size={20} color="#34D399" /> : <XCircle size={20} color="#F87171" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: dispatchResult.success ? '#6EE7B7' : '#FCA5A5', marginBottom: 4 }}>
                                {dispatchResult.success ? 'Disparo Concluído!' : 'Erro no Disparo'}
                            </div>
                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{dispatchResult.message}</div>
                            {dispatchResult.success && (
                                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                                    {[{ n: dispatchResult.sent, l: 'Enviados', c: '#059669' }, { n: dispatchResult.errors, l: 'Erros', c: '#DC2626', show: dispatchResult.errors > 0 }, { n: dispatchResult.total, l: 'Total', c: '#4B5563' }]
                                        .filter(i => i.show !== false)
                                        .map(({ n, l, c }) => (
                                            <div key={l} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', textAlign: 'center' }}>
                                                <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{n}</div>
                                                <div style={{ fontSize: 10, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setDispatchResult(null)} style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: 18 }}>✕</button>
                    </div>
                )}

                {/* ── Main Grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, paddingBottom: 40 }}>

                    {/* ── Left: Config Panel ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Agendamento */}
                        <div style={S.card}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                                <Calendar size={16} style={{ color: '#60a5fa' }} />
                                <span style={{ fontWeight: 700, fontSize: 13, color: '#F9FAFB', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>Agendamento</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 12, color: '#D1D5DB', fontWeight: 600 }}>Ativar Automação</span>
                                    <button onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                                        style={{
                                            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative',
                                            background: config.enabled ? '#2563EB' : '#374151', transition: 'background 200ms'
                                        }}>
                                        <div style={{
                                            position: 'absolute', top: 3, width: 18, height: 18, background: '#fff', borderRadius: '50%',
                                            left: config.enabled ? 23 : 3, transition: 'left 200ms'
                                        }} />
                                    </button>
                                </div>

                                <div>
                                    <label style={S.label}>Frequência</label>
                                    <select style={S.selectDark} value={config.frequency} onChange={e => setConfig({ ...config, frequency: e.target.value })}>
                                        <option value="weekly">Semanal</option>
                                        <option value="biweekly">Quinzenal</option>
                                        <option value="monthly">Mensal</option>
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div>
                                        <label style={S.label}>Dia</label>
                                        <select style={S.selectDark} value={config.day} onChange={e => setConfig({ ...config, day: e.target.value })}>
                                            {[['monday', 'Segunda'], ['tuesday', 'Terça'], ['wednesday', 'Quarta'], ['thursday', 'Quinta'], ['friday', 'Sexta']].map(([v, l]) => (
                                                <option key={v} value={v}>{l}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={S.label}>Horário</label>
                                        <input type="time" style={{ ...S.selectDark, width: '100%', boxSizing: 'border-box' as const }} value={config.hour} onChange={e => setConfig({ ...config, hour: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label style={S.label}>Segmento</label>
                                    <select style={S.selectDark} value={config.segment_id} onChange={e => setConfig({ ...config, segment_id: e.target.value })}>
                                        <option value="all">Toda a Base Ativa</option>
                                        {segments.map(s => <option key={s.id} value={s.id}>{s.nome_segmento}</option>)}
                                    </select>
                                </div>

                                <button onClick={handleSaveConfig} disabled={savingConfig} style={S.btnPrimary}>
                                    {savingConfig ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                                    Salvar Agendamento
                                </button>
                            </div>
                        </div>

                        {/* Disparar Agora */}
                        <div style={{
                            ...S.card, borderColor: 'rgba(249,115,22,0.25)',
                            background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(234,88,12,0.05) 100%)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <Rocket size={16} style={{ color: '#FB923C' }} />
                                <span style={{ fontWeight: 700, fontSize: 13, color: '#FED7AA', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>Disparar Agora</span>
                            </div>
                            <p style={{ ...S.muted, fontSize: 12, marginBottom: 14 }}>
                                Envia o informativo da prévia <strong style={{ color: '#FCA5A5' }}>imediatamente</strong> para todos os contatos do segmento selecionado.
                            </p>
                            {!previewHtml && (
                                <div style={{ display: 'flex', gap: 8, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
                                    <AlertCircle size={14} style={{ color: '#FB923C', flexShrink: 0, marginTop: 1 }} />
                                    <p style={{ fontSize: 11, color: '#FED7AA', margin: 0, lineHeight: 1.4 }}>
                                        Gere uma prévia primeiro: <strong>"Buscar Leilões"</strong> → <strong>"Modelo Padrão"</strong>
                                    </p>
                                </div>
                            )}
                            <button onClick={handleDispatchNow} disabled={dispatching || !previewHtml}
                                style={{ ...S.btnOrange, opacity: (dispatching || !previewHtml) ? 0.5 : 1, cursor: (dispatching || !previewHtml) ? 'not-allowed' : 'pointer' }}>
                                {dispatching ? <><Loader2 size={16} className="animate-spin" /> Disparando...</> : <><Zap size={16} /> Disparar Agora</>}
                            </button>
                        </div>

                        {/* Como funciona */}
                        <div style={{ ...S.card, borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <Brain size={15} style={{ color: '#A78BFA' }} />
                                <span style={{ fontWeight: 700, fontSize: 13, color: '#DDD6FE', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>Como Funciona</span>
                            </div>
                            {[
                                ['1', 'Clique em "Buscar Leilões" para carregar os imóveis do site E-Lance.'],
                                ['2', 'Gere a prévia com "Modelo Padrão" ou personalize com "Refinar com AI".'],
                                ['3', 'Dispare agora ou configure o agendamento automático.']
                            ].map(([n, t]) => (
                                <div key={n} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(167,139,250,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: 10, fontWeight: 800, color: '#C4B5FD' }}>{n}</span>
                                    </div>
                                    <span style={{ fontSize: 12, color: '#C4B5FD', lineHeight: 1.5 }}>{t}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* ── Right: Tabs ── */}
                    <div style={{ ...S.card, padding: 0, display: 'flex', flexDirection: 'column', minHeight: 920 }}>

                        {/* Tab Bar */}
                        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            {(([
                                { id: 'preview', icon: <Mail size={15} />, label: 'Prévia do Informativo', badge: undefined },
                                { id: 'template', icon: <Palette size={15} />, label: '🎨 Personalizar', badge: 'NOVO' }
                            ]) as { id: 'preview' | 'template'; icon: React.ReactNode; label: string; badge?: string }[]).map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                        padding: '14px 20px', border: 'none', cursor: 'pointer',
                                        fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, fontWeight: 700,
                                        letterSpacing: '0.03em', transition: 'all 150ms',
                                        background: activeTab === tab.id ? 'rgba(37,99,235,0.08)' : 'transparent',
                                        color: activeTab === tab.id ? '#93C5FD' : '#6B7280',
                                        borderBottom: activeTab === tab.id ? '2px solid #2563EB' : '2px solid transparent'
                                    }}>
                                    {tab.icon} {tab.label}
                                    {tab.badge && (
                                        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 100, background: 'rgba(37,99,235,0.2)', color: '#60a5fa', letterSpacing: '0.08em' }}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'preview' ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
                                {/* Action buttons */}
                                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                                    <button onClick={handleScrapePreview} disabled={loading} style={{ ...S.btnGhost, flex: 'none' }}>
                                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                                        {loading ? 'Buscando...' : '1. Buscar Leilões'}
                                    </button>
                                    <button onClick={handleGenerateStaticModel} disabled={!lastAuctions.length} style={{
                                        ...S.btnGhost, flex: 'none', borderColor: 'rgba(37,99,235,0.3)',
                                        color: '#93C5FD', opacity: !lastAuctions.length ? 0.4 : 1, cursor: !lastAuctions.length ? 'not-allowed' : 'pointer'
                                    }}>
                                        <Layout size={14} /> 2. Modelo Padrão (2 Colunas)
                                    </button>
                                    <button onClick={handleComposeEmail} disabled={composing || !lastAuctions.length} style={{
                                        ...S.btnGhost, flex: 'none',
                                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))',
                                        borderColor: 'rgba(124,58,237,0.4)', color: '#C4B5FD',
                                        opacity: (composing || !lastAuctions.length) ? 0.4 : 1,
                                        cursor: (composing || !lastAuctions.length) ? 'not-allowed' : 'pointer'
                                    }}>
                                        <Wand2 size={14} style={{ animation: composing ? 'spin 1s linear infinite' : 'none' }} />
                                        {composing ? 'Compondo...' : '3. Refinar com AI'}
                                    </button>
                                </div>

                                {/* Preview area */}
                                <div style={{
                                    flex: 1, minHeight: 700, borderRadius: 12, overflow: 'hidden', position: 'relative',
                                    background: previewHtml ? 'transparent' : 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.06)'
                                }}>
                                    {previewHtml ? (
                                        <iframe title="Email Preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', background: '#fff', borderRadius: 12 }} srcDoc={previewHtml} />
                                    ) : (
                                        <div style={{ height: '100%', minHeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center' }}>
                                            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                                <Brain size={32} style={{ color: '#2563EB', opacity: 0.5 }} />
                                            </div>
                                            <p style={{ ...S.heading, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Prévia do Informativo</p>
                                            <p style={{ ...S.muted, maxWidth: 280, margin: '0 auto 24px' }}>
                                                Clique em <strong style={{ color: '#93C5FD' }}>Buscar Leilões</strong> e depois <strong style={{ color: '#93C5FD' }}>Modelo Padrão</strong> para gerar a prévia
                                            </p>
                                            {lastAuctions.length > 0 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 400 }}>
                                                    {lastAuctions.slice(0, 4).map((a, i) => (
                                                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                                                            <div style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0, backgroundImage: `url(${a.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                                            <div style={{ minWidth: 0 }}>
                                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#D1D5DB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                                                                <div style={{ fontSize: 9, color: '#60a5fa', fontWeight: 700, marginTop: 2 }}>{a.price}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Test send bar */}
                                {previewHtml && (
                                    <div style={{
                                        marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                                        background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)',
                                        borderRadius: 12, padding: '14px 16px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                            <CheckCircle2 size={18} style={{ color: '#34D399', flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: '#6EE7B7' }}>Preview gerado!</div>
                                                <div style={{ fontSize: 11, color: '#6B7280' }}>Envie um teste antes de disparar para toda a lista</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <DarkInput type="email" placeholder="E-mail para teste..." value={testEmail} onChange={e => setTestEmail(e.target.value)} style={{ width: 220 }} />
                                            <button onClick={handleSendTestEmail} disabled={sendingTest} style={{ ...S.btnPrimary, width: 'auto', padding: '9px 18px', background: '#059669', fontSize: 12, flexShrink: 0 }}>
                                                {sendingTest ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                {sendingTest ? 'Enviando...' : 'Enviar Teste'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                                {renderTemplateEditor()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Keyframe for spin animation */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default EmailAutomations;
