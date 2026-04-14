import React from 'react';
import BlurFade from '../ui/BlurFade';
import { AnimatedTestimonials } from '../ui/animated-testimonials';

const testimonials = [
    {
        quote: "Estar associado a uma marca com autoridade e processos bem definidos abriu muitas portas. Com os leilões extrajudiciais fechados pela rede, tenho uma esteira de oportunidades constante sem precisar prospectar do zero todo dia.",
        name: "Franqueado",
        designation: "Campinas, SP",
        src: "/campinas.jpeg",
    },
    {
        quote: "Eu tinha capital guardado, mas tinha pavor de abrir um negócio físico e lidar com dezenas de funcionários e burocracia. A E-Lance entregou-me um modelo altamente rentável. No meu segundo leilão judicial, a minha comissão cobriu praticamente todo o investimento inicial da franquia.",
        name: "Franqueada",
        designation: "São José dos Campos, SP",
        src: "/sj-campos.jpeg",
    },
    {
        quote: "O mercado de leilões parecia um 'bicho de sete cabeças' para quem vinha de fora. Com o suporte da equipe da E-Lance e a tecnologia que eles nos entregam, eu só precisei focar nas relações comerciais. O sistema deles faz todo o trabalho pesado.",
        name: "Franqueados",
        designation: "Bauru, SP",
        src: "/bauru.jpeg",
    },
    {
        quote: "A estrutura oferecida pela franqueadora é impressionante. Ter acesso a um modelo validado e um suporte contínuo me permitiu faturar alto desde os primeiros meses. O escritório agora roda de forma praticamente autônoma com as ferramentas fornecidas.",
        name: "Franqueado",
        designation: "Indaiatuba, SP",
        src: "/indaiatuba.jpeg",
    },
    {
        quote: "Decidi diversificar os meus investimentos e a E-Lance foi a melhor escolha. A plataforma é robusta e o suporte jurídico me dá uma segurança incrível operando em todo o estado. Já recuperei o meu investimento inicial rapidamente.",
        name: "Franqueados",
        designation: "São José do Rio Preto, SP",
        src: "/rio-preto.jpeg",
    }
];

const LpDepoimentos: React.FC = () => {
    return (
        <section className="py-20 bg-[#151d38]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <BlurFade delay={0.1} inView>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Quem já investiu, <span className="text-[#3a7ad1]">recomenda.</span>
                        </h2>
                        <p className="text-xl text-gray-400">Prova social real do nicho de leilões.</p>
                    </div>
                </BlurFade>

                <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
            </div>
        </section>
    );
};

export default LpDepoimentos;
