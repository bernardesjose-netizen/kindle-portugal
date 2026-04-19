import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@lib/site';

export async function GET(context: APIContext) {
  const artigos = (await getCollection('blog', ({ data }) => !data.rascunho)).sort(
    (a, b) => b.data.data_publicacao.valueOf() - a.data.data_publicacao.valueOf(),
  );

  return rss({
    title: `${SITE.nome} — Blog`,
    description: SITE.descricao,
    site: context.site ?? SITE.url,
    items: artigos.map((a) => ({
      title: a.data.titulo,
      description: a.data.descricao,
      pubDate: a.data.data_publicacao,
      link: `/blog/${a.id}`,
      author: a.data.autor.nome,
    })),
    customData: `<language>pt-PT</language>`,
  });
}
