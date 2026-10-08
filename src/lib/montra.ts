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
    descricao: 'A gama atual, com ligação para a nossa ficha de cada modelo. Só versões sem publicidade, as que a Amazon.es envia para Portugal.',
  },
  {
    id: 'capas',
    titulo: 'Capas e acessórios para e-readers',
    descricao: 'Capas feitas à medida de cada modelo (confirma sempre a geração do teu) e a nova base de carregamento da Amazon.',
  },
  {
    id: 'outros-leitores',
    titulo: 'Outros leitores: Kobo e PocketBook',
    descricao: 'Para quem lê EPUB sem conversões, quer botões físicos ou prefere ficar fora do ecossistema Amazon.',
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
    descricao: 'O Kindle vem só com o cabo USB-C, sem carregador. Estes resolvem a mesa de cabeceira e a mala de viagem.',
  },
  {
    id: 'ebooks',
    titulo: 'Ebooks em português',
    descricao: 'Seis escolhas da nossa rubrica Três Ebooks, para começar a encher o Kindle.',
  },
];

const DIA = new Date('2026-10-07');

export const MONTRA: ItemMontra[] = [
  // Kindle. Só o Kindle de 2026 tem preço: é o de lançamento, sem desconto
  // (visto pelo utilizador na ficha a 07/10 com morada em Portugal). Os outros
  // estavam com preços da campanha, que acaba hoje; remetem para a ficha.
  {
    nome: 'Kindle de 2026 (16 GB, sem publicidade)',
    marca: 'Amazon',
    asin: 'B0G4SHH6YH',
    categoria: 'kindle',
    preco_eur: 177.88,
    preco_data: DIA,
    etiqueta: 'Novo',
    porque: 'A nova geração do Kindle básico, mais fino, leve e rápido, já com entrega em Portugal. É a porta de entrada na gama.',
  },
  {
    nome: 'Kindle Paperwhite (16 GB, sem publicidade)',
    marca: 'Amazon',
    asin: 'B0CFPWLGF2',
    categoria: 'kindle',
    ficha_url: '/modelos/paperwhite',
    porque: 'O que recomendamos à maioria: ecrã de 7 polegadas a 300 ppi, resistência à água IPX8 e luz com temperatura de cor ajustável.',
  },
  {
    nome: 'Kindle Paperwhite Signature Edition (32 GB)',
    marca: 'Amazon',
    asin: 'B0CFPN47NY',
    categoria: 'kindle',
    ficha_url: '/modelos/paperwhite',
    porque: 'O Paperwhite com o dobro da memória, luz que se ajusta sozinha e carregamento sem fios. Compensa a quem guarda muitos audiolivros.',
  },
  {
    nome: 'Kindle Colorsoft (16 GB)',
    marca: 'Amazon',
    asin: 'B0CX8MQF7R',
    categoria: 'kindle',
    ficha_url: '/modelos/colorsoft',
    porque: 'O Kindle a cores: capas, banda desenhada e sublinhados ganham cor suave, estilo papel. Para quem lê muita BD ou livros ilustrados.',
  },
  {
    nome: 'Kindle Scribe',
    marca: 'Amazon',
    asin: 'B0CZB5RHWX',
    categoria: 'kindle',
    ficha_url: '/modelos/scribe',
    porque: 'Leitor e caderno digital num só, com caneta incluída. Para quem anota livros, revê PDF de trabalho ou estuda no ecrã.',
  },

  // Capas e acessórios. As capas oficiais e a MoKo apareciam esgotadas vistas
  // de fora de Portugal (como os próprios Kindle): sem preço, ligam ao guia.
  {
    nome: 'Capa oficial para Paperwhite e Colorsoft',
    marca: 'Amazon',
    asin: 'B0CM7ZXQWC',
    categoria: 'capas',
    ficha_url: '/guias/capas-para-kindle-paperwhite',
    porque: 'Fina, leve e feita de material de origem vegetal, com o ecrã a acordar ao abrir. Serve no Paperwhite de 2024 e no Colorsoft.',
  },
  {
    nome: 'Capa MoKo para Kindle básico (2022 e 2024)',
    marca: 'MoKo',
    asin: 'B0CPXQ7YZN',
    categoria: 'capas',
    ficha_url: '/guias/capas-para-kindle-basico',
    porque: 'Folio clássico com fecho magnético que adormece o ecrã. A escolha segura e barata para o Kindle básico de 6 polegadas.',
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
    nome: 'Base de carregamento magnética (Paperwhite e Colorsoft Signature de 2026)',
    marca: 'Amazon',
    asin: 'B0H6KV2HMM',
    categoria: 'capas',
    etiqueta: 'Em breve',
    porque: 'A base oficial para carregar sem fios as Signature Edition de 2026, com adaptador USB-C incluído. A Amazon.es ainda a dá como «Próximamente».',
  },
  {
    nome: 'Capa oficial Kobo para Clara BW e Clara Colour',
    marca: 'Kobo',
    asin: 'B0D1KS4HVH',
    categoria: 'capas',
    preco_eur: 20.32,
    preco_data: DIA,
    porque: 'Capa em pele vegana com suporte de duas posições, que liga e desliga o leitor ao abrir e fechar.',
  },

  // Outros leitores, todos vendidos e enviados pela Amazon.
  {
    nome: 'Kobo Clara BW',
    marca: 'Kobo',
    asin: 'B0CZXYV8GT',
    categoria: 'outros-leitores',
    preco_eur: 171.78,
    preco_data: DIA,
    porque: 'A alternativa direta ao Kindle básico: 6 polegadas, resistência à água, luz com temperatura ajustável e EPUB sem conversões.',
  },
  {
    nome: 'Kobo Clara Colour',
    marca: 'Kobo',
    asin: 'B0CZY1LRT4',
    categoria: 'outros-leitores',
    preco_eur: 188.04,
    preco_data: DIA,
    porque: 'O mesmo corpo compacto com ecrã a cores Kaleido 3: texto nítido a preto e branco e cor suave nas capas e na BD.',
  },
  {
    nome: 'Kobo Libra Colour',
    marca: 'Kobo',
    asin: 'B0CZXX465Z',
    categoria: 'outros-leitores',
    preco_eur: 225.67,
    preco_data: DIA,
    porque: 'Sete polegadas a cores, botões físicos para virar a página e compatível com a caneta Kobo Stylus 2. O rival direto do Colorsoft.',
  },
  {
    nome: 'PocketBook Verse (8 GB)',
    marca: 'PocketBook',
    asin: 'B0CGVTJ47Z',
    categoria: 'outros-leitores',
    preco_eur: 120.97,
    preco_data: DIA,
    porque: 'Um e-reader simples e honesto de 6 polegadas, com botões físicos e leitura direta de EPUB e PDF, para fugir ao ecossistema Amazon.',
  },
  {
    nome: 'PocketBook Verse Pro (16 GB)',
    marca: 'PocketBook',
    asin: 'B0CGVXN52X',
    categoria: 'outros-leitores',
    preco_eur: 171.79,
    preco_data: DIA,
    porque: 'O Verse com o dobro da memória e resistência à água: lê quase todos os formatos sem conversões e mantém os botões físicos.',
  },
  {
    nome: 'PocketBook Era Color (32 GB)',
    marca: 'PocketBook',
    asin: 'B0D1Y883G2',
    categoria: 'outros-leitores',
    preco_eur: 247.49,
    preco_data: DIA,
    porque: 'Ecrã a cores de 7 polegadas, 32 GB e botões físicos. A opção para BD e livros ilustrados em qualquer formato.',
  },

  // Cadernos e canetas.
  {
    nome: 'Moleskine Clássico, capa dura, pautado, médio (preto)',
    marca: 'Moleskine',
    asin: 'B07JVF89GB',
    categoria: 'escrita',
    preco_eur: 23.38,
    preco_data: DIA,
    porque: 'O caderno de sempre: capa rígida, elástico, fita marcadora e bolsa interior, em 11,5 x 18 cm, que cabe em qualquer mala.',
  },
  {
    nome: 'Moleskine Clássico, capa dura, pautado, grande (azul hortênsia)',
    marca: 'Moleskine',
    asin: 'B07XW6SWC2',
    categoria: 'escrita',
    porque: 'O formato grande, 13 x 21 cm e 240 páginas, para quem escreve muito.',
  },
  {
    nome: 'Leuchtturm1917 A5, capa dura, pontilhado',
    marca: 'Leuchtturm1917',
    asin: 'B002TSIMW4',
    categoria: 'escrita',
    preco_eur: 24.34,
    preco_data: DIA,
    porque: 'O preferido de quem faz bullet journal ou diário de leituras: páginas numeradas, índice, papel pontilhado e duas fitas marcadoras.',
  },
  {
    nome: 'Lamy safari, caneta de tinta permanente (aparo F)',
    marca: 'Lamy',
    asin: 'B000FA5DRK',
    categoria: 'escrita',
    preco_eur: 23.28,
    preco_data: DIA,
    porque: 'A caneta de tinta permanente com que muita gente começa: robusta, com pega ergonómica e aparo fino. Usa cartuchos Lamy T10.',
  },
  {
    nome: 'Parker Jotter Originals (preto, tinta azul)',
    marca: 'Parker',
    asin: 'B07RZGSQK8',
    categoria: 'escrita',
    preco_eur: 10.14,
    preco_data: DIA,
    porque: 'Um clássico desde os anos 50, com o clique característico e recarga de tinta azul. Presente barato que não parece barato.',
  },
  {
    nome: 'Pilot FriXion Ball Clicker (4 canetas apagáveis)',
    marca: 'Pilot',
    asin: 'B07S571HQV',
    categoria: 'escrita',
    preco_eur: 10.33,
    preco_data: DIA,
    porque: 'A tinta apaga-se por fricção, ótimo para anotar livros e agendas sem estragar. Cuidado com o calor, que também a faz desaparecer.',
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
    porque: 'Ilumina o livro sem acender a luz do quarto nem incomodar quem dorme ao lado. Carrega por USB. O Kindle já tem luz própria; isto é para o papel.',
  },
  {
    nome: 'Luz de leitura de pinça, recarregável',
    marca: 'Diboniur',
    asin: 'B0BLS36X4P',
    categoria: 'leitura',
    preco_eur: 12.12,
    preco_data: DIA,
    porque: 'Prende-se à capa do livro e leva-se para todo o lado. A alternativa mais barata e mais discreta à luz de pescoço.',
  },
  {
    nome: 'Suporte de livros em madeira',
    marca: 'MAGIC SELECT',
    asin: 'B09TPRBNLH',
    categoria: 'leitura',
    preco_eur: 13.41,
    preco_data: DIA,
    porque: 'Mantém o livro aberto na mesa e liberta as mãos para tomar notas ou ler enquanto se come.',
  },
  {
    nome: 'Suporte ajustável em bambu (39 x 28 cm)',
    marca: 'Theodore',
    asin: 'B07NJ4VY8L',
    categoria: 'leitura',
    preco_eur: 26.42,
    preco_data: DIA,
    porque: 'Maior e com inclinação ajustável e molas para segurar as páginas. Aguenta livros grossos, partituras e tablets.',
  },
  {
    nome: 'Marcador com elástico «Read to Live»',
    marca: 'Legami',
    asin: 'B08VRNBTVM',
    categoria: 'leitura',
    preco_eur: 2.95,
    preco_data: DIA,
    porque: 'Marca a página e mantém o livro fechado na mala. Pequeno presente para pôr dentro de um livro oferecido.',
  },

  // Carregadores, cabos e tomadas.
  {
    nome: 'Carregador USB-C de 20 W BoostCharge',
    marca: 'Belkin',
    asin: 'B0BDXSHMHD',
    categoria: 'carregar',
    preco_eur: 9.14,
    preco_data: DIA,
    porque: 'Carrega o Kindle e o telemóvel depressa, num formato pequeno. É o que falta na caixa do Kindle, que só traz o cabo.',
  },
  {
    nome: 'Carregador USB-C Nano GaN de 20 W',
    marca: 'Amazon Basics',
    asin: 'B0DBPR29MW',
    categoria: 'carregar',
    preco_eur: 8.52,
    preco_data: DIA,
    porque: 'Alternativa compacta, com uma porta USB-C. Chega para o Kindle e para um telemóvel.',
  },
  {
    nome: 'Carregador de 67 W com 3 portas USB-C BoostCharge Pro',
    marca: 'Belkin',
    asin: 'B0CWH4ND6V',
    categoria: 'carregar',
    porque: 'Um só carregador para portátil, telemóvel e Kindle ao mesmo tempo. Ideal para viagens.',
  },
  {
    nome: 'Extensão com 2 tomadas e 3 portas USB (20 W)',
    marca: 'Amazon Basics',
    asin: 'B0DW3DBQ2S',
    categoria: 'carregar',
    porque: 'Duas tomadas, duas portas USB-C e uma USB-A num cabo de 1,57 m: resolve a mesa de cabeceira sem carregadores à parte.',
  },
  {
    nome: 'Extensão Ecolor de 4 tomadas com 3 portas USB',
    marca: 'Brennenstuhl',
    asin: 'B0DYDZCBM3',
    categoria: 'carregar',
    preco_eur: 23.97,
    preco_data: DIA,
    porque: 'Quatro tomadas com interruptor e três portas USB (duas USB-C de 20 W), de uma marca alemã com tradição em material elétrico.',
  },
  {
    nome: 'Tomada inteligente Tapo P100',
    marca: 'TP-Link',
    asin: 'B07Z5JD3T4',
    categoria: 'carregar',
    preco_eur: 8.4,
    preco_data: new Date('2026-10-04'),
    porque: 'Programa horários e desliga carregadores à distância pelo telemóvel, para não ficarem ligados à corrente a noite toda.',
  },
  {
    nome: 'Powerbank Nano de 10 000 mAh com cabo USB-C',
    marca: 'Anker',
    asin: 'B0C9CJKCH3',
    categoria: 'carregar',
    preco_eur: 27.5,
    preco_data: new Date('2026-10-04'),
    porque: 'Bateria de bolso com o cabo integrado: carrega o telemóvel cerca de duas vezes e dá semanas extra ao Kindle em viagem.',
  },
  {
    nome: 'Cabo USB-C para USB-C (certificado USB-IF)',
    marca: 'Amazon Basics',
    asin: 'B01GGKZ0V6',
    categoria: 'carregar',
    preco_eur: 7.76,
    preco_data: DIA,
    porque: 'Um cabo suplente para a mesa de cabeceira ou para a mala, que serve no Kindle, no telemóvel e no portátil.',
  },
  {
    nome: 'Cabo USB-C de 2 m (100 W)',
    marca: 'INIU',
    asin: 'B09MQ4KZ27',
    categoria: 'carregar',
    porque: 'Dois metros chegam da tomada à cama, para ler com o Kindle a carregar sem esticar o braço.',
  },

  // Ebooks (rubrica Três Ebooks). Sem preço: varia muito e muda depressa.
  {
    nome: 'Misericórdia, de Lídia Jorge',
    marca: 'Ebook Kindle',
    asin: 'B0C2L7K83C',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-07-lidia-jorge-lobo-antunes-peixoto',
    porque: 'Romance sobre as últimas semanas de uma mulher num lar, escrito sem melodrama. Lídia Jorge na melhor forma.',
  },
  {
    nome: 'Nem Todas as Árvores Morrem de Pé, de Luísa Sobral',
    marca: 'Ebook Kindle',
    asin: 'B0F22P6X18',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-04-30-luisa-sobral-jrs-thriller-e-ensaio',
    porque: 'A estreia em romance da autora de «Amar Pelos Dois», escrita com mão segura.',
  },
  {
    nome: 'O Segredo dos Segredos, de Dan Brown',
    marca: 'Ebook Kindle',
    asin: 'B0FQJW98NF',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-07-pcf-dan-brown-colleen-hoover-leituras-que-se-devoram',
    porque: 'Robert Langdon regressa, desta vez em Praga. Um thriller para devorar em poucos dias.',
  },
  {
    nome: 'Isto Acaba Aqui, de Colleen Hoover',
    marca: 'Ebook Kindle',
    asin: 'B09PB3Q14F',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-07-pcf-dan-brown-colleen-hoover-leituras-que-se-devoram',
    porque: 'O romance que se tornou fenómeno, sobre uma relação que parecia feita à medida até deixar de ser segura.',
  },
  {
    nome: 'Hábitos Atómicos, de James Clear',
    marca: 'Ebook Kindle',
    asin: 'B07SR7BPKX',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-14-van-der-ding-daniel-silva-james-clear',
    porque: 'O livro mais lido sobre mudar pequenos hábitos, com capítulos curtos que se leem bem no Kindle.',
  },
  {
    nome: 'Vamos Todos Morrer, de Hugo van der Ding',
    marca: 'Ebook Kindle',
    asin: 'B09ML55W4S',
    categoria: 'ebooks',
    livro: true,
    ficha_url: '/tres-livros/2026-05-14-van-der-ding-daniel-silva-james-clear',
    porque: 'Biografias curtas e sarcásticas de gente que já morreu, três páginas cada. Perfeito para as esperas do dia a dia.',
  },
];
