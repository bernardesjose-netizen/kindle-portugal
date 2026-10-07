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
   * Alternativa a este modelo (ex.: a geração seguinte em pré-reserva, ou a
   * anterior em saldo), com o seu próprio ASIN e preço (IVA incluído).
   * Mostrada como destaque extra no cartão, com botão de compra próprio.
   */
  alternativa?: {
    etiqueta: string;
    asin: string;
    preco_promo: number;
    preco_normal: number | null;
    desconto_pct: number | null;
    /** Mostra "desde" antes do preço (quando é o da variante mais barata). */
    desde?: boolean;
    /** Frase curta por baixo do preço (estado do stock, data de entrega...). */
    nota?: string;
  } | null;
}

/**
 * Produto extra, fora da gama Kindle, destacado ao lado dos Kindle em promoção
 * (ex.: um gadget com preço excecional). Preços com IVA PT.
 */
export interface ExtraPromocao {
  nome: string;
  asin: string;
  /** Etiqueta curta por cima do nome (ex.: "Extra · Áudio"). */
  etiqueta: string;
  preco_eur: number;
  /** Preço de comparação e de onde vem (ex.: PVP oficial da marca). */
  preco_comparacao_eur: number | null;
  origem_comparacao?: string;
  desconto_pct: number | null;
  classificacao: number;
  num_avaliacoes: number;
  verificado_em: Date;
  /** Frase curta: o que é e porque vale a pena. */
  resumo: string;
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
  /**
   * Início e fim (inclusive) da janela. A Amazon.es abre e fecha à meia-noite
   * de Espanha (verão = +02:00), uma hora antes de Portugal: abre às 23h da
   * véspera e fecha às 23h do último dia, hora de Lisboa.
   */
  inicio: Date;
  fim: Date;
  /** Data em que os preços promocionais foram verificados na Amazon. */
  verificado_em: Date | null;
  /** Onde foram confirmadas as datas do evento (rastreabilidade editorial). */
  fonte_datas: string;
  /** Modelos em promoção, pela ordem em que aparecem. */
  itens: ItemPromocao[];
  /** Produtos extra, fora da gama Kindle. */
  /** Novidades da gama Kindle (sem desconto), mostradas a seguir aos Kindle em promoção. */
  novidades: ExtraPromocao[];
  extras: ExtraPromocao[];
}

export const CAMPANHA: Campanha = {
  ativa: true,
  nome: 'Promoções Kindle · Prime Big Deal Days 2026',
  etiqueta: 'Prime Big Deal Days',
  slogan: 'Kindle Colorsoft a 166,71 € (−45 %) na Amazon.es e o Paperwhite de volta ao stock, a 213,74 €. O básico de 2024 esgotou, mas o novo Kindle básico de 2026 já está em stock, a 177,88 €.',
  slogan_antecipacao:
    'O Prime Big Deal Days é a 6 e 7 de outubro, mas há Kindle já com desconto antes da abertura.',
  antecipacao: new Date('2026-09-28T00:00:00+01:00'),
  // Meia-noite de 6 em Espanha = 23h de 5 em Portugal; fim à meia-noite de 7
  // para 8 em Espanha = 23h de 7 em Portugal.
  inicio: new Date('2026-10-06T00:00:00+02:00'),
  fim: new Date('2026-10-07T23:59:59+02:00'),
  verificado_em: new Date('2026-10-07'),
  fonte_datas: 'Anúncio oficial da Amazon (aboutamazon.com), consultado a 04/10/2026.',
  itens: [
    // Verificação de 06/10/2026, na abertura do evento. A Amazon.es mostra o
    // preço sem IVA fora da UE; com entrega em Portugal cobra o IVA português
    // (23 %), por isso o preço PT é o preço sem IVA da ficha × 1,23.
    //
    // Colorsoft: o único Kindle com stock e desconto. Ficha: 135,54 € sem IVA,
    // recomendado 247,93 €, −45 %, "Oferta flash, até esgotar", 3 unidades.
    {
      slug: 'colorsoft',
      preco_promo: 166.71,
      preco_normal: 304.95,
      desconto_pct: 45,
      destaque: true,
    },
    // Básico de 2024: "Não disponível, sem previsão" na Amazon.es, .fr, .it e .de.
    // A nova geração sem publicidade (B0G4SHH6YH, 16 GB, grafite) estava em
    // stock a 07/10/2026, por volta das 13h, com entrega em Lisboa no dia
    // seguinte: 144,62 € sem IVA, 177,88 € com IVA PT (ficha vista pelo
    // utilizador com morada portuguesa; daqui, fora da UE, aparece esgotada).
    {
      slug: 'basico',
      preco_promo: null,
      preco_normal: null,
      desconto_pct: null,
      nota:
        'O Kindle básico de 2024 esgotou na Amazon.es e não há previsão de reposição; está igualmente esgotado nas Amazon de França, Itália e Alemanha. A 4 de outubro custava 91,39 €, 47 % abaixo da tabela.',
      alternativa: {
        etiqueta: 'Kindle de 2026 já em stock',
        asin: 'B0G4SHH6YH',
        preco_promo: 177.88,
        preco_normal: null,
        desconto_pct: null,
        nota: 'O novo Kindle, mais fino, leve e rápido: 16 GB, sem publicidade, cor grafite. Em stock a 7 de outubro, com entrega em Portugal no dia seguinte. Não está em promoção: é o preço de lançamento.',
      },
    },
    // Paperwhite 2024 (B0CFPWLGF2, sem publicidade, preto): de volta ao stock
    // a 07/10/2026, ~13h, vendido e enviado pela Amazon, entrega em Lisboa no
    // dia seguinte (ficha vista pelo utilizador com morada portuguesa; daqui,
    // fora da UE, aparece esgotado). A pedido do utilizador, mostra-se o que a
    // ficha lhe mostrou: 213,74 € IVA incluído (176,64 € sem IVA), −5 % face
    // aos 224,99 € recomendados.
    // O de 2026 (B0GV5YVVCD, com publicidade) estava a 213,47 € com IVA PT a
    // 04/10; o estado atual para Portugal não está confirmado.
    {
      slug: 'paperwhite',
      preco_promo: 213.74,
      preco_normal: 224.99,
      desconto_pct: 5,
      alternativa: {
        etiqueta: 'Paperwhite de 2026',
        asin: 'B0GV5YVVCD',
        preco_promo: 213.47,
        preco_normal: null,
        desconto_pct: null,
        desde: true,
        nota: 'Mais fino e leve, com publicidade. A 4 de outubro estava em pré-reserva a este preço, com entrega a 11 de novembro; confirma na ficha se já há stock.',
      },
    },
    // Scribe: o da ficha (B0CZB5RHWX) "No disponible"; a geração mais recente
    // (B0FC1XB22K, 370,02 € a 04/10) "Agotado temporalmente" a 06/10.
    {
      slug: 'scribe',
      preco_promo: null,
      preco_normal: null,
      desconto_pct: null,
      nota:
        'O Scribe desta ficha está indisponível e a geração mais recente, que a 4 de outubro estava a 370,02 € (−30 %), aparece esgotada temporariamente na Amazon.es.',
    },
  ],
  novidades: [
    // Visto pelo utilizador na ficha a 07/10, ~13h, com morada em Lisboa:
    // em stock, 177,88 € com IVA, entrega grátis no dia seguinte. Estrelas
    // lidas por nós na ficha (4,4, 56 avaliações).
    {
      nome: 'Kindle de 2026 (16 GB, sem publicidade)',
      asin: 'B0G4SHH6YH',
      etiqueta: 'Novo · já em stock',
      preco_eur: 177.88,
      preco_comparacao_eur: null,
      desconto_pct: null,
      classificacao: 4.4,
      num_avaliacoes: 56,
      verificado_em: new Date('2026-10-07T13:05:00+01:00'),
      resumo: 'O Kindle básico de nova geração, mais fino, leve e rápido. Sem desconto: é o preço de lançamento.',
    },
  ],
  extras: [
    // Ficha a 06/10, 12:15: 35,53 € sem IVA (42,99 € em Espanha), vendido e
    // enviado pela Amazon, em stock. A ficha não mostra preço recomendado; o
    // PVP oficial da Xiaomi em Espanha é 59,99 € (imprensa da especialidade),
    // daí os 28 % de desconto, iguais com ou sem a diferença de IVA.
    {
      nome: 'Xiaomi Redmi Buds 8',
      asin: 'B0GQLY4D9F',
      etiqueta: 'Extra · auriculares Bluetooth',
      preco_eur: 43.7,
      // 59,99 € em Espanha = 49,58 € sem IVA = 60,98 € com IVA PT.
      preco_comparacao_eur: 60.98,
      origem_comparacao: 'o PVP oficial (59,99 € em Espanha) com IVA português',
      desconto_pct: 28,
      classificacao: 4.5,
      num_avaliacoes: 163,
      verificado_em: new Date('2026-10-06T12:15:00+01:00'),
      resumo:
        'Cancelamento de ruído até 50 dB, 44 horas com o estojo, ligação a dois aparelhos e IP54. Bons para ouvir audiolivros e podcasts sem gastar muito.',
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

/** Hora de fecho em Portugal, ex.: "23h" (o fim é às 22:59:59 de Lisboa). */
export function horaFimPortugal(): string {
  const h = new Intl.DateTimeFormat('pt-PT', { hour: 'numeric', hour12: false, timeZone: 'Europe/Lisbon' }).format(
    new Date(CAMPANHA.fim.valueOf() + 1000)
  );
  return `${Number(h)}h`;
}
