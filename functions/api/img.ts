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
  const widgetUrl =
    'https://' +
    cfg.widget +
    '/widgets/q?_encoding=UTF8&MarketPlace=' +
    cfg.place +
    '&ASIN=' +
    asin +
    '&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL' +
    sizeParam +
    '_' +
    (tag ? '&tag=' + tag : '');

  try {
    const upstream = await fetch(widgetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; KindlePortugal/1.0; +https://kindleportugal.com)',
        Referer: 'https://www.kindleportugal.com/',
        Accept: 'image/avif,image/webp,image/jpeg,image/png,image/*,*/*;q=0.8',
      },
    });

    const contentType = upstream.headers.get('Content-Type') || 'image/jpeg';
    const contentLength = upstream.headers.get('Content-Length');

    // Amazon devolve pixel transparente 1x1 (43 bytes) para ASINs sem imagem
    // ou tag inválida — redirecionar para placeholder próprio.
    const tamanho = contentLength ? parseInt(contentLength, 10) : 0;
    if (!upstream.ok || (tamanho > 0 && tamanho < 200)) {
      return Response.redirect(
        new URL('/placeholder-amazon.svg', url.origin).toString(),
        302,
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'X-Source': 'amazon-widget-proxy',
      },
    });
  } catch (_erro) {
    return Response.redirect(
      new URL('/placeholder-amazon.svg', url.origin).toString(),
      302,
    );
  }
}
