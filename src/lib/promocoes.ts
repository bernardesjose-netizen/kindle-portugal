/**
 * Campanha de promoções ativa (ex.: Prime Day).
 *
 * REGRA DO PROJETO (CLAUDE.md): nunca inventar preços. Por isso `preco_promo`
 * e `desconto_pct` começam a `null`. Enquanto estiverem a `null`, o site mostra
 * o preço de referência (com data) do modelo e remete para a Amazon para o
 * preço atual — não inventa nenhum desconto.
 *
 * Quando tiveres os números reais do Prime Day, preenche em cada item:
 *   - `preco_promo`   → o preço promocional em euros (ex.: 139.99)
 *   - `desconto_pct`  → a percentagem de desconto inteira (ex.: 18)
 * e atualiza `verificado_em` com a data em que confirmaste os preços na Amazon.
 *
 * A campanha só aparece no site enquanto `ativa === true` E a data atual
 * estiver dentro da janela [inicio, fim]. Como o site é estático e reconstrói
 * diariamente (publicação agendada), o banner desaparece sozinho após `fim`.
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
   * "Sem desconto Prime Day" em vez de "Promoção".
   */
  nota?: string;
  /**
   * Variante alternativa em promoção (ex.: a geração anterior em saldo), com o
   * seu próprio ASIN e preços (IVA incluído). Mostrada como destaque extra no
   * cartão, com botão de compra próprio.
   */
  alternativa?: {
    etiqueta: string;
    asin: string;
    preco_promo: number;
    preco_normal: number;
    desconto_pct: number;
  } | null;
}

export interface Campanha {
  /** Interruptor geral. `false` = nunca mostra, independentemente das datas. */
  ativa: boolean;
  /** Nome completo (usado no <title> e JSON-LD). */
  nome: string;
  /** Etiqueta curta para o selo/pill (ex.: "Prime Day"). */
  etiqueta: string;
  /** Frase de abertura, vista no banner e no topo da página. */
  slogan: string;
  /** Início e fim (inclusive) da janela, com fuso de Portugal (verão = +01:00). */
  inicio: Date;
  fim: Date;
  /** Data em que os preços promocionais foram verificados na Amazon. */
  verificado_em: Date | null;
  /** Modelos em promoção, pela ordem em que aparecem. */
  itens: ItemPromocao[];
}

export const CAMPANHA: Campanha = {
  ativa: true,
  nome: 'Promoções Kindle — Prime Day 2026',
  etiqueta: 'Prime Day',
  slogan: 'Kindle com grandes promoções na Amazon — até −40%, só durante alguns dias.',
  inicio: new Date('2026-06-23T00:00:00+01:00'),
  fim: new Date('2026-06-25T23:59:59+01:00'),
  verificado_em: new Date('2026-06-23'),
  itens: [
    // Preços IVA incluído (consumidor PT), Amazon.es, verificados a 23/06/2026.
    { slug: 'paperwhite', preco_promo: 142.3, preco_normal: 182.96, desconto_pct: 22, destaque: true },
    { slug: 'basico', preco_promo: 103.68, preco_normal: 121.98, desconto_pct: 15 },
    { slug: 'colorsoft', preco_promo: 172.8, preco_normal: 274.45, desconto_pct: 37 },
    // Scribe: a 3.ª geração (ASIN B0CZB5RHWX, a que documentamos) NÃO tem
    // desconto neste Prime Day. Quem está em saldo a −40% é a geração anterior
    // (Kindle Scribe 2024, ASIN B0CZB73S5L) — destacada como alternativa.
    {
      slug: 'scribe',
      preco_promo: null,
      preco_normal: null,
      desconto_pct: null,
      nota: 'A 3.ª geração (a mais recente, que documentamos na ficha) não está em promoção neste Prime Day — mantém o preço habitual.',
      alternativa: {
        etiqueta: 'Geração anterior (Kindle Scribe 2024) em saldo de Prime Day',
        asin: 'B0CZB73S5L',
        preco_promo: 274.45,
        preco_normal: 457.42,
        desconto_pct: 40,
      },
    },
  ],
};

/**
 * Indica se a campanha deve estar visível agora. Usa a data de build/runtime.
 */
export function campanhaAtiva(agora: Date = new Date()): boolean {
  return CAMPANHA.ativa && agora >= CAMPANHA.inicio && agora <= CAMPANHA.fim;
}
