"use client";

import { Container, Leaf, UnderlineLink, Wordmark } from "@/components/ui";
import { Reveal, useStaggerDelay } from "@/components/motion";
import { SITE } from "@/lib/site";

export function Footer() {
  const d1 = useStaggerDelay(0.4);
  const d2 = useStaggerDelay(0.6);
  const d3 = useStaggerDelay(0.8);
  const d4 = useStaggerDelay(1.0);
  return (
    <section id="contato" className="scroll-mt-20 bg-cream">
      <h2 className="sr-only">contato</h2>

      <Container className="py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr_0.8fr_0.6fr] lg:gap-10">
          <Reveal delay={d1}>
            <Wordmark className="block text-[28px]" />
            <p className="mt-4 max-w-xs text-lead-sm text-ink/70">
              jardinagem e paisagismo em divinópolis e região — verde, vivo e
              bem cuidado
            </p>
          </Reveal>

          <Reveal delay={d2}>
            <p className="mono-label">guaimbês · {SITE.city}</p>
            <p className="mono-label">{SITE.coords}</p>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label mt-6 inline-block text-terra hover:underline"
            >
              {SITE.phoneDisplay}
            </a>
          </Reveal>

          <Reveal delay={d3}>
            <nav
              aria-label="Navegação do rodapé"
              className="flex flex-col items-start gap-3"
            >
              <UnderlineLink href="#sobre">sobre</UnderlineLink>
              <UnderlineLink href="#servicos">serviços</UnderlineLink>
              <UnderlineLink href="#viveiro">viveiro</UnderlineLink>
            </nav>
          </Reveal>

          <Reveal delay={d4}>
            <div className="flex flex-col items-start gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lead-sm text-terra transition-colors duration-300 hover:text-terra-deep"
              >
                Instagram
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lead-sm text-terra transition-colors duration-300 hover:text-terra-deep"
              >
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </Container>

      <div className="relative overflow-clip">
        <Container>
          <Reveal>
            <div className="flex items-end gap-6 md:gap-10">
              <div className="hidden shrink-0 md:block" aria-hidden>
                <Leaf size={180} />
              </div>
              <p className="display-mega translate-y-[18%] text-ink">
                guaimbês
              </p>
            </div>
          </Reveal>
        </Container>
      </div>

      <div className="border-t border-ink/10">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 mono-label-sm text-ink/60">
          <span>© {SITE.year} guaimbês paisagismo</span>
          <span>divinópolis · minas gerais</span>
          <span>{SITE.instagramHandle}</span>
        </Container>
      </div>
    </section>
  );
}
