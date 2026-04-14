import React from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import BlurFade from '../../ui/BlurFade';
import { RainbowButton } from '../../ui/rainbow-button';

interface LpGanhosProps {
    onStartQuiz?: () => void;
}

const LpGanhos: React.FC<LpGanhosProps> = ({ onStartQuiz }) => {
    return (
        <section className="py-20 bg-[#0f152a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#3a7ad1]/5 to-transparent skew-x-12 transform -translate-x-20"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <BlurFade delay={0.1} inView>
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#3a7ad1]/10 border border-[#3a7ad1]/30 text-[#3a7ad1] text-xs font-bold tracking-widest uppercase mb-4">
                            Projeção de Ganhos
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            A Matemática dos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3a7ad1] to-blue-400">5%</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            No mercado de leilões, a comissão é intocável. O Leiloeiro Oficial recebe 5% fixados pelo juiz. Se você vender uma fazenda de 10 milhões, vai receber 500 mil reais. Sem "choradeira", sem proprietário pedindo desconto na sua comissão. Veja o potencial:
                        </p>
                    </div>
                </BlurFade>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <BlurFade delay={0.3} inView>
                        {/* Exemplo 1 */}
                        <div className="bg-[#151d38] border border-white/10 rounded-2xl p-8 relative group hover:border-[#3a7ad1]/40 transition-colors h-full">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 bg-[#3a7ad1] rounded-full flex items-center justify-center shadow-lg text-white font-bold group-hover:scale-110 transition-transform">
                                1
                            </div>
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Arrematação de 1 imóvel médio</h3>
                            <p className="text-3xl font-bold text-white mb-6">R$ 500.000,00</p>

                            <div className="bg-[#0f152a] rounded-xl p-6 border border-[#3a7ad1]/20">
                                <p className="text-sm text-gray-400 mb-1">A sua comissão (5%)</p>
                                <p className="text-4xl font-extrabold text-[#3a7ad1]">R$ 25.000,00</p>
                            </div>
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.5} inView>
                        {/* Exemplo 2 */}
                        <div className="bg-[#151d38] border border-white/10 rounded-2xl p-8 relative group hover:border-[#3a7ad1]/40 transition-colors h-full">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 bg-[#3a7ad1] rounded-full flex items-center justify-center shadow-lg text-white font-bold group-hover:scale-110 transition-transform">
                                2
                            </div>
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Arrematação de 1 galpão/imóvel de luxo</h3>
                            <p className="text-3xl font-bold text-white mb-6">R$ 2.000.000,00</p>

                            <div className="bg-[#0f152a] rounded-xl p-6 border border-[#3a7ad1]/20">
                                <p className="text-sm text-gray-400 mb-1">A sua comissão (5%)</p>
                                <p className="text-4xl font-extrabold text-[#3a7ad1]">R$ 100.000,00</p>
                            </div>
                        </div>
                    </BlurFade>
                </div>

                {/* Consultoria Image Module */}
                <BlurFade delay={0.6} inView>
                    <div className="w-full h-96 md:h-[600px] rounded-3xl overflow-hidden mb-12 relative shadow-2xl border border-white/10">
                        <img
                            src="/hero-consultoria.jpg"
                            alt="Reunião de Consultoria"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f152a] via-transparent to-transparent opacity-80" />
                    </div>
                </BlurFade>

                <BlurFade delay={0.7} inView>
                    <div className="bg-gradient-to-r from-[#3a7ad1]/20 to-transparent p-1 rounded-2xl mt-8">
                        <div className="bg-[#0b0f1e] rounded-xl p-8 text-center flex flex-col md:flex-row items-center justify-center gap-4">
                            <Calculator className="w-8 h-8 text-[#3a7ad1]" />
                            <p className="text-xl md:text-2xl font-semibold text-white">
                                "Quantos finais de semana você precisa trabalhar vendendo imóveis comuns para colocar <span className="text-[#3a7ad1]">100 mil líquidos</span> no bolso?"
                            </p>
                        </div>
                    </div>
                </BlurFade>

                <BlurFade delay={0.8} inView>
                    <div className="mt-12 text-center">
                        <RainbowButton onClick={onStartQuiz} className="text-base font-bold w-full sm:w-auto px-12 py-6">
                            <span className="relative flex items-center">
                                Quero Mudar o Meu Jogo Financeiro
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </RainbowButton>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
};

export default LpGanhos;

