import React, { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import AnimatedShinyText from '../ui/AnimatedShinyText';
import { RainbowButton } from '../ui/rainbow-button';

interface LpHeroProps {
    onStartQuiz: () => void;
}

const LpHero: React.FC<LpHeroProps> = ({ onStartQuiz }) => {
    // Ref callback: fires synchronously when the DOM node is created,
    // BEFORE Safari evaluates its autoplay policy. This is the only
    // reliable way to set the `muted` HTML attribute in React for iOS.
    const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
        if (node) {
            node.setAttribute('muted', '');
            node.setAttribute('autoplay', '');
            node.setAttribute('playsinline', '');
            node.muted = true;
            node.load();
            const playPromise = node.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Retry after a short delay (covers edge cases)
                    setTimeout(() => {
                        node.muted = true;
                        node.play().catch(() => { });
                    }, 500);
                });
            }
        }
    }, []);

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 overflow-hidden pt-32 pb-16">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f1d3a] to-[#0a0f1e]" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f152a]/60 via-[#0f152a]/40 to-[#0f152a]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                {/* Headline */}
                <div className="space-y-4">
                    <BlurFade delay={0.1} inView>
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#3a7ad1]/10 border border-[#3a7ad1]/30 text-[#3a7ad1] text-xs font-bold tracking-widest uppercase mb-4 transition-all hover:bg-[#3a7ad1]/20">
                            Franquia Estruturada e de Alta Rentabilidade
                        </AnimatedShinyText>
                    </BlurFade>

                    <BlurFade delay={0.25} inView>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                            Fature alto no{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3a7ad1] via-blue-400 to-white">
                                mercado milionário de leilões
                            </span>{' '}
                            com a estrutura E-Lance.
                        </h1>
                    </BlurFade>

                    <BlurFade delay={0.4} inView>
                        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Receba a nossa marca, tecnologia de ponta e formação completa para se tornar um Leiloeiro Oficial. Nós entregamos o motor pronto, você só precisa de acelerar.
                        </p>
                    </BlurFade>
                </div>

                {/* CTA Button */}
                <BlurFade delay={0.7} inView className="pt-8">
                    <RainbowButton onClick={onStartQuiz} className="text-base font-bold w-full sm:w-auto mt-4 px-12 py-6">
                        <span className="relative flex items-center">
                            Quero conhecer o modelo E-Lance
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </RainbowButton>
                    <p className="mt-4 text-sm text-gray-500">
                        Modelo de operação enxuta, sem necessidade de stock ou grande equipa.
                    </p>
                </BlurFade>
            </div>
        </section>
    );
};

export default LpHero;
