"use client";

import { useEffect, useState } from "react";
import { Container, Leaf, PillButton, Wordmark } from "@/components/ui";
import { SITE } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-cream text-ink" : "bg-transparent text-paper"
      }`}
    >
      <Container className="grid h-20 grid-cols-[1fr_auto_1fr] items-center">
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 md:flex"
        >
          <a
            href="#servicos"
            className="mono-label flex items-center gap-2 transition-colors duration-300 hover:text-terra"
          >
            serviços
            <span className="mono-label-sm flex size-5 items-center justify-center rounded-full bg-ink/10">
              3
            </span>
          </a>
          <a
            href="#viveiro"
            className="mono-label transition-colors duration-300 hover:text-terra"
          >
            viveiro
          </a>
        </nav>

        <a
          href="#"
          aria-label="Guaimbês Paisagismo — voltar ao topo"
          className="flex items-center gap-2"
        >
          <Wordmark className="text-[22px]" />
          <Leaf size={20} />
        </a>

        <div className="flex items-center justify-end gap-5">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Guaimbês"
            className="transition-colors duration-300 hover:text-terra"
          >
            <InstagramIcon />
          </a>
          <PillButton
            href={SITE.whatsappCta}
            target="_blank"
            rel="noopener noreferrer"
            tone={scrolled ? "dark" : "cream"}
          >
            fale conosco
          </PillButton>
        </div>
      </Container>
    </header>
  );
}
