# Guaimbês Paisagismo — Design System da Landing Page

Landing page de página única, editorial e minimalista: fotografia em tela cheia,
tipografia gigante em caixa baixa, labels técnicos em monoespaçada, muito espaço
em branco e animações suaves de entrada. Tom quente (creme + terracota + tinta).

## Tokens (já configurados em `globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `cream` | `#F8F0DD` | fundo principal |
| `ink` | `#121212` | texto e superfícies escuras |
| `paper` | `#F0F0F0` | texto sobre imagem/fundo escuro |
| `terra` | `#C85020` | acento da marca (links, e-mail, hovers) |
| `terra-deep` | `#9F4C29` | acento alternativo escuro |

Tailwind: `bg-cream`, `text-ink`, `text-paper`, `text-terra`, `bg-ink`, etc.

## Tipografia

- **Inter** (variável, com eixo óptico — já em `--font-sans`, aplicada no body).
  Títulos SEMPRE em caixa baixa (escrever o texto já em minúsculas).
- **DM Mono** (`--font-mono`) para labels técnicos, SEMPRE em uppercase
  (a classe utilitária já aplica `text-transform: uppercase`).

Classes utilitárias prontas (usar SEMPRE estas, nunca tamanhos ad hoc):

| Classe | Uso |
|---|---|
| `display-mega` | wordmark gigante do hero e do footer (~20vw) |
| `display-giant` | títulos de seção: "sobre", "serviços", "viveiro" (~13.5vw) |
| `display-title` | títulos dos cards de serviço (~8.3vw) |
| `display-sub` | subtítulo do hero (~3.9vw) |
| `text-lead` | parágrafos grandes (24–32px) |
| `text-lead-sm` | parágrafos médios (20–24px) |
| `mono-label` | labels DM Mono 14px uppercase |
| `mono-label-sm` | labels DM Mono 12px uppercase |

## Primitivos (importar destes arquivos, não recriar)

`@/components/ui` (server-safe):
- `Container` — margens laterais padrão (`px-5 md:px-10`)
- `Leaf` — ícone da folha (props `size`, `className`); equivalente ao ✺
- `Wordmark` — "guaimbês" em texto, caixa baixa, tracking apertado
- `PillButton` — botão pílula DM Mono com seta (`tone="dark" | "cream"`, props de `<a>`)
- `UnderlineLink` — link mono sublinhado

`@/components/motion` (client):
- `SPRING` — spring padrão `{ stiffness: 235, damping: 30, mass: 1 }`
- `Reveal` — fade + slide-up ao entrar na viewport (`y` 40 texto / 60 títulos, `delay`, `onMount`)
- `HeroZoom` — zoom-out de abertura para a imagem do hero
- `Parallax` — parallax vertical sutil para imagens full-bleed (`amount` em %)
- `Marquee` — faixa infinita (`duration` em segundos)
- `motion` — re-export de `motion/react` para casos especiais

`@/lib/site` — `SITE` com todos os dados de contato (WhatsApp, Instagram,
coordenadas, cidade). NUNCA hardcodar telefone/links.

## Motion (fiel à referência)

- Entrada padrão: `opacity 0 → 1` + `y 40→0` (títulos gigantes `y 60`), spring
  `stiffness 235, damping 30, mass 1`, disparo ao entrar na viewport, uma única vez.
- Hero: imagem com `HeroZoom` (1.6s), textos com `Reveal onMount` e delays
  escalonados 0.6 / 0.85 / 1.1s.
- Delays em cascata de 0.1–0.15s entre elementos irmãos.
- Hovers: transições de 300ms (`transition-colors` / `transition-transform`);
  imagens clicáveis podem ter `scale 1.05` lento (700ms).
- `prefers-reduced-motion` já é tratado nos primitivos e no CSS global.

## Imagens (em `/public/images/`, usar `next/image` com `fill` + `object-cover`)

| Arquivo | Conteúdo | Seção |
|---|---|---|
| `hero.jpg` | sol dourado por entre a copa de uma árvore gigante | Hero |
| `sobre.jpg` | mãos plantando na terra | Sobre (coluna direita) |
| `band.jpg` | folhagem tropical densa | Faixa marquee |
| `servico-plantio.jpg` | caminho de jardim florido sob pérgola | Card serviço 1 |
| `servico-manutencao.jpg` | gramado aparado + arquitetura | Card serviço 2 |
| `servico-revitalizacao.jpg` | jardim exuberante com canteiros | Card serviço 3 |
| `viveiro-1..4.jpg` | mudas em vasos / bandejas de sementes / coleção de vasos / costela-de-adão | Galeria viveiro |

Marca em `/public/brand/`: `guaimbes-icon.png` (folha terracota, fundo
transparente — funciona sobre qualquer fundo), `guaimbes-logo.png` (wordmark
BRANCO + "Paisagismo" terracota — SÓ usar sobre imagem/fundo escuro).

## Layout global

- Página única com âncoras: `#sobre`, `#servicos`, `#viveiro`, `#contato`.
- Navbar fixa por cima de tudo (`fixed inset-x-0 top-0 z-50`), altura 80px.
- Seções em `bg-cream` coladas umas nas outras; cards de serviço full-bleed
  sem gap entre si.
- Texto sobre imagem é sempre `text-paper` ou `text-cream`; adicionar leve
  gradiente escuro (`bg-gradient-to-t from-black/35 via-transparent`) para
  garantir contraste.

## Conteúdo e especificação por seção

### 1. Navbar — `src/components/sections/navbar.tsx`
Client component. Fixa, 80px, `Container` interno com grid 3 colunas
(esquerda / centro / direita), itens centralizados verticalmente.
- Esquerda: links `mono-label` "serviços" (com badge `3` num círculo pequeno
  `bg-ink/10` — número de serviços) e "viveiro" → âncoras.
- Centro: `Wordmark` (~22px) + `Leaf size={20}` ao lado.
- Direita: ícone Instagram (SVG inline minimalista, stroke 1.5) e
  `PillButton` "fale conosco" → `SITE.whatsappCta`.
- Comportamento de scroll: transparente com `text-paper` sobre o hero; após
  `window.scrollY > 40`, fundo `bg-cream` + `text-ink` (transição 300ms).
  Usar estado + listener de scroll (passive).
- Mobile: esconder links da esquerda (`hidden md:flex`), manter marca e CTA.

### 2. Hero — `src/components/sections/hero.tsx`
`<section>` de `min-h-svh`, imagem `hero.jpg` cobrindo tudo (`HeroZoom` no
wrapper), gradiente de contraste no rodapé da imagem.
Conteúdo em `Container`, empilhado no rodapé da viewport:
- `display-sub` em `text-paper`, 2 linhas, `Reveal onMount delay 0.6`:
  "transformando espaços ao ar livre" / "em divinópolis e região"
- `display-mega` `text-cream` "guaimbês" colado na base (margem negativa
  inferior leve para "sangrar" como na referência), `Reveal onMount delay 0.85 y 80`.
- Canto inferior direito (só desktop): `mono-label-sm` `text-paper/80` com
  `SITE.coords` e "paisagismo · jardinagem", `Reveal onMount delay 1.1`.

### 3. Sobre — `src/components/sections/sobre.tsx`
`<section id="sobre">` `bg-cream`, grid `lg:grid-cols-2`, SEM gap horizontal.
Coluna esquerda (em `Container`, `py-24 lg:py-32`, altura mínima `lg:min-h-svh`,
flex col justify-between):
- Topo: `display-giant` "sobre" (Reveal y 60) + `text-lead` máx ~20ch de
  largura (`max-w-xl`), Reveal delay 0.1:
  "na guaimbês, criamos e cuidamos de jardins que unem beleza, conforto e
  funcionalidade. do plantio à manutenção, transformamos áreas verdes em
  ambientes que trazem calma para o dia a dia"
- Base (margem-top generosa ~mt-32): linha com `Leaf size={32}` em cima de
  `mono-label` "desde divinópolis — mg"; à direita `UnderlineLink` "serviços"
  → `#servicos`.
Coluna direita: imagem `sobre.jpg` altura total (`relative`, `lg:min-h-svh`,
`min-h-[70svh]`), com **card overlay** centrado próximo à base
(`absolute inset-x-10 bottom-10` aprox, `max-w-sm mx-auto`): fundo `bg-cream`,
`p-8`, conteúdo centrado: `Wordmark` ~24px; `Leaf size={56}` no meio (my-8);
linha base entre `mono-label-sm`: "verde que transforma." e "guaimbês
paisagismo". Card entra com Reveal delay 0.2.

### 4. Faixa marquee — `src/components/sections/banda.tsx`
`<section>` altura `h-[50svh] min-h-[360px]`, `relative`, imagem `band.jpg`
`fill object-cover` dentro de `Parallax` cobrindo a seção.
Por cima, centralizado verticalmente, `Marquee duration={38}`com sequência
repetida 3× de: palavra `display-giant` `text-ink/85` "guaimbê" +
`Leaf size={90}` (gap `mx-10`) + palavra "natureza" + Leaf + palavra
"paisagismo" + Leaf. Texto com `mix-blend-multiply` para fundir na foto
(como a palavra "timeless" da referência).

### 5. Serviços — `src/components/sections/servicos.tsx`
Bloco A — intro `<section id="servicos">` `bg-cream` `py-24 lg:py-32`:
- `display-giant` "serviços" (Reveal y 60) em `Container`.
- Abaixo, grid 2 colunas: esquerda no rodapé com `Leaf size={28}` +
  `mono-label` "o que fazemos — 03"; direita `text-lead` `max-w-lg`
  (Reveal delay 0.15):
  "cada jardim nasce de um olhar atento ao espaço, à luz e a quem vive nele —
  pensado para crescer bonito e durar o ano inteiro"

Bloco B — 3 cards full-bleed empilhados (sem gap), cada um `<article>`
`relative h-svh` com imagem em `Parallax amount={8}` + gradiente de contraste:

| # | imagem | título (2 linhas, caixa baixa) | descrição | mono topo-esq | mono topo-dir |
|---|---|---|---|---|---|
| 1 | `servico-plantio.jpg` | "plantio" / "de jardins" | "do projeto à primeira muda: preparamos o solo, escolhemos as espécies certas e plantamos jardins prontos para crescer com saúde" | `SITE.coords` | "divinópolis · mg" |
| 2 | `servico-manutencao.jpg` | "manutenção" / "de jardins" | "poda, adubação, controle de pragas e cuidado contínuo para o seu jardim ficar bonito em todas as estações" | `SITE.coords` | "divinópolis · mg" |
| 3 | `servico-revitalizacao.jpg` | "revitalização" / "de áreas verdes" | "damos vida nova a espaços esquecidos: recuperamos gramados, canteiros e jardins de casas, condomínios e empresas" | `SITE.coords` | "região centro-oeste · mg" |

Anatomia do card: mono labels `mono-label-sm text-paper/80` nos cantos
superiores (`Container` + `pt-28` para não colidir com a navbar);
título `display-title text-paper text-center` centralizado verticalmente
(Reveal y 60); base: à esquerda `Leaf size={24}` + `mono-label-sm text-paper`
"executado pela guaimbês"; à direita `text-lead-sm text-paper max-w-md`
(escondida no mobile → `hidden md:block`; no mobile a descrição vai abaixo do
título centralizado). Reveals com delays 0.1/0.2.

Fechamento: faixa `bg-cream py-16` centrada com `PillButton tone="dark"`
"peça um orçamento" → `SITE.whatsappCta`.

### 6. Viveiro — `src/components/sections/viveiro.tsx`
`<section id="viveiro">` `bg-cream py-24 lg:py-32`:
- `Container`: `display-giant` "viveiro" (Reveal y 60).
- Grid 2 col: esquerda `text-lead` `max-w-md` (Reveal 0.1):
  "somos produtores de plantas ornamentais. do nosso viveiro para o seu
  jardim: mudas saudáveis, aclimatadas e escolhidas uma a uma"
- Galeria em colagem (grid 12 col, alturas variadas, offsets verticais como
  na referência — imagens pequenas, muito respiro):
  - `viveiro-1.jpg` col-span-3, aspecto 4/5, caption `mono-label-sm` "produção"
  - `viveiro-2.jpg` col-span-4 deslocada para baixo (`mt-24`), aspecto 4/3, caption "mudas"
  - `viveiro-3.jpg` col-span-3, aspecto 1/1 (`mt-8`), caption "espécies ornamentais"
  - `viveiro-4.jpg` col-span-2 (`mt-40`), aspecto 3/4, caption "viveiro guaimbês"
  No mobile: grid de 2 colunas simples com gap.
  Cada item: Reveal com delays escalonados; caption abaixo da imagem.
- Entre a intro e a galeria, um `Leaf size={40}` + `mono-label`
  "produção própria — plantas ornamentais".

### 7. Footer — `src/components/sections/footer.tsx`
`<section id="contato">` `bg-cream`:
Bloco contato `Container py-24`, grid `lg:grid-cols-[1.2fr_1fr_0.8fr_0.6fr]`
com `gap-10` (mobile: 1 coluna, gap-12):
1. `Wordmark` ~28px + parágrafo `text-lead-sm text-ink/70 max-w-xs`:
   "jardinagem e paisagismo em divinópolis e região — verde, vivo e bem cuidado"
2. `mono-label`: "guaimbês · divinópolis, mg" / `SITE.coords` em linhas; abaixo
   (mt-6) link WhatsApp `mono-label text-terra hover:underline` com
   `SITE.phoneDisplay` → `SITE.whatsapp`.
3. Links âncora `UnderlineLink` empilhados (`flex flex-col gap-3 items-start`):
   "sobre", "serviços", "viveiro".
4. Sociais `text-lead-sm text-terra` empilhados: "Instagram" →
   `SITE.instagram`, "WhatsApp" → `SITE.whatsapp` (target _blank).
Bloco wordmark gigante: `relative overflow-clip`, `Container`:
linha flex com `Leaf` ENORME (~180px, `hidden md:block`) + `display-mega`
"guaimbês" `text-ink`, com `translate-y-[18%]` para o texto sangrar cortado
na borda inferior (como a referência). Reveal y 80.
Bordinha final: linha `border-t border-ink/10`, `Container py-5`, flex
justify-between `mono-label-sm text-ink/60`:
"© {SITE.year} guaimbês paisagismo" / "divinópolis · minas gerais" /
"{SITE.instagramHandle}".

## Regras de código

- TypeScript estrito, componentes funcionais nomeados com `export function`.
- `"use client"` APENAS onde há hooks/handlers (navbar). Seções que só usam
  `Reveal`/`Parallax`/`Marquee` podem ser server components importando esses
  primitivos client.
- `next/image` sempre com `alt` descritivo em pt-BR (ou `alt=""` decorativo);
  imagens full-bleed com `fill`, `object-cover` e `sizes` adequado
  (`100vw` para full-bleed, `(min-width:1024px) 50vw, 100vw` para metades).
  Hero com `priority`.
- Âncoras com `scroll-mt-20` quando a navbar cobriria o título.
- Acessibilidade: um único `h1` (no hero — usar o wordmark gigante como `h1`
  com `aria-label="Guaimbês Paisagismo"`), `h2` para títulos de seção,
  `aria-label` nos links de ícone.
- Nada de estilos inline exceto quando dinâmicos; todo o resto em Tailwind.
- Não instalar nenhuma dependência nova.
