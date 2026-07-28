"use client";

import Image from "next/image";
import { Container, Leaf, PillButton } from "@/components/ui";
import {
  BlurTitle,
  HOVER_SPRING,
  Pop,
  Reveal,
  ShrinkAway,
  VIGNETTE,
  motion,
} from "@/components/motion";
import { SITE } from "@/lib/site";

type Servico = {
  image: string;
  alt: string;
  titulo: string;
  descricao: string;
  local: string;
};

const SERVICOS: readonly Servico[] = [
  {
    image: "/images/servico-plantio.jpg",
    alt: "Caminho de jardim florido sob uma pérgola de madeira",
    titulo: "plantio\nde jardins",
    descricao:
      "do projeto à primeira muda: preparamos o solo, escolhemos as espécies certas e plantamos jardins prontos para crescer com saúde",
    local: "divinópolis · mg",
  },
  {
    image: "/images/servico-manutencao.jpg",
    alt: "Gramado aparado emoldurando uma arquitetura moderna",
    titulo: "manutenção\nde jardins",
    descricao:
      "poda, adubação, controle de pragas e cuidado contínuo para o seu jardim ficar bonito em todas as estações",
    local: "divinópolis · mg",
  },
  {
    image: "/images/servico-revitalizacao.jpg",
    alt: "Jardim exuberante com canteiros bem cuidados",
    titulo: "revitalização\nde áreas verdes",
    descricao:
      "damos vida nova a espaços esquecidos: recuperamos gramados, canteiros e jardins de casas, condomínios e empresas",
    local: "região centro-oeste · mg",
  },
];

function ServicoCard({ servico }: { servico: Servico }) {
  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      className="relative h-125 overflow-clip md:h-150 lg:h-svh"
    >
      <motion.div
        className="absolute inset-0"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.01 } }}
        transition={HOVER_SPRING}
      >
        <Image
          src={servico.image}
          alt={servico.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0" style={VIGNETTE} />
      <div className="relative flex h-full flex-col justify-between py-12.5">
        <Container className="flex items-start justify-between gap-6 max-md:flex-col max-md:items-center">
          <Pop delay={0.2}>
            <span className="mono-label-sm text-paper/80">{SITE.coords}</span>
          </Pop>
          <Pop delay={0.2}>
            <span className="mono-label-sm text-paper/80">{servico.local}</span>
          </Pop>
        </Container>
        <Container className="flex flex-col items-center text-center">
          <BlurTitle
            as="h3"
            text={servico.titulo}
            amount={1}
            className="display-title text-paper"
          />
          <Reveal delay={0.4} className="md:hidden">
            <p className="text-lead-sm mt-6 max-w-md text-paper">
              {servico.descricao}
            </p>
          </Reveal>
        </Container>
        <Container className="flex items-end justify-between gap-8 max-md:justify-center">
          <Pop delay={0.6}>
            <span className="flex items-center gap-3">
              <Leaf size={24} />
              <span className="mono-label-sm text-paper">
                executado pela guaimbês
              </span>
            </span>
          </Pop>
          <Reveal delay={0.4} className="hidden md:block">
            <p className="text-lead-sm max-w-md text-paper">
              {servico.descricao}
            </p>
          </Reveal>
        </Container>
      </div>
    </motion.article>
  );
}

export function Servicos() {
  return (
    <>
      <section id="servicos" className="scroll-mt-20 bg-cream py-24 lg:py-32">
        <Container className="max-md:text-center">
          <BlurTitle text="serviços" amount={0.1} className="display-giant" />
          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2">
            <Pop className="flex items-end max-md:justify-center">
              <span className="flex items-center gap-3">
                <Leaf size={28} />
                <span className="mono-label">o que fazemos — 03</span>
              </span>
            </Pop>
            <Reveal delay={0.4}>
              <p className="text-lead max-w-lg max-md:mx-auto">
                cada jardim nasce de um olhar atento ao espaço, à luz e a quem
                vive nele — pensado para crescer bonito e durar o ano inteiro
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
      {SERVICOS.map((servico, i) =>
        i < SERVICOS.length - 1 ? (
          <ShrinkAway key={servico.image}>
            <ServicoCard servico={servico} />
          </ShrinkAway>
        ) : (
          <ServicoCard key={servico.image} servico={servico} />
        ),
      )}
      <div className="flex justify-center bg-cream py-16">
        <Reveal delay={0.4}>
          <PillButton
            tone="dark"
            href={SITE.whatsappCta}
            target="_blank"
            rel="noopener noreferrer"
          >
            peça um orçamento
          </PillButton>
        </Reveal>
      </div>
    </>
  );
}
