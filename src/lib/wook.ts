/**
 * Helpers para links de afiliado Wook (afiliados.wook.pt).
 *
 * Programa: afiliados.wook.pt — afiliado externo da Porto Editora.
 * ID configurável via `PUBLIC_WOOK_AID`; cai para o ID conhecido do
 * site caso a variável não esteja definida (útil em dev e build local).
 */

const env = import.meta.env;

const WOOK_AID_FALLBACK = '69f36f37be1b4';

export const WOOK_AID: string = env.PUBLIC_WOOK_AID ?? WOOK_AID_FALLBACK;

/** Widget módulo iframe (pesquisa Wook) — `a_bid=3032b7ad`. */
export const WOOK_BID_MODULO: string = env.PUBLIC_WOOK_BID_MODULO ?? '3032b7ad';

/** Banner gráfico Wook 600×226 — imagem estática, sem iframe. */
export const WOOK_BID_BANNER: string = env.PUBLIC_WOOK_BID_BANNER ?? '581bfdfb';

/**
 * Acrescenta o parâmetro de afiliado a um URL Wook arbitrário.
 *
 * Aceita URLs com ou sem query string. Se o URL não for da Wook,
 * é devolvido tal qual.
 *
 * @example
 *   linkWook('https://www.wook.pt')
 *   // → 'https://www.wook.pt/?a_aid=69f36f37be1b4'
 *
 * @example
 *   linkWook('https://www.wook.pt/livro/lobo-antunes-vol-1/12345?utm=x')
 *   // → 'https://www.wook.pt/livro/lobo-antunes-vol-1/12345?utm=x&a_aid=69f36f37be1b4'
 */
export function linkWook(urlWook: string, aid: string = WOOK_AID): string {
  try {
    const url = new URL(urlWook);
    if (!url.hostname.endsWith('wook.pt')) return urlWook;
    url.searchParams.set('a_aid', aid);
    return url.toString();
  } catch {
    return urlWook;
  }
}

/** URL de raiz da Wook já com o afiliado aplicado. */
export function linkWookHome(aid: string = WOOK_AID): string {
  return `https://www.wook.pt/?a_aid=${aid}`;
}

/**
 * URL do widget oficial de módulo (carrossel de livros) servido por
 * afiliados.wook.pt. Aceita `bid` para variar entre criativos.
 */
export function urlWidgetModulo(
  bid: string = WOOK_BID_MODULO,
  aid: string = WOOK_AID,
): string {
  return `https://afiliados.wook.pt/widgets/modulo?a_aid=${aid}&a_bid=${bid}`;
}
