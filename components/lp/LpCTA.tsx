import React from 'react';
import { ArrowRight } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import { RainbowButton } from '../ui/rainbow-button';

interface LpCTAProps {
    onStartQuiz: () => void;
}

const LpCTA: React.FC<LpCTAProps> = ({ onStartQuiz }) => {
    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-br from-[#0f2c5e] via-[#1a3a7a] to-[#0f2c5e] py-24 md:py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                <BlurFade delay={0.1} inView>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Está na hora de colocar o seu capital a render num oceano azul.
                    </h2>

                    <p className="text-xl text-blue-100/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Dê o primeiro passo para se tornar um Leiloeiro Oficial e dono de um ecossistema completo de leilões. As vagas para novas franquias são limitadas por região para garantir o sucesso dos nossos parceiros.
                    </p>

                    <RainbowButton variant="light" onClick={onStartQuiz} className="text-lg font-bold w-full sm:w-auto px-12 py-6">
                        <span className="relative flex items-center">
                            Quero conhecer o modelo E-Lance
                            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </RainbowButton>
                </BlurFade>
            </div>
        </section>
    );
};

export default LpCTA;
