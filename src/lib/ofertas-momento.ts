/**
 * Ofertas do momento: produtos de qualquer categoria com desconto de 35 % ou
 * mais na Amazon.es, verificados ao longo do dia.
 *
 * REGRAS (CLAUDE.md): nunca inventar preços. Cada oferta foi lida na ficha do
 * produto na hora indicada em `verificado_em`. Só entram produtos:
 *   - vendidos e enviados pela Amazon;
 *   - em stock no momento da verificação;
 *   - com desconto de pelo menos `DESCONTO_MINIMO` face ao preço recomendado
 *     que a própria Amazon mostra riscado na ficha;
 *   - com classificação de 4 estrelas ou mais;
 *   - de marcas reconhecidas (nada de marcas genéricas com preços de
 *     referência inflacionados).
 *
 * Preços com IVA português (23 %), como a Amazon.es os cobra com entrega em
 * Portugal: preço sem IVA lido na ficha × 1,23, arredondado ao cêntimo.
 *
 * Cada oferta desaparece sozinha no browser depois de `valida_ate` (ou 24 h
 * depois de `verificado_em`, se não houver data de fim), porque o site só é
 * reconstruído quando há alterações.
 */

export const DESCONTO_MINIMO = 35;

export interface OfertaMomento {
  /** Marca reconhecida, mostrada em destaque no cartão. */
  marca: string;
  nome: string;
  asin: string;
  categoria: 'Áudio' | 'Carregadores' | 'Informática' | 'Casa' | 'Casa inteligente' | 'Cuidado pessoal';
  /** Preço com IVA PT, em euros. */
  preco_eur: number;
  /** Preço recomendado (riscado na ficha), com IVA PT. */
  preco_recomendado_eur: number;
  /** Desconto que a Amazon mostra na ficha. */
  desconto_pct: number;
  classificacao: number;
  num_avaliacoes: number;
  /** Momento exato da verificação na Amazon.es (com hora). */
  verificado_em: Date;
  /** Fim anunciado da oferta (ex.: fim do Prime Big Deal Days). */
  valida_ate?: Date;
  /** Oferta exclusiva para membros Prime (selo na ficha). */
  so_prime?: boolean;
  /** Uma ou duas frases: o que é e para quem serve. Sem hype. */
  resumo: string;
}

// Fim do Prime Big Deal Days (as ofertas "exclusivas Prime" acabam aqui):
// meia-noite de Espanha, 23h em Portugal.
const FIM_PBDD = new Date('2026-10-07T23:59:59+02:00');
const VERIF_0612 = new Date('2026-10-06T12:15:00+01:00');

export const OFERTAS_MOMENTO: OfertaMomento[] = [
  {
    marca: 'Nothing',
    nome: 'Nothing Headphone (1)',
    asin: 'B0F66XD5LF',
    categoria: 'Áudio',
    preco_eur: 167.17,
    preco_recomendado_eur: 303.95,
    desconto_pct: 45,
    classificacao: 4.5,
    num_avaliacoes: 1211,
    verificado_em: VERIF_0612,
    resumo:
      'Auscultadores de diadema com cancelamento de ruído e até 80 horas de bateria anunciadas. Quase metade do preço de lançamento, num modelo com pouco mais de um ano.',
  },
  {
    marca: 'Sony',
    nome: 'Sony WF-C510',
    asin: 'B0DBLNFHLT',
    categoria: 'Áudio',
    preco_eur: 36.09,
    preco_recomendado_eur: 60.98,
    desconto_pct: 41,
    classificacao: 4.5,
    num_avaliacoes: 4606,
    verificado_em: VERIF_0612,
    resumo:
      'Auriculares sem fios pequenos e leves, com o som equilibrado da Sony. Não têm cancelamento de ruído, mas a este preço e com mais de 4500 avaliações são aposta segura.',
  },
  {
    marca: 'Samsung',
    nome: 'Samsung Galaxy Buds3 Pro (com carregador)',
    asin: 'B0D4QVV1WV',
    categoria: 'Áudio',
    preco_eur: 120.97,
    preco_recomendado_eur: 253.12,
    desconto_pct: 52,
    classificacao: 4.2,
    num_avaliacoes: 289,
    verificado_em: VERIF_0612,
    // Única com selo "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'Os auriculares topo de gama da Samsung, com cancelamento de ruído, a menos de metade do preço recomendado. Fazem mais sentido para quem tem um telemóvel Galaxy.',
  },
  {
    marca: 'Belkin',
    nome: 'Belkin BoostCharge 60 W (2 × USB-C)',
    asin: 'B0C4FYH4YM',
    categoria: 'Carregadores',
    preco_eur: 18.19,
    preco_recomendado_eur: 40.65,
    desconto_pct: 55,
    classificacao: 4.6,
    num_avaliacoes: 1043,
    verificado_em: VERIF_0612,
    resumo:
      'Carregador de parede com duas portas USB-C: telemóvel e Kindle ao mesmo tempo, ou um portátil leve. O maior desconto desta lista.',
  },
  {
    marca: 'Belkin',
    nome: 'Belkin BoostCharge Pro 67 W (3 × USB-C)',
    asin: 'B0CWH4ND6V',
    categoria: 'Carregadores',
    preco_eur: 23.37,
    preco_recomendado_eur: 45.73,
    desconto_pct: 49,
    classificacao: 4.6,
    num_avaliacoes: 667,
    verificado_em: VERIF_0612,
    resumo:
      'Três portas USB-C e potência para carregar um MacBook Air. Para quem quer deixar de andar com vários carregadores na mala.',
  },
  {
    marca: 'Logitech',
    nome: 'Logitech M171 (rato sem fios)',
    asin: 'B01A9GXEOI',
    categoria: 'Informática',
    preco_eur: 8.08,
    preco_recomendado_eur: 14.22,
    desconto_pct: 43,
    classificacao: 4.5,
    num_avaliacoes: 17674,
    verificado_em: VERIF_0612,
    resumo:
      'O rato simples que a Logitech vende há anos, com recetor USB e pilha que dura meses. Mais de dezassete mil avaliações por menos de 10 €.',
  },
  {
    marca: 'Braun',
    nome: 'Braun CJ3000 (espremedor de citrinos)',
    asin: 'B00IYIETIE',
    categoria: 'Casa',
    preco_eur: 13.11,
    preco_recomendado_eur: 28.46,
    desconto_pct: 54,
    classificacao: 4.6,
    num_avaliacoes: 22015,
    verificado_em: VERIF_0612,
    resumo:
      'Espremedor elétrico pequeno, com polpa ajustável e peças que vão à máquina de lavar loiça. Um clássico da Braun com mais de vinte mil avaliações.',
  },
  {
    marca: 'Philips',
    nome: 'Philips Sonicare DiamondClean 9000 (pack de 2)',
    asin: 'B0B722494K',
    categoria: 'Cuidado pessoal',
    preco_eur: 270.39,
    preco_recomendado_eur: 508.25,
    desconto_pct: 47,
    classificacao: 4.3,
    num_avaliacoes: 3736,
    verificado_em: VERIF_0612,
    resumo:
      'Duas escovas elétricas topo de gama da Philips, com sensor de pressão e aplicação, quase a metade do preço. Faz sentido para um casal: cada escova sai a cerca de 135 €.',
  },
  {
    marca: 'TP-Link',
    nome: 'Tapo C211 (câmara Wi-Fi 2K, 360°)',
    asin: 'B0CHFG8XBZ',
    categoria: 'Casa inteligente',
    preco_eur: 23.87,
    preco_recomendado_eur: 40.57,
    desconto_pct: 41,
    classificacao: 4.6,
    num_avaliacoes: 3239,
    verificado_em: VERIF_0612,
    resumo:
      'Câmara de interior que roda 360°, com imagem 2K e deteção de pessoas. Para ver o cão, a casa de férias ou o bebé a partir do telemóvel, sem mensalidade obrigatória.',
  },
];

/** Ofertas ordenadas da verificação mais recente para a mais antiga. */
export function ofertasRecentes(): OfertaMomento[] {
  return [...OFERTAS_MOMENTO]
    .filter((o) => o.desconto_pct >= DESCONTO_MINIMO)
    .sort((a, b) => b.verificado_em.valueOf() - a.verificado_em.valueOf() || b.desconto_pct - a.desconto_pct);
}

/** Momento a partir do qual a oferta deixa de se mostrar. */
export function expiraEm(o: OfertaMomento): Date {
  return o.valida_ate ?? new Date(o.verificado_em.valueOf() + 24 * 3_600_000);
}
