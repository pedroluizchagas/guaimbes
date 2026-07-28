import Image from "next/image";
import { Container, Leaf, UnderlineLink, Wordmark } from "@/components/ui";
import { BlurTitle, Pop, Reveal } from "@/components/motion";

export function Sobre() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-cream">
      <div className="grid md:h-150 md:grid-cols-2 lg:h-svh">
        <Container className="flex flex-col justify-between gap-12 overflow-clip pb-12.5 pt-7.5 max-md:items-center max-md:py-12.5 max-md:text-center md:h-full">
          <div className="flex flex-col gap-12 max-md:w-[80%] max-md:items-center">
            <BlurTitle text="sobre" className="display-giant" />
            <Reveal delay={0.4}>
              <p className="text-lead max-w-xl">
                na guaimbês, criamos e cuidamos de jardins que unem beleza,
                conforto e funcionalidade. do plantio à manutenção,
                transformamos áreas verdes em ambientes que trazem calma para o
                dia a dia
              </p>
            </Reveal>
          </div>
          <div className="flex w-full items-end justify-between gap-6 max-md:flex-col max-md:items-center max-md:gap-5">
            <Pop>
              <div className="flex flex-col items-start gap-3 max-md:items-center">
                <Leaf size={32} />
                <span className="mono-label">desde divinópolis — mg</span>
              </div>
            </Pop>
            <Pop delay={0.2}>
              <UnderlineLink href="#servicos">serviços</UnderlineLink>
            </Pop>
          </div>
        </Container>
        <div className="relative max-md:aspect-5/4 md:h-full">
          <Image
            src="/images/sobre.jpg"
            alt="mãos plantando uma muda na terra"
            fill
            className="object-cover"
            sizes="(min-width: 810px) 50vw, 100vw"
          />
          <Reveal
            delay={0.6}
            className="absolute bottom-12.5 left-1/2 w-62.5 -translate-x-1/2 max-md:bottom-19.25 md:w-75 lg:w-104.5"
          >
            <div className="bg-cream p-6 text-center lg:p-8">
              <Wordmark className="text-2xl" />
              <div className="my-6 lg:my-8">
                <Leaf size={56} />
              </div>
              <div className="mono-label-sm flex items-baseline justify-between gap-4 text-left">
                <span>verde que transforma.</span>
                <span>guaimbês paisagismo</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
