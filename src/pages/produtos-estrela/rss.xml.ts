import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@lib/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('produtosEstrela', ({ data }) => !data.rascunho)).sort(
    (a, b) => b.data.data_publicacao.valueOf() - a.data.data_publicacao.valueOf(),
  );

  return rss({
    title: `${SITE.nome} — Produtos Estrela`,
    description:
      'Oportunidades verificadas em leitores e acessórios: Kindle na Amazon, Kobo e BOOX na Worten e na Wook. Preços confirmados com data.',
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.titulo,
      description: p.data.descricao,
      pubDate: p.data.data_publicacao,
      link: `/produtos-estrela/${p.id}`,
      author: p.data.autor.nome,
    })),
    customData: `<language>pt-PT</language>`,
  });
}
