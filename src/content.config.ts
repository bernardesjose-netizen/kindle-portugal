import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const autor = z.object({
  nome: z.string(),
  url: z.string().url().optional(),
});

const seo = z.object({
  titulo_seo: z.string().max(65).optional(),
  descricao_seo: z.string().max(160).optional(),
  noindex: z.boolean().default(false),
});

const livroDestaque = z.object({
  asin: z
    .string()
    .regex(/^B0[A-Z0-9]{8}$/, 'ASIN inválido (deve começar por B0 e ter 10 caracteres)'),
  titulo: z.string(),
  autor: z.string(),
  editora: z.string(),
  ano: z.number().int().min(1900).optional(),
  marketplace: z.enum(['es', 'com', 'uk', 'de', 'fr', 'it']).default('es'),
  comentario: z.string().min(50).max(800),
});

const modelos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/modelos' }),
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      fabricante: z.string().default('Amazon'),
      ano_lancamento: z.number().int().min(2007),
      geracao: z.string().optional(),
      descricao_curta: z.string().max(200),
      preco_referencia_eur: z.number().positive().optional(),
      preco_data: z.coerce.date().optional(),
      url_amazon: z.string().url().optional(),
      asin: z.string().optional(),
      especificacoes: z.object({
        ecra_polegadas: z.number().positive(),
        ecra_ppi: z.number().int().positive(),
        ecra_cor: z.boolean().default(false),
        memoria_gb: z.number().int().positive(),
        peso_g: z.number().int().positive(),
        resistencia_agua: z.enum(['nenhuma', 'IPX7', 'IPX8']).default('nenhuma'),
        luz_frontal: z.boolean().default(true),
        luz_ajustavel_temperatura: z.boolean().default(false),
        carregamento: z.enum(['USB-C', 'Micro-USB']),
        bateria_semanas: z.number().int().positive().optional(),
        sem_publicidade: z.boolean().default(false),
        stylus_incluido: z.boolean().default(false),
      }),
      destaques: z.array(z.string()).max(6).default([]),
      pros: z.array(z.string()).default([]),
      contras: z.array(z.string()).default([]),
      veredito: z.string(),
      publico_alvo: z.array(z.string()).default([]),
      imagem_hero: image().optional(),
      imagem_hero_alt: z.string().optional(),
      data_publicacao: z.coerce.date(),
      data_revisao: z.coerce.date().optional(),
      rascunho: z.boolean().default(false),
      seo: seo.optional(),
    }),
});

const guias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guias' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descricao: z.string().max(200),
      categoria: z.enum([
        'comprar',
        'utilizar',
        'converter-e-enviar',
        'ebooks',
        'problemas',
        'comparacoes',
      ]),
      tags: z.array(z.string()).default([]),
      autor: autor,
      data_publicacao: z.coerce.date(),
      data_revisao: z.coerce.date().optional(),
      tempo_leitura_min: z.number().int().positive().optional(),
      imagem_hero: image().optional(),
      imagem_hero_alt: z.string().optional(),
      modelos_relacionados: z.array(z.string()).default([]),
      rascunho: z.boolean().default(false),
      seo: seo.optional(),
    }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      produto: z.string(),
      tipo: z.enum(['dispositivo', 'ebook', 'acessorio', 'servico']),
      classificacao: z.number().min(1).max(5),
      autor: autor,
      data_publicacao: z.coerce.date(),
      data_revisao: z.coerce.date().optional(),
      pros: z.array(z.string()).min(1),
      contras: z.array(z.string()).min(1),
      veredito: z.string(),
      preco_referencia_eur: z.number().positive().optional(),
      preco_data: z.coerce.date().optional(),
      url_amazon: z.string().url().optional(),
      imagem_hero: image().optional(),
      imagem_hero_alt: z.string().optional(),
      rascunho: z.boolean().default(false),
      seo: seo.optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descricao: z.string().max(200),
      autor: autor,
      data_publicacao: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      imagem_hero: image().optional(),
      imagem_hero_alt: z.string().optional(),
      rascunho: z.boolean().default(false),
      seo: seo.optional(),
    }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/faq' }),
  schema: z.object({
    pergunta: z.string(),
    categoria: z.enum(['geral', 'compra', 'utilizacao', 'ebooks', 'suporte']),
    ordem: z.number().int().default(100),
    data_revisao: z.coerce.date().optional(),
    rascunho: z.boolean().default(false),
  }),
});

const tresLivros = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tres-livros' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descricao: z.string().max(200),
      autor: autor,
      data_publicacao: z.coerce.date(),
      livros: z
        .array(livroDestaque)
        .length(3, 'A rubrica chama-se Três Livros — exatamente três'),
      tags: z.array(z.string()).default([]),
      imagem_hero: image().optional(),
      imagem_hero_alt: z.string().optional(),
      rascunho: z.boolean().default(false),
      seo: seo.optional(),
    }),
});

export const collections = { modelos, guias, reviews, blog, faq, tresLivros };
