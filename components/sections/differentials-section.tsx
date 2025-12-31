import Image from "next/image"
import { DIFFERENTIALS } from "@/lib/constants"
import { Check } from "lucide-react"

export function DifferentialsSection() {
  return (
    <section id="diferenciais" className="py-24 bg-muted" aria-labelledby="differentials-title">
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/philodendron-guaimbe-tropical-plant-close-up-with-.jpg"
                alt="Planta Guaimbê - Philodendron guaimbê"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-secondary rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="text-secondary font-medium tracking-widest text-sm uppercase">Por que nos escolher</span>
              <h2
                id="differentials-title"
                className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-4 mb-6"
              >
                O Diferencial Guaimbês
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Por que o cliente deve escolher a Guaimbês e não o jardineiro autônomo comum?
              </p>
            </div>

            <ul className="space-y-6">
              {DIFFERENTIALS.map((differential) => (
                <li key={differential.id} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{differential.title}</h3>
                    <p className="text-muted-foreground">{differential.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
