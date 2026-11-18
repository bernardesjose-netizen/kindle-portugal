/**
 * URL de imagem da Creators API; nunca transfere nem guarda a fotografia.
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

const ASINS = new Set([
 'B0G4SHH6YH', 'B0CFPWLGF2', 'B0CM7ZXQWC', 'B0C4LSRTYT',
 'B07FRPXF44', 'B000JL2CAG', 'B08VD632WJ',
]);
const TAGS = {
 kindle: 'portukcom_site-21',
 'mochila-pt': 'mochilapt-21',
 'mochila-es': 'comp_mochilaes-21',
} as const;
const TOKEN_URL = 'https://api.amazon.co.uk/auth/o2/token';
const ITEMS_URL = 'https://creatorsapi.amazon/catalog/v1/getItems';
const MARKETPLACE = 'www.amazon.es';
const URL_TTL_SECONDS = 3600;

// Estado efémero do isolate: não vai para Cache API, disco, resposta ou logs.
let token: Token | undefined;
let pendingToken: { clientId: string; promise: Promise<Token> } | undefined;

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
 if (typeof value !== 'string') return;
 try {
  const url = new URL(value);
  if (url.protocol === 'https:' && url.hostname === 'm.media-amazon.com'
   && !url.port && !url.username && !url.password && url.pathname.startsWith('/images/')) {
   return url.href;
  }
 } catch { /* Dados inválidos nunca passam para Location. */ }
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

export async function onRequest(context: Context): Promise<Response> {
 const { request, env, params } = context;
 if (request.method !== 'GET') return reply(405, 'Method not allowed', { Allow: 'GET' });

 const asin = params.asin;
 const url = new URL(request.url);
 const site = url.searchParams.get('site');
 if (typeof asin !== 'string' || !ASINS.has(asin)
  || !/^\/api\/amazon-imagem\/[A-Z0-9]{10}\/?$/.test(url.pathname)
  || !site || !Object.hasOwn(TAGS, site) || url.searchParams.getAll('site').length !== 1
  || [...url.searchParams.keys()].some((key) => key !== 'site')) {
  return reply(404, 'Not found');
 }
 const clientId = env.CREATORS_CLIENT_ID;
 const clientSecret = env.CREATORS_CLIENT_SECRET;
 if (!clientId || !clientSecret) return reply(503, 'Image unavailable', { 'Retry-After': '60' });

 // Chave canónica: apenas o ASIN e site validados, sem parâmetros arbitrários.
 const key = new Request(`${url.origin}/api/amazon-imagem/${asin}?site=${site}`);
 let cache: Cache | undefined;
 try {
  cache = await caches.open('creators-image-urls-v1');
  const cached = await cache.match(key);
  if (cached) {
   const entry = await cached.json() as { url?: unknown; expiresAt?: unknown };
   const officialUrl = imageUrl(entry.url);
   if (officialUrl && typeof entry.expiresAt === 'number' && entry.expiresAt > Date.now()
    && entry.expiresAt <= Date.now() + URL_TTL_SECONDS * 1000) return redirect(officialUrl);
  }
 } catch { /* Uma falha da cache permite consultar a API normalmente. */ }

 try {
  const bearer = await accessToken(clientId, clientSecret);
  const response = await post('catalog', ITEMS_URL, {
   itemIds: [asin],
   itemIdType: 'ASIN',
   marketplace: MARKETPLACE,
   partnerTag: TAGS[site as keyof typeof TAGS],
   resources: ['images.primary.large'],
  }, {
   Authorization: `Bearer ${bearer}`,
   'x-marketplace': MARKETPLACE,
  });
  if (!response.ok) {
   if (response.status === 401) token = undefined;
   return reply(503, 'Image unavailable', { 'Retry-After': '60' });
  }
  const body = response.data as {
   itemsResult?: { items?: { asin?: string; images?: { primary?: { large?: { url?: unknown } } } }[] };
  };
  const items = body?.itemsResult?.items;
  const item = Array.isArray(items) ? items.find((candidate) => candidate?.asin === asin) : undefined;
  const officialUrl = imageUrl(item?.images?.primary?.large?.url);
  if (!officialUrl) {
   logFailure('catalog', 'image_unavailable', body);
   return reply(503, 'Image unavailable', { 'Retry-After': '60' });
  }

  if (cache) {
   const entry = new Response(JSON.stringify({
    url: officialUrl,
    expiresAt: Date.now() + URL_TTL_SECONDS * 1000,
   }), { headers: {
    'Content-Type': 'application/json',
    'Cache-Control': `max-age=${URL_TTL_SECONDS}`,
    'X-Robots-Tag': 'noindex, nofollow',
   } });
   context.waitUntil(cache.put(key, entry).catch(() => undefined));
  }
  return redirect(officialUrl);
 } catch {
  // A resposta pública nunca expõe diagnóstico, corpos, tokens ou credenciais.
  return reply(503, 'Image unavailable', { 'Retry-After': '60' });
 }
}
