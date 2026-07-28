import Image from "next/image";
import { Leaf } from "@/components/ui";
import { Marquee, Reveal } from "@/components/motion";

const PALAVRAS = ["guaimbê", "natureza", "paisagismo"] as const;

export function Banda() {
  return (
    <section className="relative h-50 md:h-75 lg:h-125">
      <Image
        src="/images/band.jpg"
        alt="Folhagem tropical densa em tons de verde"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <Reveal
        y={0}
        delay={0.4}
        className="absolute inset-0 flex items-center mix-blend-overlay"
      >
        <Marquee speed={100} className="w-full">
          {PALAVRAS.map((palavra) => (
            <div key={palavra} className="flex items-center mix-blend-exclusion">
              <span className="display-mega whitespace-nowrap text-black">
                {palavra}
              </span>
              <Leaf size={90} className="mx-10 shrink-0" />
            </div>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}
