import React from 'react';
import BlurFade from '../ui/BlurFade';

const LpNaMidia: React.FC = () => {
    return (
        <section className="py-20 bg-[#0f152a] relative overflow-hidden">

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <BlurFade delay={0.1} inView>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-[#3a7ad1] animate-pulse"></span>
                            Na Mídia
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            A E-Lance é destaque na <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3a7ad1] to-[#25528c]">imprensa.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                            Nosso modelo de negócios e transparência nos leilões geram repercussão em veículos de credibilidade.
                        </p>
                    </div>
                </BlurFade>

                <BlurFade delay={0.2} inView>
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-white/5 p-2 md:p-4 backdrop-blur-sm">
                        <img
                            src="/noticia-jornal.jpeg"
                            alt="Matéria Jornalística sobre a E-Lance"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto object-contain rounded-xl transform group-hover:scale-[1.02] transition-transform duration-700"
                        />
                    </div>
                </BlurFade>
            </div>
        </section>
    );
};

export default LpNaMidia;
