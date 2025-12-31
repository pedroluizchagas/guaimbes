import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { AuthoritySection } from "@/components/sections/authority-section"
import { AboutSection } from "@/components/sections/about-section"
import { ServicesSection } from "@/components/sections/services-section"
import { DifferentialsSection } from "@/components/sections/differentials-section"
import { PortfolioSection } from "@/components/sections/portfolio-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CTASection } from "@/components/sections/cta-section"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AuthoritySection />
        <AboutSection />
        <ServicesSection />
        <DifferentialsSection />
        <PortfolioSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton variant="floating" />
    </>
  )
}
