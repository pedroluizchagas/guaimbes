"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { NAV_LINKS, WHATSAPP_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        isScrolled ? "bg-primary/95 backdrop-blur-md shadow-lg py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between" aria-label="Navegação principal">
          <Link href="#inicio" className="relative z-50" aria-label="Guaimbês Paisagismo - Voltar ao início">
            <Image
              src="/images/GuaimbesLogoT.png"
              alt="Guaimbês Paisagismo"
              width={180}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-primary-foreground/90 hover:text-secondary text-sm font-medium tracking-wide transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg"
              >
                Orçamento
              </a>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative z-50 p-2 text-primary-foreground"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "fixed inset-0 bg-primary lg:hidden transition-all duration-500",
              isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
            )}
          >
            <ul className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={handleNavClick}
                    className="text-primary-foreground text-2xl font-medium tracking-wide transition-colors duration-300 hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary px-8 py-3 text-lg font-semibold text-secondary-foreground"
                >
                  Solicitar Orçamento
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}
