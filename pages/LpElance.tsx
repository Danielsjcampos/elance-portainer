import React, { useRef, useState, Suspense, lazy } from 'react';
import LpHero from '../components/lp/LpHero';
import LpVSL from '../components/lp/LpVSL';
import LpSEO from '../components/lp/LpSEO';
import { Logo } from '../components/Logo';
import FloatingLeadButton from '../components/FloatingLeadButton';
import LeadCaptureModal from '../components/LeadCaptureModal';
import QuizModal from '../components/QuizModal';
import { RainbowButton } from '../components/ui/rainbow-button';

const LpDor = lazy(() => import('../components/lp/LpDor'));
const LpSolucao = lazy(() => import('../components/lp/LpSolucao'));
const LpEntregamos = lazy(() => import('../components/lp/LpEntregamos'));
const LpGanhos = lazy(() => import('../components/lp/LpGanhos'));
const LpBio = lazy(() => import('../components/lp/LpBio'));
const LpNaMidia = lazy(() => import('../components/lp/LpNaMidia'));
const LpDepoimentos = lazy(() => import('../components/lp/LpDepoimentos'));
const LpFAQ = lazy(() => import('../components/lp/LpFAQ'));
const LpCTA = lazy(() => import('../components/lp/LpCTA'));
const QuizForm = lazy(() => import('../components/lp/QuizForm'));

const LpElance: React.FC = () => {
    const quizRef = useRef<HTMLDivElement>(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const scrollToQuiz = () => {
        quizRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#0f152a] min-h-screen text-white font-sans selection:bg-[#3a7ad1] selection:text-white">
            <LpSEO />
            {/* Minimal Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f152a]/95 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <Logo className="h-8 md:h-10" />
                    <RainbowButton
                        onClick={scrollToQuiz}
                        variant="dark"
                        className="text-xs sm:text-sm font-bold px-4 py-2 h-auto"
                    >
                        JÁ QUERO ME INSCREVER
                    </RainbowButton>
                </div>
            </header>

            <main>
                <LpHero onStartQuiz={scrollToQuiz} />
                <LpVSL />

                <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">Carregando...</div>}>
                    <LpDor onStartQuiz={scrollToQuiz} />
                    <LpSolucao onStartQuiz={scrollToQuiz} />
                    <LpEntregamos onStartQuiz={scrollToQuiz} />
                    <LpGanhos onStartQuiz={scrollToQuiz} />
                    <LpBio onStartQuiz={scrollToQuiz} />
                    <LpNaMidia />
                    <LpDepoimentos />
                    <LpFAQ />
                    <LpCTA onStartQuiz={scrollToQuiz} />

                    {/* Scroll Target for Quiz */}
                    <div ref={quizRef}>
                        <QuizForm />
                    </div>
                </Suspense>
            </main>

            <footer className="bg-[#0b0f1e] py-8 text-center border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} E-Lance. Todos os direitos reservados.
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                        CNPJ: 00.000.000/0001-00
                    </p>
                </div>
            </footer>

            <LeadCaptureModal />
            <FloatingLeadButton onClick={() => setIsQuizModalOpen(true)} />
            <QuizModal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} />
        </div>
    );
};

export default LpElance;
