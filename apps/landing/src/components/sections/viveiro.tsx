"use client";

import Image from "next/image";
import { Container, Leaf } from "@/components/ui";
import { BlurTitle, Pop, Reveal, useStaggerDelay } from "@/components/motion";

function Foto({
  src,
  alt,
  caption,
  aspect,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  aspect: string;
  sizes: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden ${aspect}`}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="mono-label-sm mt-2.5 text-ink/60 max-md:text-center">
        {caption}
      </figcaption>
    </figure>
  );
}

export function Viveiro() {
  // no mobile a cascata da referência colapsa para 0.1s em todos os blocos
  const d1 = useStaggerDelay(0.4);
  const d2 = useStaggerDelay(0.8);
  const d3 = useStaggerDelay(1.0);
  const d4 = useStaggerDelay(1.2);

  return (
    <section id="viveiro" className="scroll-mt-20 bg-cream py-24 lg:py-32">
      <Container className="flex flex-col gap-12.5">
        <BlurTitle
          text="viveiro"
          amount={0.1}
          className="display-giant text-ink max-md:text-center"
        />

        <div className="flex gap-2.5 max-md:flex-col max-md:gap-7.5">
          <div className="flex gap-5 max-md:flex-col md:w-[65%]">
            <Reveal delay={d1} className="flex-1">
              <p className="text-lead max-w-md text-ink max-md:mx-auto max-md:text-center">
                somos produtores de plantas ornamentais. do nosso viveiro para
                o seu jardim: mudas saudáveis, aclimatadas e escolhidas uma a
                uma
              </p>
            </Reveal>
            <Reveal delay={d1} className="flex-1 max-md:w-full">
              <Foto
                src="/images/viveiro-4.jpg"
                alt="Folhas de costela-de-adão em detalhe"
                caption="viveiro guaimbês"
                aspect="aspect-3/4"
                sizes="(min-width: 1200px) 30vw, (min-width: 810px) 30vw, calc(100vw - 40px)"
              />
            </Reveal>
          </div>
          <Reveal
            delay={d2}
            className="flex-1 md:pr-25 md:pt-25 max-md:w-full"
          >
            <Foto
              src="/images/viveiro-3.jpg"
              alt="Coleção de vasos com espécies ornamentais variadas"
              caption="espécies ornamentais"
              aspect="aspect-square"
              sizes="(min-width: 1200px) 300px, (min-width: 810px) 200px, calc(100vw - 40px)"
              className="lg:w-75 md:w-50 max-md:w-full"
            />
          </Reveal>
        </div>

        <div className="flex items-end gap-2.5 max-md:flex-col max-md:items-stretch max-md:gap-7.5">
          <div className="flex flex-col justify-between gap-12.5 md:w-[65%]">
            <Reveal delay={d4} className="max-md:w-full">
              <Foto
                src="/images/viveiro-2.jpg"
                alt="Bandejas de sementes germinando no viveiro"
                caption="mudas"
                aspect="aspect-square"
                sizes="(min-width: 1200px) 200px, (min-width: 810px) 100px, calc(100vw - 40px)"
                className="lg:w-50 md:w-25 max-md:w-full"
              />
            </Reveal>
            <Pop className="max-md:self-center">
              <div className="flex items-center gap-4">
                <Leaf size={40} />
                <span className="mono-label text-ink">
                  produção própria — plantas ornamentais
                </span>
              </div>
            </Pop>
          </div>
          <Reveal delay={d3} className="flex-1 max-md:w-full">
            <Foto
              src="/images/viveiro-1.jpg"
              alt="Mudas de plantas ornamentais em vasos no viveiro da Guaimbês"
              caption="produção"
              aspect="aspect-3/2"
              sizes="(min-width: 810px) 33vw, calc(100vw - 40px)"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
