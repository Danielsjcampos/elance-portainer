import React, { useState } from 'react';
import { Type, Image as ImageIcon, Box, Send, Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';

interface Block {
    id: string;
    type: 'text' | 'image' | 'button' | 'auction';
    content: any;
}

interface VisualEmailBuilderProps {
    initialHtml?: string;
    onSave: (html: string) => void;
    onCancel: () => void;
}

const VisualEmailBuilder: React.FC<VisualEmailBuilderProps> = ({ initialHtml, onSave, onCancel }) => {
    const [blocks, setBlocks] = useState<Block[]>([
        { id: '1', type: 'text', content: { text: '<h1>Olá {{nome}}!</h1><p>Confira as novidades que preparamos para você.</p>' } }
    ]);

    const addBlock = (type: Block['type']) => {
        const id = Math.random().toString(36).substr(2, 9);
        let content = {};
        if (type === 'text') content = { text: '<p>Novo parágrafo de texto...</p>' };
        if (type === 'image') content = { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600', caption: '' };
        if (type === 'button') content = { label: 'Clique Aqui', url: '#', color: '#3a7ad1' };
        if (type === 'auction') content = { title: 'Leilão em Destaque', price: 'R$ 100.000,00', link: '#' };
        
        setBlocks([...blocks, { id, type, content }]);
    };

    const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));

    const moveBlock = (idx: number, dir: 'up' | 'down') => {
        const newBlocks = [...blocks];
        const newIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= blocks.length) return;
        [newBlocks[idx], newBlocks[newIdx]] = [newBlocks[newIdx], newBlocks[idx]];
        setBlocks(newBlocks);
    };

    const updateBlock = (id: string, newContent: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b));
    };

    const generateHtml = () => {
        let html = `
        <div style="background: #eff0f1; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <!-- Header Perfeito -->
                <div style="background: #151d38; padding: 40px 20px; text-align: center;">
                    <img src="https://www.elance.com.br/logo.png" alt="E-Lance Leilões" style="height: 60px; margin-bottom: 20px;" />
                    <div style="height: 2px; width: 40px; background: #3a7ad1; margin: 0 auto;"></div>
                </div>
                
                <div style="padding: 40px 30px;">
        `;

        blocks.forEach(block => {
            if (block.type === 'text') {
                html += `<div style="margin-bottom: 25px; color: #475569; line-height: 1.8; font-size: 16px;">${block.content.text}</div>`;
            } else if (block.type === 'image') {
                html += `
                <div style="margin-bottom: 30px; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <img src="${block.content.url}" style="width: 100%; display: block;" />
                    ${block.content.caption ? `<p style="text-align:center; font-size: 12px; color: #64748b; margin: 10px 0;">${block.content.caption}</p>` : ''}
                </div>`;
            } else if (block.type === 'button') {
                html += `
                <div style="margin-bottom: 30px; text-align: center;">
                    <a href="${block.content.url}" style="background: ${block.content.color || '#3a7ad1'}; color: #ffffff; padding: 16px 35px; border-radius: 10px; text-decoration: none; font-weight: 800; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(58, 122, 209, 0.2);">
                        ${block.content.label}
                    </a>
                </div>`;
            } else if (block.type === 'auction') {
                html += `
                <div style="margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff; transition: transform 0.2s;">
                    <div style="padding: 20px; border-left: 4px solid #3a7ad1;">
                        <h3 style="margin: 0; color: #151d38; font-size: 18px; font-weight: 800;">${block.content.title}</h3>
                        <p style="color: #3a7ad1; font-weight: 900; font-size: 22px; margin: 12px 0;">${block.content.price}</p>
                        <a href="${block.content.link}" style="display: block; text-align: center; background: #f1f5f9; color: #151d38; padding: 10px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 800; text-transform: uppercase;">Ver no Site &rarr;</a>
                    </div>
                </div>`;
            }
        });

        html += `
                </div>
                <!-- Rodapé Perfeito -->
                <div style="background: #f8fafc; padding: 40px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
                    <div style="margin-bottom: 25px;">
                        <a href="https://wa.me/5511941660975" style="display: inline-block; margin: 0 12px; color: #151d38; text-decoration: none; font-size: 13px; font-weight: 800; letter-spacing: 0.5px;">WHATSAPP</a>
                        <a href="https://e-lance.com.br" style="display: inline-block; margin: 0 12px; color: #151d38; text-decoration: none; font-size: 13px; font-weight: 800; letter-spacing: 0.5px;">WEBSITE</a>
                        <a href="https://instagram.com/elanceleiloes" style="display: inline-block; margin: 0 12px; color: #151d38; text-decoration: none; font-size: 13px; font-weight: 800; letter-spacing: 0.5px;">INSTAGRAM</a>
                    </div>
                    <p style="font-size: 12px; color: #64748b; line-height: 1.8; margin-bottom: 20px;">
                        <strong>E-Lance Leilões Brasil</strong><br/>
                        Av. Duque de Caxias 18-29, Bauru-SP, 17011-066<br/>
                        Você está recebendo este e-mail conforme nossas políticas de privacidade.
                    </p>
                    <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 25px;">
                        <p style="font-size: 11px; color: #94a3b8; font-weight: 500;">
                            © 2026 E-Lance. Todos os direitos reservados.<br/>
                            <a href="{{unsubscribe_link}}" style="color: #3a7ad1; text-decoration: underline;">Remover meu e-mail desta lista</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>`;

        return html;
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden rounded-2xl border shadow-2xl">
            <div className="p-4 bg-white border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Editor Visual de E-mail</h3>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">Cancelar</button>
                    <button onClick={() => onSave(generateHtml())} className="px-6 py-2 bg-[#3a7ad1] text-white rounded-lg font-bold shadow-sm">Concluir e Salvar</button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r p-4 space-y-4 overflow-y-auto">
                    <p className="text-xs font-bold text-gray-400 uppercase">Adicionar Blocos</p>
                    <button onClick={() => addBlock('text')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed hover:border-[#3a7ad1] hover:text-[#3a7ad1] transition-all group">
                        <Type size={18} className="text-gray-400 group-hover:text-[#3a7ad1]" />
                        <span className="text-sm font-medium">Bloco de Texto</span>
                    </button>
                    <button onClick={() => addBlock('image')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed hover:border-[#3a7ad1] hover:text-[#3a7ad1] transition-all group">
                        <ImageIcon size={18} className="text-gray-400 group-hover:text-[#3a7ad1]" />
                        <span className="text-sm font-medium">Imagem/Banner</span>
                    </button>
                    <button onClick={() => addBlock('button')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed hover:border-[#3a7ad1] hover:text-[#3a7ad1] transition-all group">
                        <Box size={18} className="text-gray-400 group-hover:text-[#3a7ad1]" />
                        <span className="text-sm font-medium">Botão de Link</span>
                    </button>
                    <button onClick={() => addBlock('auction')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed hover:border-[#3a7ad1] hover:text-[#3a7ad1] transition-all group">
                        <Send size={18} className="text-gray-400 group-hover:text-[#3a7ad1]" />
                        <span className="text-sm font-medium">Card de Leilão</span>
                    </button>

                    <div className="pt-8 opacity-50 text-[10px] text-gray-400 italic">
                        Dica: Arraste para cima ou baixo usando as setas nos cards da direita para reordenar.
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-[600px] mx-auto space-y-4 pb-20">
                        {blocks.map((block, idx) => (
                            <div key={block.id} className="bg-white border rounded-xl shadow-sm overflow-hidden group relative">
                                <div className="p-2 bg-gray-50 border-b flex justify-between items-center grayscale group-hover:grayscale-0 transition-all">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase px-2">{block.type}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => moveBlock(idx, 'up')} className="p-1 hover:bg-gray-200 rounded"><ChevronUp size={14}/></button>
                                        <button onClick={() => moveBlock(idx, 'down')} className="p-1 hover:bg-gray-200 rounded"><ChevronDown size={14}/></button>
                                        <button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {block.type === 'text' && (
                                        <textarea 
                                            className="w-full p-2 border rounded outline-none h-24 text-sm"
                                            value={block.content.text}
                                            onChange={e => updateBlock(block.id, { text: e.target.value })}
                                        />
                                    )}
                                    {block.type === 'image' && (
                                        <div className="space-y-2">
                                            <input 
                                                className="w-full p-2 border rounded text-xs" 
                                                value={block.content.url}
                                                onChange={e => updateBlock(block.id, { url: e.target.value })}
                                                placeholder="URL da Imagem"
                                            />
                                            <img src={block.content.url} className="max-h-32 rounded mx-auto" alt="preview"/>
                                        </div>
                                    )}
                                    {block.type === 'button' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <input 
                                                className="w-full p-2 border rounded text-xs" 
                                                value={block.content.label}
                                                onChange={e => updateBlock(block.id, { label: e.target.value })}
                                                placeholder="Texto do Botão"
                                            />
                                            <input 
                                                className="w-full p-2 border rounded text-xs" 
                                                value={block.content.url}
                                                onChange={e => updateBlock(block.id, { url: e.target.value })}
                                                placeholder="Link (http://...)"
                                            />
                                        </div>
                                    )}
                                    {block.type === 'auction' && (
                                        <div className="space-y-2">
                                            <input 
                                                className="w-full p-2 border rounded text-xs font-bold" 
                                                value={block.content.title}
                                                onChange={e => updateBlock(block.id, { title: e.target.value })}
                                                placeholder="Título do Leilão"
                                            />
                                            <input 
                                                className="w-full p-2 border rounded text-xs" 
                                                value={block.content.price}
                                                onChange={e => updateBlock(block.id, { price: e.target.value })}
                                                placeholder="Preço/Valor"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        <div className="flex justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl">
                             <p className="text-gray-400 text-sm flex items-center gap-2">
                                <Plus size={16}/> Clique nos ícones da esquerda para adicionar conteúdo
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualEmailBuilder;
