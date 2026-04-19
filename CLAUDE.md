# Kindle Portugal — Site de Divulgação

Site informativo em **português europeu (PT-PT)** sobre Kindle e ebooks em Portugal: modelos, guias de compra, reviews, dicas de utilização e destaques de ebooks em PT.

## Objetivo

Ser a referência em PT-PT para quem considera comprar um Kindle ou já tem um e quer tirar mais partido dele. Monetização via Amazon Associates (programa ES) e, eventualmente, parcerias com editoras PT.

## Stack

- **Astro** (content-driven, static-first)
- **MDX** para conteúdo editorial
- **Tailwind CSS** para estilos
- **TypeScript** estrito
- **Cloudflare Pages** ou Netlify para deployment
- **Plausible/Umami** para analytics (sem cookies, RGPD-friendly)

## Comandos

```
npm run dev         # servidor local
npm run build       # build de produção
npm run preview     # pré-visualizar build
npm run check       # astro check + type-check
```

(A criar quando inicializarmos o projeto.)

## Convenções de conteúdo

### Idioma — PT-PT **sempre**
- Usar ortografia e vocabulário de Portugal: *ecrã* (não "tela"), *ficheiro* (não "arquivo"), *rato* (não "mouse"), *utilizador* (não "usuário"), *atualizar/ligar/descarregar*, *telemóvel*.
- Evitar brasileirismos e anglicismos desnecessários. Preferir "correio eletrónico" ou "e-mail" (não "email" sem hífen em contextos formais).
- Preços em euros com vírgula decimal: `129,99 €`.
- Datas em formato `dd/mm/aaaa` ou `19 de abril de 2026`.

### Tom
Informativo, próximo e honesto. Nada de hype. Admitir limitações dos produtos. Recomendar com base em casos de uso, não em marketing.

### Estrutura de artigos
- Título claro e pesquisável (SEO sem clickbait).
- Parágrafo introdutório de 2-3 linhas que responde à pergunta central.
- Subtítulos H2/H3 semânticos.
- Tabelas comparativas sempre que faça sentido.
- "Em resumo" ou TL;DR no final de guias longos.

## Afiliados — regras **obrigatórias**

1. **Disclosure visível** em qualquer página com links de afiliado. Componente reutilizável. Texto base: *"Esta página contém links de afiliado. Se comprares através deles, podemos receber uma comissão sem custo adicional para ti."*
2. Página dedicada `/divulgacao-afiliados` com explicação completa.
3. Usar **tag Amazon Associates ES** (a definir em variável de ambiente `PUBLIC_AMAZON_TAG`).
4. Nunca mascarar ou encurtar links de afiliado de forma que esconda o destino.
5. Nunca prometer preços — indicar "preço à data de X" e remeter para a Amazon para o valor atual.
6. Cumprir [Operating Agreement Amazon Associates ES](https://afiliados.amazon.es) — não publicar em email/PDF, não usar em ambientes fechados, etc.

## SEO

- **Schema.org JSON-LD** em todas as páginas relevantes: `Article`, `Review`, `Product`, `FAQPage`, `BreadcrumbList`.
- `<title>` e `meta description` únicos por página (validados em build).
- Open Graph + Twitter Cards com imagem dedicada.
- `hreflang="pt-PT"` no `<html>`.
- Sitemap automático (`@astrojs/sitemap`).
- URLs em minúsculas, com hífens, sem acentos: `/guias/enviar-ebooks-para-kindle`.
- Imagens com `alt` descritivo em PT-PT.

## Organização de conteúdo

Cada tipo vive numa *content collection* em `src/content/` com schema Zod:

- `modelos/` — ficha de cada Kindle (frontmatter: nome, preço_referencia, memoria, peso, ecra, resistencia_agua, etc.)
- `guias/` — guias evergreen (frontmatter: titulo, descricao, data_publicacao, data_revisao, categoria, tags)
- `reviews/` — reviews com rating 1-5 (frontmatter: produto, classificacao, pros, contras, veredito)
- `blog/` — notícias e atualizações
- `faq/` — perguntas e respostas estruturadas

## Imagens

### Fotos próprias / capturadas
- Pasta: `src/assets/imagens/{modelos,guias,blog}/` (otimizadas pelo Astro).
- Formato preferido: **AVIF** com fallback WebP.
- Dimensões hero: 1600×1200 (modelos) · 1600×900 (guias).

### Imagens de produtos Amazon
Usamos o componente [`ImagemProduto`](src/components/afiliados/ImagemProduto.astro) que aceita um **ASIN** e renderiza a imagem oficial via **Amazon Image Widget** (endpoint `ws-eu.amazon-adsystem.com`, ferramenta oficial do programa Associates). Se o widget falhar, cai para `m.media-amazon.com/images/P/{ASIN}.01._SCLZZZZZZZ_.jpg` (imagem pública do catálogo).

**Uso no MDX**:
```mdx
import ImagemProduto from '@components/afiliados/ImagemProduto.astro';

<ImagemProduto asin="B0CFPWLGF2" alt="Kindle Paperwhite" marketplace="es" />
```

**Uso no ModeloLayout**: basta preencher o campo `asin` no frontmatter — a imagem aparece automaticamente.

### Encontrar o ASIN de um produto
1. Abrir a página do produto na Amazon (p. ex. amazon.es).
2. O URL tem `/dp/B0XXXXXXXX` — esses 10 caracteres (começam com B0) são o ASIN.
3. Verificar que é a versão correta (sem anúncios, preto, tamanho de memória pretendido).

### Legalidade
O programa Amazon Associates permite usar imagens oficiais dos produtos que promovemos, desde que através de ferramentas oficiais (widgets, SiteStripe, PA-API). Nunca fazer download e rehospedar imagens Amazon.

### Open Graph
- `public/og/` para imagens OG (1200×630).
- Sempre `alt` descritivo em PT-PT.

## O que **evitar**

- Reviews de produtos que não testámos de facto.
- Afirmações sobre preços sem data.
- Links para ebooks pirateados ou métodos de remoção de DRM para distribuir conteúdo.
- Brasileirismos (ver secção de idioma).
- Cookies de tracking sem consentimento — escolhemos analytics sem cookies precisamente para isto.
- Dependências JS pesadas — manter o site rápido (Lighthouse ≥95 em Performance).

## Legal

- Página de privacidade compatível com RGPD.
- Termos de utilização.
- Contacto visível (email).
- Indicação de que não somos associados oficiais da Amazon.

## Notas para o Claude

- Toda a comunicação com o utilizador é em **PT-PT**.
- Ao gerar conteúdo, seguir rigorosamente as convenções de idioma acima.
- Antes de adicionar um novo tipo de conteúdo, atualizar `src/content/config.ts` com o schema Zod correspondente.
- Confirmar com o utilizador antes de: instalar dependências novas, alterar a stack, publicar/fazer deploy, ou adicionar scripts que consumam APIs externas pagas.
- Não inventar preços, especificações técnicas nem disponibilidade — quando em dúvida, marcar com `TODO: confirmar` no conteúdo.
