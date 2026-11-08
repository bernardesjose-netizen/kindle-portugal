/**
 * Montra do leitor (/montra): produtos para quem lê e escreve, por categoria.
 *
 * REGRA DO PROJETO (CLAUDE.md): nunca inventar preços. Cada ASIN foi aberto
 * na ficha da Amazon.es; o preço é o da ficha com IVA português (23 %) e vem
 * sempre com a data (`preco_data`). Sem preço confirmado (ex.: ficha
 * esgotada vista de fora de Portugal, artigo ainda «Próximamente», ebooks),
 * o cartão remete para a Amazon.es em vez de mostrar um valor.
 *
 * `expira`: o preço era de uma oferta com prazo (Prime Big Deal Days). Até
 * essa hora o cartão mostra-o; depois troca, no browser, por «Vê o preço
 * atual na Amazon.es», e uma build posterior já nem o inclui.
 *
 * Sem estrelas nem número de avaliações da Amazon (acordo operativo dos
 * Afiliados, cláusula t): o cartão liga para as avaliações na ficha.
 */

export type CategoriaMontra = 'kindle' | 'capas' | 'outros-leitores' | 'escrita' | 'leitura' | 'carregar' | 'ebooks';

export interface ItemMontra {
  nome: string;
  marca: string;
  asin: string;
  categoria: CategoriaMontra;
  /** Com IVA PT, como a Amazon.es o cobra com entrega em Portugal. */
  preco_eur?: number;
  preco_data?: Date;
  /** Fim da oferta com prazo a que o preço pertence. */
  expira?: Date;
  /** Uma ou duas frases: o que é, para quem serve, o que convém saber. */
  porque: string;
  etiqueta?: string;
  /** Página do site sobre o produto (ficha do modelo, guia de capas, etc.). */
  ficha_url?: string;
  /** Ebooks: capa pelo CDN de livros em vez do mapa de imagens. */
  livro?: boolean;
}

export const CATEGORIAS_MONTRA: { id: CategoriaMontra; titulo: string; descricao: string }[] = [
  {
    id: 'kindle',
    titulo: 'Kindle',
    descricao: 'A gama atual, com links para as fichas e para cada versão na Amazon.es. Confirma as opções de entrega para a tua morada.',
  },
  {
    id: 'capas',
    titulo: 'Capas e acessórios para e-readers',
    descricao: 'Capas feitas à medida de cada modelo (confirma sempre a geração do teu leitor) e a nova base de carregamento da Amazon.',
  },
  {
    id: 'outros-leitores',
    titulo: 'Outros leitores: Kobo e PocketBook',
    descricao: 'Leitores que abrem ficheiros EPUB e PDF, com opções de cor, iluminação e botões de página.',
  },
  {
    id: 'escrita',
    titulo: 'Cadernos e canetas',
    descricao: 'Para quem lê de lápis na mão, escreve diários de leitura ou simplesmente gosta de bom papel.',
  },
  {
    id: 'leitura',
    titulo: 'Para ler melhor em papel',
    descricao: 'Luzes, suportes e marcadores para os livros que continuam a ser de papel.',
  },
  {
    id: 'carregar',
    titulo: 'Carregadores, cabos e tomadas',
    descricao: 'O Kindle vem só com o cabo USB-C, sem carregador. Vê as portas e a potência de cada carregador para escolheres o que te serve.',
  },
  {
    id: 'ebooks',
    titulo: 'Ebooks em português',
    descricao: 'Seis livros apresentados na rubrica Três Ebooks, com ligação para a edição Kindle.',
  },
];

const DIA = new Date('2026-10-08');

export const MONTRA: ItemMontra[] = [
  // Capas e acessórios. As capas oficiais e a MoKo apareciam esgotadas vistas
  // de fora de Portugal (como os próprios Kindle): sem preço, ligam ao guia.
  {
    nome: 'Capa oficial para Paperwhite e Colorsoft',
    marca: 'Amazon',
    asin: 'B0CM7ZXQWC',
    categoria: 'capas',
    ficha_url: '/guias/capas-para-kindle-paperwhite',
    porque: 'Fina, leve e feita de material de origem vegetal, com o ecrã a acordar ao abrir. Confirma no guia a compatibilidade com o Paperwhite de 2024 e o Colorsoft da mesma geração.',
  },
  {
    nome: 'Capa MoKo para Kindle básico (2022 e 2024)',
    marca: 'MoKo',
    asin: 'B0CPXQ7YZN',
    categoria: 'capas',
    ficha_url: '/guias/capas-para-kindle-basico',
    porque: 'Capa com fecho magnético que põe o leitor em repouso quando a fechas. Serve no Kindle básico de 2022 e de 2024.',
  },
  {
    nome: 'Capa oficial para Kindle Scribe (2022 e 2024)',
    marca: 'Amazon',
    asin: 'B0B2H4ZH1M',
    categoria: 'capas',
    ficha_url: '/guias/capas-para-kindle-scribe',
    porque: 'Capa em pele com tampa dobrável e fixação magnética ao leitor, para os Scribe de 2022 e de 2024.',
  },
  {
    nome: 'Base de carregamento (Paperwhite Signature Edition e Colorsoft Signature Edition de 2026)',
    marca: 'Amazon',
    asin: 'B0H6KV2HMM',
    categoria: 'capas',
    etiqueta: 'Em breve',
    porque: 'Base com contactos de carregamento para o Paperwhite Signature Edition e o Colorsoft Signature Edition de 2026. Inclui adaptador USB-C. Confirma a disponibilidade na ficha.',
  },
  {
    nome: 'Capa oficial Kobo para Clara BW e Clara Colour',
    marca: 'Kobo',
    asin: 'B0D1KS4HVH',
    categoria: 'capas',
    preco_eur: 20.32,
    preco_data: DIA,
    porque: 'Capa Basic SleepCover para Clara BW e Clara Colour. O leitor acorda quando a abres e entra em repouso quando a fechas.',
  },

  // Outros leitores, todos vendidos e enviados pela Amazon.
  {
    nome: 'Kobo Clara BW',
    marca: 'Kobo',
    asin: 'B0CZXYV8GT',
    categoria: 'outros-leitores',
    preco_eur: 171.79,
    preco_data: DIA,
    porque: 'Leitor de 6 polegadas com resistência à água e luz de temperatura ajustável. Podes abrir ficheiros EPUB diretamente.',
  },
  {
    nome: 'Kobo Clara Colour',
    marca: 'Kobo',
    asin: 'B0CZY1LRT4',
    categoria: 'outros-leitores',
    preco_eur: 188.04,
    preco_data: DIA,
    porque: 'Leitor compacto com ecrã Kaleido 3. Mostra o texto a preto e branco e as capas, ilustrações e banda desenhada a cores.',
  },
  {
    nome: 'Kobo Libra Colour',
    marca: 'Kobo',
    asin: 'B0CZXX465Z',
    categoria: 'outros-leitores',
    preco_eur: 273.44,
    preco_data: DIA,
    porque: 'Ecrã a cores de 7 polegadas e botões físicos para virar a página. Se queres tomar notas à mão, é compatível com a Kobo Stylus 2, vendida à parte.',
  },
  {
    nome: 'PocketBook Verse (8 GB)',
    marca: 'PocketBook',
    asin: 'B0CGVTJ47Z',
    categoria: 'outros-leitores',
    preco_eur: 120.97,
    preco_data: DIA,
    porque: 'Leitor de 6 polegadas com botões físicos e leitura de EPUB e PDF. Podes transferir os teus ficheiros por cabo USB.',
  },
  {
    nome: 'PocketBook Verse Pro (16 GB)',
    marca: 'PocketBook',
    asin: 'B0CGVXN52X',
    categoria: 'outros-leitores',
    preco_eur: 171.79,
    preco_data: DIA,
    porque: 'Tem 16 GB, resistência à água e botões físicos. Abre EPUB e PDF diretamente e permite ouvir audiolivros por Bluetooth.',
  },
  {
    nome: 'PocketBook Era Color (32 GB)',
    marca: 'PocketBook',
    asin: 'B0D1Y883G2',
    categoria: 'outros-leitores',
    preco_eur: 249.03,
    preco_data: DIA,
    porque: 'Ecrã a cores de 7 polegadas, 32 GB e botões físicos. Para leres banda desenhada e livros ilustrados em formatos compatíveis, incluindo EPUB e PDF.',
  },

  // Cadernos e canetas.
  {
    nome: 'Moleskine Clássico, capa dura, pautado, médio (preto)',
    marca: 'Moleskine',
    asin: 'B07JVF89GB',
    categoria: 'escrita',
    preco_eur: 23.38,
    preco_data: DIA,
    porque: 'Caderno de 11,5 × 18 cm com capa rígida, elástico, fita marcadora e bolsa interior.',
  },
  {
    nome: 'Moleskine Clássico, capa dura, pautado, grande (azul hortênsia)',
    marca: 'Moleskine',
    asin: 'B07XW6SWC2',
    categoria: 'escrita',
    preco_eur: 24.39,
    preco_data: DIA,
    porque: 'O formato de 13 × 21 cm tem 240 páginas pautadas, para notas, apontamentos ou um diário de leituras.',
  },
  {
    nome: 'Leuchtturm1917 A5, capa dura, pontilhado',
    marca: 'Leuchtturm1917',
    asin: 'B002TSIMW4',
    categoria: 'escrita',
    preco_eur: 24.34,
    preco_data: DIA,
    porque: 'As páginas pontilhadas deixam-te organizar listas, notas e desenhos. Tem índice, páginas numeradas e duas fitas marcadoras.',
  },
  {
    nome: 'Lamy safari, caneta de tinta permanente (aparo F)',
    marca: 'Lamy',
    asin: 'B000FA5DRK',
    categoria: 'escrita',
    preco_eur: 23.28,
    preco_data: DIA,
    porque: 'Caneta de tinta permanente com pega ergonómica e aparo fino. Usa cartuchos Lamy T10.',
  },
  {
    nome: 'Parker Jotter Originals (preto, tinta azul)',
    marca: 'Parker',
    asin: 'B07RZGSQK8',
    categoria: 'escrita',
    preco_eur: 10.14,
    preco_data: DIA,
    porque: 'Esferográfica com botão retrátil e recarga de tinta azul. Podes substituir a recarga quando a tinta acabar.',
  },
  {
    nome: 'Pilot FriXion Ball Clicker (4 canetas apagáveis)',
    marca: 'Pilot',
    asin: 'B07S571HQV',
    categoria: 'escrita',
    preco_eur: 10.37,
    preco_data: DIA,
    porque: 'Podes apagar a tinta por fricção. Evita usá-la em documentos que precisas de conservar, porque o calor também a pode fazer desaparecer.',
  },
  {
    nome: 'Stabilo Boss Original Pastel (6 marcadores)',
    marca: 'Stabilo',
    asin: 'B01LXOQ1KJ',
    categoria: 'escrita',
    porque: 'Marcadores em tons pastel, mais suaves do que os fluorescentes para sublinhar livros e apontamentos.',
  },

  // Para ler melhor em papel.
  {
    nome: 'Luz de leitura de pescoço, recarregável',
    marca: 'Diboniur',
    asin: 'B0BKSR65D4',
    categoria: 'leitura',
    preco_eur: 15.24,
    preco_data: DIA,
    porque: 'Pousa-a à volta do pescoço e dirige a luz para as páginas. Carrega por USB e permite-te ler um livro de papel com o candeeiro do quarto apagado.',
  },
  {
    nome: 'Luz de leitura de pinça, recarregável',
    marca: 'Diboniur',
    asin: 'B0BLS36X4P',
    categoria: 'leitura',
    preco_eur: 12.12,
    preco_data: DIA,
    porque: 'A pinça prende-se à capa do livro. Podes levá-la na mala e recarregá-la por USB.',
  },
  {
    nome: 'Suporte de livros em madeira',
    marca: 'MAGIC SELECT',
    asin: 'B09TPRBNLH',
    categoria: 'leitura',
    preco_eur: 11.29,
    preco_data: DIA,
    porque: 'Mantém o livro aberto na mesa, para poderes consultar as páginas enquanto tomas notas.',
  },
  {
    nome: 'Suporte ajustável em bambu (39 × 28 cm)',
    marca: 'Theodore',
    asin: 'B07NJ4VY8L',
    categoria: 'leitura',
    preco_eur: 26.42,
    preco_data: DIA,
    porque: 'Base de 39 × 28 cm com inclinação ajustável e patilhas que seguram as páginas de um livro ou de uma partitura.',
  },
  {
    nome: 'Marcador com elástico «Read to Live»',
    marca: 'Legami',
    asin: 'B08VRNBTVM',
    categoria: 'leitura',
    preco_eur: 2.95,
    preco_data: DIA,
    porque: 'Marca a página e mantém o livro fechado na mala. O elástico prende-o à capa.',
  },

  // Carregadores, cabos e tomadas.
  {
    nome: 'Carregador USB-C de 20 W BoostCharge',
    marca: 'Belkin',
    asin: 'B0BDXSHMHD',
    categoria: 'carregar',
    preco_eur: 9.14,
    preco_data: DIA,
    porque: 'Carregador de uma porta USB-C para o Kindle ou o telemóvel.',
  },
  {
    nome: 'Carregador USB-C Nano GaN de 20 W',
    marca: 'Amazon Basics',
    asin: 'B0DBPR29MW',
    categoria: 'carregar',
    preco_eur: 8.52,
    preco_data: DIA,
    porque: 'Carregador compacto com uma porta USB-C. Podes carregar um aparelho de cada vez.',
  },
  {
    nome: 'Carregador de 67 W com 3 portas USB-C BoostCharge Pro',
    marca: 'Belkin',
    asin: 'B0CWH4ND6V',
    categoria: 'carregar',
    preco_eur: 30.49,
    preco_data: DIA,
    porque: 'Três portas USB-C para ligares vários aparelhos. Os 67 W são repartidos pelas portas quando as usas ao mesmo tempo.',
  },
  {
    nome: 'Extensão com 2 tomadas e 3 portas USB (20 W)',
    marca: 'Amazon Basics',
    asin: 'B0DW3DBQ2S',
    categoria: 'carregar',
    preco_eur: 15.44,
    preco_data: DIA,
    porque: 'Duas tomadas, duas portas USB-C e uma USB-A, com cabo de 1,57 m. Podes ligar o candeeiro e carregar pequenos aparelhos na mesma extensão.',
  },
  {
    nome: 'Extensão Ecolor de 4 tomadas com 3 portas USB',
    marca: 'Brennenstuhl',
    asin: 'B0DYDZCBM3',
    categoria: 'carregar',
    preco_eur: 23.99,
    preco_data: DIA,
    porque: 'Quatro tomadas com interruptor, duas portas USB-C e uma USB-A. Consulta na ficha a potência disponível quando usas várias portas.',
  },
  {
    nome: 'Tomada inteligente Tapo P100',
    marca: 'TP-Link',
    asin: 'B07Z5JD3T4',
    categoria: 'carregar',
    preco_eur: 9.14,
    preco_data: DIA,
    porque: 'Programa a hora a que um aparelho se liga ou desliga e controla a tomada pela aplicação Tapo.',
  },
  {
    nome: 'Powerbank Nano de 10 000 mAh com cabo USB-C',
    marca: 'Anker',
    asin: 'B0C9CJKCH3',
    categoria: 'carregar',
    porque: 'Bateria externa de 10 000 mAh com cabo USB-C integrado. Podes carregar o Kindle ou o telemóvel em viagem.',
  },
  {
    nome: 'Cabo USB-C para USB-C (certificado USB-IF)',
    marca: 'Amazon Basics',
    asin: 'B01GGKZ0V6',
    categoria: 'carregar',
    preco_eur: 7.47,
    preco_data: DIA,
    porque: 'Cabo com USB-C nas duas pontas. Confirma se a potência suportada chega para o aparelho que queres carregar.',
  },
  {
    nome: 'Cabo USB-C de 2 m (100 W)',
    marca: 'INIU',
    asin: 'B09MQ4KZ27',
    categoria: 'carregar',
    preco_eur: 12.19,
    preco_data: DIA,
    porque: 'O comprimento de 2 m dá-te mais margem entre a tomada e o lugar onde estás a ler.',
  },

  // Ebooks (rubrica Três Ebooks). Sem preço: varia muito e muda depressa.
  {
    nome: 'Misericórdia, de Lídia Jorge',
    marca: 'Ebook Kindle',
    asin: 'B0C2L7K83C',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-07-lidia-jorge-lobo-antunes-peixoto',
    porque: 'A vida de uma mulher num lar, contada a partir dos dias, das memórias e das conversas com quem a rodeia.',
  },
  {
    nome: 'Nem Todas as Árvores Morrem de Pé, de Luísa Sobral',
    marca: 'Ebook Kindle',
    asin: 'B0F22P6X18',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-04-30-luisa-sobral-jrs-thriller-e-ensaio',
    porque: 'O primeiro romance de Luísa Sobral, autora da canção «Amar Pelos Dois».',
  },
  {
    nome: 'O Segredo dos Segredos, de Dan Brown',
    marca: 'Ebook Kindle',
    asin: 'B0FQJW98NF',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-07-pcf-dan-brown-colleen-hoover-leituras-que-se-devoram',
    porque: 'Robert Langdon regressa numa história passada em Praga. Vê a apresentação e os dados da edição na rubrica.',
  },
  {
    nome: 'Isto Acaba Aqui, de Colleen Hoover',
    marca: 'Ebook Kindle',
    asin: 'B09PB3Q14F',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-07-pcf-dan-brown-colleen-hoover-leituras-que-se-devoram',
    porque: 'Um romance sobre uma relação marcada pela violência doméstica.',
  },
  {
    nome: 'Hábitos Atómicos, de James Clear',
    marca: 'Ebook Kindle',
    asin: 'B07SR7BPKX',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-14-van-der-ding-daniel-silva-james-clear',
    porque: 'James Clear apresenta métodos para criares hábitos e acompanhares pequenas mudanças na rotina.',
  },
  {
    nome: 'Vamos Todos Morrer, de Hugo van der Ding',
    marca: 'Ebook Kindle',
    asin: 'B09ML55W4S',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-14-van-der-ding-daniel-silva-james-clear',
    porque: 'Biografias curtas em que Hugo van der Ding percorre, com humor, a vida de figuras de épocas diferentes.',
  },
];
