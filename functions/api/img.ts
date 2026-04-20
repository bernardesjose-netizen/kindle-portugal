/**
 * Cloudflare Pages Function — resolve a imagem principal dum produto Amazon
 * a partir do ASIN, contornando bloqueios a ad-blockers e aos próprios
 * Workers Cloudflare.
 *
 * Estratégia:
 *   1. Fetch da página de produto (/dp/{ASIN}) no marketplace correspondente.
 *   2. Extração do og:image — contém um URL do CDN m.media-amazon.com que
 *      NÃO está nas listas de ad-blockers (serve imagens reais, não ads).
 *   3. Redireciona (302) o browser para esse URL. Cliente carrega direto do
 *      CDN Amazon — sem passar pelo Worker para cada imagem, o que poupa
 *      invocações e faz cache automático no browser.
 *
 * Alternativa para quando o og:image não aparece (raro): redireciona para
 * /placeholder-amazon.svg.
 *
 * Uso: <img src="/api/img?asin=B0CPXQ7YZN&m=es&size=500">
 */

const MARKET_HOST = {
  es: 'www.amazon.es',
  com: 'www.amazon.com',
  uk: 'www.amazon.co.uk',
  de: 'www.amazon.de',
  fr: 'www.amazon.fr',
  it: 'www.amazon.it',
};

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function bad(mensagem) {
  return new Response(mensagem, {
    status: 400,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

function redirectToPlaceholder(originUrl) {
  return Response.redirect(
    new URL('/placeholder-amazon.svg', originUrl).toString(),
    302,
  );
}

// Extrai og:image de uma string HTML. Devolve null se não encontrar.
function extrairOgImage(html) {
  const padroes = [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
    /"hiRes":\s*"(https?:\/\/[^"]+)"/i,
    /"landingImage":\s*\{[^}]*"url":\s*"([^"]+)"/i,
  ];
  for (const padrao of padroes) {
    const match = html.match(padrao);
    if (match && match[1]) {
      return match[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
    }
  }
  return null;
}

// Reescreve o URL do CDN Amazon para o tamanho pedido (250, 500 ou 1000).
function redimensionar(url, size) {
  // Padrão tipico: .../I/XXX._AC_SL1500_.jpg ou .../I/XXX._SL500_.jpg
  // Substituir o token de tamanho pelo que queremos.
  return url.replace(/\._[A-Z]+[0-9_,]+_\.jpg/i, '._SL' + size + '_.jpg');
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const asin = url.searchParams.get('asin') || '';
  const marketplace = (url.searchParams.get('m') || 'es').toLowerCase();
  const size = url.searchParams.get('size') || '500';
  const debug = url.searchParams.get('debug') === '1';

  if (!/^[A-Z0-9]{10}$/.test(asin)) return bad('ASIN inválido');
  if (!['250', '500', '1000'].includes(size)) return bad('Tamanho inválido');
  const host = MARKET_HOST[marketplace];
  if (!host) return bad('Marketplace inválido');

  const paginaProduto = 'https://' + host + '/dp/' + asin;

  try {
    const resposta = await fetch(paginaProduto, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-PT,pt;q=0.9,es;q=0.8,en;q=0.7',
      },
      redirect: 'follow',
    });

    if (!resposta.ok) {
      if (debug) {
        return new Response(
          JSON.stringify({ erro: 'pagina_nao_ok', status: resposta.status, paginaProduto }, null, 2),
          { headers: { 'Content-Type': 'application/json' } },
        );
      }
      return redirectToPlaceholder(url.origin);
    }

    const html = await resposta.text();
    const imagemOriginal = extrairOgImage(html);

    if (!imagemOriginal) {
      if (debug) {
        return new Response(
          JSON.stringify({ erro: 'og_image_nao_encontrado', paginaProduto, tamanhoHtml: html.length }, null, 2),
          { headers: { 'Content-Type': 'application/json' } },
        );
      }
      return redirectToPlaceholder(url.origin);
    }

    const imagemFinal = redimensionar(imagemOriginal, size);

    if (debug) {
      return new Response(
        JSON.stringify({ paginaProduto, imagemOriginal, imagemFinal }, null, 2),
        { headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Redirecionar com cache agressivo para que o browser não volte a pedir
    // o mesmo Worker durante 24h. O CDN Amazon já tem os seus próprios
    // headers de cache, portanto a imagem real também fica em cache no
    // browser.
    return new Response(null, {
      status: 302,
      headers: {
        Location: imagemFinal,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'X-Source': 'og-image',
      },
    });
  } catch (erro) {
    if (debug) {
      return new Response(
        JSON.stringify({ erro: String(erro) }, null, 2),
        { headers: { 'Content-Type': 'application/json' } },
      );
    }
    return redirectToPlaceholder(url.origin);
  }
}
