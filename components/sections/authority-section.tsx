import { Leaf, FlaskConical, Clock } from "lucide-react"

const authorityItems = [
  {
    icon: Leaf,
    title: "Projetos Exclusivos",
    description: "Design personalizado para cada cliente",
  },
  {
    icon: FlaskConical,
    title: "Técnica Especializada",
    description: "Conhecimento botânico aprofundado",
  },
  {
    icon: Clock,
    title: "Compromisso",
    description: "Pontualidade e limpeza na execução",
  },
]

export function AuthoritySection() {
  return (
    <section className="relative bg-muted py-16 overflow-hidden" aria-label="Nossos diferenciais">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/5 rounded-full translate-x-1/4 translate-y-1/4" />

      <div className="container relative mx-auto px-4">
        {/* Tagline */}
        <p className="text-center text-2xl md:text-3xl font-medium text-primary mb-12 text-balance">
          {'"A natureza pede passagem. Nós abrimos o caminho."'}
        </p>

        {/* Authority Items */}
        <div className="grid gap-8 md:grid-cols-3">
          {authorityItems.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col items-center text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:shadow-lg hover:border-secondary/30"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-secondary group-hover:text-secondary-foreground">
                <item.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
