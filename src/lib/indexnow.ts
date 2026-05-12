/**
 * IndexNow — protocolo de notificação push de mudanças para Bing,
 * Yandex, Naver, Seznam (e qualquer motor que adira ao standard).
 *
 * Como funciona:
 * 1. O ficheiro `public/<KEY>.txt` (apenas contém a key) prova posse.
 * 2. Para notificar mudanças, fazemos GET ou POST a uma das APIs:
 *    - https://api.indexnow.org/IndexNow
 *    - https://www.bing.com/indexnow
 *    - https://yandex.com/indexnow
 *
 * Uso (do terminal ou de uma Cloudflare Function pós-deploy):
 *   curl "https://api.indexnow.org/IndexNow?url=https://kindleportugal.com/guias/calibre-noticias-diarias-kindle-2026&key=6ca1bb380a929ae82fda9f1bee6aef70"
 *
 * Para múltiplos URLs em massa, POST JSON:
 *   {
 *     "host": "kindleportugal.com",
 *     "key": "6ca1bb380a929ae82fda9f1bee6aef70",
 *     "urlList": [ ...URLs... ]
 *   }
 */

const env = import.meta.env;

export const INDEXNOW_KEY: string =
  env.PUBLIC_INDEXNOW_KEY ?? '6ca1bb380a929ae82fda9f1bee6aef70';

export const INDEXNOW_KEY_LOCATION = `https://kindleportugal.com/${INDEXNOW_KEY}.txt`;

/**
 * Constrói o URL de notificação GET single-URL.
 *
 * @example
 *   urlIndexNowSingle('https://kindleportugal.com/guias/foo')
 */
export function urlIndexNowSingle(
  url: string,
  key: string = INDEXNOW_KEY,
): string {
  return `https://api.indexnow.org/IndexNow?url=${encodeURIComponent(url)}&key=${key}`;
}

/**
 * Body JSON para POST em massa.
 */
export function bodyIndexNowBulk(
  urls: string[],
  key: string = INDEXNOW_KEY,
): Record<string, unknown> {
  return {
    host: 'kindleportugal.com',
    key,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };
}
