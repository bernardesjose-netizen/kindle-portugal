/**
 * Estado do stock de um modelo na Amazon.es (campo `disponibilidade` das
 * fichas em `src/content/modelos/`). Só se mostra com a data em que foi lido.
 */

export type Disponibilidade = 'disponivel' | 'ultimas-unidades' | 'esgotado';

export const ROTULO_DISPONIBILIDADE: Record<Disponibilidade, string> = {
  disponivel: 'Em stock',
  'ultimas-unidades': 'Últimas unidades',
  esgotado: 'Esgotado',
};

/** Valor para o `availability` do JSON-LD `Offer`. */
export const SCHEMA_DISPONIBILIDADE: Record<Disponibilidade, string> = {
  disponivel: 'https://schema.org/InStock',
  'ultimas-unidades': 'https://schema.org/LimitedAvailability',
  esgotado: 'https://schema.org/OutOfStock',
};

/** Rótulo do preço: um modelo esgotado não tem preço "a partir de". */
export function rotuloPreco(d: Disponibilidade | undefined): string {
  return d === 'esgotado' ? 'último preço' : 'a partir de';
}
