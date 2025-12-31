"use client"

import { useState } from "react"
import { TESTIMONIALS } from "@/lib/constants"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  return (
    <section id="depoimentos" className="py-24 bg-primary" aria-labelledby="testimonials-title">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-secondary font-medium tracking-widest text-sm uppercase">Depoimentos</span>
          <h2
            id="testimonials-title"
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground mt-4 mb-6"
          >
            O Que Dizem Nossos Clientes
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-500 ${index === activeIndex ? "block" : "hidden"}`}
              >
                <div className="text-center px-8 md:px-16">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-8">
                    <Quote className="h-12 w-12 text-secondary" strokeWidth={1} />
                  </div>

                  {/* Quote Text */}
                  <blockquote className="text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 leading-relaxed mb-8 font-light italic">
                    {`"${testimonial.text}"`}
                  </blockquote>

                  {/* Author */}
                  <div className="space-y-1">
                    <p className="text-secondary font-semibold text-lg">{testimonial.author}</p>
                    <p className="text-primary-foreground/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prevTestimonial}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-all duration-300 hover:bg-secondary hover:border-secondary hover:text-secondary-foreground"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-secondary" : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"}`}
                  aria-label={`Ver depoimento ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : "false"}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-all duration-300 hover:bg-secondary hover:border-secondary hover:text-secondary-foreground"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
