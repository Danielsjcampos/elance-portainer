import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import BlurFade from '../../ui/BlurFade';

const LpFAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "Preciso suspender a minha OAB para ser Leiloeiro Oficial?",
            answer: "Depende da legislação da Junta Comercial do seu estado. Alguns estados exigem a suspensão da OAB durante o exercício ativo da leiloaria. Contudo, você pode focar apenas em captações, montar equipe jurídica ou atuar como preposto e Assessor de Investidores mantendo a sua carteira intocável."
        },
        {
            question: "Em quanto tempo a minha franquia estará pronta para operar?",
            answer: "O processo de treino, configuração do portal tecnológico e a papelada na Junta Comercial demoram algumas semanas. Trabalhamos com rapidez para que possa iniciar as captações o mais breve possível."
        },
        {
            question: "Vou atuar apenas na minha cidade?",
            answer: "Não. Como Leiloeiro Oficial com um portal digital, poderá realizar leilões judiciais e extrajudiciais a nível estadual e nacional, dependendo dos credenciamentos."
        }
    ];

    return (
        <section className="py-20 bg-[#0f152a]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <BlurFade delay={0.1} inView>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Dúvidas <span className="text-[#3a7ad1]">Frequentes</span>
                        </h2>
                        <p className="text-gray-400">Tudo o que você precisa saber antes de dar o próximo passo.</p>
                    </div>
                </BlurFade>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <BlurFade key={index} delay={0.2 + (index * 0.1)} inView>
                            <div
                                className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-white/5 border-[#3a7ad1]/50' : 'bg-transparent hover:bg-white/5'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className={`font-semibold text-lg ${openIndex === index ? 'text-[#3a7ad1]' : 'text-white'}`}>
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? <Minus className="text-[#3a7ad1]" /> : <Plus className="text-gray-400" />}
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-6 pt-0 text-gray-300 leading-relaxed border-t border-white/5 mt-2">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LpFAQ;

