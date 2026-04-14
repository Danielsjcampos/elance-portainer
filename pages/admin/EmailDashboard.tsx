import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, MousePointer2, Percent, Users, BarChart, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { emailFlowService } from '../../services/emailFlowService';
import { 
    BarChart as ReBarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import moment from 'moment';

const EmailDashboard: React.FC = () => {
    const { profile } = useAuth();
    const [stats, setStats] = useState({
        totalContacts: 0,
        activeFlows: 0,
        emailsSent: 0,
        openRate: 0,
        clickRate: 0
    });
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        fetchStats();

        // Auto-process queue every 60s while on dashboard
        const interval = setInterval(() => {
            emailFlowService.processQueue(5).then(() => fetchStats()).catch(console.error);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            // 1. Basic Counts
            const { count: contactsCount } = await supabase.from('email_contacts').select('*', { count: 'exact', head: true });
            const { count: flowsCount } = await supabase.from('email_flows').select('*', { count: 'exact', head: true }).eq('ativo', true);
            const { count: sentCount } = await supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'enviado');

            // 2. Open/Click Rates
            const { data: logs } = await supabase.from('email_logs').select('action, queue_id');
            const uniqueOpens = new Set(logs?.filter(l => l.action === 'open').map(l => l.queue_id)).size;
            const uniqueClicks = new Set(logs?.filter(l => l.action === 'click').map(l => l.queue_id)).size;

            const openRate = sentCount ? ((uniqueOpens / sentCount) * 100).toFixed(1) : 0;
            const clickRate = sentCount ? ((uniqueClicks / sentCount) * 100).toFixed(1) : 0;

            setStats({
                totalContacts: contactsCount || 0,
                activeFlows: flowsCount || 0,
                emailsSent: sentCount || 0,
                openRate: Number(openRate),
                clickRate: Number(clickRate)
            });

            // 3. Performance Data (Last 7 days)
            const sevenDaysAgo = moment().subtract(7, 'days').toISOString();
            const { data: queueData } = await supabase
                .from('email_queue')
                .select('sent_at')
                .eq('status', 'enviado')
                .gte('sent_at', sevenDaysAgo);

            const chartData = Array.from({ length: 7 }).map((_, i) => {
                const date = moment().subtract(6 - i, 'days');
                const dateStr = date.format('DD/MM');
                const count = queueData?.filter(q => q.sent_at && moment(q.sent_at).format('DD/MM') === dateStr).length || 0;
                return { name: dateStr, envios: count };
            });
            setPerformanceData(chartData);

            // 4. Latest Campaigns (Grouped by Template)
            const { data: recentQueues } = await supabase
                .from('email_queue')
                .select('*, template:email_templates(nome_template)')
                .eq('status', 'enviado')
                .order('sent_at', { ascending: false })
                .limit(50);

            // Basic Grouping by template_id + day
            const groupedCampaigns: any[] = [];
            const processed = new Set();
            
            recentQueues?.forEach(q => {
                const dayStr = moment(q.sent_at).format('YYYY-MM-DD');
                const key = `${q.template_id}-${dayStr}`;
                if (!processed.has(key)) {
                    const count = recentQueues.filter(rq => `${rq.template_id}-${moment(rq.sent_at).format('YYYY-MM-DD')}` === key).length;
                    groupedCampaigns.push({
                        id: q.id,
                        name: q.template?.nome_template || 'Sem Título',
                        date: q.sent_at,
                        sent: count,
                        status: 'Concluído'
                    });
                    processed.add(key);
                }
            });
            setRecentCampaigns(groupedCampaigns.slice(0, 5));

        } catch (error) {
            console.error('Error fetching email stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeedDefaults = async () => {
        if (!profile?.franchise_unit_id) return;
        setIsSeeding(true);
        try {
            // Seed Templates
            const templates = [
                {
                    nome_template: 'Boas-vindas Designer/Modelo',
                    tipo: 'comunicado',
                    assunto: 'Seja bem-vindo(a) à Elite Creative!',
                    corpo_html: '<div style="font-family: Arial; padding: 20px;"><h1>Olá {{nome}}!</h1><p>Sua jornada criativa começa aqui.</p></div>',
                    variaveis: ['nome'],
                    franchise_unit_id: profile.franchise_unit_id
                },
                {
                    nome_template: 'Oportunidade de Casting/Job',
                    tipo: 'leilao',
                    assunto: 'NOVA OPORTUNIDADE: Casting Aberto',
                    corpo_html: '<div style="padding: 20px;"><h2>Novo Casting: Campanha de Verão</h2><p>Olá {{nome}}, candidates-se agora.</p></div>',
                    variaveis: ['nome'],
                    franchise_unit_id: profile.franchise_unit_id
                }
            ];

            const { error: tError } = await supabase.from('email_templates').insert(templates);
            if (tError) throw tError;

            // Seed Segments
            const segments = [
                {
                    nome_segmento: 'Designers de Elite',
                    descricao: 'Contatos interessados em design.',
                    regras: { interests: ["investidor", "news"] },
                    franchise_unit_id: profile.franchise_unit_id
                }
            ];
            const { error: sError } = await supabase.from('email_segments').insert(segments);
            if (sError) throw sError;

            alert('Base técnica de modelos e templates criada com sucesso!');
            fetchStats();
        } catch (error: any) {
            alert('Erro ao configurar base: ' + error.message);
        } finally {
            setIsSeeding(false);
        }
    };

    const statCards = [
        { label: 'Contatos Totais', value: stats.totalContacts, icon: Users, color: 'blue' },
        { label: 'Fluxos Ativos', value: stats.activeFlows, icon: BarChart, color: 'purple' },
        { label: 'E-mails Enviados', value: stats.emailsSent, icon: Mail, color: 'green' },
        { label: 'Taxa de Abertura', value: `${stats.openRate}%`, icon: Percent, color: 'orange' },
        { label: 'Taxa de Cliques', value: `${stats.clickRate}%`, icon: MousePointer2, color: 'pink' },
    ];

    return (
        <div className="p-6 space-y-8">
            {stats.totalContacts === 0 && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <Sparkles className="text-yellow-400" /> Comece sua Automação
                            </h2>
                            <p className="opacity-90">Detectamos que sua base de marketing está vazia. Gostaria de configurar automaticamente os modelos e fluxos para <b>Modelos e Designers</b>?</p>
                        </div>
                        <button
                            onClick={handleSeedDefaults}
                            disabled={isSeeding}
                            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSeeding ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            {isSeeding ? 'Configurando...' : 'Configurar Base Agora'}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-end mb-4">
                <button
                    onClick={async () => {
                        const loadingBtn = document.getElementById('btn-process-queue');
                        if (loadingBtn) loadingBtn.innerText = 'Processando...';
                        try {
                            const res = await emailFlowService.processQueue(5);
                            alert(`Processamento concluído! ${res.length} e-mails processados.`);
                            fetchStats();
                        } catch (e: any) {
                            alert('Erro: ' + e.message);
                        } finally {
                            if (loadingBtn) loadingBtn.innerText = 'Forçar Processamento da Fila';
                        }
                    }}
                    id="btn-process-queue"
                    className="flex items-center gap-2 text-xs font-bold bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                >
                    <RefreshCw size={14} /> Forçar Processamento da Fila
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 flex items-center justify-center mb-4`}>
                                <Icon size={20} className={`text-${card.color}-600`} />
                            </div>
                            <p className="text-sm font-medium text-gray-500">{card.label}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" /> Desempenho Recente
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorEnvios" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3a7ad1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3a7ad1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#94a3b8'}}
                                    dy={10}
                                />
                                <YAxis 
                                    hide 
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="envios" 
                                    stroke="#3a7ad1" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorEnvios)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Mail size={20} className="text-[#3a7ad1]" /> Últimas Campanhas
                    </h3>
                    <div className="space-y-4">
                        {recentCampaigns.length > 0 ? recentCampaigns.map(camp => (
                            <div key={camp.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-[#3a7ad1]">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm line-clamp-1">{camp.name}</p>
                                        <p className="text-xs text-gray-500">{moment(camp.date).format('DD/MM/YYYY HH:mm')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">{camp.sent}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Enviados</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center py-12 text-gray-400 italic">Nenhuma campanha enviada recentemente.</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EmailDashboard;
