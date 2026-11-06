export const VERIFICADO_EM = new Date('2026-11-06');

export const CATEGORIAS_ACHADOS = [
  { id: 'leitura', nome: 'Leitura e acessórios' },
  { id: 'carregamento', nome: 'Carregamento' },
  { id: 'audio', nome: 'Áudio' },
  { id: 'casa-tv', nome: 'Casa e TV' },
  { id: 'secretaria', nome: 'Secretária' },
  { id: 'viagem', nome: 'Para levar' },
] as const;

interface AchadoTech {
  nome: string;
  asin: string;
  categoria: (typeof CATEGORIAS_ACHADOS)[number]['id'];
  etiqueta: string;
  comentario: string;
}

export const ACHADOS_TECH: AchadoTech[] = [
  {
    nome: 'Kindle Click',
    asin: 'B0H431P5WZ',
    categoria: 'leitura',
    etiqueta: 'Kindle desde 2024',
    comentario:
      'Vira as páginas e ajusta o brilho sem tocar no ecrã. Se costumas ler com o Kindle num suporte, podes deixar o leitor à altura dos olhos e ficar com o comando na mão. Carrega por USB-C.',
  },
  {
    nome: 'Capa Kindle com botões de página',
    asin: 'B0H4WRLQW9',
    categoria: 'leitura',
    etiqueta: 'Signature Edition de 2026',
    comentario:
      'Os botões na lateral deixam-te avançar e recuar com o polegar. Esta capa magnética serve nas edições Signature do Paperwhite e do Colorsoft de 2026.',
  },
  {
    nome: 'PocketBook Verse Pro (16 GB)',
    asin: 'B0CGVXN52X',
    categoria: 'leitura',
    etiqueta: 'E Ink de 6 polegadas',
    comentario:
      'Um leitor de bolso com botões para virar a página, luz frontal de tom ajustável e resistência à água IPX8. Podes abrir EPUB diretamente e ouvir audiolivros com auscultadores Bluetooth.',
  },
  {
    nome: 'Kobo Remote',
    asin: 'B0FW6TPV2D',
    categoria: 'leitura',
    etiqueta: 'Comando Bluetooth',
    comentario:
      'Avança e recua no livro sem tirares o Kobo do suporte. É um comando para leitores Kobo compatíveis. Confirma o teu modelo na ficha antes de encomendar.',
  },
  {
    nome: 'Kobo Stylus 2',
    asin: 'B0C1JPMMWT',
    categoria: 'leitura',
    etiqueta: 'Caneta recarregável',
    comentario:
      'Para sublinhares passagens e escreveres nas margens em modelos compatíveis, como o Kobo Libra Colour, Sage e Elipsa 2E. A caneta recarrega por USB-C.',
  },
  {
    nome: 'Kobo Libra Colour Notebook SleepCover',
    asin: 'B0D1GQ25NW',
    categoria: 'leitura',
    etiqueta: 'Bege areia',
    comentario:
      'Se usas a Stylus 2, esta capa tem espaço para a guardares junto do leitor. A capa também acorda o Libra Colour quando a abres.',
  },
  {
    nome: 'Kobo Clara Basic SleepCover',
    asin: 'B0D1KS4HVH',
    categoria: 'leitura',
    etiqueta: 'Azul-cobalto',
    comentario:
      'Abres a capa e o leitor acorda. Ao fechá-la, o Kobo entra em repouso. Esta versão serve no Clara Colour e no Clara BW.',
  },
  {
    nome: 'Capa Amazon para Paperwhite e Colorsoft',
    asin: 'B0CM7ZXQWC',
    categoria: 'leitura',
    etiqueta: 'Geração de 2024',
    comentario:
      'Capa dobrável em material de origem vegetal, com abertura lateral. Confirma a geração do teu leitor na lista de compatibilidade da Amazon antes de encomendar.',
  },
  {
    nome: 'Luz de leitura Glocusent 20 LED',
    asin: 'B0FNRQ5B8K',
    categoria: 'leitura',
    etiqueta: 'Para livros em papel',
    comentario:
      'Prende-a à capa quando quiseres ler à noite sem acender o candeeiro. Tem cinco tons de luz e uma bateria recarregável.',
  },
  {
    nome: 'Anker Nano Power Bank (10 000 mAh)',
    asin: 'B0C9CJKCH3',
    categoria: 'carregamento',
    etiqueta: 'Cabo USB-C integrado',
    comentario:
      'Uma bateria externa de até 30 W para levares na mochila. O cabo fica preso à bateria, por isso tens sempre como ligar um Kindle ou um telemóvel com USB-C.',
  },
  {
    nome: 'Belkin BoostCharge 67 W',
    asin: 'B0CWH4ND6V',
    categoria: 'carregamento',
    etiqueta: 'Três portas USB-C',
    comentario:
      'Podes ligar o portátil, o telemóvel e o leitor à mesma tomada. Os 67 W são o máximo do carregador. Com vários aparelhos ligados, a potência é repartida pelas portas.',
  },
  {
    nome: 'Amazon Basics Nano GaN 20 W',
    asin: 'B0DBPR29MW',
    categoria: 'carregamento',
    etiqueta: 'Uma porta USB-C',
    comentario:
      'Um carregador pequeno para o leitor, o telemóvel ou os auriculares. Tem uma porta USB-C com Power Delivery. Para carregares dois aparelhos ao mesmo tempo, escolhe um modelo com mais portas.',
  },
  {
    nome: 'Cabo INIU USB-C de 2 m',
    asin: 'B09MQ4KZ27',
    categoria: 'carregamento',
    etiqueta: 'Até 100 W',
    comentario:
      'Os dois metros dão-te margem quando a tomada fica atrás da cama ou da secretária. Tem USB-C nas duas pontas e suporta até 100 W com um carregador e um aparelho compatíveis.',
  },
  {
    nome: 'Sony WF-C510',
    asin: 'B0DBLNFHLT',
    categoria: 'audio',
    etiqueta: 'Auriculares Bluetooth',
    comentario:
      'Liga-os a dois aparelhos ao mesmo tempo, por exemplo ao portátil e ao telemóvel. O modo de som ambiente deixa-te ouvir o que se passa à tua volta.',
  },
  {
    nome: 'Nothing Headphone (1)',
    asin: 'B0F66XD5LF',
    categoria: 'audio',
    etiqueta: 'Branco',
    comentario:
      'Auscultadores que cobrem a orelha, com cancelamento ativo de ruído e comandos físicos. Podes usá-los por Bluetooth ou pela entrada de 3,5 mm.',
  },
  {
    nome: 'Xiaomi Redmi Buds 8',
    asin: 'B0GQLY4D9F',
    categoria: 'audio',
    etiqueta: 'Preto',
    comentario:
      'Auriculares com cancelamento ativo de ruído e ligação a dois aparelhos. A Xiaomi anuncia até 44 horas com o estojo em condições de teste. A autonomia baixa com o cancelamento de ruído ligado.',
  },
  {
    nome: 'JBL Tune 510BT',
    asin: 'B08VDJYLS5',
    categoria: 'audio',
    etiqueta: 'Azul',
    comentario:
      'Auscultadores Bluetooth dobráveis, com almofadas que assentam sobre as orelhas. Se os queres para ouvir audiolivros, podes emparelhá-los com o telemóvel por Bluetooth.',
  },
  {
    nome: 'Tomada inteligente TP-Link Tapo P100',
    asin: 'B07Z5JD3T4',
    categoria: 'casa-tv',
    etiqueta: 'Wi-Fi',
    comentario:
      'Podes programar a hora a que um candeeiro se liga e desligá-lo à distância pela aplicação Tapo. Consulta a potência máxima na ficha antes de ligares um aparelho de maior consumo.',
  },
  {
    nome: 'Fire TV Stick 4K Plus',
    asin: 'B0F7ZFWVTC',
    categoria: 'casa-tv',
    etiqueta: 'Wi-Fi 6',
    comentario:
      'Liga-o à porta HDMI para teres aplicações de streaming numa televisão compatível. Suporta 4K e Dolby Vision. A qualidade de imagem depende da televisão, da aplicação e do plano que tens.',
  },
  {
    nome: 'Echo Dot (5.ª geração)',
    asin: 'B09B9CX8PW',
    categoria: 'casa-tv',
    etiqueta: 'Versão internacional',
    comentario:
      'Uma coluna compacta para ouvires música, pores alarmes e controlares aparelhos compatíveis com Alexa. Nesta variante, a Amazon indica que o português de Portugal não está disponível.',
  },
  {
    nome: 'Echo Dot Max',
    asin: 'B0DKLGMX7R',
    categoria: 'casa-tv',
    etiqueta: 'Versão internacional, grafite',
    comentario:
      'Tem um altifalante dedicado aos graves e um hub integrado para a casa inteligente. Vê os idiomas disponíveis na ficha se queres usar a Alexa por voz.',
  },
  {
    nome: 'Câmara TP-Link Tapo C211',
    asin: 'B0CHFG8XBZ',
    categoria: 'casa-tv',
    etiqueta: '2K para interior',
    comentario:
      'Podes rodar a câmara pela aplicação e falar com quem está na divisão pelo áudio bidirecional. A câmara foi concebida para interiores.',
  },
  {
    nome: 'iRobot Roomba 115 Combo AutoEmpty',
    asin: 'B0GQVG2D3Z',
    categoria: 'casa-tv',
    etiqueta: 'Branco',
    comentario:
      'Aspira e passa a mopa. A base esvazia o depósito de pó do robô, mas continuas a ter de tratar do pano e do reservatório de água.',
  },
  {
    nome: 'Hub USB-C Anker 555',
    asin: 'B087QZVQJX',
    categoria: 'secretaria',
    etiqueta: 'Oito ligações',
    comentario:
      'Junta HDMI, Ethernet e leitores de cartões SD e microSD numa só ligação ao portátil. Se o queres para um monitor, confirma se a porta USB-C do computador também transmite vídeo.',
  },
  {
    nome: 'Rato sem fios Logitech M171',
    asin: 'B01A9GXEOI',
    categoria: 'secretaria',
    etiqueta: 'Preto e cinzento',
    comentario:
      'Tem uma forma simétrica e liga-se através de um recetor USB. Se o teu portátil só tiver USB-C, conta com um adaptador para o recetor.',
  },
  {
    nome: 'Suporte de leitura Theodore',
    asin: 'B07NJ4VY8L',
    categoria: 'secretaria',
    etiqueta: 'Bambu, 39 × 28 cm',
    comentario:
      'Podes inclinar o suporte e usar as patilhas para manter um livro de papel aberto. Dá jeito na secretária se estiveres a consultar um manual enquanto escreves.',
  },
  {
    nome: 'Apple AirTag (2.ª geração)',
    asin: 'B0GJTFY58R',
    categoria: 'viagem',
    etiqueta: 'Para iPhone',
    comentario:
      'Põe-no na mala ou prende-o às chaves com um porta-chaves compatível. Depois de o configurares num iPhone ou iPad, podes localizá-lo na app Encontrar.',
  },
  {
    nome: 'Samsung Galaxy Watch8 (40 mm)',
    asin: 'B0FCG4B4C7',
    categoria: 'viagem',
    etiqueta: 'Bluetooth, prateado, versão espanhola',
    comentario:
      'Para registares caminhadas, treinos e sono com um telemóvel Android compatível. Esta versão é Bluetooth. Confirma também os requisitos das funções Samsung que queres usar.',
  },
];
