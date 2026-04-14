import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import { TraditionalCard, ModernCard } from '../ui/comparison-cards';
import { RainbowButton } from '../ui/rainbow-button';

interface LpSolucaoProps {
    onStartQuiz?: () => void;
}

const LpSolucao: React.FC<LpSolucaoProps> = ({ onStartQuiz }) => {
    return (
        <section className="py-20 bg-[#0f152a] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1e] via-[#0f152a] to-[#0f152a]"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <BlurFade delay={0.1} inView>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white">
                            O caminho tradicional <span className="text-gray-500">vs.</span> <span className="text-[#3a7ad1]">A Franquia E-Lance</span>
                        </h2>
                    </div>
                </BlurFade>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Tradicional */}
                    <BlurFade delay={0.3} inView>
                        <TraditionalCard title="Negócio Tradicional">
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg">Altos custos fixos mensais (Renda, Energia, Stocks).</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg">Margem de lucro espremida (10% a 15%).</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg">Limitado geograficamente ao seu bairro ou cidade.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg">Dependência de dezenas de clientes por dia para faturar.</span>
                                </li>
                            </ul>
                        </TraditionalCard>
                    </BlurFade>

                    {/* E-Lance */}
                    <BlurFade delay={0.5} inView>
                        <ModernCard title="Franquia E-Lance" badgeText="A Escolha Inteligente">
                            <ul className="space-y-6 relative z-10">
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium">Custo fixo quase zero (Operação 100% Home-Office ou Digital).</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium">Comissão de 5% sobre bens de alto valor (Imóveis, Veículos, Máquinas).</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium">Alcance nacional através do seu próprio Portal de Lances Online.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium">Apenas um ou dois negócios fechados no mês já garantem uma faturação estrondosa.</span>
                                </li>
                            </ul>
                        </ModernCard>
                    </BlurFade>
                </div>

                <BlurFade delay={0.7} inView>
                    <div className="text-center mt-12">
                        <RainbowButton onClick={onStartQuiz} className="text-base font-bold w-full sm:w-auto px-12 py-6">
                            <span className="relative flex items-center">
                                Quero a Segurança do Modelo E-Lance
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </RainbowButton>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
};

export default LpSolucao;
