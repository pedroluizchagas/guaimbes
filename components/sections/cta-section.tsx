import Image from "next/image"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { CONTACT_INFO } from "@/lib/constants"
import { MapPin, Phone } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 bg-muted relative overflow-hidden" aria-label="Chamada para ação">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <Image src="/tropical-leaves-pattern-texture.jpg" alt="" fill className="object-cover" aria-hidden="true" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <Image
              src="/images/icon.png"
              alt=""
              width={60}
              height={60}
              className="h-16 w-auto opacity-80"
              aria-hidden="true"
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Pronto para ter o <span className="text-secondary">jardim dos sonhos</span>?
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Atendemos Divinópolis/MG e toda a região. Agende uma visita técnica agora mesmo e transforme seu espaço.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-secondary" />
              <span>{CONTACT_INFO.whatsappFormatted}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              <span>{CONTACT_INFO.location}</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <WhatsAppButton className="text-lg px-10 py-4 shadow-xl">Agendar Visita Técnica</WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  )
}
