import React from 'react';
import { ArrowRight } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import { RainbowButton } from '../ui/rainbow-button';

interface LpEntregamosProps {
    onStartQuiz?: () => void;
}

const LpEntregamos: React.FC<LpEntregamosProps> = ({ onStartQuiz }) => {
    return (
        <section className="py-20 bg-[#0b0f1e] relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <BlurFade delay={0.1} inView>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Nós construímos a ponte, <span className="text-[#3a7ad1]">você atravessa.</span>
                        </h2>
                        <p className="text-xl text-gray-400">
                            Tudo o que precisa para começar a operar desde o primeiro dia.
                        </p>
                    </div>
                </BlurFade>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <BlurFade delay={0.2} inView>
                        {/* Pilar 1 */}
                        <div className="group relative rounded-2xl overflow-hidden h-full flex flex-col justify-end p-8 border border-white/10 aspect-[3/4] md:aspect-auto md:min-h-[420px]">
                            <img src="/card 1.png" alt="Tecnologia Pronta" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f152a] via-[#0f152a]/80 to-transparent z-10" />
                            <div className="relative z-20">
                                <h3 className="text-2xl font-bold text-white mb-4">Tecnologia Pronta</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Um portal de leilões robusto, exclusivo da sua franquia, preparado para receber milhares de acessos e lances simultâneos com total segurança.
                                </p>
                            </div>
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.4} inView>
                        {/* Pilar 2 */}
                        <div className="group relative rounded-2xl overflow-hidden h-full flex flex-col justify-end p-8 border border-white/10 aspect-[3/4] md:aspect-auto md:min-h-[420px]">
                            <img src="/card 2.png" alt="Capacitação de Elite" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f152a] via-[#0f152a]/80 to-transparent z-10" />
                            <div className="relative z-20">
                                <h3 className="text-2xl font-bold text-white mb-4">Capacitação de Elite</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Não sabe nada de leilões? O nosso Centro de Treinamento leva-o do absoluto zero até ao momento do seu registo na Junta Comercial como Leiloeiro Oficial.
                                </p>
                            </div>
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.6} inView>
                        {/* Pilar 3 */}
                        <div className="group relative rounded-2xl overflow-hidden h-full flex flex-col justify-end p-8 border border-white/10 aspect-[3/4] md:aspect-auto md:min-h-[420px]">
                            <img src="/card 3.png" alt="Suporte Operacional" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f152a] via-[#0f152a]/80 to-transparent z-10" />
                            <div className="relative z-20">
                                <h3 className="text-2xl font-bold text-white mb-4">Suporte Operacional</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Modelos de contratos, editais, manuais de gestão e apoio jurídico. Não precisa de reinventar a roda, basta seguir a nossa metodologia validada.
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                </div>

                {/* CTA Button */}
                <BlurFade delay={0.8} inView>
                    <div className="mt-16 text-center">
                        <RainbowButton onClick={onStartQuiz} className="text-base font-bold w-full sm:w-auto px-12 py-6">
                            <span className="relative flex items-center">
                                Quero a Estrutura E-Lance
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </RainbowButton>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
};

export default LpEntregamos;
