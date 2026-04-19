# Kindle Portugal

Site de divulgação de Kindle e ebooks em Portugal, em português europeu (PT-PT).

Ler [CLAUDE.md](./CLAUDE.md) para convenções de conteúdo, stack e regras de afiliação.

## Pré-requisitos

- Node.js LTS (≥ 20)
- npm (incluído no Node)

## Arranque

```bash
npm install
cp .env.example .env     # preencher PUBLIC_AMAZON_TAG, etc.
npm run dev
```

Abrir http://localhost:4321.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor local com HMR |
| `npm run build` | Build estático para `dist/` |
| `npm run preview` | Pré-visualizar o build |
| `npm run check` | Type-check e validação Astro |

## Estrutura

```
src/
├── content/        Collections editoriais (MDX + schemas Zod)
├── pages/          Rotas do site
├── layouts/        Layouts Astro reutilizáveis
├── components/     Componentes UI, SEO, afiliados
├── lib/            Utilitários (afiliados, formatação pt-PT)
└── styles/         CSS global + Tailwind
```

## Licença

Todos os direitos reservados. Conteúdo editorial © os autores.
