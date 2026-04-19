# Pasta de imagens otimizadas

Imagens colocadas aqui são **processadas pelo Astro** (compressão, formatos modernos, responsive) quando referenciadas via `image()` nos schemas Zod do conteúdo.

## Estrutura

```
src/assets/imagens/
├── modelos/          Fotos dos Kindles (hero de cada ficha)
│   ├── paperwhite.avif
│   ├── basico.avif
│   ├── signature.avif
│   ├── scribe.avif
│   └── colorsoft.avif
├── guias/            Hero das capas de guias
└── blog/             Thumbnails dos posts de blog
```

## Como usar num MDX

```mdx
---
imagem_hero: "./paperwhite.avif"        # relativo à pasta do MDX
imagem_hero_alt: "Kindle Paperwhite visto de cima"
---
```

O schema Zod (`src/content.config.ts`) usa `image()` em vez de `string`, o que dá ao Astro acesso à imagem para otimização.

## Formatos recomendados

- **AVIF** (primário) — 30-50% mais pequeno que WebP
- **WebP** (fallback) — suportado em todo o lado
- **JPG** apenas se nada mais funcionar

## Dimensões-alvo

| Uso | Dimensão |
|-----|----------|
| Hero de modelo | 1600×1200 (4:3) |
| Hero de guia | 1600×900 (16:9) |
| Thumbnail blog | 800×450 (16:9) |
| Open Graph (em `/public/og/`) | 1200×630 |

## Imagens oficiais Amazon

O programa **Amazon Associates** permite usar imagens do catálogo *para o propósito de promover produtos*. A via oficial é a **Product Advertising API (PA-API)** — requer conta Associate aprovada e configuração. Entretanto, fotos próprias ou renderizações não-oficiais são alternativa segura.
