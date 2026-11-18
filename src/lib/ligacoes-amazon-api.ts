/** Atualiza só metadados de ligações conhecidas. O href direto funciona sem JavaScript. */
const pedidos = new Map<string, { ate: number; resultado: Promise<string | null> }>();
const asinNoCaminho = (caminho: string) => caminho.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|$)/)?.[1];

function produtoValido(valor: unknown, asin: string, tag: string): valor is string {
 if (typeof valor !== 'string') return false;
 try {
  const url = new URL(valor);
  return url.protocol === 'https:' && (url.hostname === 'www.amazon.es' || url.hostname === 'amazon.es')
   && !url.port && !url.username && !url.password && asinNoCaminho(url.pathname) === asin
   && url.searchParams.getAll('tag').length === 1 && url.searchParams.get('tag') === tag;
 } catch { return false; }
}

async function obterProduto(endpoint: string, asin: string, tag: string): Promise<string | null> {
 const anterior = pedidos.get(endpoint);
 if (anterior && anterior.ate > Date.now()) return anterior.resultado;
 const resultado = (async () => {
  const controlador = new AbortController();
  const limite = setTimeout(() => controlador.abort(), 18000);
  try {
   const resposta = await fetch(endpoint, { credentials: 'omit', signal: controlador.signal });
   if (!resposta.ok || !resposta.headers.get('content-type')?.includes('application/json')) return null;
   const dados: unknown = await resposta.json();
   const url = dados && typeof dados === 'object' && 'url' in dados ? dados.url : undefined;
   return produtoValido(url, asin, tag) ? url : null;
  } catch { return null; }
  finally { clearTimeout(limite); }
 })();
 pedidos.set(endpoint, { ate: Date.now() + 3600000, resultado });
 const url = await resultado;
 if (!url) pedidos.delete(endpoint);
 return url;
}

export function atualizarLigacoesAmazonApi(endpointParaAsin: (asin: string) => string | null, tag: string): void {
 document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((ligacao) => {
  let asin: string | undefined;
  try { asin = asinNoCaminho(new URL(ligacao.href).pathname); } catch { return; }
  if (!asin || !produtoValido(ligacao.href, asin, tag)) return;
  const endpoint = endpointParaAsin(asin);
  if (!endpoint) return;
  ligacao.dataset.amazonProdutoApi = endpoint;
  void obterProduto(endpoint, asin, tag).then((url) => {
   if (url && ligacao.isConnected && ligacao.dataset.amazonProdutoApi === endpoint) ligacao.href = url;
  });
 });
}
