/**
 * Mapa ASIN → URL da imagem principal do produto no CDN Amazon.
 *
 * A Amazon bloqueia pedidos vindos de Workers Cloudflare (edge IPs) ao
 * widget oficial (ws-eu.amazon-adsystem.com) e à própria página de
 * produto, portanto a resolução dinâmica server-side não é viável.
 * Em vez disso, extraímos `data-old-hires` do HTML da página manualmente
 * e guardamos o URL aqui. O browser carrega direto de m.media-amazon.com,
 * que é o CDN público de imagens e NÃO está em listas de ad-blockers.
 *
 * Como atualizar um ASIN:
 *   1. Abrir https://www.amazon.es/dp/{ASIN} (ou .com/.co.uk se não existir em .es)
 *   2. Inspecionar a imagem principal, copiar o atributo `data-old-hires`
 *   3. Substituir ou adicionar aqui.
 *
 * Alternativamente, gera-se tudo com um script:
 *   curl -A "Mozilla/5.0..." https://www.amazon.es/dp/ASIN | grep -oE 'data-old-hires="[^"]+"'
 */

export const ASIN_IMAGES: Record<string, string> = {
  // Capas para Kindle básico
  B0CPXQ7YZN: 'https://m.media-amazon.com/images/I/717q6mlbGCL._AC_SL1500_.jpg',
  B0BGHLJPMQ: 'https://m.media-amazon.com/images/I/81pUB8LRgaL._AC_SL1500_.jpg',
  B0DCBT1CDJ: 'https://m.media-amazon.com/images/I/719YYlyA2ML._AC_SL1500_.jpg',
  B0DG2GRYH5: 'https://m.media-amazon.com/images/I/71IlxgFIeXL._AC_SL1500_.jpg',
  B0BGH62NDR: 'https://m.media-amazon.com/images/I/81STCwlNffL._AC_SL1500_.jpg',

  // Capas para Kindle Paperwhite
  B0CM7ZXQWC: 'https://m.media-amazon.com/images/I/518iv3Nzk8L._AC_SL1000_.jpg',
  B0DPMFS69T: 'https://m.media-amazon.com/images/I/711HvQ5AChL._AC_SL1500_.jpg',
  B0FQJM8TF5: 'https://m.media-amazon.com/images/I/61x6Y4x4WGL._AC_SL1500_.jpg',
  B0DLP2L8H9: 'https://m.media-amazon.com/images/I/71qfqlFO-uL._AC_SL1500_.jpg',

  // Capas para Kindle Colorsoft
  B0CX8YKQ2H: 'https://m.media-amazon.com/images/I/71eNrTC1WBL._AC_SL1500_.jpg',
  B0DKC5SH43: 'https://m.media-amazon.com/images/I/81sHGQ+z96L._AC_SL1500_.jpg',
  B0DKFY294F: 'https://m.media-amazon.com/images/I/71lMhyuCwKL._AC_SL1500_.jpg',

  // Capas para Kindle Scribe
  B0B2H4ZH1M: 'https://m.media-amazon.com/images/I/41q3evGBChL._AC_SL1000_.jpg',
  B09XQ2NKW4: 'https://m.media-amazon.com/images/I/71gG4vVKYjL._AC_SL1000_.jpg',
  B0D5KPDR1X: 'https://m.media-amazon.com/images/I/41SKQoi33FL._AC_SL1000_.jpg',
  B0D5KR4JQ3: 'https://m.media-amazon.com/images/I/51VAFhs7HRL._AC_SL1000_.jpg',
  B0BN6DYCN1: 'https://m.media-amazon.com/images/I/714OsOjDJ7L._AC_SL1500_.jpg',

  // Kindles (modelos + referenciados em artigos) — ASINs válidos em Amazon.es
  B0CFPWLGF2: 'https://m.media-amazon.com/images/I/61RI4fvXHqL._AC_SL1000_.jpg', // Kindle Paperwhite 12.ª gen
  B0CP32JG8B: 'https://m.media-amazon.com/images/I/61toPUX7aDL._AC_SL1000_.jpg', // Kindle básico 2024
  B0CX8MQF7R: 'https://m.media-amazon.com/images/I/61RzHzSgEAL._AC_SL1000_.jpg', // Kindle Colorsoft
  B0CZB5RHWX: 'https://m.media-amazon.com/images/I/71XyttQ0hNL._AC_SL1000_.jpg', // Kindle Scribe 3.ª gen
  B0C8RR4WN3: 'https://m.media-amazon.com/images/I/71l4ubAJ0BL._AC_SL1500_.jpg',

  // Kobo
  B0CZXYV8GT: 'https://m.media-amazon.com/images/I/61DMtK4OPLL._AC_SL1080_.jpg', // Kobo Clara BW
  B0CZY1LRT4: 'https://m.media-amazon.com/images/I/51q5W1jepqL._AC_SL1080_.jpg', // Kobo Clara Colour
};

/**
 * Dado um ASIN, devolve o URL da imagem principal (se estiver no map)
 * ou null. O chamador deve ter um fallback (placeholder SVG).
 *
 * Aceita também um parâmetro opcional `size` (250/500/1000) que reescreve
 * o token de tamanho no URL do CDN Amazon. O CDN aceita vários formatos
 * (_SL500_, _SL1000_, _SL1500_), portanto é seguro reescrever.
 */
export function imagemParaAsin(asin: string, size?: 250 | 500 | 1000): string | null {
  const url = ASIN_IMAGES[asin];
  if (!url) return null;
  if (!size) return url;
  return url.replace(/\._[A-Z0-9_,]+_\.(jpg|png)$/i, `._AC_SL${size}_.$1`);
}
