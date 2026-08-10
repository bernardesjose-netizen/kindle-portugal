/**
 * Achados Tech — produtos Amazon fora do universo e-reader, escolhidos por
 * qualidade comprovada (classificação e volume de avaliações) e verificados
 * ao vivo na Amazon.es.
 *
 * REGRA DO PROJETO (CLAUDE.md): nunca inventar preços. Cada atualização de
 * preços deve mudar também `VERIFICADO_EM`. A página mostra sempre esta data
 * e remete para a Amazon para o valor do momento.
 */

export const VERIFICADO_EM = new Date('2026-08-01');

export interface AchadoTech {
  nome: string;
  asin: string;
  categoria: 'Casa inteligente' | 'Streaming' | 'Áudio' | 'Para levar no bolso';
  preco_eur: number;
  classificacao: number;
  num_avaliacoes: number;
  etiqueta?: string;
  comentario: string;
}

export const ACHADOS_TECH: AchadoTech[] = [
  {
    nome: 'Echo Dot (5.ª geração)',
    asin: 'B09B9CX8PW',
    categoria: 'Casa inteligente',
    preco_eur: 51.02,
    classificacao: 4.7,
    num_avaliacoes: 2900,
    comentario:
      'A coluna inteligente mais vendida da Amazon: Alexa, som surpreendente para o tamanho e o papel de central da casa inteligente. Responde em português, põe música, cria alarmes e comanda tomadas e lâmpadas. É o ponto de partida habitual para quem quer experimentar a casa conectada sem grande investimento.',
  },
  {
    nome: 'Echo Dot Max',
    asin: 'B0DKLGMX7R',
    categoria: 'Casa inteligente',
    preco_eur: 86.36,
    classificacao: 4.6,
    num_avaliacoes: 32,
    etiqueta: 'Novidade',
    comentario:
      'A geração mais recente da família Dot, com som reforçado — a Amazon fala em graves com o dobro da presença face ao Dot clássico. Ainda tem poucas avaliações por ser novo no mercado; para já, faz sentido para quem quer o Dot sobretudo para música.',
  },
  {
    nome: 'TP-Link Tapo P100 (tomada inteligente)',
    asin: 'B07Z5JD3T4',
    categoria: 'Casa inteligente',
    preco_eur: 7.84,
    classificacao: 4.6,
    num_avaliacoes: 42200,
    comentario:
      'O produto com melhor relação preço-utilidade desta lista: uma tomada Wi-Fi que se comanda pelo telemóvel ou por voz (Alexa e Google Home), programa horários e desliga aparelhos à distância. Mais de quarenta mil avaliações compradas a menos de 8 € — difícil errar. Há pack de 4 por cerca de 29 €.',
  },
  {
    nome: 'Fire TV Stick 4K Plus',
    asin: 'B0F7ZFWVTC',
    categoria: 'Streaming',
    preco_eur: 54.95,
    classificacao: 4.6,
    num_avaliacoes: 38500,
    etiqueta: 'Wi-Fi 6',
    comentario:
      'Transforma qualquer televisão com HDMI numa smart TV rápida: Netflix, Prime Video, Disney+, RTP Play e companhia, com 4K, Dolby Vision e Dolby Atmos. A versão atual traz Wi-Fi 6 e comando com controlo da televisão. Para televisões mais antigas ou secundárias, é a forma mais barata de as modernizar.',
  },
  {
    nome: 'JBL Tune 510BT',
    asin: 'B08VDJYLS5',
    categoria: 'Áudio',
    preco_eur: 24.79,
    classificacao: 4.6,
    num_avaliacoes: 51600,
    comentario:
      'Os auscultadores Bluetooth mais recomendáveis abaixo dos 25 €: leves, dobráveis, com 40 horas de bateria anunciadas e o som equilibrado típico da JBL. Mais de cinquenta mil avaliações sustentam a fama. São também um par excelente para ouvir audiolivros no Kindle ou no telemóvel.',
  },
  {
    nome: 'Apple AirTag (2.ª geração)',
    asin: 'B0GJTFY58R',
    categoria: 'Para levar no bolso',
    preco_eur: 21.69,
    classificacao: 4.7,
    num_avaliacoes: 1300,
    etiqueta: 'Novidade',
    comentario:
      'A segunda geração do localizador da Apple, com maior alcance na busca de precisão. Nas chaves, na mala de viagem ou na mochila do portátil, avisa onde as coisas ficaram — requer iPhone. O pack de 4 fica sensivelmente ao preço de três unidades avulsas.',
  },
  {
    nome: 'Anker Nano Power Bank (10 000 mAh, USB-C)',
    asin: 'B0C9CJKCH3',
    categoria: 'Para levar no bolso',
    preco_eur: 30.49,
    classificacao: 4.7,
    num_avaliacoes: 9900,
    comentario:
      'Powerbank compacta com o cabo USB-C integrado — o detalhe que acaba com o "trouxe a bateria mas esqueci-me do cabo". Carrega um telemóvel cerca de duas vezes, a 30 W, e serve igualmente para dar semanas extra a um Kindle em viagem. A Anker é das marcas mais fiáveis da categoria.',
  },
];
