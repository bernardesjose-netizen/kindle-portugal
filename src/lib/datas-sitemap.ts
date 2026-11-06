/**
 * Datas de última revisão de cada página de conteúdo, para o `<lastmod>`
 * do sitemap. Lê o frontmatter dos MDX diretamente (o astro.config corre
 * antes das content collections): usa `data_revisao` e, sem ela,
 * `data_publicacao`. O slug é o nome do ficheiro, como nas rotas.
 */
import fs from 'node:fs';
import path from 'node:path';

const PREFIXOS: Record<string, string> = {
  blog: '/blog',
  guias: '/guias',
  faq: '/faq',
  modelos: '/modelos',
  boox: '/modelos-boox',
  'tres-livros': '/tres-livros',
  'produtos-estrela': '/produtos-estrela',
};

const campo = (frontmatter: string, nome: string) =>
  frontmatter.match(new RegExp(`^${nome}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1];

export function datasDeRevisao(raiz = 'src/content'): Map<string, string> {
  const datas = new Map<string, string>();
  for (const [colecao, prefixo] of Object.entries(PREFIXOS)) {
    const pasta = path.join(raiz, colecao);
    if (!fs.existsSync(pasta)) continue;
    for (const ficheiro of fs.readdirSync(pasta)) {
      if (!/\.mdx?$/.test(ficheiro)) continue;
      const texto = fs.readFileSync(path.join(pasta, ficheiro), 'utf8');
      const frontmatter = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      const data = campo(frontmatter, 'data_revisao') ?? campo(frontmatter, 'data_publicacao');
      if (data) datas.set(`${prefixo}/${ficheiro.replace(/\.mdx?$/, '')}`, data);
    }
  }
  return datas;
}
