/**
 * Mapa ASIN → URL da imagem principal do produto no CDN Amazon.
 *
 * A Amazon bloqueia pedidos vindos de Workers Cloudflare (edge IPs) ao
 * widget oficial (ws-eu.amazon-adsystem.com) e à própria página de
 * produto, portanto a resolução dinâmica server-side não é viável.
 * Em vez disso, extraímos `data-old-hires` do HTML da página manualmente
 * e guardamos o URL aqui. O browser carrega direto de m.media-amazon.com,
 * que é o CDN público de imagens e NÃO está em listas de ad-blockers.
 *
 * Como atualizar um ASIN:
 *   1. Abrir https://www.amazon.es/dp/{ASIN} (ou .com/.co.uk se não existir em .es)
 *   2. Inspecionar a imagem principal, copiar o atributo `data-old-hires`
 *   3. Substituir ou adicionar aqui.
 *
 * Alternativamente, gera-se tudo com um script:
 *   curl -A "Mozilla/5.0..." https://www.amazon.es/dp/ASIN | grep -oE 'data-old-hires="[^"]+"'
 */

export const ASIN_IMAGES: Record<string, string> = {
  // Capas para Kindle básico
  B0CPXQ7YZN: 'https://m.media-amazon.com/images/I/717q6mlbGCL._AC_SL1500_.jpg',
  B0BGHLJPMQ: 'https://m.media-amazon.com/images/I/81pUB8LRgaL._AC_SL1500_.jpg',
  B0DCBT1CDJ: 'https://m.media-amazon.com/images/I/719YYlyA2ML._AC_SL1500_.jpg',
  B0DG2GRYH5: 'https://m.media-amazon.com/images/I/71IlxgFIeXL._AC_SL1500_.jpg',
  B0BGH62NDR: 'https://m.media-amazon.com/images/I/81STCwlNffL._AC_SL1500_.jpg',

  // Capas para Kindle Paperwhite
  B0CM7ZXQWC: 'https://m.media-amazon.com/images/I/518iv3Nzk8L._AC_SL1000_.jpg',
  B0DPMFS69T: 'https://m.media-amazon.com/images/I/711HvQ5AChL._AC_SL1500_.jpg',
  B0FQJM8TF5: 'https://m.media-amazon.com/images/I/61x6Y4x4WGL._AC_SL1500_.jpg',
  B0DLP2L8H9: 'https://m.media-amazon.com/images/I/71qfqlFO-uL._AC_SL1500_.jpg',

  // Capas para Kindle Colorsoft
  B0CX8YKQ2H: 'https://m.media-amazon.com/images/I/71eNrTC1WBL._AC_SL1500_.jpg',
  B0DKC5SH43: 'https://m.media-amazon.com/images/I/81sHGQ+z96L._AC_SL1500_.jpg',
  B0DKFY294F: 'https://m.media-amazon.com/images/I/71lMhyuCwKL._AC_SL1500_.jpg',

  // Capas para Kindle Scribe
  B0B2H4ZH1M: 'https://m.media-amazon.com/images/I/41q3evGBChL._AC_SL1000_.jpg',
  B09XQ2NKW4: 'https://m.media-amazon.com/images/I/71gG4vVKYjL._AC_SL1000_.jpg',
  B0D5KPDR1X: 'https://m.media-amazon.com/images/I/41SKQoi33FL._AC_SL1000_.jpg',
  B0D5KR4JQ3: 'https://m.media-amazon.com/images/I/51VAFhs7HRL._AC_SL1000_.jpg',
  B0BN6DYCN1: 'https://m.media-amazon.com/images/I/714OsOjDJ7L._AC_SL1500_.jpg',

  // Kindles (modelos + referenciados em artigos) — ASINs válidos em Amazon.es
  B0CFPWLGF2: 'https://m.media-amazon.com/images/I/61RI4fvXHqL._AC_SL1000_.jpg', // Kindle Paperwhite 12.ª gen
  B0CP32JG8B: 'https://m.media-amazon.com/images/I/61toPUX7aDL._AC_SL1000_.jpg', // Kindle básico 2024
  B0CX8MQF7R: 'https://m.media-amazon.com/images/I/61RzHzSgEAL._AC_SL1000_.jpg', // Kindle Colorsoft
  B0CZB5RHWX: 'https://m.media-amazon.com/images/I/71XyttQ0hNL._AC_SL1000_.jpg', // Kindle Scribe 3.ª gen
  B0C8RR4WN3: 'https://m.media-amazon.com/images/I/71l4ubAJ0BL._AC_SL1500_.jpg',

  // Kobo
  B0CZXYV8GT: 'https://m.media-amazon.com/images/I/61DMtK4OPLL._AC_SL1080_.jpg', // Kobo Clara BW
  B0CZY1LRT4: 'https://m.media-amazon.com/images/I/51q5W1jepqL._AC_SL1080_.jpg', // Kobo Clara Colour
  B0CZXX465Z: 'https://m.media-amazon.com/images/I/61DFpVsTxNL._AC_SL1080_.jpg', // Kobo Libra Colour
  B0C15G7J3V: 'https://m.media-amazon.com/images/I/81ntO7Zf-sL._AC_SL1500_.jpg', // Kobo Elipsa 2E

  // Leitores BOOX (Onyx) — vendidos pela WOOK; ASINs válidos em Amazon.es
  B0DGTSHLWH: 'https://m.media-amazon.com/images/I/51Lev8774kL._AC_SL1500_.jpg', // BOOX Go 6
  B0F5495T8C: 'https://m.media-amazon.com/images/I/71CPZqw8VxL._AC_SL1500_.jpg', // BOOX Go 7
  B0F5B6KZ1H: 'https://m.media-amazon.com/images/I/612d-Gx6SNL._AC_SL1500_.jpg', // BOOX Go Color 7 (Gen II)

  // Achados Tech (produtos Amazon fora do universo e-reader)
  B09B9CX8PW: 'https://m.media-amazon.com/images/I/61vuWkj2tIL._AC_SL1000_.jpg', // Echo Dot 5.ª gen
  B0DKLGMX7R: 'https://m.media-amazon.com/images/I/71b+Eht2R5L._AC_SL1500_.jpg', // Echo Dot Max
  B0F7ZFWVTC: 'https://m.media-amazon.com/images/I/615KD4BiJKL._AC_SL1500_.jpg', // Fire TV Stick 4K Plus
  B0GJTFY58R: 'https://m.media-amazon.com/images/I/61lBuevDnnL._AC_SL1500_.jpg', // Apple AirTag 2.ª gen
  B08VDJYLS5: 'https://m.media-amazon.com/images/I/51KgWxg+Y6L._AC_SL1000_.jpg', // JBL Tune 510BT
  B0C9CJKCH3: 'https://m.media-amazon.com/images/I/614OfiBkyZL._AC_SL1500_.jpg', // Anker Nano Power Bank 10k
  B07Z5JD3T4: 'https://m.media-amazon.com/images/I/71aEoXvgIwL._SL1500_.jpg', // TP-Link Tapo P100
  B0GQLY4D9F: 'https://m.media-amazon.com/images/I/51cJaSgKkHL._AC_SL1500_.jpg', // Xiaomi Redmi Buds 8
  // Ofertas do momento (src/lib/ofertas-momento.ts)
  B0F66XD5LF: 'https://m.media-amazon.com/images/I/51lEvBqF31L._AC_SL1100_.jpg', // Nothing Headphone (1)
  B0DBLNFHLT: 'https://m.media-amazon.com/images/I/4186KwkKTuL._AC_SL1200_.jpg', // Sony WF-C510
  B0D4QVV1WV: 'https://m.media-amazon.com/images/I/61TuiK8TEmL._AC_SL1500_.jpg', // Samsung Galaxy Buds3 Pro
  B0C4FYH4YM: 'https://m.media-amazon.com/images/I/41ne-Y+I9FL._AC_SL1500_.jpg', // Belkin BoostCharge 60 W
  B0CWH4ND6V: 'https://m.media-amazon.com/images/I/51QSAWZAcrL._AC_SL1500_.jpg', // Belkin BoostCharge Pro 67 W
  B01A9GXEOI: 'https://m.media-amazon.com/images/I/41TszOgiDCL._AC_SL1200_.jpg', // Logitech M171
  B0B722494K: 'https://m.media-amazon.com/images/I/71QGE0reOSL._AC_SL1500_.jpg', // Philips Sonicare DiamondClean 9000 (2)
  B0CHFG8XBZ: 'https://m.media-amazon.com/images/I/71fjanBpbmL._AC_SL1500_.jpg', // TP-Link Tapo C211
  B0B12TTTF2: 'https://m.media-amazon.com/images/I/71OMEq8cYbL._AC_SL1500_.jpg', // Philips Sonicare DiamondClean 9000 (edição especial)
  B0D5D3WBN5: 'https://m.media-amazon.com/images/I/81SILJr9h2L._AC_SL1500_.jpg', // Oral-B iO 5
  B0GQVG2D3Z: 'https://m.media-amazon.com/images/I/61kA6Ue9NPL._AC_SL1500_.jpg', // iRobot Roomba 115 Combo
  B0D4QVNFWV: 'https://m.media-amazon.com/images/I/61O-IbM5IsL._AC_SL1500_.jpg', // Samsung Galaxy Buds3
  B0C4LSRTYT: 'https://m.media-amazon.com/images/I/71xffJfvWVL._AC_SL1500_.jpg', // Technics EAH-AZ80
  B0DT6NDW4L: 'https://m.media-amazon.com/images/I/71ubb8eK+QL._AC_SL1500_.jpg', // Philips i9000 Prestige
  B0F9X92FQH: 'https://m.media-amazon.com/images/I/813dj98ThUL._AC_SL1500_.jpg', // Braun Series 5
  B01MTF06KN: 'https://m.media-amazon.com/images/I/51ykSRmE1nL._AC_SL1000_.jpg', // Philips PowerPro Compact
  B0FCG4B4C7: 'https://m.media-amazon.com/images/I/51WGGhKn74L._AC_SL1200_.jpg', // Samsung Galaxy Watch8
  B0BPYPJ3KN: 'https://m.media-amazon.com/images/I/71QgoRIuJ9L._AC_SL1500_.jpg', // AEG QX7
  B0CHZ5WN26: 'https://m.media-amazon.com/images/I/715vVlrOSiL._AC_SL1500_.jpg', // Philips OneBlade 360
  B0CFPN47NY: 'https://m.media-amazon.com/images/I/615fBpZOMdL._AC_SL1001_.jpg', // Kindle Paperwhite Signature Edition
  B0G4SHH6YH: 'https://m.media-amazon.com/images/I/71J9n+mqpJL._AC_SL1500_.jpg', // Kindle de 2026 (16 GB, sem publicidade)
  B0FBGQYQLL: 'https://m.media-amazon.com/images/I/61Wd4f0QugL._AC_SL1500_.jpg', // Samsung Galaxy Z Flip7 FE
  B0FLDLZ7MR: 'https://m.media-amazon.com/images/I/61bcBykvJWL._AC_SL1500_.jpg', // Samsung Galaxy S25 FE
  B0H4H89QXV: 'https://m.media-amazon.com/images/I/615gMB9zOXL._AC_SL1500_.jpg', // Redmi Note 17 Pro 5G
  B0FQGLL2HL: 'https://m.media-amazon.com/images/I/71iedrwf4LL._AC_SL1500_.jpg', // Apple Watch Series 11 GPS 46 mm (oferta estrela)

  // Montra do leitor (/montra): cadernos, canetas, leitura, carregadores, capas Kobo, PocketBook
  B07XW6SWC2: 'https://m.media-amazon.com/images/I/81fWpaxOCyL._SL1500_.jpg',
  B07JVF89GB: 'https://m.media-amazon.com/images/I/81zRF9snovL._AC_SL1500_.jpg',
  B002TSIMW4: 'https://m.media-amazon.com/images/I/517Oz-MQuZL._AC_SL1181_.jpg',
  B000FA5DRK: 'https://m.media-amazon.com/images/I/61OCv1DIljL._AC_SL1500_.jpg',
  B07RZGSQK8: 'https://m.media-amazon.com/images/I/51Fvl3D9jOL._AC_SL1500_.jpg',
  B07S571HQV: 'https://m.media-amazon.com/images/I/81JYXtvUHZL._AC_SL1500_.jpg',
  B01LXOQ1KJ: 'https://m.media-amazon.com/images/I/71hJq32b6aL._AC_SL1500_.jpg',
  B08VRNBTVM: 'https://m.media-amazon.com/images/I/717vuRBkUdL._AC_SL1500_.jpg',
  B0BKSR65D4: 'https://m.media-amazon.com/images/I/61rN+rz+MxL._AC_SL1500_.jpg',
  B0BLS36X4P: 'https://m.media-amazon.com/images/I/61NFFwpXUPL._AC_SL1500_.jpg',
  B09TPRBNLH: 'https://m.media-amazon.com/images/I/51Xh-RpP3XL._AC_SL1000_.jpg',
  B07NJ4VY8L: 'https://m.media-amazon.com/images/I/71716Hct2yL._AC_SL1500_.jpg',
  B0D1KS4HVH: 'https://m.media-amazon.com/images/I/418gsM0PPJL._AC_SL1080_.jpg',
  B0H6KV2HMM: 'https://m.media-amazon.com/images/I/61yYEJ771UL._AC_SL1500_.jpg',
  B01GGKZ0V6: 'https://m.media-amazon.com/images/I/51cr-GQotHL._AC_SL1282_.jpg',
  B0BDXSHMHD: 'https://m.media-amazon.com/images/I/41Y4FiLBUYL._AC_SL1200_.jpg',
  B0DBPR29MW: 'https://m.media-amazon.com/images/I/41DMnFr9RDL._AC_SL1500_.jpg',
  B0CWH4ND6V: 'https://m.media-amazon.com/images/I/51QSAWZAcrL._AC_SL1500_.jpg',
  B0DW3DBQ2S: 'https://m.media-amazon.com/images/I/51yxBLi2U2L._AC_SL1500_.jpg',
  B0DYDZCBM3: 'https://m.media-amazon.com/images/I/614VdQKzEcL._AC_SL1500_.jpg',
  B09MQ4KZ27: 'https://m.media-amazon.com/images/I/71aKKR1W7EL._SL1500_.jpg',
  B0CGVXN52X: 'https://m.media-amazon.com/images/I/51XAWTOHLHL._AC_SL1024_.jpg',
  B0CGVTJ47Z: 'https://m.media-amazon.com/images/I/614L8heg-2L._AC_SL1500_.jpg',
  B0D1Y883G2: 'https://m.media-amazon.com/images/I/61zelwNI7PL._AC_SL1280_.jpg',
};

/**
 * Dado um ASIN, devolve o URL da imagem principal (se estiver no map)
 * ou null. O chamador deve ter um fallback (placeholder SVG).
 *
 * Aceita também um parâmetro opcional `size` (250/500/1000) que reescreve
 * o token de tamanho no URL do CDN Amazon. O CDN aceita vários formatos
 * (_SL500_, _SL1000_, _SL1500_), portanto é seguro reescrever.
 */
export function imagemParaAsin(asin: string, size?: 250 | 500 | 1000): string | null {
  const url = ASIN_IMAGES[asin];
  if (!url) return null;
  if (!size) return url;
  return url.replace(/\._[A-Z0-9_,]+_\.(jpg|png)$/i, `._AC_SL${size}_.$1`);
}
