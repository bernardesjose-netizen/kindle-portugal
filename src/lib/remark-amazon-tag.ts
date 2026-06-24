/**
 * Plugin remark que reescreve automaticamente todos os links markdown
 * para a Amazon, aplicando a tag de afiliado do marketplace correto.
 *
 * Aplica-se a construções markdown tipo `[texto](https://www.amazon.es/...)`
 * nos MDX — que de outra forma seriam servidos sem tag (zero comissão).
 * Links JSX com <a href=...> ou <LinkAmazon> não passam aqui (não são
 * nós markdown), mas esses já usam urlAfiliado manualmente.
 *
 * Nota: lê as tags de process.env em vez de import.meta.env porque corre
 * em Node durante o build, antes de Vite injetar os env vars no bundle.
 */

type Marketplace = 'es' | 'com' | 'uk' | 'de' | 'fr' | 'it';

const HOST_TO_MARKET: Record<string, Marketplace> = {
  'amazon.es': 'es',
  'amazon.com': 'com',
  'amazon.co.uk': 'uk',
  'amazon.de': 'de',
  'amazon.fr': 'fr',
  'amazon.it': 'it',
};

// Reserva embutida para o marketplace ES — ver nota em src/lib/afiliados.ts.
const TAG_ES_FALLBACK = 'compleitdee04-21';

function tagPara(m: Marketplace): string {
  const env = process.env;
  const fallback = env.PUBLIC_AMAZON_TAG ?? '';
  const especificas: Record<Marketplace, string | undefined> = {
    es: env.PUBLIC_AMAZON_TAG_ES || env.PUBLIC_AMAZON_TAG || TAG_ES_FALLBACK,
    com: env.PUBLIC_AMAZON_TAG_COM,
    uk: env.PUBLIC_AMAZON_TAG_UK,
    de: env.PUBLIC_AMAZON_TAG_DE,
    fr: env.PUBLIC_AMAZON_TAG_FR,
    it: env.PUBLIC_AMAZON_TAG_IT,
  };
  return especificas[m] || fallback;
}

function detetarMarketplace(hostname: string): Marketplace | null {
  const h = hostname.toLowerCase().replace(/^www\./, '');
  for (const [host, market] of Object.entries(HOST_TO_MARKET)) {
    if (h === host || h.endsWith('.' + host)) return market;
  }
  return null;
}

function aplicarTag(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    const market = detetarMarketplace(u.hostname);
    if (!market) return urlStr;
    const tag = tagPara(market);
    if (!tag) return urlStr;
    u.searchParams.set('tag', tag);
    return u.toString();
  } catch {
    return urlStr;
  }
}

interface MdastNode {
  type: string;
  url?: string;
  children?: MdastNode[];
}

function reescreverLinks(node: MdastNode): void {
  if (node.type === 'link' && node.url) {
    try {
      const host = new URL(node.url).hostname;
      if (detetarMarketplace(host)) {
        node.url = aplicarTag(node.url);
      }
    } catch {
      // URL inválido — ignorar
    }
  }
  if (node.children) {
    for (const filho of node.children) reescreverLinks(filho);
  }
}

export function remarkAmazonTag() {
  return (tree: MdastNode) => {
    reescreverLinks(tree);
  };
}
