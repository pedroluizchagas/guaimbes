# Napkin — landing Guaimbês

## Design de referência (prioridade alta)

- O design é réplica de https://ardene.framer.website/. Specs exatas extraídas do bundle Framer (spring, delays, dimensões) estão codificadas em `src/components/motion.tsx` (comentário no topo) — não inventar timings novos, seguir esses.
- Sistema de animação: Reveal (y30, spring bounce .2/1.5s, 50% visível, once), BlurTitle (por caractere, blur 10px, y20, spring 120/40, stagger .05s, início .1s), Pop (scale .85, y18, spring 400/58), ShrinkAway (scale→.5 + fade ao ser coberto; só ≥810px), Marquee (100px/s fixo).
- Cascata de delays desktop: 0.4/0.6/0.8/1.0/1.2s; no mobile TUDO colapsa para 0.1s (`useStaggerDelay`).
- Breakpoints Tailwind CUSTOMIZADOS em globals.css: md=810px, lg=1200px (iguais aos do Framer, não os defaults 768/1024). Atualizar `sizes` de imagens de acordo.
- Alturas de seção full-bleed: 100svh desktop / 600px (h-150) tablet / 500px (h-125) phone. Ticker: 500/300/200 com texto display-mega, preto, mix-blend exclusion dentro de wrapper overlay.
- Overlay de imagem: vinheta radial 5%→30% preto (`VIGNETTE` em motion.tsx), não gradientes lineares.

## Gotchas do ambiente (prioridade alta)

- Reiniciar `next start` após rebuild: `kill` pelo PID da porta NÃO mata o next-server (processo filho do pnpm) → servidor velho serve manifest antigo → CSS 404 → layout todo colapsado. Usar `pkill -9 -f next-server`.
- Este Next (16.x) usa `preload` no lugar de `priority` em `next/image`. Ler docs em `node_modules/next/dist/docs/` antes de usar APIs novas (ver AGENTS.md).

## Verificação visual (prioridade média)

- `chrome-headless-shell --screenshot --virtual-time-budget` NÃO serve para páginas com animações de entrada (captura antes de completarem). Usar o Chromium completo do cache playwright (`~/.cache/ms-playwright/chromium-1228`) via CDP: navegar, esperar ~4s reais, scrollTo + esperar ~2.5s, capturar. Script modelo em scratchpad (`shot.mjs`): porta 9922+, WebSocket nativo do Node ≥22.
- Rodar sempre desktop 1440×900 e mobile 390×844; conferir que reveals completaram (texto visível) antes de julgar layout.
