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
                            Advocacia Tradicional <span className="text-gray-500">vs.</span> <span className="text-[#3a7ad1]">Negócios em Leilão</span>
                        </h2>
                    </div>
                </BlurFade>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Tradicional */}
                    <BlurFade delay={0.3} inView>
                        <TraditionalCard title="Advocacia Tradicional">
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg">Morosidade judiciária: esperar anos para ver a cor dos seus honorários justos num processo.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg">Guerra de preços e captação de clientes cada vez mais difícil, ferindo o código de ética.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg">Falta de previsibilidade de caixa: você não sabe quando sairá aquele alvará salvador.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <span className="text-gray-400 text-lg">Rotina exaustiva de prazos, petições e aborrecimentos sem o devido retorno financeiro.</span>
                                </li>
                            </ul>
                        </TraditionalCard>
                    </BlurFade>

                    {/* E-Lance */}
                    <BlurFade delay={0.5} inView>
                        <ModernCard title="Unidade E-Lance" badgeText="A Nova Era Jurídica">
                            <ul className="space-y-6 relative z-10">
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium">Fature Honorários e Assessorias ágeis ajudando investidores a comprar imóveis com lucro.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium">Torne-se Leiloeiro Oficial: lucre 5% em vendas judiciais ou extrajudiciais trabalhando de onde quiser.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium">Mercado bilionário e com baixa concorrência, focado em alta liquidez e segurança para quem domina as leis.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-200 text-lg font-medium">O seu saber e sua OAB sendo traduzidos em rentabilidade que entra na sua conta de forma muito mais rápida.</span>
                                </li>
                            </ul>
                        </ModernCard>
                    </BlurFade>
                </div>

                <BlurFade delay={0.7} inView>
                    <div className="text-center mt-12">
                        <RainbowButton onClick={onStartQuiz} className="text-base font-bold w-full sm:w-auto px-12 py-6">
                            <span className="relative flex items-center">
                                Quero Multiplicar Meus Honorários
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

