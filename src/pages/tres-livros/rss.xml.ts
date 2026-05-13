import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@lib/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('tresLivros', ({ data }) => !data.rascunho)).sort(
    (a, b) => b.data.data_publicacao.valueOf() - a.data.data_publicacao.valueOf(),
  );

  return rss({
    title: `${SITE.nome} — Três Ebooks`,
    description:
      'Sugestões semanais de três ebooks em português europeu para qualquer leitor. Editoras portuguesas, autores nacionais, traduções PT-PT.',
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.titulo,
      description: p.data.descricao,
      pubDate: p.data.data_publicacao,
      link: `/tres-livros/${p.id}`,
      author: p.data.autor.nome,
    })),
    customData: `<language>pt-PT</language>`,
  });
}
