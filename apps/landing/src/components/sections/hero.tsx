import Image from "next/image";
import { BlurTitle, Reveal, ShrinkAway, VIGNETTE } from "@/components/motion";
import { Container } from "@/components/ui";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <ShrinkAway endOffset={80}>
      <section className="relative flex h-125 flex-col justify-end overflow-clip md:h-150 lg:h-svh">
        <Image
          src="/images/hero.jpg"
          alt="Sol dourado atravessando a copa de uma árvore gigante"
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0" style={VIGNETTE} />
        <Container className="relative flex flex-col gap-5 pb-12.5 max-md:items-center max-md:text-center">
          <div className="flex w-full items-end justify-between gap-8 max-md:justify-center">
            <Reveal delay={0.4}>
              <p className="display-sub text-paper">
                transformando espaços ao ar livre{" "}
                <br className="hidden md:block" />
                em divinópolis e região
              </p>
            </Reveal>
            <Reveal delay={0.6} className="hidden md:block">
              <p className="mono-label-sm text-right text-paper/80">
                {SITE.coords}
                <br />
                paisagismo · jardinagem
              </p>
            </Reveal>
          </div>
          <BlurTitle
            as="h1"
            text="guaimbês"
            ariaLabel="Guaimbês Paisagismo"
            className="display-mega text-cream"
          />
        </Container>
      </section>
    </ShrinkAway>
  );
}
