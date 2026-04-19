const env = import.meta.env;

export type Marketplace = 'es' | 'com' | 'uk' | 'de' | 'fr' | 'it' | 'br';

const FALLBACK = env.PUBLIC_AMAZON_TAG ?? '';

const TAGS: Record<Marketplace, string> = {
  es: env.PUBLIC_AMAZON_TAG_ES ?? FALLBACK,
  com: env.PUBLIC_AMAZON_TAG_COM ?? FALLBACK,
  uk: env.PUBLIC_AMAZON_TAG_UK ?? FALLBACK,
  de: env.PUBLIC_AMAZON_TAG_DE ?? FALLBACK,
  fr: env.PUBLIC_AMAZON_TAG_FR ?? FALLBACK,
  it: env.PUBLIC_AMAZON_TAG_IT ?? FALLBACK,
  br: env.PUBLIC_AMAZON_TAG_BR ?? FALLBACK,
};

export const MARKETPLACES: {
  id: Marketplace;
  etiqueta: string;
  host: string;
  bandeira: string;
  moeda: string;
}[] = [
  { id: 'es', etiqueta: 'Amazon Espanha', host: 'www.amazon.es', bandeira: '🇪🇸', moeda: 'EUR' },
  { id: 'com', etiqueta: 'Amazon EUA', host: 'www.amazon.com', bandeira: '🇺🇸', moeda: 'USD' },
  { id: 'uk', etiqueta: 'Amazon Reino Unido', host: 'www.amazon.co.uk', bandeira: '🇬🇧', moeda: 'GBP' },
  { id: 'de', etiqueta: 'Amazon Alemanha', host: 'www.amazon.de', bandeira: '🇩🇪', moeda: 'EUR' },
  { id: 'fr', etiqueta: 'Amazon França', host: 'www.amazon.fr', bandeira: '🇫🇷', moeda: 'EUR' },
  { id: 'it', etiqueta: 'Amazon Itália', host: 'www.amazon.it', bandeira: '🇮🇹', moeda: 'EUR' },
  { id: 'br', etiqueta: 'Amazon Brasil', host: 'www.amazon.com.br', bandeira: '🇧🇷', moeda: 'BRL' },
];

const HOST_TO_MARKET: Record<string, Marketplace> = {
  'amazon.es': 'es',
  'amazon.com': 'com',
  'amazon.co.uk': 'uk',
  'amazon.de': 'de',
  'amazon.fr': 'fr',
  'amazon.it': 'it',
  'amazon.com.br': 'br',
};

function detetarMarketplace(hostname: string): Marketplace | null {
  const h = hostname.toLowerCase().replace(/^www\./, '');
  for (const [host, market] of Object.entries(HOST_TO_MARKET)) {
    if (h === host || h.endsWith('.' + host)) return market;
  }
  return null;
}

export function tagPara(marketplace: Marketplace): string {
  return TAGS[marketplace] ?? FALLBACK;
}

export function temTag(marketplace: Marketplace): boolean {
  return Boolean(TAGS[marketplace]);
}

/**
 * Adiciona o tracking ID correto ao URL Amazon, consoante o marketplace
 * detetado pelo hostname. Preserva todos os parâmetros existentes.
 */
export function urlAfiliado(url: string): string {
  try {
    const u = new URL(url);
    const market = detetarMarketplace(u.hostname);
    if (!market) return url;
    const tag = tagPara(market);
    if (!tag) return url;
    u.searchParams.set('tag', tag);
    return u.toString();
  } catch {
    return url;
  }
}

export function ehLinkAmazon(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return detetarMarketplace(u.hostname) !== null;
  } catch {
    return false;
  }
}

/**
 * Dado um ASIN, devolve URLs de produto para cada marketplace com tag.
 * Só inclui marketplaces onde existe tracking ID configurado.
 */
export function linksPorLojaDeAsin(asin: string): { id: Marketplace; url: string; etiqueta: string; bandeira: string }[] {
  return MARKETPLACES.filter((m) => temTag(m.id)).map((m) => {
    const u = new URL(`https://${m.host}/dp/${asin}`);
    u.searchParams.set('tag', tagPara(m.id));
    return { id: m.id, url: u.toString(), etiqueta: m.etiqueta, bandeira: m.bandeira };
  });
}

/**
 * Dado um termo de pesquisa, devolve URLs de pesquisa por marketplace.
 */
export function linksPorLojaDePesquisa(
  termo: string,
  opcoes: { categoria?: string } = {},
): { id: Marketplace; url: string; etiqueta: string; bandeira: string }[] {
  return MARKETPLACES.filter((m) => temTag(m.id)).map((m) => {
    const u = new URL(`https://${m.host}/s`);
    u.searchParams.set('k', termo);
    if (opcoes.categoria) u.searchParams.set('i', opcoes.categoria);
    u.searchParams.set('tag', tagPara(m.id));
    return { id: m.id, url: u.toString(), etiqueta: m.etiqueta, bandeira: m.bandeira };
  });
}
