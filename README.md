# Guaimbês — Monorepo

Monorepo da Guaimbês Paisagismo (Divinópolis, MG): jardinagem, paisagismo e
produção de plantas ornamentais.

## Estrutura

```
guaimbes/
├── apps/
│   └── landing/    # Landing page institucional (Next.js + TypeScript) — Vercel
│   # futuro: loja/  — e-commerce de plantas ornamentais
├── packages/       # futuro: código compartilhado (ui, config, sdk do backend)
├── pnpm-workspace.yaml
└── turbo.json
```

A arquitetura separa as aplicações (landing e, futuramente, a loja) como
projetos independentes deployados na Vercel, compartilhando um backend
unificado via `packages/` quando ele existir.

## Desenvolvimento

```bash
pnpm install
pnpm dev          # roda todos os apps (turbo)
pnpm --filter landing dev   # só a landing
```

## Build

```bash
pnpm build
```

## Deploy (Vercel)

Cada app é um projeto Vercel separado apontando para o mesmo repositório:

- **landing** — Root Directory: `apps/landing`

O Turborepo é detectado automaticamente pela Vercel.
