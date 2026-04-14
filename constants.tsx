import { Globe, TrendingUp, Users, Book, TableProperties, CheckCircle, XCircle, HelpCircle, School } from 'lucide-react';
import { NavItem, ServiceItem, Testimonial, ComparisonItem, FaqItem, MaterialItem } from './types';
import React from 'react';

export const COLORS = {
  primary: '#151d38', // Dark Navy
  secondary: '#3a7ad1', // Bright Blue
  background: '#eff0f1', // Light Gray
  white: '#ffffff',
};

export const CONTACT_INFO = {
  address: "Av. Duque de Caxias 18-29, Bauru-SP, 17011-066, BR",
  phone: "(11) 94166-0975",
  email: "contato@e-lance.com.br",
  whatsappLink: "https://wa.me/5514998536254?text=Estou%20cansado%20de%20ser%20corretor%20da%20Caixa.%20Agora%20quero%20ser%20um%20leiloeiro.%20Pode%20me%20ajudar%3F"
};

export const SERVICES: ServiceItem[] = [
  {
    title: "Escola E-Lance",
    description: "Capacitação prática para compradores, advogados, corretores de imóveis e leiloeiros.",
    icon: <School size={32} />,
    link: "escola"
  },
  {
    title: "Portal de Leilões",
    description: "Plataforma segura contendo ofertas de imóveis em leilão de toda a nossa rede.",
    icon: <Globe size={32} />,
    link: "portal"
  },
  {
    title: "Consultoria e Mentoria",
    description: "Orientação personalizada para compradores e investidores dominarem o mercado.",
    icon: <TrendingUp size={32} />,
    link: "consultoria"
  }
];

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#", id: "home" },
  {
    label: "Ecossistema",
    href: "#about",
    subItems: [
      { label: "O Ecossistema", href: "#", id: "ecossistema" },
      { label: "Bid Invest", href: "#", id: "bid-invest" },
      { label: "Escola E-Lance", href: "#", id: "escola" },
      { label: "Sobre Nós", href: "#about" }
    ]
  },
  {
    label: "Soluções",
    href: "#services",
    subItems: [
      { label: "Portal", href: "#portal" },
      { label: "Consultoria", href: "#", id: "consultoria" },
      { label: "Mentoria Trilha do Arrematante", href: "#", id: "mentoria" },
      { label: "Indique a E-Lance", href: "/indique" },
      { label: "Leilão Detran (+1000 Veículos)", href: "/detran" },
      { label: "Artigos", href: "#articles" }
    ]
  },
  { label: "Contato", href: "#", id: "contact" },
];

// MENTOR BIO
export const MENTOR_BIO = {
  name: "Jerônimo Pompeu",
  role: "Mentor e Especialista em Leilões",
  description: "Com mais de 21 anos de atuação no segmento de leilões, seja como gerente de leilões da Caixa Econômica Federal, como arrematante ou como leiloeiro, Jerônimo Pompeu é uma das maiores autoridades em leilões no Brasil.",
  credentials: [
    "Graduado em Publicidade e Propaganda pela USP",
    "Pós-graduado em Direito Imobiliário pelo Instituto Damásio",
    "MBA em Gestão de Empresas pela FGV",
    "Gerente do setor de leilões da Caixa por 5 anos",
    "Sócio-proprietário da Casa e Cia Negócios Imobiliários há 15 anos",
    "Corretor, Avaliador de Imóveis e Perito Judicial"
  ],
  image: "https://storage.googleapis.com/production-hostgator-brasil-v1-0-3/873/1757873/wOfpXRsp/2322b175ccc74a82a1b310f3df6727eb"
};