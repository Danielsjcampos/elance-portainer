import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Layout, Plus, Mail, Trash2, Edit, Copy, Type, Send, Users, Filter, Check, RefreshCw, Sparkles, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../../components/Modal';
import { emailFlowService } from '../../services/emailFlowService';
import VisualEmailBuilder from './VisualEmailBuilder';

const TemplateManagement: React.FC = () => {
    const { profile } = useAuth();
    const [templates, setTemplates] = useState<any[]>([]);
    const [segments, setSegments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isBlastModalOpen, setIsBlastModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [selectedSegment, setSelectedSegment] = useState<string>('all');
    const [isDispatching, setIsDispatching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [isVisualEditorOpen, setIsVisualEditorOpen] = useState(false);
    const [aiConfig, setAiConfig] = useState<any>(null);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');

    useEffect(() => {
        fetchTemplates();
        fetchSegments();
        fetchAiConfig();
    }, [profile]);

    const fetchAiConfig = async () => {
        if (!profile?.franchise_unit_id) return;
        const { data } = await supabase
            .from('franchise_units')
            .select('ai_config')
            .eq('id', profile.franchise_unit_id)
            .single();
        if (data?.ai_config) setAiConfig(data.ai_config);
    };

    const fetchSegments = async () => {
        const { data } = await supabase.from('email_segments').select('*').eq('ativo', true);
        setSegments(data || []);
    };

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('email_templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenBlast = (template: any) => {
        setSelectedTemplate(template);
        setIsBlastModalOpen(true);
    };

    const handleOpenEdit = (template: any = null) => {
        if (template) {
            setSelectedTemplate({ ...template });
        } else {
            setSelectedTemplate({
                nome_template: '',
                tipo: 'comunicado',
                assunto: '',
                corpo_html: '<div style="font-family: Arial; padding: 20px;">\n  <h1>Olá {{nome}}!</h1>\n  <p>Escreva seu conteúdo aqui...</p>\n</div>',
                variaveis: ['nome'],
                franchise_unit_id: profile?.franchise_unit_id
            });
        }
        setIsEditModalOpen(true);
    };

    const handleSaveTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (selectedTemplate.id) {
                const { error } = await supabase
                    .from('email_templates')
                    .update({
                        nome_template: selectedTemplate.nome_template,
                        tipo: selectedTemplate.tipo,
                        assunto: selectedTemplate.assunto,
                        corpo_html: selectedTemplate.corpo_html,
                        variaveis: selectedTemplate.variaveis
                    })
                    .eq('id', selectedTemplate.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('email_templates')
                    .insert([selectedTemplate]);
                if (error) throw error;
            }

            alert('Template salvo com sucesso!');
            setIsEditModalOpen(false);
            fetchTemplates();
        } catch (error: any) {
            alert('Erro ao salvar template: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleTestSend = async (template: any) => {
        const email = prompt('Para qual e-mail deseja enviar o teste?', profile?.email);
        if (!email) return;

        setIsTesting(true);
        try {
            // Render basic test
            const html = template.corpo_html.replace('{{nome}}', profile?.full_name || 'Usuário de Teste');

            // Send via emailService
            const { sendEmail } = await import('../../services/emailService');
            await sendEmail({
                to: email,
                subject: `[TESTE] ${template.assunto}`,
                html: html
            });

            alert('E-mail de teste enviado com sucesso!');
        } catch (error: any) {
            alert('Erro ao enviar teste: ' + error.message);
        } finally {
            setIsTesting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir este template permanentemente?')) return;
        try {
            const { error } = await supabase.from('email_templates').delete().eq('id', id);
            if (error) throw error;
            fetchTemplates();
        } catch (error: any) {
            alert('Erro ao excluir template: ' + error.message);
        }
    };

    const handleGenerateAi = async () => {
        if (!aiPrompt) return alert('Descreva o que deseja no template.');
        if (!aiConfig) return alert('Configuração de IA não encontrada.');

        setIsGeneratingAi(true);
        try {
            const systemPrompt = `Você é um Web Designer e Marketeer especialista em E-mail.
            Gere o CORPOR HTML COMPLETO de um e-mail. 
            Regras:
            1. Use tabelas para compatibilidade com Outlook.
            2. Cores: Marinho (#151d38) e Azul (#3a7ad1).
            3. Logo: https://static.s4bdigital.net/logos_empresas/logoELance.jpg (largura fixa 180px).
            4. Layout limpo e responsivo.
            5. Use {{nome}} para personalização de nome.
            Retorne APENAS o código HTML puro.`;

            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Crie um template de e-mail sobre: ${aiPrompt}`,
                    systemPrompt,
                    aiConfig
                })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            setSelectedTemplate({ ...selectedTemplate, corpo_html: data.text });
            setAiPrompt('');
        } catch (error: any) {
            alert('Erro: ' + error.message);
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const handleDispatch = async () => {
        if (!selectedTemplate) return;
        setIsDispatching(true);

        try {
            // 1. Fetch target contacts
            let query = supabase.from('email_contacts').select('*').eq('status', 'ativo');

            if (selectedSegment !== 'all') {
                const segment = segments.find(s => s.id === selectedSegment);
                if (segment) {
                    // Filter logic handled in memory for simplicity or via rule evaluation
                    // In real app, might want a more complex SQL query or RPC
                }
            }

            const { data: contacts, error: contactError } = await query;
            if (contactError) throw contactError;

            if (!contacts || contacts.length === 0) {
                alert('Nenhum contato encontrado no segmento selecionado.');
                setIsDispatching(false);
                return;
            }

            // 2. Add each contact to the queue
            let count = 0;
            for (const contact of contacts) {
                // Apply segment rules if not 'all'
                if (selectedSegment !== 'all') {
                    const segment = segments.find(s => s.id === selectedSegment);
                    if (segment && !emailFlowService.matchesSegment(contact, segment.regras)) {
                        continue;
                    }
                }

                await emailFlowService.addToQueue(contact.id, selectedTemplate.id);
                count++;
            }

            alert(`Campanha agendada com sucesso! ${count} e-mails adicionados à fila de disparo.`);
            setIsBlastModalOpen(false);
        } catch (error: any) {
            alert('Erro ao agendar disparo: ' + error.message);
        } finally {
            setIsDispatching(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Modelos de E-mail</h3>
                    <p className="text-sm text-gray-500">Templates reutilizáveis com variáveis dinâmicas.</p>
                </div>
                <button
                    onClick={() => handleOpenEdit()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3a7ad1] text-white rounded-xl hover:bg-[#2a61b0] transition-colors font-medium shadow-sm"
                >
                    <Plus size={18} /> Novo Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-50 rounded-2xl animate-pulse"></div>
                    ))
                ) : templates.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border border-dashed">
                        <Layout size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">Nenhum template criado ainda.</p>
                        <button className="mt-4 text-[#3a7ad1] font-bold hover:underline">Criar meu primeiro modelo</button>
                    </div>
                ) : (
                    templates.map((template) => (
                        <div key={template.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            <div className="h-32 bg-gray-50 border-b border-gray-50 flex items-center justify-center relative overflow-hidden">
                                <Mail size={40} className="text-gray-200" />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleOpenBlast(template)}
                                        className="p-2 bg-white rounded-lg text-[#3a7ad1] shadow-sm hover:scale-110 transition-transform"
                                        title="Disparar esta Campanha"
                                    >
                                        <Send size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleTestSend(template)}
                                        className="p-2 bg-white rounded-lg text-green-600 shadow-sm hover:scale-110 transition-transform"
                                        title="Enviar Teste"
                                    >
                                        <Mail size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEdit(template)}
                                        className="p-2 bg-white rounded-lg text-gray-600 shadow-sm hover:scale-110 transition-transform"
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="p-2 bg-white rounded-lg text-red-500 shadow-sm hover:scale-110 transition-transform"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-blue-50 text-blue-600 rounded">
                                        {template.tipo || 'Geral'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{template.nome_template}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2 italic mb-3">"{template.assunto}"</p>

                                <div className="flex flex-wrap gap-1 mt-auto">
                                    {template.variaveis?.map((v: string, idx: number) => (
                                        <span key={idx} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-mono">
                                            {`{${v}}`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Blast Modal */}
            {isBlastModalOpen && selectedTemplate && (
                <Modal isOpen={isBlastModalOpen} onClose={() => setIsBlastModalOpen(false)} title="Disparar Campanha">
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                                <Mail size={18} /> Modelo Selecionado
                            </h4>
                            <p className="text-blue-800 text-sm">{selectedTemplate.nome_template}</p>
                            <p className="text-blue-600 text-xs italic mt-1">Assunto: {selectedTemplate.assunto}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Users size={18} /> Público-Alvo
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedSegment === 'all' ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        className="sr-only"
                                        name="segment"
                                        value="all"
                                        checked={selectedSegment === 'all'}
                                        onChange={() => setSelectedSegment('all')}
                                    />
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedSegment === 'all' ? 'border-[#3a7ad1] bg-[#3a7ad1]' : 'border-gray-300'}`}>
                                        {selectedSegment === 'all' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-gray-800">Todos os Contatos Ativos</p>
                                        <p className="text-xs text-gray-500">Enviar para toda a sua base disponível.</p>
                                    </div>
                                </label>

                                {segments.map(s => (
                                    <label key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedSegment === s.id ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="segment"
                                            value={s.id}
                                            checked={selectedSegment === s.id}
                                            onChange={() => setSelectedSegment(s.id)}
                                        />
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedSegment === s.id ? 'border-[#3a7ad1] bg-[#3a7ad1]' : 'border-gray-300'}`}>
                                            {selectedSegment === s.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-gray-800">{s.nome_segmento}</p>
                                            <p className="text-xs text-gray-500">{s.descricao || 'Filtro personalizado.'}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                            <b>Nota:</b> Os e-mails serão adicionados à fila de processamento e disparados usando as configurações de SMTP da sua unidade de franquia.
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={() => setIsBlastModalOpen(false)}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDispatch}
                                disabled={isDispatching}
                                className="px-6 py-2 bg-[#3a7ad1] text-white rounded-lg font-bold hover:bg-[#2a61b0] disabled:opacity-50 flex items-center gap-2"
                            >
                                {isDispatching ? <RefreshCw className="animate-spin" size={18} /> : <Check size={18} />}
                                {isDispatching ? 'Confirmar Disparo...' : 'Iniciar Campanha'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Edit Template Modal */}
            {isEditModalOpen && selectedTemplate && (
                <Modal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    title={selectedTemplate.id ? "Editar Template" : "Novo Template"}
                    maxWidth="max-w-6xl"
                >
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Editor Side */}
                        <div className="lg:w-1/2 flex flex-col gap-4">
                            <form onSubmit={handleSaveTemplate} className="space-y-4">
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mb-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles size={20} className="text-purple-600" />
                                        <span className="text-purple-900 font-bold text-sm">Assistente de Design IA</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            placeholder="Ex: Newsletter mensal de ofertas, fundo claro..."
                                            className="flex-1 text-xs border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-400"
                                            value={aiPrompt}
                                            onChange={e => setAiPrompt(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGenerateAi}
                                            disabled={isGeneratingAi}
                                            className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 disabled:opacity-50"
                                        >
                                            {isGeneratingAi ? 'Gerando...' : 'Gerar HTML'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Nome</label>
                                        <input
                                            required
                                            className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#3a7ad1]/20"
                                            value={selectedTemplate.nome_template}
                                            onChange={e => setSelectedTemplate({ ...selectedTemplate, nome_template: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Tipo</label>
                                        <select
                                            className="w-full border rounded-lg p-2 text-sm outline-none"
                                            value={selectedTemplate.tipo}
                                            onChange={e => setSelectedTemplate({ ...selectedTemplate, tipo: e.target.value })}
                                        >
                                            <option value="comunicado">Comunicado</option>
                                            <option value="leilao">Leilão/Imóvel</option>
                                            <option value="blog">Blog/Notícias</option>
                                            <option value="outros">Outros</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Assunto</label>
                                    <input
                                        required
                                        className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#3a7ad1]/20"
                                        value={selectedTemplate.assunto}
                                        onChange={e => setSelectedTemplate({ ...selectedTemplate, assunto: e.target.value })}
                                        placeholder="Assunto da mensagem"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 flex justify-between uppercase">
                                        Conteúdo HTML
                                        <div className="flex gap-2">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsVisualEditorOpen(true)}
                                                className="text-[10px] font-bold text-[#3a7ad1] hover:underline flex items-center gap-1"
                                            >
                                                <Sparkles size={10} /> Editor Visual
                                            </button>
                                        </div>
                                    </label>
                                    <textarea
                                        required
                                        className="w-full border rounded-lg p-3 outline-none h-[400px] font-mono text-xs leading-relaxed"
                                        value={selectedTemplate.corpo_html}
                                        onChange={e => setSelectedTemplate({ ...selectedTemplate, corpo_html: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-500 text-sm">Cancelar</button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-[#151d38] text-white rounded-lg font-bold hover:bg-[#0a0f1d] disabled:opacity-50 flex items-center gap-2 text-sm"
                                    >
                                        {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Check size={18} />}
                                        {isSaving ? 'Salvando...' : 'Salvar Template'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview Side */}
                        <div className="lg:w-1/2 flex flex-col bg-gray-50 rounded-2xl border overflow-hidden min-h-[500px]">
                            <div className="bg-white border-b p-3 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Eye size={16} /> Pré-visualização Real
                                </span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-4 bg-[#eff0f1]">
                                <div 
                                    className="bg-white shadow-lg mx-auto overflow-hidden" 
                                    style={{ width: '100%', maxWidth: '100%', minHeight: '100%' }}
                                    dangerouslySetInnerHTML={{ __html: selectedTemplate.corpo_html }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Visual Editor Modal Overlay */}
            {isVisualEditorOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 overflow-hidden">
                    <div className="w-full h-full max-w-6xl animate-scale-in">
                        <VisualEmailBuilder 
                            initialHtml={selectedTemplate.corpo_html}
                            onSave={(html) => {
                                setSelectedTemplate({ ...selectedTemplate, corpo_html: html });
                                setIsVisualEditorOpen(false);
                            }}
                            onCancel={() => setIsVisualEditorOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateManagement;
