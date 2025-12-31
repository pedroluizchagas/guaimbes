import Image from "next/image"

export function AboutSection() {
  return (
    <section id="sobre" className="py-24 bg-background" aria-labelledby="about-title">
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="relative flex justify-center">
            <div className="relative h-80 w-80 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full overflow-hidden shadow-2xl ring-4 ring-secondary/60">
              <Image
                src="/images/Perfil-foto-Guaimbes.png"
                alt="Fundador da Guaimbês"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 352px, 384px"
                priority
              />
            </div>
          </div>
          <div className="space-y-6">
            <span className="text-secondary font-medium tracking-widest text-sm uppercase">Quem somos</span>
            <h2 id="about-title" className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
              A Essência da Guaimbês: Onde a Experiência Encontra o Design.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Meu nome é Pedro Chagas e minha jornada com a natureza começou muito antes da fundação da Guaimbês
                Paisagismo. Sempre atuei diretamente no cuidado prático, com as mãos na terra e entendendo o ciclo de
                vida de cada espécie. Foi a jardinagem que me abriu as portas para o fascinante mundo do paisagismo.
              </p>
              <p>
                Para mim, um jardim não é apenas um conjunto de plantas; é um ecossistema vivo que tem o poder de
                transformar o humor, valorizar arquiteturas e criar memórias. A Guaimbês nasceu deste amadurecimento: a
                união entre o vigo técnico de quem sabe cultivar, aflorando em olhar artístico de quem projeta
                paisagens.
              </p>
              <p>
                Embora a Guaimbês esteja em seu primeiro ano como marca, ela carrega o DNA de meia década de dedicação
                total ao verde.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
