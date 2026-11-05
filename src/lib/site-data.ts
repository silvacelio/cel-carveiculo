/**
 * Dados centrais do site Cel-Car.
 * Editar este arquivo para atualizar informações da oficina.
 */

export const SITE_CONFIG = {
  companyName: "Cel-Car",
  companyFullName: "Cel-Car Funilaria e Pintura",
  cnpj: "35.497.152/0001-26",
  owner: "Célio Evangelista",
  tagline: "Devolvemos o brilho original do seu carro.",
  phone: "(21) 97708-6841",
  phoneRaw: "5521977086841",
  email: "celio_e_v@hotmail.com",
  address: {
    street: "Rua José dos Reis, 2047",
    district: "Inhaúma",
    city: "Rio de Janeiro",
    state: "RJ",
    zip: "20760-245",
  },
  mapsUrl: "https://maps.app.goo.gl/wTD9SHDvcbPXxcqq9",
  mapsEmbed:
    "https://www.google.com/maps?q=-22.879798,-43.2856367&z=17&hl=pt-BR&output=embed",
  mapsCoords: {
    lat: -22.879798,
    lng: -43.2856367,
  },
  mapsPlaceId: "0x997c50aec7f14b:0xc216f407b88f9f7c",
  hours: [
    { day: "Segunda a Sexta", time: "08:00 — 18:00" },
    { day: "Sábado", time: "08:00 — 14:00" },
    { day: "Domingo", time: "Fechado" },
  ],
  social: {
    instagram: "#",
    facebook: "#",
  },
  yearsExperience: 18,
} as const;

export const SERVICES = [
  {
    id: "repintura",
    title: "Repintura Automotiva",
    short: "Pintura completa ou parcial com cor original e acabamento de fábrica.",
    description:
      "Repintamos seu veículo usando tintas de alta qualidade e cabine de pintura profissional. Garantimos fidelidade à cor original ou personalizamos conforme sua preferência.",
    icon: "paintbrush",
    duration: "3 a 7 dias",
    features: [
      "Tinta PU de alta durabilidade",
      "Cabine de pintura pressurizada",
      "Acabamento com polimento final",
    ],
  },
  {
    id: "funilaria",
    title: "Funilaria",
    short: "Recuperação de amassados, alinhamento de painéis e estrutura.",
    description:
      "Trabalhamos com funilaria tradicional e técnica de leitura de painel para alinhar a estrutura do veículo conforme especificações de fábrica.",
    icon: "hammer",
    duration: "2 a 5 dias",
    features: [
      "Alinhamento de longarinas",
      "Recuperação de amassados",
      "Pré-montagem e conferência",
    ],
  },
  {
    id: "polimento",
    title: "Polimento & Cristalização",
    short: "Remove riscos superficiais e devolve o brilho de fábrica.",
    description:
      "Polimento técnico em múltimas etapas para remover riscos, swirls e opacidade. Finalizamos com cristalização para proteção duradoura.",
    icon: "sparkles",
    duration: "1 a 2 dias",
    features: [
      "Polimento em 3 etapas",
      "Cristalização de pintura",
      "Hidrorepelência de até 6 meses",
    ],
  },
  {
    id: "parachoques",
    title: "Recuperação de Parachoques",
    short: "Reparo de parachoques trincados, rachados ou amassados.",
    description:
      "Recuperamos parachoques plásticos com soldagem especializada, mantendo a resistência original e devolvendo o acabamento de fábrica.",
    icon: "shield",
    duration: "1 a 3 dias",
    features: [
      "Solda de plástico ABS",
      "Reforço estrutural",
      "Repintura perfeita",
    ],
  },
  {
    id: "alinhamento",
    title: "Alinhamento de Painéis",
    short: "Ajuste de folgas e encaixes entre portas, capô e para-lamas.",
    description:
      "Alinhamos os painéis do veículo para garantir folgas uniformes e encaixe perfeito, eliminando ruídos e vazamentos.",
    icon: "ruler",
    duration: "1 dia",
    features: [
      "Ajuste milimétrico de folgas",
      "Regulagem de travas",
      "Conferência com gabarito",
    ],
  },
  {
    id: "estetica",
    title: "Estética Automotiva",
    short: "Vitrificação, hidratação de couro e detalhamento completo.",
    description:
      "Serviços de estética profunda para deixar seu carro com aspecto de zero quilômetro: vitrificação da pintura, hidratação de couro e detalhamento interno.",
    icon: "gem",
    duration: "1 a 3 dias",
    features: [
      "Vitrificação cerâmica",
      "Hidratação de couro e plásticos",
      "Detalhamento interno completo",
    ],
  },
] as const;

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Honda Civic — Repintura completa",
    category: "repintura",
    vehicle: "Honda Civic 2019",
    service: "Repintura + Funilaria",
    duration: "6 dias",
    before:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fd153a388e4f.jpg",
    after:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/442a7832b7f6.jpg",
  },
  {
    id: 2,
    title: "Fiat Uno — Recuperação de para-lama",
    category: "funilaria",
    vehicle: "Fiat Uno 2016",
    service: "Funilaria + Pintura",
    duration: "4 dias",
    before:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e838829a3c07.jpg",
    after:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/340d17339da2.jpg",
  },
  {
    id: 3,
    title: "Chevrolet Onix — Polimento técnico",
    category: "polimento",
    vehicle: "Chevrolet Onix 2021",
    service: "Polimento + Cristalização",
    duration: "1 dia",
    before:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/64ddb347427e.png",
    after:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/718e55163b2d.jpg",
  },
  {
    id: 4,
    title: "Volkswagen Golf — Parachoques dianteiro",
    category: "parachoques",
    vehicle: "VW Golf 2020",
    service: "Recuperação de parachoques",
    duration: "2 dias",
    before:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f2210ddc8d4b.jpg",
    after:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/98b13fdcebb5.jpg",
  },
  {
    id: 5,
    title: "Hyundai HB20 — Porta amassada",
    category: "funilaria",
    vehicle: "Hyundai HB20 2018",
    service: "Funilaria + Repintura",
    duration: "3 dias",
    before:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bead24ba5c77.jpg",
    after:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5455aa24be69.png",
  },
  {
    id: 6,
    title: "Toyota Corolla — Repintura de capô",
    category: "repintura",
    vehicle: "Toyota Corolla 2022",
    service: "Repintura + Polimento",
    duration: "4 dias",
    before:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e838829a3c07.jpg",
    after:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/442a7832b7f6.jpg",
  },
] as const;

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ricardo Almeida",
    vehicle: "Honda Civic",
    service: "Repintura completa",
    rating: 5,
    text: "Levei meu Civic com vários arranhões profundos e saiu novinho. O Célio é super atencioso e o prazo foi cumprido certinho. Recomendo demais!",
    date: "Outubro 2026",
  },
  {
    id: 2,
    name: "Mariana Costa",
    vehicle: "Chevrolet Onix",
    service: "Polimento + Cristalização",
    rating: 5,
    text: "Não reconheci meu carro. O polimento tirou todos os riscos e a cristalização deixou a pintura parecendo zero km. Atendimento nota mil.",
    date: "Setembro 2026",
  },
  {
    id: 3,
    name: "Pedro Henrique Souza",
    vehicle: "Volkswagen Golf",
    service: "Recuperação de parachoques",
    rating: 5,
    text: "Bati o parachoques num buraco e achei que ia ter que trocar. A equipe da Cel-Car recuperou e ficou perfeito, bem mais barato que peça nova.",
    date: "Agosto 2026",
  },
  {
    id: 4,
    name: "Juliana Ferreira",
    vehicle: "Hyundai HB20",
    service: "Funilaria + Repintura",
    rating: 5,
    text: "Profissionais de verdade. Me explicaram todo o processo, mandaram fotos do andamento e o resultado superou minhas expectativas.",
    date: "Agosto 2026",
  },
  {
    id: 5,
    name: "Carlos Eduardo Lima",
    vehicle: "Fiat Toro",
    service: "Repintura de porta",
    rating: 5,
    text: "Orçamento justo, serviço impecável e prazo certo. Já é a terceira vez que levo meu carro na Cel-Car. Virei cliente fiel.",
    date: "Julho 2026",
  },
  {
    id: 6,
    name: "Fernanda Oliveira",
    vehicle: "Toyota Corolla",
    service: "Estética automotiva completa",
    rating: 5,
    text: "Vitrificação ficou maravilhosa. A água escorre sozinha e o brilho é surreal. Vale cada centavo investido.",
    date: "Julho 2026",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Quanto tempo dura uma repintura?",
    answer:
      "Uma repintura bem feita, com tinta PU de qualidade e procedimento correto em cabine pressurizada, dura mais de 10 anos sem desbotar. Trabalhamos apenas com tintas premium e oferecemos garantia de 1 ano sobre o serviço.",
  },
  {
    question: "Vocês emitem nota fiscal?",
    answer:
      "Sim. A Cel-Car é uma empresa formal (CNPJ 35.497.152/0001-26) e emite nota fiscal eletrônica para todos os serviços prestados, tanto para pessoa física quanto jurídica.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "Aceitamos PIX, dinheiro, cartões de débito e crédito (até 6x sem juros), além de transferência bancária. Para serviços acima de R$ 3.000, oferecemos parcelamento especial — consulte.",
  },
  {
    question: "O serviço tem garantia?",
    answer:
      "Sim. Toda repintura tem garantia de 1 ano contra bolhas, descascamento ou defeitos de aplicação. Funilaria e alinhamento de painéis têm garantia de 6 meses. Polimento e cristalização têm garantia de 3 meses.",
  },
  {
    question: "Vocês atendem carro importado?",
    answer:
      "Sim. Trabalhamos com veículos nacionais e importados. Para importados, usamos tintas e processos específicos recomendados pelo fabricante. Em alguns casos pode ser necessário um prazo maior para obtenção de componentes.",
  },
  {
    question: "Como funciona o orçamento?",
    answer:
      "O orçamento é gratuito. Você pode usar nossa ferramenta online aqui no site para ter uma estimativa, ou enviar fotos do dano pelo WhatsApp. Para um orçamento definitivo, é necessária uma avaliação visual e técnica na oficina, pois cada avaria exige análise da preparação, tipo de tinta e funilaria.",
  },
  {
    question: "Vocês buscam o carro em casa ou trabalho?",
    answer:
      "Para serviços acima de R$ 2.000, oferecemos serviço de busca e entrega em um raio de 15 km da oficina, sem custo adicional. Para distâncias maiores ou serviços de menor valor, consulte disponibilidade.",
  },
  {
    question: "Vocês trabalham com seguro?",
    answer:
      "Sim. Trabalhamos diretamente com as principais seguradoras e acompanhamos todo o processo de liberação da franquia. Caso tenha sofrido um sinistro, entre em contato que cuidamos de tudo.",
  },
] as const;

export const STATS = [
  { value: "18+", label: "Anos de experiência" },
  { value: "3.500+", label: "Carros restaurados" },
  { value: "98%", label: "Clientes satisfeitos" },
  { value: "1 ano", label: "Garantia de serviço" },
] as const;
