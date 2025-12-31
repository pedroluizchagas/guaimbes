import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Instagram, Facebook } from "lucide-react"
import { CONTACT_INFO, NAV_LINKS, WHATSAPP_URL } from "@/lib/constants"

export function Footer() {
  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/images/logo.png"
              alt="Guaimbês Paisagismo"
              width={180}
              height={50}
              className="h-12 w-auto object-contain"
            />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Transformamos espaços em refúgios naturais. Paisagismo e jardinagem com excelência em Divinópolis e
              região.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-secondary font-semibold mb-4 text-lg">Navegação</h3>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-secondary font-semibold mb-4 text-lg">Contato</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary text-sm transition-colors duration-300"
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT_INFO.whatsappFormatted}
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                <MapPin className="h-4 w-4" />
                {CONTACT_INFO.location}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-secondary font-semibold mb-4 text-lg">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href={CONTACT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground"
                aria-label="Instagram da Guaimbês"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={CONTACT_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground"
                aria-label="Facebook da Guaimbês"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Guaimbês Paisagismo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
