"use client"

import { useState } from "react"
import Image from "next/image"
import { PORTFOLIO_ITEMS } from "@/lib/constants"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAfter, setShowAfter] = useState<Record<number, boolean>>({})

  const toggleBeforeAfter = (id: number) => {
    setShowAfter((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % PORTFOLIO_ITEMS.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length)
  }

  return (
    <section id="portfolio" className="py-24 bg-background" aria-labelledby="portfolio-title">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-secondary font-medium tracking-widest text-sm uppercase">Nosso Trabalho</span>
          <h2 id="portfolio-title" className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4 mb-6">
            Veja a Transformação
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Confira alguns dos projetos que realizamos. Clique nas imagens para ver o antes e depois.
          </p>
        </div>

        {/* Portfolio Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            {PORTFOLIO_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-500 ${index === activeIndex ? "block" : "hidden"}`}
              >
                <div
                  className="relative aspect-[3/2] cursor-pointer group"
                  onClick={() => toggleBeforeAfter(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleBeforeAfter(item.id)}
                  aria-label={`Ver ${showAfter[item.id] ? "antes" : "depois"} - ${item.title}`}
                >
                  <Image
                    src={showAfter[item.id] ? item.after : item.before}
                    alt={`${item.title} - ${showAfter[item.id] ? "Depois" : "Antes"}`}
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-width: 1024px) 100vw, 896px"
                  />

                  {/* Overlay Label */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${showAfter[item.id] ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}
                    >
                      {showAfter[item.id] ? "Depois" : "Antes"}
                    </span>
                  </div>

                  {/* Tap Hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-lg font-medium bg-foreground/50 px-6 py-3 rounded-full">
                      Clique para ver {showAfter[item.id] ? "antes" : "depois"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="bg-card p-6 text-center border-t border-border">
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground"
            aria-label="Projeto anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground"
            aria-label="Próximo projeto"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {PORTFOLIO_ITEMS.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-secondary" : "w-2 bg-border hover:bg-muted-foreground"}`}
                aria-label={`Ver projeto ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
