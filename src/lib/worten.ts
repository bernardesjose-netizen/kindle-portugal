/**
 * Helpers para links de afiliado Worten (programa Awin).
 *
 * Programa: Worten PT na Awin (anunciante 99897). O ID de afiliado é
 * configurável via `PUBLIC_AWIN_AFFID`; cai para o ID do site quando a
 * variável não está definida (útil em dev e build local).
 *
 * O link Awin mantém o destino visível no parâmetro `ued`, por isso não
 * esconde a página da Worten para onde o leitor vai.
 *
 * Nota: lê `process.env` como alternativa porque o plugin remark corre em
 * Node durante o build, antes de o Vite injetar `import.meta.env`.
 */

const env: Record<string, string | undefined> =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env) ||
  (typeof process !== 'undefined' ? process.env : {});

export const AWIN_MID_WORTEN = '99897';
export const AWIN_AFFID: string = env.PUBLIC_AWIN_AFFID || '2950455';

export function ehLinkWorten(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const h = new URL(url).hostname.toLowerCase();
    return h === 'worten.pt' || h.endsWith('.worten.pt');
  } catch {
    return false;
  }
}

/**
 * Encaminha um URL da Worten pelo link de afiliado Awin.
 * URLs que não sejam da Worten (ou já sejam da Awin) são devolvidos tal qual.
 *
 * @example
 *   linkWorten('https://www.worten.pt/livros/e-reader-e-acessorios/e-reader/kindle')
 *   // → 'https://www.awin1.com/cread.php?awinmid=99897&awinaffid=2950455&ued=https%3A%2F%2Fwww.worten.pt%2F...'
 */
export function linkWorten(urlWorten: string, affid: string = AWIN_AFFID): string {
  if (!ehLinkWorten(urlWorten)) return urlWorten;
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_MID_WORTEN}&awinaffid=${affid}&ued=${encodeURIComponent(urlWorten)}`;
}

/** Páginas da Worten usadas em vários sítios do site. */
export const WORTEN = {
  /** Categoria Kindle (todos os Kindle à venda na Worten). */
  kindles: 'https://www.worten.pt/livros/e-reader-e-acessorios/e-reader/kindle',
  /** Kindle 2026 de 6″, 16 GB, grafite (versão com publicidade). */
  kindle2026Grafite: 'https://www.worten.pt/produtos/amazon-kindle-2026-com-ads-6-16-gb-grafite-9026977',
  /** Kindle 2026 de 6″, 16 GB, roxo ube (versão com publicidade). */
  kindle2026Roxo: 'https://www.worten.pt/produtos/amazon-kindle-2026-com-ads-6-16-gb-roxo-ube-9026978',
  /** Anúncio da Worten sobre a chegada dos novos Kindle. */
  novidade: 'https://www.worten.pt/novidades-tecnologicas/novos-kindle-modelos-precos-novidades',
  /** Todos os leitores de ebooks (Kindle, Kobo, BOOX). */
  ereaders: 'https://www.worten.pt/livros/e-reader-e-acessorios/e-reader',
} as const;
