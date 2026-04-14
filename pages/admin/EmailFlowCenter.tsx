import React, { useState } from 'react';
import { Mail, Users, Brain, Layout, Repeat, BarChart3, Plus, Send } from 'lucide-react';
import EmailDashboard from './EmailDashboard';
import ContactManagement from './ContactManagement';
import SegmentManagement from './SegmentManagement';
import TemplateManagement from './TemplateManagement';
import FlowManagement from './FlowManagement';
import QueueManagement from './QueueManagement';
import EmailAutomations from './EmailAutomations';

type Tab = 'dashboard' | 'contacts' | 'segments' | 'templates' | 'flows' | 'automations' | 'queue';

const EmailFlowCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Relatórios', icon: BarChart3 },
        { id: 'contacts', label: 'Contatos', icon: Users },
        { id: 'segments', label: 'Segmentos', icon: Brain },
        { id: 'templates', label: 'Templates', icon: Layout },
        { id: 'flows', label: 'Fluxos (Auto)', icon: Repeat },
        { id: 'automations', label: 'Informativos AI', icon: Brain },
        { id: 'queue', label: 'Disparos/Fila', icon: Send },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <EmailDashboard />;
            case 'contacts': return <ContactManagement />;
            case 'segments': return <SegmentManagement />;
            case 'templates': return <TemplateManagement />;
            case 'flows': return <FlowManagement />;
            case 'automations': return <EmailAutomations />;
            case 'queue': return <QueueManagement />;
            default: return <EmailDashboard />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2 tracking-tight">
                        <Mail className="text-primary" /> Central de Fluxos
                    </h2>
                    <p className="text-slate-500 font-medium">Automação inteligente e gestão de disparos.</p>
                </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto border border-slate-200/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[600px] overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default EmailFlowCenter;
