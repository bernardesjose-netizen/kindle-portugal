/**
 * URLs de imagem/produto da Creators API; nunca guarda a fotografia.
 * Credenciais v3.2 EU: apenas secrets do Cloudflare, sem valores no repositório.
 * Pedido conforme scripts/testar-creators-api.mjs e documentação oficial:
 * https://affiliate-program.amazon.com/creatorsapi/docs/en-us/get-started/using-curl
 * https://affiliate-program.amazon.com/creatorsapi/docs/en-us/api-reference/resources/images
 * Cache só do URL por 1 hora (limite contratual: 24 horas):
 * https://afiliados.amazon.es/help/operating/policies
 * Ao integrar, a imagem deve ligar à página Amazon do mesmo ASIN e site/tag.
 */

interface Env {
 CREATORS_CLIENT_ID?: string;
 CREATORS_CLIENT_SECRET?: string;
}

interface Context {
 request: Request;
 env: Env;
 params: Record<string, string | string[]>;
 waitUntil(promise: Promise<unknown>): void;
}

interface Token {
 clientId: string;
 value: string;
 expiresAt: number;
}

interface Product {
 imageUrl?: string;
 detailPageURL: string;
 expiresAt: number;
}

const ASIN_BATCHES: string[][] = [
 ['B0G4SHH6YH', 'B0CFPWLGF2', 'B0CM7ZXQWC', 'B0C4LSRTYT',
  'B07FRPXF44', 'B000JL2CAG', 'B08VD632WJ', '9897228411'],
 ['B009CB1IG8', 'B01DA0YCJQ', 'B083N54TYR', 'B0FDKCKKJM', 'B0G3YRH2B8', 'B0FY4SSSF6'],
 ['B0GF8H6XYW', 'B0GKWW7SDZ', 'B0GYVBC3KF', 'B00B7NPRY8',
  'B0F5P8TBRQ', 'B0FGZYTRP1', 'B0FDPHPWQY'],
];
const TAGS = {
 kindle: 'portukcom_site-21',
 'mochila-pt': 'mochilapt-21',
 'mochila-es': 'comp_mochilaes-21',
} as const;
type Site = keyof typeof TAGS;
const TOKEN_URL = 'https://api.amazon.co.uk/auth/o2/token';
const ITEMS_URL = 'https://creatorsapi.amazon/catalog/v1/getItems';
const MARKETPLACE = 'www.amazon.es';
const URL_TTL_SECONDS = 3600;
const PRODUCT_ORIGINS = new Set(['https://mochiladeemergencia.pt', 'https://kindleportugal.com']);

// Estado efémero do isolate: não vai para Cache API, disco, resposta ou logs.
let token: Token | undefined;
let pendingToken: { clientId: string; promise: Promise<Token> } | undefined;
const pendingBatches = new Map<string, Promise<Record<string, Product>>>();
let catalogQueue: Promise<unknown> = Promise.resolve();
let lastCatalogStart = 0;

function reply(status: number, text: string, extra: HeadersInit = {}): Response {
 return new Response(text, {
  status,
  headers: {
   'Content-Type': 'text/plain; charset=utf-8',
   'Cache-Control': 'no-store',
   'X-Robots-Tag': 'noindex, nofollow',
   ...extra,
  },
 });
}

function imageUrl(value: unknown): string | undefined {
 if (typeof value !== 'string' || value.trim() !== value) return;
 try {
  const url = new URL(value);
  if (url.protocol === 'https:' && url.hostname === 'm.media-amazon.com'
   && !url.port && !url.username && !url.password && url.pathname.startsWith('/images/')) {
   return value;
  }
 } catch { /* Dados inválidos nunca passam para Location. */ }
}

function productUrl(value: unknown, asin: string, site: Site): string | undefined {
 if (typeof value !== 'string' || value.trim() !== value || /[\u0000-\u0020\u007f]/.test(value)) return;
 try {
  const url = new URL(value);
  if (url.protocol === 'https:' && url.hostname === 'www.amazon.es'
   && !url.port && !url.username && !url.password && !url.hash
   && url.pathname === `/dp/${asin}` && url.searchParams.getAll('tag').length === 1
   && url.searchParams.get('tag') === TAGS[site]) {
   return value; // Preservar todos os parâmetros e a ordem devolvidos pela API.
  }
 } catch { /* Um URL inválido nunca passa para Location. */ }
}

function productResponse(url: string, origin: string | null): Response {
 return new Response(JSON.stringify({ url }), { headers: {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'private, max-age=60, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow',
  Vary: 'Origin',
  ...(origin && PRODUCT_ORIGINS.has(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
 } });
}

function productFallback(asin: string, site: Site, origin: string | null): Response {
 return productResponse(`https://www.amazon.es/dp/${asin}?tag=${TAGS[site]}`, origin);
}

function redirect(url: string): Response {
 return reply(302, '', {
  Location: url,
  'Cache-Control': 'public, max-age=60, s-maxage=60, must-revalidate',
 });
}

type Stage = 'oauth' | 'catalog';

// Só identificadores públicos documentados; nunca mensagens ou valores livres.
const SAFE_ERRORS = new Set([
 'UnauthorizedException', 'ValidationException', 'AccessDeniedException',
 'ResourceNotFoundException', 'ThrottleException', 'InternalServerException',
 'UnknownOperation', 'CannotParse', 'FieldValidationFailed', 'InvalidAssociate',
 'InvalidPartnerTag', 'AssociateNotEligible', 'MissingClaim', 'MissingKeyId',
 'UnsupportedClient', 'InvalidClient', 'MissingCredential', 'TokenExpired', 'InvalidToken', 'Other',
 'invalid_request', 'invalid_client', 'invalid_scope', 'invalid_grant',
 'unauthorized_client', 'unsupported_grant_type', 'access_denied', 'server_error',
 'temporarily_unavailable',
]);

function logFailure(stage: Stage, status: number | string, data?: unknown): void {
 const fields: Record<string, string | number> = { stage, status };
 if (data && typeof data === 'object' && !Array.isArray(data)) {
  const body = data as Record<string, unknown>;
  const safe = (value: unknown): value is string => typeof value === 'string' && SAFE_ERRORS.has(value);
  if (safe(body.type)) fields.type = body.type;
  if (safe(body.reason)) fields.reason = body.reason;
  if (safe(body.error)) fields.code = body.error;
  if (Array.isArray(body.errors)) {
   const partial = body.errors.find((entry) => entry && typeof entry === 'object' && safe(entry.code));
   if (partial) fields.code = partial.code;
  }
 }
 // Logs privados Cloudflare: só campos/códigos fechados, sem corpos/URLs/segredos.
 console.warn(fields);
}

async function post(stage: Stage, url: string, body: unknown, headers: HeadersInit = {}): Promise<{
 ok: boolean; status: number; data: unknown;
}> {
 const controller = new AbortController();
 const timeout = setTimeout(() => controller.abort(), 8000);
 let receivedStatus: number | undefined;
 try {
  const response = await fetch(url, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json', ...headers },
   body: JSON.stringify(body),
   redirect: 'manual', // Workers suporta manual/follow; 3xx não é seguido.
   signal: controller.signal,
  });
  receivedStatus = response.status;
  // Inclui a leitura no timeout; de erros só saem códigos da lista fechada.
  const data: unknown = await response.json().catch(() => undefined);
  if (!response.ok) logFailure(stage, response.status, data);
  return { ok: response.ok, status: response.status, data };
 } catch {
  logFailure(stage, receivedStatus === undefined ? 'request_failed' : 'invalid_response');
  throw new Error('Amazon request unavailable');
 } finally {
  clearTimeout(timeout);
 }
}

async function accessToken(clientId: string, clientSecret: string): Promise<string> {
 if (token && token.expiresAt <= Date.now()) token = undefined;
 if (token?.clientId === clientId) return token.value;
 if (pendingToken?.clientId === clientId) return (await pendingToken.promise).value;

 const promise = (async (): Promise<Token> => {
  const response = await post('oauth', TOKEN_URL, {
   grant_type: 'client_credentials',
   client_id: clientId,
   client_secret: clientSecret,
   scope: 'creatorsapi::default',
  });
  if (!response.ok) throw new Error('Token unavailable');
  const body = response.data as { access_token?: unknown; expires_in?: unknown };
  const lifetime = Number(body?.expires_in);
  if (typeof body?.access_token !== 'string' || !body.access_token
   || !Number.isFinite(lifetime) || lifetime <= 0) {
   logFailure('oauth', 'invalid_response', body);
   throw new Error('Invalid token');
  }
  token = {
   clientId,
   value: body.access_token,
   expiresAt: Date.now() + Math.max(0, lifetime - 60) * 1000,
  };
  return token;
 })();
 pendingToken = { clientId, promise };
 try {
  return (await promise).value;
 } finally {
  if (pendingToken?.promise === promise) pendingToken = undefined;
 }
}

function cacheKey(origin: string, asin: string, site: Site): Request {
 return new Request(`${origin}/api/amazon-imagem/${asin}?site=${site}`);
}

async function loadBatch(clientId: string, clientSecret: string, site: Site, origin: string, batch: string[], cache?: Cache): Promise<Record<string, Product>> {
 const key = `${clientId}:${site}:${batch[0]}`;
 const existing = pendingBatches.get(key);
 if (existing) return existing;

 const promise = (async (): Promise<Record<string, Product>> => {
  const bearer = await accessToken(clientId, clientSecret);
  // O lote de ASINs conta como uma transação. Limitar também outros sites
  // no mesmo isolate a1pedido/1,1s; não é um limitador global entrePOPs.
  const job = catalogQueue.then(async () => {
   const delay = Math.max(0, lastCatalogStart + 1100 - Date.now());
   if (delay) await new Promise<void>((resolve) => setTimeout(resolve, delay));
   lastCatalogStart = Date.now();
   return post('catalog', ITEMS_URL, {
    itemIds: batch,
    itemIdType: 'ASIN',
    marketplace: MARKETPLACE,
    partnerTag: TAGS[site],
    resources: ['images.primary.large'],
   }, { Authorization: `Bearer ${bearer}`, 'x-marketplace': MARKETPLACE });
  });
  catalogQueue = job.then(() => undefined, () => undefined);
  const response = await job;
  if (!response.ok) {
   if (response.status === 401 && token?.value === bearer) token = undefined;
   throw new Error('Catalog unavailable');
  }
  const body = response.data as {
   itemsResult?: { items?: { asin?: string; detailPageURL?: unknown; images?: { primary?: { large?: { url?: unknown } } } }[] };
  };
  const items = body?.itemsResult?.items;
  const products: Record<string, Product> = {};
  if (Array.isArray(items)) {
   for (const item of items) {
    if (!item?.asin || !batch.includes(item.asin)) continue;
    const detailPageURL = productUrl(item.detailPageURL, item.asin, site);
    if (!detailPageURL) continue;
    products[item.asin] = {
     imageUrl: imageUrl(item.images?.primary?.large?.url),
     detailPageURL,
     expiresAt: Date.now() + URL_TTL_SECONDS * 1000,
    };
   }
  }
  if (!Object.keys(products).length) logFailure('catalog', 'invalid_response', body);
  if (cache) {
   // Resolver só depois das escritas: o próximo pedido não abre outro batch
   // entre o fim do POST e a disponibilização dos outros ASINs na cache.
   await Promise.all(Object.entries(products).map(([asin, product]) => cache.put(
    cacheKey(origin, asin, site),
    new Response(JSON.stringify(product), { headers: {
     'Content-Type': 'application/json',
     'Cache-Control': `max-age=${URL_TTL_SECONDS}`,
     'X-Robots-Tag': 'noindex, nofollow',
    } }),
   ).catch(() => undefined)));
  }
  return products; // Só dados simples; nunca partilhar Response/streams.
 })();
 pendingBatches.set(key, promise);
 try {
  return await promise;
 } finally {
  if (pendingBatches.get(key) === promise) pendingBatches.delete(key);
 }
}

export async function onRequest(context: Context): Promise<Response> {
 const { request, env, params } = context;
 if (request.method !== 'GET') return reply(405, 'Method not allowed', { Allow: 'GET' });

 const asin = params.asin;
 const url = new URL(request.url);
 const requestedSite = url.searchParams.get('site');
 const route = url.pathname.match(/^\/api\/amazon-(imagem|produto)\/([A-Z0-9]{10})\/?$/);
 const batch = typeof asin === 'string' && ASIN_BATCHES.find(items => items.includes(asin));
 if (typeof asin !== 'string' || !batch
  || !route || route[2] !== asin
  || !requestedSite || !Object.hasOwn(TAGS, requestedSite) || url.searchParams.getAll('site').length !== 1
  || [...url.searchParams.keys()].some((key) => key !== 'site')) {
  return reply(404, 'Not found');
 }
 const site = requestedSite as Site;
 const isProduct = route[1] === 'produto';
 const origin = request.headers.get('Origin');
 if (isProduct && origin && !PRODUCT_ORIGINS.has(origin)) return reply(403, 'Origin not allowed');
 const unavailable = () => isProduct ? productFallback(asin, site, origin) : reply(503, 'Image unavailable', { 'Retry-After': '60' });
 const clientId = env.CREATORS_CLIENT_ID;
 const clientSecret = env.CREATORS_CLIENT_SECRET;
 if (!clientId || !clientSecret) return unavailable();

 // Imagem e produto usam o mesmo par de URLs e prazo por ASIN/site.
 const key = cacheKey(url.origin, asin, site);
 let cache: Cache | undefined;
 try {
  cache = await caches.open('creators-product-urls-v2');
  const cached = await cache.match(key);
  if (cached) {
   const entry = await cached.json() as Product;
   const detail = productUrl(entry?.detailPageURL, asin, site);
   if (detail && typeof entry.expiresAt === 'number' && entry.expiresAt > Date.now()
    && entry.expiresAt <= Date.now() + URL_TTL_SECONDS * 1000) {
    if (isProduct) return productResponse(detail, origin);
    const image = imageUrl(entry.imageUrl);
    return image ? redirect(image) : unavailable();
   }
  }
 } catch { /* Uma falha da cache permite consultar a API normalmente. */ }

 try {
  const products = await loadBatch(clientId, clientSecret, site, url.origin, batch, cache);
  const product = products[asin];
  if (!product) return unavailable();
  if (isProduct) return productResponse(product.detailPageURL, origin);
  return product.imageUrl ? redirect(product.imageUrl) : unavailable();
 } catch {
  // A resposta pública nunca expõe diagnóstico, corpos, tokens ou credenciais.
  return unavailable();
 }
}
