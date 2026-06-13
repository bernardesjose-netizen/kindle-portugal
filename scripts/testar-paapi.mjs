// Teste de acesso à PA API (Product Advertising API 5.0) da Amazon.
//
// Faz um GetItems ao ASIN do Kindle Paperwhite na amazon.es e imprime
// título e preço. Serve para confirmar se a conta já tem acesso ativo:
// - Resposta com dados  -> acesso OK, podemos construir a integração.
// - AssociateNotEligible / AccessDenied -> ainda sem elegibilidade.
//
// Credenciais: lê do ambiente (nunca ficam no repositório).
//   PAAPI_ACCESS_KEY  — chave de acesso gerada na consola de afiliados
//   PAAPI_SECRET_KEY  — chave secreta correspondente
//   PAAPI_PARTNER_TAG — tag de associado (por omissão: compleitdee04-21)
//
// Uso (PowerShell):
//   $env:PAAPI_ACCESS_KEY='...'; $env:PAAPI_SECRET_KEY='...'; node scripts/testar-paapi.mjs
// Uso (bash):
//   PAAPI_ACCESS_KEY=... PAAPI_SECRET_KEY=... node scripts/testar-paapi.mjs
//
// Sem dependências: assinatura AWS SigV4 feita com node:crypto.

import { createHash, createHmac } from 'node:crypto';

const ACCESS_KEY = process.env.PAAPI_ACCESS_KEY;
const SECRET_KEY = process.env.PAAPI_SECRET_KEY;
const PARTNER_TAG = process.env.PAAPI_PARTNER_TAG ?? 'compleitdee04-21';

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error('Faltam credenciais: define PAAPI_ACCESS_KEY e PAAPI_SECRET_KEY no ambiente.');
  console.error('Exemplo (PowerShell):');
  console.error("  $env:PAAPI_ACCESS_KEY='AKIA...'; $env:PAAPI_SECRET_KEY='...'; node scripts/testar-paapi.mjs");
  process.exit(2);
}

// Endpoint da amazon.es (marketplace espanhol, região eu-west-1)
const HOST = 'webservices.amazon.es';
const REGION = 'eu-west-1';
const SERVICE = 'ProductAdvertisingAPI';
const PATH = '/paapi5/getitems';
const TARGET = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems';

const payload = JSON.stringify({
  ItemIds: ['B0CFPWLGF2'], // Kindle Paperwhite 12.ª geração
  PartnerTag: PARTNER_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.es',
  Resources: [
    'ItemInfo.Title',
    'Offers.Listings.Price',
    'Images.Primary.Medium',
  ],
});

// ---- Assinatura AWS Signature V4 ----
const agora = new Date();
const amzDate = agora.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDD'T'HHMMSS'Z'
const dataStamp = amzDate.slice(0, 8);

const sha256hex = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const hmac = (key, s) => createHmac('sha256', key).update(s, 'utf8').digest();

const headersCanonicos =
  `content-encoding:amz-1.0\n` +
  `content-type:application/json; charset=utf-8\n` +
  `host:${HOST}\n` +
  `x-amz-date:${amzDate}\n` +
  `x-amz-target:${TARGET}\n`;
const headersAssinados = 'content-encoding;content-type;host;x-amz-date;x-amz-target';

const pedidoCanonico = [
  'POST', PATH, '',
  headersCanonicos,
  headersAssinados,
  sha256hex(payload),
].join('\n');

const ambito = `${dataStamp}/${REGION}/${SERVICE}/aws4_request`;
const stringParaAssinar = ['AWS4-HMAC-SHA256', amzDate, ambito, sha256hex(pedidoCanonico)].join('\n');

let chave = hmac(`AWS4${SECRET_KEY}`, dataStamp);
chave = hmac(chave, REGION);
chave = hmac(chave, SERVICE);
chave = hmac(chave, 'aws4_request');
const assinatura = createHmac('sha256', chave).update(stringParaAssinar, 'utf8').digest('hex');

const autorizacao =
  `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${ambito}, ` +
  `SignedHeaders=${headersAssinados}, Signature=${assinatura}`;

// ---- Chamada ----
const resposta = await fetch(`https://${HOST}${PATH}`, {
  method: 'POST',
  headers: {
    'content-encoding': 'amz-1.0',
    'content-type': 'application/json; charset=utf-8',
    'x-amz-date': amzDate,
    'x-amz-target': TARGET,
    Authorization: autorizacao,
  },
  body: payload,
});

const corpo = await resposta.json().catch(() => ({}));

if (resposta.ok && corpo.ItemsResult?.Items?.length) {
  const item = corpo.ItemsResult.Items[0];
  console.log('ACESSO OK — a PA API respondeu com dados:');
  console.log(`  Título: ${item.ItemInfo?.Title?.DisplayValue ?? '(sem título)'}`);
  console.log(`  Preço:  ${item.Offers?.Listings?.[0]?.Price?.DisplayAmount ?? '(sem oferta)'}`);
  console.log(`  Imagem: ${item.Images?.Primary?.Medium?.URL ?? '(sem imagem)'}`);
  process.exit(0);
} else {
  const erros = corpo.Errors ?? corpo.__type ? [corpo] : [];
  console.error(`SEM ACESSO (HTTP ${resposta.status}).`);
  for (const e of corpo.Errors ?? []) console.error(`  ${e.Code}: ${e.Message}`);
  if (!corpo.Errors) console.error(JSON.stringify(corpo).slice(0, 400));
  console.error('\nSe o erro for AssociateNotEligible/AccessDenied, a conta ainda não');
  console.error('cumpre a elegibilidade (3 vendas/180 dias para pedir; 10/30 para manter).');
  process.exit(1);
}
