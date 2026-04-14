import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FileText, Phone, Mail, CheckCircle, Download, ChevronDown, MapPin, Scale, Gavel, Shield, Users, ArrowRight, Award, ChevronLeft, ChevronRight, Presentation, X, User } from 'lucide-react';
import SEO from '../components/SEO';
import { useModal } from '../contexts/ModalContext';

const Indique = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        knowledge: 'Não',
        investment: '',
        interest: 'Arrematar imóveis'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);

    const [openDifferential, setOpenDifferential] = useState<number | null>(null);

    // Presentation Carousel logic
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    const presentationSlides = Array.from({ length: 5 }, (_, i) => `/apresentacao/${i + 2}.png`);

    // Diferenciais Carousel logic
    const [emblaDiffRef, emblaDiffApi] = useEmblaCarousel({ loop: true });
    const [selectedIndexDiff, setSelectedIndexDiff] = useState(0);

    const scrollDiffPrev = useCallback(() => emblaDiffApi && emblaDiffApi.scrollPrev(), [emblaDiffApi]);
    const scrollDiffNext = useCallback(() => emblaDiffApi && emblaDiffApi.scrollNext(), [emblaDiffApi]);

    const onSelectDiff = useCallback(() => {
        if (!emblaDiffApi) return;
        setSelectedIndexDiff(emblaDiffApi.selectedScrollSnap());
    }, [emblaDiffApi]);

    useEffect(() => {
        if (!emblaDiffApi) return;
        onSelectDiff();
        emblaDiffApi.on('select', onSelectDiff);
        emblaDiffApi.on('reInit', onSelectDiff);
    }, [emblaDiffApi, onSelectDiff]);

    const differentials = [
        {
            title: "Ampla divulgação nas plataformas e redes sociais",
            content: "Nossa equipe de marketing desenvolve campanhas direcionadas no Facebook, Instagram, LinkedIn, além de e-mail marketing e disparo via WhatsApp para nossa base de milhares de investidores cadastrados, garantindo máxima visibilidade e lances competitivos para o seu leilão.",
            icon: <Users className="w-5 h-5 text-blue-400" />
        },
        {
            title: "Suporte Jurídico Especializado",
            content: "Contamos com um corpo jurídico próprio para auxiliar em todas as etapas do leilão, desde a análise prévia de editais até a expedição da carta de arrematação, mitigando riscos de nulidades e proporcionando total segurança ao escritório.",
            icon: <Scale className="w-5 h-5 text-blue-400" />
        },
        {
            title: "Estrutura e Governança de Excelência",
            content: "Investimos constantemente em tecnologia de ponta e em processos internos padronizados, pautados na transparência e ética. Isso proporciona um ambiente de leilão online robusto, seguro, à prova de falhas e totalmente auditável.",
            icon: <Shield className="w-5 h-5 text-blue-400" />
        },
        {
            title: "Agilidade na Homologação",
            content: "Trabalhamos de forma proativa junto às secretarias e varas, entregando a prestação de contas completa, organizada e exatamente no formato exigido, o que acelera consideravelmente o processo de homologação pelo juízo.",
            icon: <Gavel className="w-5 h-5 text-blue-400" />
        }
    ];

    const toggleDifferential = (index: number) => {
        setOpenDifferential(openDifferential === index ? null : index);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/evolution/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    source: "Indicação Direta - Site",
                    quiz_data: {
                        knowledge: formData.knowledge,
                        investment: formData.investment,
                        interest: formData.interest
                    }
                })
            });

            if (response.ok) {
                setSubmitSuccess(true);
                setFormData({ name: '', email: '', phone: '', knowledge: 'Não', investment: '', interest: 'Arrematar imóveis' });
                // Hide success message and close modal after 5 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                    setIsModalOpen(false);
                    setModalStep(1);
                }, 5000);
            } else {
                throw new Error("Erro ao enviar indicação");
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Houve um erro ao enviar sua indicação. Por favor, tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (modalStep === 1 && formData.name.trim()) setModalStep(2);
        else if (modalStep === 2 && formData.phone.trim()) setModalStep(3);
    };

    const prevStep = () => {
        if (modalStep > 1) setModalStep(modalStep - 1);
    };

    const openIndiqueModal = () => {
        setIsModalOpen(true);
        setModalStep(1);
    };

    return (
        <div className="min-h-screen bg-[#151d38] font-sans">
            <SEO
                title="Indique a E-Lance | Leilões Judiciais"
                description="Advogado: Indique a E-Lance para realizar seus leilões judiciais. Segurança jurídica, ampla divulgação e suporte completo com a Leiloeira Oficial Amanda Crepaldi."
            />
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#151d38] pb-20 pt-32">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-[#3a7ad1] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left animate-fade-in-up">
                            <span className="inline-flex items-center px-4 py-2 rounded-full border border-[#3a7ad1]/30 bg-[#3a7ad1]/10 backdrop-blur-md shadow-lg shadow-[#3a7ad1]/10 text-[#3a7ad1] font-bold text-xs tracking-widest uppercase mb-6">
                                PARA ADVOGADOS E ESCRITÓRIOS
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                Indique a E-Lance para realizar o seu <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3a7ad1] via-blue-400 to-white">
                                    leilão judicial
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed border-l-2 border-[#3a7ad1] pl-6 bg-gradient-to-r from-white/5 to-transparent py-2 rounded-r-lg">
                                Garantimos segurança jurídica, transparência e agilidade, acompanhando seu processo desde a avaliação até a expedição da carta de arrematação.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={openIndiqueModal}
                                    className="bg-gradient-to-r from-[#3a7ad1] to-[#2a61b0] text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Indicar a E-Lance
                                    <ArrowRight size={20} />
                                </button>
                                <a href="#apresentacao" className="bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-sm font-bold py-4 px-10 rounded-full transition-all flex items-center justify-center gap-2">
                                     Ver Apresentação
                                    <Presentation size={20} />
                                </a>
                            </div>
                        </div>

                        <div className="relative block mt-12 lg:mt-0 perspective-1000 animate-fade-in-up delay-300">
                             {/* Floating Card Image matching Home style */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group transform transition-all duration-500 hover:rotate-y-6 hover:scale-105 bg-white/5 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#151d38] via-transparent to-transparent opacity-60 z-10"></div>
                                <object 
                                    data="/apresentacao/1.png" 
                                    type="image/png" 
                                    className="w-full h-full object-cover object-top relative z-10"
                                >
                                    <img src="/apresentacao/1.png" alt="Apresentação Oficial" className="w-full h-full object-cover object-right transform group-hover:scale-105 transition-transform duration-700" />
                                </object>

                            </div>

                            {/* Floating Glass Stats Card */}
                            <div className="absolute -top-10 -right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl animate-float">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-[#3a7ad1] flex items-center justify-center text-white font-bold text-xl">
                                        20+
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">Anos de</p>
                                        <p className="text-gray-300 text-sm">Experiência</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Presentation Carousel Section */}
            <section id="apresentacao" className="py-24 bg-slate-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2">Conheça nosso trabalho</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-[#151d38]">Apresentação Oficial</h3>
                    </div>

                    <div className="relative group max-w-4xl mx-auto">
                        <div className="overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] bg-white border border-slate-200" ref={emblaRef}>
                            <div className="flex touch-pan-y">
                                {presentationSlides.map((slide, index) => (
                                    <div className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] flex items-center justify-center bg-slate-50" key={index}>
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                            <span className="animate-pulse">Carregando slide...</span>
                                        </div>
                                        {/* Fallback to img if object fails */}
                                        <object 
                                            data={slide} 
                                            type="image/png" 
                                            className="w-full h-full object-contain relative z-10"
                                        >
                                            <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-full object-contain" />
                                        </object>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={scrollPrev}
                            disabled={!prevBtnEnabled}
                            className={`absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-blue-600 transition-all ${!prevBtnEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:bg-blue-50'} z-20`}
                            aria-label="Slide anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={!nextBtnEnabled}
                            className={`absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-blue-600 transition-all ${!nextBtnEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:bg-blue-50'} z-20`}
                            aria-label="Próximo slide"
                        >
                            <ChevronRight size={24} />
                        </button>

                        <div className="mt-6 flex justify-center gap-2">
                             {presentationSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        emblaApi?.selectedScrollSnap() === index ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                                    aria-label={`Ir para slide ${index + 1}`}
                                />
                             ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Section - Amanda */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Photos Side */}
                        <div className="lg:w-1/2 relative">
                            {/* Decorative background shape */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-slate-50 rounded-3xl -rotate-6 transform -z-10 hidden sm:block"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <img 
                                    src="/amanda_images/image_10.jpeg" 
                                    alt="Amanda Crepaldi - Apresentação" 
                                    className="rounded-2xl shadow-lg object-cover object-top w-full h-80 sm:h-64 lg:h-80 transform hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="grid grid-cols-1 gap-4">
                                    <img 
                                        src="/amanda_images/image_8.jpeg" 
                                        alt="Leilões E-Lance" 
                                        className="rounded-2xl shadow-lg object-cover w-full h-44 sm:h-32 lg:h-44 object-top transform hover:scale-[1.02] transition-transform duration-500 hidden sm:block"
                                    />
                                    <div className="bg-[#151d38] rounded-2xl p-6 text-white h-full flex flex-col justify-center shadow-lg transform hover:scale-[1.02] transition-transform duration-500">
                                        <Award className="w-10 h-10 text-blue-400 mb-2" />
                                        <p className="font-bold text-xl">Mais de 20 anos</p>
                                        <p className="text-slate-300 text-sm">de experiência em leilões judiciais</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="lg:w-1/2">
                            <h2 className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2">Leiloeira Oficial</h2>
                            <h3 className="text-4xl lg:text-5xl font-bold text-[#151d38] mb-6">Amanda Crepaldi</h3>
                            
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Profissional com vasta experiência na condução de leilões judiciais e extrajudiciais. Nossa missão é proporcionar a máxima liquidez aos bens penhorados, com total segurança jurídica para as partes envolvidas.
                            </p>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="text-blue-500 w-6 h-6" />
                                    <h4 className="text-xl font-bold text-[#151d38]">Onde Atuamos</h4>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>Tribunal de Justiça do Estado de São Paulo (TJSP)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>Tribunais Regionais do Trabalho (TRTs)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>Justiça Federal (TRFs)</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <blockquote className="border-l-4 border-blue-500 pl-6 py-2 text-slate-500 italic mb-8">
                                "Da avaliação inicial ao auto de arrematação, nossa equipe cuida de todos os detalhes para garantir um leilão de sucesso."
                            </blockquote>

                            <button 
                                onClick={openIndiqueModal}
                                className="w-full lg:w-auto bg-gradient-to-r from-[#3a7ad1] to-[#2a61b0] text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Indicar a E-Lance agora
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Diferenciais Section - New High Impact Carousel */}
            <section className="py-24 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2">Por que nós?</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-[#151d38] mb-4">Nossos Diferenciais</h3>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Conheça em detalhes o que nos torna a melhor escolha para a liquidação dos seus bens.
                        </p>
                    </div>

                    <div className="relative max-w-5xl mx-auto group">
                        <div className="overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white bg-white" ref={emblaDiffRef}>
                            <div className="flex">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <div key={num} className="flex-[0_0_100%] min-w-0 relative aspect-[16/9]">
                                        <object 
                                            data={`/apresentacao_diff/${num}.png`} 
                                            type="image/png" 
                                            className="w-full h-full object-contain bg-slate-100"
                                        >
                                            <img src={`/apresentacao_diff/${num}.png`} alt={`Diferencial ${num}`} className="w-full h-full object-contain" />
                                        </object>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={scrollDiffPrev}
                            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-blue-600 hover:scale-110 hover:bg-blue-50 transition-all z-20"
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={scrollDiffNext}
                            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-blue-600 hover:scale-110 hover:bg-blue-50 transition-all z-20"
                            aria-label="Próximo"
                        >
                            <ChevronRight size={24} />
                        </button>

                        <div className="mt-8 flex justify-center gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaDiffApi?.scrollTo(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        selectedIndexDiff === index ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                                    aria-label={`Ir para diferencial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                         <button 
                            onClick={openIndiqueModal}
                            className="inline-flex bg-[#151d38] hover:bg-[#3a7ad1] text-white font-bold py-5 px-12 rounded-full shadow-xl hover:scale-105 transition-all duration-300 items-center justify-center gap-2"
                        >
                            Falar com um especialista
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Petition Template & Contact Section */}
            <section id="contato" className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-stretch">
                        {/* Premium Petition Section - The "Crown Jewel" */}
                        <div className="lg:w-3/5 relative group">
                            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] transform rotate-1 group-hover:rotate-0 transition-transform duration-500 -z-10 opacity-5"></div>
                            <div className="h-full bg-gradient-to-br from-white to-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-2xl p-10 lg:p-16 relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                                        <FileText size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#151d38]">Modelo de Petição</h2>
                                        <p className="text-blue-600 font-semibold tracking-wide uppercase text-xs mt-1">Recurso Exclusivo para Advogados</p>
                                    </div>
                                </div>

                                <div className="flex-grow space-y-6">
                                    <p className="text-xl text-slate-600 leading-relaxed font-light">
                                        Este é o documento <span className="text-[#151d38] font-bold underline decoration-blue-500 decoration-2 underline-offset-4">essencial</span> para consolidar sua parceria com a E-Lance. 
                                    </p>
                                    
                                    {/* Visual Document Preview - Enhanced with real-looking text lines */}
                                    <div className="relative bg-white border border-slate-200 rounded-xl p-8 shadow-inner overflow-hidden max-h-[500px] mb-8 group/doc">
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                                        <div className="overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                                            <div className="text-left font-serif text-slate-800 space-y-4 text-sm md:text-base leading-relaxed">
                                                <p className="font-bold underline text-center mb-8">
                                                    EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA (Nº) VARA CÍVEL DA COMARCA DE(A) (COMARCA)
                                                </p>
                                                
                                                <div className="space-y-1 mb-8">
                                                    <p><strong>Processo n°</strong> xxxxxxxxxxxxxxx</p>
                                                    <p><strong>Exequente:</strong> xxxxxxxxxxxxxxxxx</p>
                                                    <p><strong>Executado:</strong> xxxxxxxxxxxxxxxxxxx</p>
                                                </div>

                                                <p>
                                                    <strong>(NOME DO EXEQUENTE)</strong>, já devidamente qualificado nos autos da ação em epígrafe, por seu(ua) advogado(a) infra-assinado(a), vem respeitosamente à presença de Vossa Excelência, requerer a <strong>NOMEAÇÃO</strong> de leiloeiro para a realização da alienação judicial do(s) bem(ns) penhorado(s).
                                                </p>

                                                <p>
                                                    Para tanto, indica a Leiloeira Pública Oficial <strong>AMANDA PRISCILA PENA CREPALDI</strong>, inscrita na JUCESP sob nº 1.001, responsável pelo portal eletrônico de leilões <a href="https://www.elance.com.br" className="text-blue-600 underline">www.elance.com.br</a>, devidamente cadastrada no Portal de Auxiliares da Justiça do Tribunal de Justiça do Estado de São Paulo, nos termos do art. 883 do Código de Processo Civil.
                                                </p>

                                                <p>
                                                    A referida profissional possui estrutura técnica e portal eletrônico aptos à realização de leilões judiciais eletrônicos, atendendo às exigências do art. 880 do Código de Processo Civil.
                                                </p>

                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 my-6">
                                                    <p className="font-bold mb-2">Dados para contato:</p>
                                                    <p>E-Lance Leilões</p>
                                                    <p>Av. Duque de Caxias, 18-25, Vila Cardia</p>
                                                    <p>Bauru/SP – CEP 17011-066</p>
                                                    <p>Telefone: (14) 98193-6781</p>
                                                    <p>E-mail: contato@elance.com.br</p>
                                                </div>

                                                <p className="text-right mt-10">
                                                    (Local/UF), (dia) de (mês) de (ano).
                                                </p>
                                                
                                                <div className="mt-12 pt-8 border-t border-dashed border-slate-300 text-center">
                                                    <p className="font-bold">Respeitosamente,</p>
                                                    <div className="h-0.5 w-48 bg-slate-400 mx-auto my-4"></div>
                                                    <p>(Nome do Advogado)</p>
                                                    <p>OAB/SP (Nº)</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <a 
                                                href="https://storage.googleapis.com/production-hostgator-brasil-v1-0-3/873/1757873/wOfpXRsp/68e6fed52e0443eeabebbb5b389cefd6?fileName=Petição - Indicação da E-Lance Leilões.docx"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#151d38] text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 transform group-hover/doc:scale-110 transition-transform duration-300 ring-4 ring-blue-500/10"
                                            >
                                                <Download size={24} />
                                                Visualizar / Baixar Modelo
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                        <p className="text-blue-900 text-sm italic">
                                            "Após realizar a indicação pelo formulário ao lado, nosso jurídico disponibilizará automaticamente o modelo customizado para os autos do seu processo."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Action Side */}
                        <div className="lg:w-2/5 flex flex-col gap-8">
                            {/* Contact Box */}
                            <div className="bg-[#151d38] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden h-1/2">
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
                                <h3 className="text-2xl font-bold mb-6">Suporte Direto</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group cursor-pointer">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 transition-all">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Atendimento</p>
                                            <p className="text-lg font-medium">(14) 98193-6781</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group cursor-pointer">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 transition-all">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">E-mail</p>
                                            <p className="text-lg font-medium">contato@elance.com.br</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main CTA Box */}
                            <div className="bg-gradient-to-br from-[#3a7ad1] to-[#151d38] rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col justify-center items-center text-center h-1/2 relative group cursor-pointer overflow-hidden" onClick={openIndiqueModal}>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
                                <div className="p-5 bg-white/10 backdrop-blur-md rounded-full mb-6 transform group-hover:rotate-12 transition-transform">
                                    <Users size={40} />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Indicar Agora</h3>
                                <p className="text-blue-100/80 mb-8 max-w-xs">Acelere seus resultados com a melhor parceira de leilões do Brasil.</p>
                                <div className="w-full py-4 bg-white text-[#151d38] font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 transform group-hover:translate-y-[-4px] transition-transform">
                                    Começar Indicação
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Multi-step Modal Implementation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[#151d38]/80 backdrop-blur-sm transition-opacity animate-fade-in"
                        onClick={() => !isSubmitting && setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all animate-fade-in-up">
                        {/* Header */}
                        <div className="bg-[#151d38] p-6 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Users size={100} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold">Indicar E-Lance</h3>
                                <p className="text-gray-300 text-sm mt-1">Siga os passos abaixo.</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-white/70 hover:text-white transition-colors z-20"
                                disabled={isSubmitting}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-gray-100 relative">
                            <div 
                                className="h-full bg-[#3a7ad1] transition-all duration-500"
                                style={{ width: submitSuccess ? '100%' : `${(modalStep / 3) * 100}%` }}
                            ></div>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            {submitSuccess ? (
                                <div className="text-center py-10 animate-fade-in">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-[#151d38] mb-3">Indicação Recebida!</h4>
                                    <p className="text-slate-600 mb-8">
                                        Muito obrigado pela confiança. Nossa equipe entrará em contato com você pelo WhatsApp em instantes.
                                    </p>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full py-4 px-6 rounded-xl bg-[#151d38] text-white font-bold hover:bg-[#3a7ad1] transition-all"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {modalStep === 1 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="text-center mb-8">
                                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#3a7ad1]">
                                                    <User size={32} />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-800">Primeiro, qual seu nome?</h4>
                                                <p className="text-gray-500 text-sm">Gostaríamos de saber com quem estamos falando.</p>
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Dr. João Silva"
                                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 focus:border-[#3a7ad1] focus:ring-2 focus:ring-[#3a7ad1]/20 outline-none transition-all placeholder:text-gray-400"
                                                autoFocus
                                            />
                                            <button
                                                onClick={nextStep}
                                                disabled={!formData.name.trim()}
                                                className="w-full py-4 px-6 rounded-2xl bg-[#151d38] text-white font-bold hover:bg-[#3a7ad1] transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                Próximo Passo
                                                <ArrowRight size={20} />
                                            </button>
                                        </div>
                                    )}

                                    {modalStep === 2 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="text-center mb-8">
                                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#3a7ad1]">
                                                    <Phone size={32} />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-800">Qual seu WhatsApp?</h4>
                                                <p className="text-gray-500 text-sm">Para agilizarmos o atendimento.</p>
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="(11) 99999-9999"
                                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 focus:border-[#3a7ad1] focus:ring-2 focus:ring-[#3a7ad1]/20 outline-none transition-all placeholder:text-gray-400"
                                                autoFocus
                                            />
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={prevStep}
                                                    className="w-1/3 py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                                                >
                                                    Voltar
                                                </button>
                                                <button
                                                    onClick={nextStep}
                                                    disabled={!formData.phone.trim()}
                                                    className="w-2/3 py-4 px-6 rounded-2xl bg-[#151d38] text-white font-bold hover:bg-[#3a7ad1] transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    Próximo Passo
                                                    <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {modalStep === 3 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="text-center mb-8">
                                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#3a7ad1]">
                                                    <Mail size={32} />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-800">E seu melhor E-mail?</h4>
                                                <p className="text-gray-500 text-sm">Prometemos não enviar spam.</p>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="contato@adv.br"
                                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 focus:border-[#3a7ad1] focus:ring-2 focus:ring-[#3a7ad1]/20 outline-none transition-all placeholder:text-gray-400"
                                                autoFocus
                                            />
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={prevStep}
                                                    disabled={isSubmitting}
                                                    className="w-1/3 py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                                                >
                                                    Voltar
                                                </button>
                                                <button
                                                    onClick={() => handleSubmit(undefined as any)}
                                                    disabled={isSubmitting || !formData.email.trim()}
                                                    className="w-2/3 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#3a7ad1] to-[#2a61b0] text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {isSubmitting ? 'Enviando...' : 'Concluir Indicação'}
                                                    {!isSubmitting && <ArrowRight size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Indique;
