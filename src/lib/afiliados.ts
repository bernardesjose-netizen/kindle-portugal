const env = import.meta.env;

export type Marketplace = 'es' | 'com' | 'uk' | 'de' | 'fr' | 'it';

const FALLBACK = env.PUBLIC_AMAZON_TAG ?? '';

const TAGS: Record<Marketplace, string> = {
  es: env.PUBLIC_AMAZON_TAG_ES ?? FALLBACK,
  com: env.PUBLIC_AMAZON_TAG_COM ?? FALLBACK,
  uk: env.PUBLIC_AMAZON_TAG_UK ?? FALLBACK,
  de: env.PUBLIC_AMAZON_TAG_DE ?? FALLBACK,
  fr: env.PUBLIC_AMAZON_TAG_FR ?? FALLBACK,
  it: env.PUBLIC_AMAZON_TAG_IT ?? FALLBACK,
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
];

const HOST_TO_MARKET: Record<string, Marketplace> = {
  'amazon.es': 'es',
  'amazon.com': 'com',
  'amazon.co.uk': 'uk',
  'amazon.de': 'de',
  'amazon.fr': 'fr',
  'amazon.it': 'it',
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
 * Mapa de ASINs por marketplace. Útil para produtos (tipicamente dispositivos
 * Amazon) onde cada marketplace tem uma listagem diferente — um link /dp para
 * um ASIN Amazon.es num Amazon.co.uk devolve 404.
 *
 * Chave: ASIN primário (o que aparece em Amazon.es). Valor: overrides por
 * marketplace. Se o valor for `null` em vez de uma string, a função usa
 * pesquisa como fallback em vez de /dp.
 */
export const ASIN_POR_MARKET: Record<string, Partial<Record<Marketplace, string | null>>> = {
  // Kindle básico 11.ª gen (2024)
  B0CNV9F72P: {
    uk: 'B0CP31JRLK',
    de: null, // ASIN DE desconhecido — cai para pesquisa
    fr: null,
    it: null,
    com: null,
  },
  // Kindle Paperwhite 12.ª gen 2024
  B0CFPWLGF2: {
    uk: null,
    de: null,
    fr: null,
    it: null,
    com: null,
  },
  // Kindle Colorsoft
  B0CGVSKR1G: {
    uk: null,
    de: null,
    fr: null,
    it: null,
    com: null,
  },
  // Kindle Scribe
  B0DVQQGMCZ: {
    uk: null,
    de: null,
    fr: null,
    it: null,
    com: null,
  },
};

/**
 * Dado um ASIN primário e um marketplace, devolve o ASIN correspondente
 * nesse marketplace (se for o mesmo ou se existir override), ou `null` se
 * não houver ASIN válido conhecido.
 */
export function asinPara(asinPrimario: string, marketplace: Marketplace): string | null {
  const overrides = ASIN_POR_MARKET[asinPrimario];
  if (!overrides) {
    // Sem overrides → ASIN partilhado em todos os markets (caso de
    // acessórios de terceiros, Kobo, etc.)
    return asinPrimario;
  }
  if (marketplace in overrides) {
    const v = overrides[marketplace];
    return v === null ? null : (v as string);
  }
  // Marketplace não listado nos overrides → assume que o ASIN primário serve
  return asinPrimario;
}

/**
 * Dado um ASIN, devolve URLs de produto para cada marketplace com tag.
 * Só inclui marketplaces onde existe tracking ID configurado.
 *
 * Para marketplaces onde o ASIN é sabidamente inválido (ver ASIN_POR_MARKET)
 * e `pesquisaAlternativa` é fornecido, gera URL de pesquisa em vez de /dp,
 * preservando a tag do marketplace. Se nenhum dos dois estiver disponível,
 * omite o marketplace.
 */
export function linksPorLojaDeAsin(
  asin: string,
  opcoes: { pesquisaAlternativa?: string; categoriaPesquisa?: string } = {},
): { id: Marketplace; url: string; etiqueta: string; bandeira: string }[] {
  const { pesquisaAlternativa, categoriaPesquisa } = opcoes;
  const resultado: { id: Marketplace; url: string; etiqueta: string; bandeira: string }[] = [];

  for (const m of MARKETPLACES) {
    if (!temTag(m.id)) continue;

    const asinNesteMercado = asinPara(asin, m.id);
    let url: URL;

    if (asinNesteMercado) {
      url = new URL(`https://${m.host}/dp/${asinNesteMercado}`);
    } else if (pesquisaAlternativa) {
      url = new URL(`https://${m.host}/s`);
      url.searchParams.set('k', pesquisaAlternativa);
      if (categoriaPesquisa) url.searchParams.set('i', categoriaPesquisa);
    } else {
      // Sem ASIN válido nem pesquisa alternativa → omite este marketplace
      continue;
    }

    url.searchParams.set('tag', tagPara(m.id));
    resultado.push({ id: m.id, url: url.toString(), etiqueta: m.etiqueta, bandeira: m.bandeira });
  }

  return resultado;
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
