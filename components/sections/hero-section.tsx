import Image from "next/image"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Seção principal"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/luxurious-modern-garden-with-tropical-plants-at-su.jpg"
          alt="Jardim paisagístico profissional"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-32 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Logo Icon */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/GuaimbesIcone.png"
              alt=""
              width={80}
              height={80}
              className="h-20 w-auto opacity-90"
              aria-hidden="true"
            />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground leading-tight text-balance">
            Da terra à arte: <span className="text-secondary">Transformamos</span> seu espaço em um refúgio natural
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
            Especialistas em Paisagismo e Manutenção de Jardins. Unimos técnica agronômica e design para criar ambientes
            vivos, exuberantes e valorizados.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <WhatsAppButton className="text-lg px-8 py-4 shadow-xl">Solicitar Orçamento</WhatsAppButton>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 pt-8">
            <MapPin className="h-5 w-5 text-secondary" />
            <span className="text-primary-foreground/80 text-sm tracking-wide">
              Atendendo Divinópolis e Região com excelência
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="h-12 w-6 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-1">
          <div className="h-2 w-1 rounded-full bg-primary-foreground/50 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
