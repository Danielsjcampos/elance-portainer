import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import BlurFade from '../../ui/BlurFade';
import { TraditionalCard, ModernCard } from '../../ui/comparison-cards';
import { RainbowButton } from '../../ui/rainbow-button';

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
                            Corretor de Imóveis <span className="text-gray-500">vs.</span> <span className="text-[#3a7ad1]">Leiloeiro E-Lance</span>
                        </h2>
                    </div>
                </BlurFade>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Tradicional */}
                    <BlurFade delay={0.3} inView>
                        <TraditionalCard title="Corretor Imobiliário">
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg"><strong>Sem exclusividade:</strong> O proprietário deixa a casa para vender em vários lugares. Você investe em anúncios, visitas, e perde a venda.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg"><strong>Pós-venda infinito:</strong> Fica até um ano acompanhando o comprador. Vai no cartório, resolve ITBI, financiamento e burocracia interminável.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg"><strong>Comissão "na canela":</strong> Vende um imóvel caro e na empolgação de receber, abaixa sua comissão porque o vendedor exige renegociação.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg"><strong>Imóvel fora do preço:</strong> O vendedor quer sempre mais do que vale e você tem que tentar empurrar imóveis acima da avaliação do mercado.</span>
                                </li>
                            </ul>
                        </TraditionalCard>
                    </BlurFade>

                    {/* E-Lance */}
                    <BlurFade delay={0.5} inView>
                        <ModernCard title="Leiloeiro E-Lance" badgeText="A Escolha Inteligente">
                            <ul className="space-y-6 relative z-10">
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium"><strong>Exclusividade absoluta:</strong> Nomeação judicial com 6 meses de exclusividade. Ninguém mais pode oferecer ou vender aquele imóvel.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium"><strong>Bateu o martelo, acabou:</strong> Subiu o Auto de Arrematação no processo, seu trabalho feito! O arrematante que contrate um advogado para o restante.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium"><strong>Comissão intocável:</strong> 5% fixos, estabelecidos em lei. Se vendeu uma fazenda de R$ 10 milhões, ganha R$ 500 mil. Sem choro, sem desconto.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium"><strong>Facilidade de venda:</strong> O juiz autoriza vender o imóvel com até 50% de desconto da avaliação. É muito mais fácil atrair dinheiro!</span>
                                </li>
                            </ul>
                        </ModernCard>
                    </BlurFade>
                </div>

                <BlurFade delay={0.7} inView>
                    <div className="text-center mt-12">
                        <RainbowButton onClick={onStartQuiz} className="text-base font-bold w-full sm:w-auto px-12 py-6">
                            <span className="relative flex items-center">
                                Quero Parar de Perder Clientes
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

