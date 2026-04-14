import React, { useState } from 'react';
import { Play } from 'lucide-react';
import BlurFade from '../../ui/BlurFade';

const LpVSL: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="relative py-12 bg-[#0f152a] overflow-hidden z-20">

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                <BlurFade delay={0.2} inView>
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 group">
                        {isPlaying ? (
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/TuYQtX06ZMs?autoplay=1&rel=0"
                                title="Vídeo Institucional"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="absolute inset-0 w-full h-full block cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-lg shadow-[#3a7ad1]/20">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                                <img
                                    src="https://img.youtube.com/vi/TuYQtX06ZMs/maxresdefault.jpg"
                                    alt="Vídeo Institucional"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Overlay Text inside Image */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent z-20 text-left">
                                    <p className="text-white font-bold text-xl mb-1">O Fim da Dependência da Caixa</p>
                                    <p className="text-gray-300 text-sm md:text-base">Entenda o modelo de negócio para Corretores de Alta Renda</p>
                                </div>
                            </button>
                        )}
                    </div>
                </BlurFade>
            </div>
        </section>
    );
};

export default LpVSL;

