/**
 * Cloudflare Pages Function — proxy de imagens Amazon.
 *
 * Alguns ad-blockers filtram o host `amazon-adsystem.com` (widget oficial
 * do programa Associates), o que fazia com que as imagens aparecessem em
 * branco para uma parte dos visitantes. Esta função busca a imagem à
 * Amazon server-side (edge da Cloudflare) e devolve-a pelo nosso próprio
 * domínio — invisível para ad-blockers.
 *
 * Uso: <img src="/api/img?asin=B0CPXQ7YZN&m=es&size=500">
 */

const MARKET_CONFIG = {
  es: { widget: 'ws-eu.amazon-adsystem.com', place: 'ES', tagKey: 'PUBLIC_AMAZON_TAG_ES' },
  com: { widget: 'ws-na.amazon-adsystem.com', place: 'US', tagKey: 'PUBLIC_AMAZON_TAG_COM' },
  uk: { widget: 'ws-eu.amazon-adsystem.com', place: 'GB', tagKey: 'PUBLIC_AMAZON_TAG_UK' },
  de: { widget: 'ws-eu.amazon-adsystem.com', place: 'DE', tagKey: 'PUBLIC_AMAZON_TAG_DE' },
  fr: { widget: 'ws-eu.amazon-adsystem.com', place: 'FR', tagKey: 'PUBLIC_AMAZON_TAG_FR' },
  it: { widget: 'ws-eu.amazon-adsystem.com', place: 'IT', tagKey: 'PUBLIC_AMAZON_TAG_IT' },
};

function badRequest(mensagem) {
  return new Response(mensagem, {
    status: 400,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const asin = url.searchParams.get('asin') || '';
  const marketplace = (url.searchParams.get('m') || 'es').toLowerCase();
  const sizeParam = url.searchParams.get('size') || '500';

  if (!/^[A-Z0-9]{10}$/.test(asin)) {
    return badRequest('ASIN inválido');
  }
  if (!['250', '500', '1000'].includes(sizeParam)) {
    return badRequest('Tamanho inválido — use 250, 500 ou 1000');
  }
  const cfg = MARKET_CONFIG[marketplace];
  if (!cfg) {
    return badRequest('Marketplace inválido — use es, com, uk, de, fr ou it');
  }

  const tag = env[cfg.tagKey] || env.PUBLIC_AMAZON_TAG || '';

  // Tentar múltiplas fontes por ordem: o widget adsystem bloqueia pedidos
  // vindos de IPs Cloudflare (403); m.media-amazon.com é o CDN de produtos
  // e raramente bloqueia. Primeiro o CDN direto (mais fiável), depois o
  // widget oficial como backup (que retorna tracking para o programa).
  const upstreams = [
    'https://m.media-amazon.com/images/P/' + asin + '.01._SL' + sizeParam + '_.jpg',
    'https://m.media-amazon.com/images/P/' + asin + '._SL' + sizeParam + '_.jpg',
    'https://' +
      cfg.widget +
      '/widgets/q?_encoding=UTF8&MarketPlace=' +
      cfg.place +
      '&ASIN=' +
      asin +
      '&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL' +
      sizeParam +
      '_' +
      (tag ? '&tag=' + tag : ''),
  ];

  const tentativas = [];

  for (const upstreamUrl of upstreams) {
    try {
      const upstream = await fetch(upstreamUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          Referer: 'https://www.kindleportugal.com/',
          Accept: 'image/avif,image/webp,image/jpeg,image/png,image/*,*/*;q=0.8',
        },
      });

      const contentType = upstream.headers.get('Content-Type') || '';
      const contentLength = upstream.headers.get('Content-Length');
      const tamanho = contentLength ? parseInt(contentLength, 10) : 0;
      const validImage =
        upstream.ok &&
        contentType.startsWith('image/') &&
        contentType !== 'image/gif' &&
        tamanho >= 500;

      tentativas.push({
        url: upstreamUrl,
        status: upstream.status,
        contentType,
        contentLength,
        valid: validImage,
      });

      if (validImage) {
        // Se estivermos em modo debug, ainda mostrar o diagnóstico
        if (url.searchParams.get('debug') === '1') {
          return new Response(
            JSON.stringify({ escolhido: upstreamUrl, tentativas }, null, 2),
            { headers: { 'Content-Type': 'application/json' } },
          );
        }
        return new Response(upstream.body, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, s-maxage=604800',
            'X-Source': upstreamUrl.includes('media-amazon') ? 'media-cdn' : 'widget',
          },
        });
      }
    } catch (erro) {
      tentativas.push({
        url: upstreamUrl,
        erro: erro instanceof Error ? erro.message : String(erro),
      });
    }
  }

  if (url.searchParams.get('debug') === '1') {
    return new Response(
      JSON.stringify({ escolhido: null, tentativas }, null, 2),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Nenhuma fonte devolveu imagem válida — placeholder próprio
  return Response.redirect(
    new URL('/placeholder-amazon.svg', url.origin).toString(),
    302,
  );
}
