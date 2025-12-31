// Centralized constants following Single Responsibility Principle
export const CONTACT_INFO = {
  whatsapp: "5537999142677",
  whatsappFormatted: "(37) 99914-2677",
  instagram: "@guiambespaisagismo",
  instagramUrl: "https://instagram.com/guiambespaisagismo",
  facebook: "@guiambespaisagismo",
  facebookUrl: "https://facebook.com/guiambespaisagismo",
  location: "Divinópolis, MG",
} as const

export const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Gostaria de solicitar um orçamento para serviços de paisagismo.",
)

export const WHATSAPP_URL = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${WHATSAPP_MESSAGE}`

export const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre nós" },
  { href: "#servicos", label: "Serviços" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#contato", label: "Contato" },
] as const

export const SERVICES = [
  {
    id: "paisagismo",
    icon: "leaf",
    title: "Projetos de Paisagismo",
    description:
      "Do conceito à execução. Criamos jardins que conversam com a arquitetura da sua casa ou empresa. Planejamento de espécies, iluminação e hardscape.",
  },
  {
    id: "jardinagem",
    icon: "scissors",
    title: "Jardinagem e Manutenção",
    description:
      "Seu jardim sempre impecável. Podas técnicas, adubação, controle de pragas e revitalização. Cuidamos da saúde das suas plantas para que elas durem.",
  },
  {
    id: "corporativo",
    icon: "building",
    title: "Paisagismo Corporativo",
    description:
      "Valorize sua empresa. Ambientes verdes aumentam a produtividade e causam uma excelente primeira impressão nos seus clientes em Divinópolis.",
  },
] as const

export const DIFFERENTIALS = [
  {
    id: "tecnico",
    title: "Olhar Técnico",
    description:
      "Não apenas plantamos; analisamos o solo, a incidência solar e o clima local para garantir que o jardim prospere.",
  },
  {
    id: "guaimbe",
    title: "A Espécie Guaimbê",
    description:
      "Assim como nossa planta homônima (Philodendron guaimbê), somos resistentes, adaptáveis e de beleza escultural. Trazemos a força da flora brasileira para o seu projeto.",
  },
  {
    id: "atendimento",
    title: "Atendimento Premium",
    description: "Do primeiro contato no WhatsApp até a limpeza final pós-obra. Compromisso total com sua satisfação.",
  },
] as const

export const TESTIMONIALS = [
  {
    id: 1,
    text: "A equipe da Guaimbês mudou completamente a fachada da minha loja. Profissionais, rápidos e com muito bom gosto.",
    author: "Maria Clara",
    role: "Empresária em Divinópolis",
  },
  {
    id: 2,
    text: "Nosso jardim estava abandonado e eles trouxeram vida novamente. Recomendo de olhos fechados!",
    author: "Roberto Silva",
    role: "Morador do Bairro Niterói",
  },
  {
    id: 3,
    text: "Profissionalismo do início ao fim. O projeto ficou ainda melhor do que eu imaginava.",
    author: "Ana Paula",
    role: "Arquiteta Parceira",
  },
] as const

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    before: "/empty-backyard-with-dirt-and-weeds.jpg",
    after: "/beautiful-landscaped-garden-with-tropical-plants-a.jpg",
    title: "Residência Jardim Tropical",
  },
  {
    id: 2,
    before: "/overgrown-neglected-garden.jpg",
    after: "/manicured-lawn-with-ornamental-plants-and-modern-d.jpg",
    title: "Revitalização Completa",
  },
  {
    id: 3,
    before: "/plain-commercial-building-entrance.jpg",
    after: "/corporate-building-with-elegant-landscaping-and-gr.jpg",
    title: "Paisagismo Corporativo",
  },
] as const
