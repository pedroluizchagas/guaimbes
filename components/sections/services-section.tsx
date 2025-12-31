import { Leaf, Scissors, Building2 } from "lucide-react"
import { SERVICES } from "@/lib/constants"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

const iconMap = {
  leaf: Leaf,
  scissors: Scissors,
  building: Building2,
}

export function ServicesSection() {
  return (
    <section id="servicos" className="py-24 bg-background" aria-labelledby="services-title">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-secondary font-medium tracking-widest text-sm uppercase">O que fazemos</span>
          <h2 id="services-title" className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4 mb-6">
            Nossos Serviços
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Soluções completas em paisagismo e jardinagem para transformar e manter seu espaço verde com excelência.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap]
            return (
              <article
                key={service.id}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 transition-all duration-500 hover:shadow-2xl hover:border-secondary/30"
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all duration-300 group-hover:bg-secondary">
                    <IconComponent className="h-7 w-7" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-4">{service.title}</h3>

                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </article>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <WhatsAppButton className="inline-flex">Solicitar Orçamento Gratuito</WhatsAppButton>
        </div>
      </div>
    </section>
  )
}
