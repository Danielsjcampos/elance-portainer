import React from 'react';
import { ArrowRight } from 'lucide-react';
import BlurFade from '../../ui/BlurFade';
import { RainbowButton } from '../../ui/rainbow-button';

interface LpDorProps {
    onStartQuiz?: () => void;
}

const LpDor: React.FC<LpDorProps> = ({ onStartQuiz }) => {
    return (
        <section className="py-20 bg-[#0b0f1e] relative overflow-hidden">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                <BlurFade delay={0.1} inView>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                        Peticionar sem parar e lutar contra a <span className="text-[#3a7ad1]">morosidade</span>?
                    </h2>
                </BlurFade>

                <BlurFade delay={0.25} inView>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                        A advocacia tradicional prende você num ciclo exaustivo. Você resolve problemas de terceiros enquanto seus honorários ficam meses ou anos travados na morosidade do sistema judiciário. O esforço é desproporcional ao ganho imediato.
                    </p>
                </BlurFade>

                <BlurFade delay={0.4} inView>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform">
                        <p className="text-xl md:text-2xl font-semibold text-white mb-8">
                            Você já domina as leis e a burocracia. Onde e como aplicar esse saber em troca de <span className="text-[#3a7ad1]">alta liquidez e controle escalável</span>?
                        </p>

                        <RainbowButton onClick={onStartQuiz} className="text-base font-bold w-full sm:w-auto px-12 py-6">
                            <span className="relative flex items-center">
                                Descubra a Franquia para Advogados
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </RainbowButton>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
};

export default LpDor;

