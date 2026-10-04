/**
 * Campanha de promoções ativa (ex.: Prime Day, Prime Big Deal Days).
 *
 * REGRA DO PROJETO (CLAUDE.md): nunca inventar preços. Todos os valores abaixo
 * foram lidos na ficha do produto na Amazon.es, com entrega para Portugal, na
 * data indicada em `verificado_em`. Quando um preço não se consegue confirmar,
 * fica a `null` e o site mostra o preço de referência do modelo (com data) em
 * vez de afirmar um desconto.
 *
 * A campanha tem três fases, devolvidas por `faseCampanha()`:
 *   - `antecipacao`  entre `antecipacao` e `inicio`: conta decrescente e ofertas
 *                    que a Amazon já abriu antes do evento;
 *   - `ativa`        entre `inicio` e `fim`: campanha a decorrer;
 *   - `fora`         fora dessas janelas, ou com `ativa: false`.
 *
 * Como o site é estático e reconstrói diariamente (publicação agendada), a
 * passagem de fase acontece sozinha. A conta decrescente é calculada no browser
 * a partir de `inicio`, por isso não depende da hora do build.
 */

export interface ItemPromocao {
  /** id/slug do modelo na coleção `modelos` (= nome do ficheiro .mdx sem extensão) */
  slug: string;
  /** Preço promocional em euros (IVA incluído, consumidor PT). `null` = ainda não confirmado. */
  preco_promo: number | null;
  /**
   * Preço "normal"/recomendado em euros (IVA incluído) para mostrar riscado.
   * Se `null`, usa-se o `preco_referencia_eur` do modelo como fallback.
   */
  preco_normal: number | null;
  /** Percentagem de desconto inteira (ex.: 20). `null` = sem selo de %. */
  desconto_pct: number | null;
  /** Marca como "melhor escolha" no destaque. */
  destaque?: boolean;
  /**
   * Nota curta sobre o estado do desconto deste modelo (ex.: explicar que a
   * geração mais recente não está em promoção). Se definida, o cartão mostra
   * "Sem desconto nesta campanha" em vez de "Promoção".
   */
  nota?: string;
  /**
   * Variante alternativa em promoção (ex.: a geração seguinte, ou a anterior em
   * saldo), com o seu próprio ASIN e preços (IVA incluído). Mostrada como
   * destaque extra no cartão, com botão de compra próprio.
   */
  alternativa?: {
    etiqueta: string;
    asin: string;
    preco_promo: number;
    preco_normal: number;
    desconto_pct: number;
  } | null;
}

export type FaseCampanha = 'antecipacao' | 'ativa' | 'fora';

export interface Campanha {
  /** Interruptor geral. `false` = nunca mostra, independentemente das datas. */
  ativa: boolean;
  /** Nome completo (usado no <title> e JSON-LD). */
  nome: string;
  /** Etiqueta curta para o selo/pill (ex.: "Prime Day"). */
  etiqueta: string;
  /** Frase de abertura, vista no banner e no topo da página. */
  slogan: string;
  /** Frase usada apenas na fase de antecipação, antes de o evento abrir. */
  slogan_antecipacao: string;
  /** A partir de quando mostrar a conta decrescente e as ofertas antecipadas. */
  antecipacao: Date;
  /** Início e fim (inclusive) da janela, com fuso de Portugal (verão = +01:00). */
  inicio: Date;
  fim: Date;
  /** Data em que os preços promocionais foram verificados na Amazon. */
  verificado_em: Date | null;
  /** Onde foram confirmadas as datas do evento (rastreabilidade editorial). */
  fonte_datas: string;
  /** Modelos em promoção, pela ordem em que aparecem. */
  itens: ItemPromocao[];
}

export const CAMPANHA: Campanha = {
  ativa: true,
  nome: 'Promoções Kindle · Prime Big Deal Days 2026',
  etiqueta: 'Prime Big Deal Days',
  slogan: 'Kindle com grandes descontos na Amazon.es, só para membros Prime.',
  slogan_antecipacao:
    'O Prime Big Deal Days é a 6 e 7 de outubro, mas há Kindle já com desconto antes da abertura.',
  antecipacao: new Date('2026-09-28T00:00:00+01:00'),
  inicio: new Date('2026-10-06T00:00:00+01:00'),
  fim: new Date('2026-10-07T23:59:59+01:00'),
  verificado_em: new Date('2026-10-04'),
  fonte_datas: 'Anúncio oficial da Amazon (aboutamazon.com), consultado a 04/10/2026.',
  itens: [
    // Preços IVA incluído (consumidor PT), Amazon.es, verificados a 04/10/2026.
    // O "preço normal" é o preço recomendado que a Amazon mostra riscado na ficha.
    {
      slug: 'basico',
      preco_promo: 91.39,
      preco_normal: 172.8,
      desconto_pct: 47,
      destaque: true,
    },
    {
      slug: 'colorsoft',
      preco_promo: 166.71,
      preco_normal: 304.95,
      desconto_pct: 45,
    },
    // Paperwhite: sem desconto. A ficha que documentamos (12.ª geração, 2024)
    // estava a 228,71 € a 04/10 e a Amazon já anuncia a geração seguinte, com
    // lançamento marcado para 11 de novembro de 2026.
    {
      slug: 'paperwhite',
      preco_promo: null,
      preco_normal: null,
      desconto_pct: null,
      nota:
        'O Paperwhite de 2024 não está em promoção e subiu de preço nos últimos meses. A Amazon já aceita reservas da geração seguinte, mais fina e leve, com lançamento a 11 de novembro de 2026, o que costuma explicar a falta de desconto no modelo a sair.',
    },
    // Scribe: o ASIN que documentamos na ficha (B0CZB5RHWX, 3.ª geração, 16 GB)
    // aparecia como indisponível a 04/10, sem previsão de reposição. Quem está
    // em promoção é a geração seguinte, destacada como alternativa.
    {
      slug: 'scribe',
      preco_promo: null,
      preco_normal: null,
      desconto_pct: null,
      nota:
        'O Scribe desta ficha estava indisponível na Amazon.es a 4 de outubro, sem previsão de reposição. Em promoção está a geração seguinte, mais fina e rápida, com 32 GB.',
      alternativa: {
        etiqueta: 'Geração mais recente do Kindle Scribe, em promoção',
        asin: 'B0FC1XB22K',
        preco_promo: 370.02,
        preco_normal: 528.58,
        desconto_pct: 30,
      },
    },
  ],
};

/** Fase em que a campanha se encontra na data indicada. */
export function faseCampanha(agora: Date = new Date()): FaseCampanha {
  if (!CAMPANHA.ativa) return 'fora';
  if (agora >= CAMPANHA.inicio && agora <= CAMPANHA.fim) return 'ativa';
  if (agora >= CAMPANHA.antecipacao && agora < CAMPANHA.inicio) return 'antecipacao';
  return 'fora';
}

/**
 * Indica se a campanha está a decorrer agora (fase `ativa`). Usa a data de
 * build/runtime.
 */
export function campanhaAtiva(agora: Date = new Date()): boolean {
  return faseCampanha(agora) === 'ativa';
}

/** Indica se a campanha deve estar visível no site (antecipação ou a decorrer). */
export function campanhaVisivel(agora: Date = new Date()): boolean {
  return faseCampanha(agora) !== 'fora';
}

/** Itens com desconto confirmado, para destacar antes e durante o evento. */
export function itensComDesconto(): ItemPromocao[] {
  return CAMPANHA.itens.filter((it) => it.preco_promo != null);
}
