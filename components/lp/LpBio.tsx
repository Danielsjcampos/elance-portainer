import React from 'react';
import { ArrowRight, Star, ShieldCheck, Award, TrendingUp } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import { RainbowButton } from '../ui/rainbow-button';

interface LpBioProps {
    onStartQuiz?: () => void;
}

const LpBio: React.FC<LpBioProps> = ({ onStartQuiz }) => {
    return (
        <section className="py-24 relative overflow-hidden bg-[#050505] flex items-center min-h-[800px]">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-[center_top] opacity-60 md:opacity-100"
                style={{ backgroundImage: "url('/mentor-bg.jpg')" }}
            />
            {/* Dark overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/60 md:via-transparent to-[#050505]/95 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="flex justify-end items-center">

                    {/* Text Card - Right Side */}
                    <BlurFade delay={0.4} inView className="w-full lg:w-7/12">
                        <div className="bg-[#0b0f1e]/90 rounded-[2rem] p-8 md:p-12 border border-white/10 relative overflow-hidden shadow-2xl">
                            {/* Accent Right Border */}
                            <div className="absolute top-0 right-0 bottom-0 w-2 bg-gradient-to-b from-[#3a7ad1] via-blue-400 to-[#3a7ad1]"></div>

                            {/* Mobile Image - Only visible on small screens */}
                            <div className="block lg:hidden mb-8 -mx-4 sm:mx-0">
                                <div className="relative w-full aspect-square sm:aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1e] via-[#0b0f1e]/40 to-transparent z-10" />
                                    <img
                                        src="/mentor-jeronimo.jpg"
                                        alt="Jerônimo Pompeu"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-gray-400 text-sm font-bold tracking-[0.25em] uppercase mb-3">
                                        O Mentor
                                    </p>
                                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-none tracking-tight">
                                        JERÔNIMO <br />
                                        <span className="text-[#3a7ad1]">POMPEU</span>
                                    </h2>
                                </div>

                                <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                                    <p>
                                        Reconhecido como uma das maiores autoridades brasileiras na estruturação e gestão de <strong>leilões de alto padrão</strong>.
                                    </p>
                                    <p>
                                        Mas a sua maior conquista não foi apenas o conhecimento técnico, foi a criação do <strong>Método E-Lance</strong>, onde aplica um sistema de comissionamento transparente e altamente lucrativo.
                                    </p>
                                    <p>
                                        Hoje, como mentor e especialista, Jerônimo usa o ecossistema E-Lance para forjar novos Leiloeiros Oficiais que buscam a excelência e a independência financeira absoluta.
                                    </p>
                                </div>

                                <ul className="space-y-4 pt-6 border-t border-white/10">
                                    <li className="flex items-center gap-4">
                                        <TrendingUp className="w-6 h-6 text-[#3a7ad1] flex-shrink-0" />
                                        <span className="text-gray-200 font-medium">Mais de 21 anos de experiência prática incontestável</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <ShieldCheck className="w-6 h-6 text-[#3a7ad1] flex-shrink-0" />
                                        <span className="text-gray-200 font-medium">Ex-Gerente do setor de leilões da Caixa (5 anos)</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Award className="w-6 h-6 text-[#3a7ad1] flex-shrink-0" />
                                        <span className="text-gray-200 font-medium">Especialista com MBA em Gestão de Empresas pela FGV</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Star className="w-6 h-6 text-[#3a7ad1] flex-shrink-0" />
                                        <span className="text-gray-200 font-medium">Testado em centenas de leilões milionários no Brasil</span>
                                    </li>
                                </ul>

                                <div className="pt-8">
                                    <RainbowButton variant="light" onClick={onStartQuiz} className="text-base font-bold w-full sm:w-auto px-10 py-5">
                                        <span className="relative flex items-center">
                                            Conheça a história
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </RainbowButton>
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>
        </section>
    );
};

export default LpBio;
