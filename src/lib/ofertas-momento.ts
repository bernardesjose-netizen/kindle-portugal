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
  categoria: 'Áudio' | 'Carregadores' | 'Informática' | 'Casa' | 'Casa inteligente' | 'Cuidado pessoal' | 'Kindle' | 'Relógios' | 'Tablets' | 'Telemóveis';
  /** Preço com IVA PT, em euros. */
  preco_eur: number;
  /** Preço riscado na ficha, com IVA PT (ver `referencia`). */
  preco_recomendado_eur: number;
  /**
   * O que é o preço riscado: o recomendado pelo fabricante (por omissão) ou o
   * mais baixo dos últimos 30 dias ("Más bajo" na Amazon.es).
   */
  referencia?: 'recomendado' | 'minimo-30-dias';
  /** Desconto que a Amazon mostra na ficha. */
  desconto_pct: number;
  // Sem estrelas nem número de avaliações da Amazon: o acordo operativo dos
  // Afiliados (cláusula t) só deixa mostrá-los se vierem da PA-API.
  /**
   * Preço ainda NÃO lido por nós na ficha (ex.: a Amazon estava a bloquear a
   * leitura): vem desta fonte, citada no cartão, e o cartão diz que está por
   * confirmar. Retirar quando o preço for confirmado na ficha.
   */
  fonte?: { nome: string; url: string; preco_original: string };
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
// Última reconfirmação, ficha a ficha, de todas as ofertas desta lista
// (preço, desconto, stock e vendedor sem alterações face à anterior).
const VERIF_ULTIMA = new Date('2026-10-06T21:33:00+01:00');
// Ofertas encontradas na verificação das 21h (lidas na ficha às 21:35).
const VERIF_21H = new Date('2026-10-06T21:35:00+01:00');

export const OFERTAS_MOMENTO: OfertaMomento[] = [
  {
    marca: 'Nothing',
    nome: 'Nothing Headphone (1)',
    asin: 'B0F66XD5LF',
    categoria: 'Áudio',
    preco_eur: 167.17,
    preco_recomendado_eur: 303.95,
    desconto_pct: 45,
    verificado_em: VERIF_ULTIMA,
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
    verificado_em: VERIF_ULTIMA,
    resumo:
      'Auriculares sem fios pequenos e leves, com o som equilibrado da Sony. Não têm cancelamento de ruído, mas a este preço e com milhares de avaliações são aposta segura.',
  },
  {
    marca: 'Samsung',
    nome: 'Samsung Galaxy Buds3 Pro (com carregador)',
    asin: 'B0D4QVV1WV',
    categoria: 'Áudio',
    preco_eur: 120.97,
    preco_recomendado_eur: 253.12,
    desconto_pct: 52,
    verificado_em: VERIF_ULTIMA,
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
    verificado_em: VERIF_ULTIMA,
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
    verificado_em: VERIF_ULTIMA,
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
    verificado_em: VERIF_ULTIMA,
    resumo:
      'O rato simples que a Logitech vende há anos, com recetor USB e pilha que dura meses. Milhares de avaliações, por menos de 10 €.',
  },
  {
    marca: 'Philips',
    nome: 'Philips Sonicare DiamondClean 9000 (pack de 2)',
    asin: 'B0B722494K',
    categoria: 'Cuidado pessoal',
    preco_eur: 270.39,
    preco_recomendado_eur: 508.25,
    desconto_pct: 47,
    verificado_em: VERIF_ULTIMA,
    resumo:
      'Duas escovas elétricas topo de gama da Philips, com sensor de pressão e aplicação, quase a metade do preço. Faz sentido para um casal: cada escova sai a cerca de 135 €.',
  },
  {
    marca: 'Philips',
    nome: 'Philips Sonicare DiamondClean 9000 (edição especial)',
    asin: 'B0B12TTTF2',
    categoria: 'Cuidado pessoal',
    preco_eur: 132.14,
    preco_recomendado_eur: 284.62,
    desconto_pct: 54,
    verificado_em: VERIF_ULTIMA,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'A mesma escova topo de gama do pack de duas, vendida sozinha: sensor de pressão e aplicação. A menos de metade do preço recomendado.',
  },
  {
    marca: 'Oral-B',
    nome: 'Oral-B iO 5 (com 3 cabeças)',
    asin: 'B0D5D3WBN5',
    categoria: 'Cuidado pessoal',
    preco_eur: 101.6,
    preco_recomendado_eur: 193.09,
    desconto_pct: 47,
    verificado_em: VERIF_ULTIMA,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'Escova elétrica da gama iO, com sensor de pressão e três cabeças incluídas. Quase metade do preço, e com cabeças para os primeiros meses.',
  },
  {
    marca: 'iRobot',
    nome: 'iRobot Roomba 115 Combo com base AutoEmpty',
    asin: 'B0GQVG2D3Z',
    categoria: 'Casa',
    preco_eur: 183.98,
    preco_recomendado_eur: 354.77,
    desconto_pct: 48,
    verificado_em: VERIF_ULTIMA,
    resumo:
      'Robot 2 em 1 que aspira e passa a mopa, com base que esvazia o depósito sozinha, por menos de 200 €. É um modelo de entrada da gama Roomba.',
  },
  {
    marca: 'Samsung',
    nome: 'Samsung Galaxy Buds3 (com carregador)',
    asin: 'B0D4QVNFWV',
    categoria: 'Áudio',
    preco_eur: 80.31,
    preco_recomendado_eur: 181.95,
    desconto_pct: 56,
    verificado_em: VERIF_ULTIMA,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'A versão sem «Pro» dos auriculares da Samsung, com cancelamento de ruído e carregador incluído, a menos de metade do preço recomendado. Tal como os Pro, fazem mais sentido com um telemóvel Galaxy.',
  },
  {
    marca: 'Technics',
    nome: 'Technics EAH-AZ80 (auriculares com cancelamento de ruído)',
    asin: 'B0C4LSRTYT',
    categoria: 'Áudio',
    preco_eur: 153.54,
    preco_recomendado_eur: 263.28,
    desconto_pct: 42,
    verificado_em: VERIF_ULTIMA,
    // "Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'Os auriculares topo de gama da Technics, a marca de áudio da Panasonic, com cancelamento de ruído. Para quem dá prioridade à qualidade de som, estão 42 % abaixo do preço recomendado.',
  },
  {
    marca: 'Philips',
    nome: 'Philips i9000 Prestige (máquina de barbear)',
    asin: 'B0DT6NDW4L',
    categoria: 'Cuidado pessoal',
    preco_eur: 203.29,
    preco_recomendado_eur: 406.6,
    desconto_pct: 50,
    verificado_em: VERIF_ULTIMA,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'A máquina de barbear rotativa topo de gama da Philips, a metade do preço recomendado. Faz sentido para quem faz a barba todos os dias e quer uma máquina para muitos anos.',
  },
  {
    marca: 'Braun',
    nome: 'Braun Series 5 (máquina de barbear)',
    asin: 'B0F9X92FQH',
    categoria: 'Cuidado pessoal',
    preco_eur: 66.06,
    preco_recomendado_eur: 132.14,
    desconto_pct: 50,
    verificado_em: VERIF_ULTIMA,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'Máquina de barbear de lâminas da Braun, a metade do preço recomendado e com milhares de avaliações. Uma escolha simples para o dia a dia, sem pagar a gama alta.',
  },
  {
    marca: 'Philips',
    nome: 'Philips PowerPro Compact (aspirador sem saco)',
    asin: 'B01MTF06KN',
    categoria: 'Casa',
    preco_eur: 81.3,
    preco_recomendado_eur: 147.39,
    desconto_pct: 45,
    verificado_em: VERIF_ULTIMA,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'Aspirador de trenó sem saco, de 900 W e tamanho compacto, com dezenas de milhares de avaliações. Um aspirador simples para casas pequenas, a pouco mais de metade do preço.',
  },
  {
    marca: 'Samsung',
    nome: 'Samsung Galaxy Watch8 (40 mm)',
    asin: 'B0FCG4B4C7',
    categoria: 'Relógios',
    preco_eur: 222.62,
    preco_recomendado_eur: 385.26,
    desconto_pct: 42,
    verificado_em: VERIF_21H,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'O relógio inteligente da Samsung com Galaxy AI, na versão de 40 mm, 42 % abaixo do preço recomendado. Só funciona com telemóveis Android: para quem tem iPhone, não serve.',
  },
  {
    marca: 'AEG',
    nome: 'AEG QX7 (aspirador vertical sem fios 2 em 1)',
    asin: 'B0BPYPJ3KN',
    categoria: 'Casa',
    preco_eur: 151.46,
    preco_recomendado_eur: 303.95,
    desconto_pct: 50,
    verificado_em: VERIF_21H,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'Aspirador vertical sem fios que também se usa como aspirador de mão, com até 50 minutos de autonomia anunciados. A metade do preço recomendado e com milhares de avaliações.',
  },
  {
    marca: 'Philips',
    nome: 'Philips OneBlade 360 (com Bluetooth)',
    asin: 'B0CHZ5WN26',
    categoria: 'Cuidado pessoal',
    preco_eur: 40.65,
    preco_recomendado_eur: 69.11,
    desconto_pct: 41,
    verificado_em: VERIF_21H,
    // "Gran Oferta Prime" na ficha: acaba com a campanha.
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'A OneBlade da Philips para aparar e rapar a barba e o corpo, com ligação Bluetooth à aplicação. Uma das máquinas de barba mais populares, 41 % abaixo do preço recomendado.',
  },
  {
    marca: 'TP-Link',
    nome: 'Tapo C211 (câmara Wi-Fi 2K, 360°)',
    asin: 'B0CHFG8XBZ',
    categoria: 'Casa inteligente',
    preco_eur: 23.87,
    preco_recomendado_eur: 40.57,
    desconto_pct: 41,
    verificado_em: VERIF_ULTIMA,
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
export function expiraEm(o: Pick<OfertaMomento, 'valida_ate' | 'verificado_em'>): Date {
  return o.valida_ate ?? new Date(o.verificado_em.valueOf() + 24 * 3_600_000);
}

/**
 * Tablets e telemóveis Samsung e Xiaomi em destaque em /promocoes. Os
 * descontos nestas categorias raramente passam dos 30 %, por isso têm lista
 * própria e não entram nas ofertas de 35 % ou mais. Mesmas regras de
 * verificação: vendidos e enviados pela Amazon, em stock, preço com IVA PT.
 */
export const TABLETS_TELEMOVEIS: OfertaMomento[] = [
  // Verificados na ficha a 06/10/2026, 13:35 (reconfirmados às 21:33): "Gran Oferta Prime", vendidos e
  // enviados pela Amazon, em stock, desconto face ao preço recomendado.
  // Ficaram de fora os tablets Galaxy Tab S11, Tab S10 Lite e Xiaomi Pad 8
  // Pro: o "−21 % a −26 %" da ficha compara com o preço mais baixo dos
  // últimos 30 dias, e com o IVA certo a descida real é de 4 % a 11 %.
  {
    marca: 'Samsung',
    nome: 'Samsung Galaxy Z Flip7 FE (128 GB)',
    asin: 'B0FBGQYQLL',
    categoria: 'Telemóveis',
    preco_eur: 608.9,
    preco_recomendado_eur: 1015.51,
    desconto_pct: 40,
    verificado_em: VERIF_ULTIMA,
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'O dobrável da Samsung com ecrã que fecha a meio e cabe em qualquer bolso. Com 40 % de desconto face ao preço de lançamento, é das maiores descidas de um Galaxy nesta campanha; ainda tem poucas avaliações por ser recente.',
  },
  {
    marca: 'Samsung',
    nome: 'Samsung Galaxy S25 FE (512 GB)',
    asin: 'B0FLDLZ7MR',
    categoria: 'Telemóveis',
    preco_eur: 674.97,
    preco_recomendado_eur: 954.52,
    desconto_pct: 29,
    verificado_em: VERIF_ULTIMA,
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'A versão mais acessível da gama S, com ecrã de 6,7 polegadas, câmara de 50 MP e 512 GB. Para quem quer um Galaxy de topo sem pagar o S25 completo.',
  },
  {
    marca: 'Xiaomi',
    nome: 'Redmi Note 17 Pro 5G (8 + 512 GB)',
    asin: 'B0H4H89QXV',
    categoria: 'Telemóveis',
    preco_eur: 386.18,
    preco_recomendado_eur: 558.99,
    desconto_pct: 31,
    verificado_em: VERIF_ULTIMA,
    valida_ate: FIM_PBDD,
    so_prime: true,
    resumo:
      'O Redmi Note mais completo deste ano, com 512 GB e bateria de 8340 mAh que aguenta folgadamente dois dias. Muito telemóvel por menos de 400 €.',
  },
];

/** Tablets e telemóveis ainda válidos, por desconto. */
export function tabletsTelemoveisValidos(agora: Date = new Date()): OfertaMomento[] {
  return TABLETS_TELEMOVEIS.filter((o) => expiraEm(o) > agora).sort((a, b) => b.desconto_pct - a.desconto_pct);
}

/**
 * Ofertas em grande destaque, fora das regras de desconto mínimo: escolhidas
 * a dedo, mostradas no topo da entrada e de /promocoes. Cada uma tem uma
 * janela de exibição (`mostrar_desde` até `mostrar_ate`, ou até ao fim da
 * oferta): todas entram no HTML e o script de OfertasMomento mostra no
 * browser só a que está na janela, por isso as trocas acontecem à hora certa
 * sem nova build.
 */
export interface OfertaEstrela extends Omit<OfertaMomento, 'preco_recomendado_eur' | 'referencia'> {
  /** Poupança anunciada, em euros, face a `comparacao`. */
  poupanca_eur: number;
  /** Com o que se compara o preço, para o cartão. */
  comparacao: string;
  /** Selo curto no topo do cartão. */
  etiqueta: string;
  /** Só aparece a partir deste momento. */
  mostrar_desde?: Date;
  /** Sai do destaque neste momento, mesmo que a oferta continue. */
  mostrar_ate?: Date;
}

// Troca do destaque pedida pelo utilizador a 06/10/2026, às 17:42 ("daqui a
// 7 horas"): o Apple Watch saiu às 00:45 de 7/10 (entraram os Galaxy Buds3
// Pro, que a 7/10 deram lugar ao Kindle Colorsoft).
const TROCA_DESTAQUE = new Date('2026-10-07T00:45:00+01:00');

/**
 * Ofertas de marcas que passam à frente das outras na grelha de cartões do
 * destaque da entrada (ex.: a que saiu do destaque principal). Galaxy Buds3
 * Pro: trocaram de lugar com o Kindle Colorsoft a 07/10, a pedido do utilizador.
 */
export const MARCAS_PRIORITARIAS_GRELHA = ['B0D4QVV1WV'];

export const OFERTAS_ESTRELA: OfertaEstrela[] = [
  {
    marca: 'Apple',
    nome: 'Apple Watch Series 11 GPS, 46 mm (alumínio prateado)',
    asin: 'B0FQGLL2HL',
    categoria: 'Relógios',
    // 379 € em Espanha (IVA de 21 %) → 385,26 € com o IVA de 23 % cobrado em Portugal.
    preco_eur: 385.26,
    poupanca_eur: 50,
    desconto_pct: 12,
    comparacao: 'face aos 429 € da MediaMarkt Espanha',
    etiqueta: 'Mínimo histórico',
    // Lidas por nós na ficha às 17:29; o preço a Amazon não o mostra a quem
    // consulta de fora da UE, daí a `fonte`.
    fonte: {
      nome: 'Applesfera',
      url: 'https://www.applesfera.com/seleccion/amazon-arranca-su-fiesta-ofertas-prime-todos-estos-descuentos-airpods-ipad',
      preco_original: '379 € em Espanha',
    },
    verificado_em: new Date('2026-10-06T11:31:00+01:00'),
    valida_ate: FIM_PBDD,
    mostrar_ate: TROCA_DESTAQUE,
    so_prime: true,
    resumo:
      'O Series 11 deu lugar ao Series 12 e baixou para o preço mais baixo de sempre na Amazon.es, segundo a Applesfera. Ecrã sempre ligado, qualidade do sono e monitorização de treino e saúde. Atenção: só funciona com iPhone.',
  },
  // Destaque principal a partir de 07/10, ~13h30 (pedido do utilizador: "muda
  // o destaque principal para Kindle", trocando com os Galaxy Buds3 Pro, que
  // passam para a grelha de cartões). Colorsoft lido por nós na ficha às
  // 13:16: 166,71 € com IVA PT, recomendado 304,95 €, −45 %, 3 unidades.
  {
    marca: 'Amazon',
    nome: 'Kindle Colorsoft (16 GB)',
    asin: 'B0CX8MQF7R',
    categoria: 'Kindle',
    preco_eur: 166.71,
    poupanca_eur: 138.24,
    desconto_pct: 45,
    comparacao: 'face ao preço recomendado na Amazon.es (304,95 €)',
    etiqueta: 'O maior desconto Kindle',
    verificado_em: new Date('2026-10-07T13:16:00+01:00'),
    valida_ate: FIM_PBDD,
    resumo:
      'O primeiro Kindle a cores, quase a metade do preço: capas, banda desenhada e sublinhados a cores, com a autonomia de semanas de um Kindle. A ficha indicava só três unidades em stock.',
  },
];

/** Momento em que a oferta estrela sai do destaque. */
export function fimDestaque(o: OfertaEstrela): Date {
  const fim = expiraEm(o);
  return o.mostrar_ate && o.mostrar_ate < fim ? o.mostrar_ate : fim;
}

/** Ofertas estrela que ainda vão aparecer (a de agora e as agendadas). */
export function ofertasEstrelaPorMostrar(agora: Date = new Date()): OfertaEstrela[] {
  return OFERTAS_ESTRELA.filter((o) => fimDestaque(o) > agora);
}
