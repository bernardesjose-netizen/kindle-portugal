// Teste de acesso à Creators API da Amazon (a via nova da PA API).
//
// Fluxo, conforme a documentação oficial (afiliados.amazon.es/creatorsapi/docs):
//   1. Obter access token OAuth2 no endpoint LwA da região EU
//      (credenciais versão 3.2): POST https://api.amazon.co.uk/auth/o2/token
//   2. Chamar GetItems: POST https://creatorsapi.amazon/catalog/v1/getItems
//      com Authorization: Bearer e x-marketplace: www.amazon.es
//
// Resultado:
//   - Dados do produto  -> ACESSO OK (elegibilidade confirmada)
//   - AssociateNotEligible / 403 -> conta ainda sem as 10 vendas/30 dias
//
// Credenciais: lê de .env na raiz do projeto (gitignored) ou do ambiente.
//   CREATORS_CLIENT_ID     — ID da credencial (amzn1.application-oa2-client....)
//   CREATORS_CLIENT_SECRET — segredo correspondente
//   PAAPI_PARTNER_TAG      — tag de associado (default: compleitdee04-21)
//
// Uso: node scripts/testar-creators-api.mjs

import { readFileSync, existsSync } from 'node:fs';

// ---- Carregar .env simples (KEY=VALOR, sem dependências) ----
if (existsSync('.env')) {
  for (const linha of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

const CLIENT_ID = process.env.CREATORS_CLIENT_ID;
const CLIENT_SECRET = process.env.CREATORS_CLIENT_SECRET;
const PARTNER_TAG = process.env.PAAPI_PARTNER_TAG ?? 'compleitdee04-21';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Faltam credenciais. Define no .env (raiz do projeto) ou no ambiente:');
  console.error('  CREATORS_CLIENT_ID=amzn1.application-oa2-client....');
  console.error('  CREATORS_CLIENT_SECRET=...');
  console.error('O .env está no .gitignore; o segredo nunca sai da tua máquina.');
  process.exit(2);
}

// ---- Passo 1: token (endpoint EU para credenciais v3.2) ----
const TOKEN_URL = 'https://api.amazon.co.uk/auth/o2/token';

console.error('1/2 A obter access token (LwA, região EU)...');
const respToken = await fetch(TOKEN_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'creatorsapi::default',
  }),
});

const corpoToken = await respToken.json().catch(() => ({}));
if (!respToken.ok || !corpoToken.access_token) {
  console.error(`FALHA NO TOKEN (HTTP ${respToken.status}):`);
  console.error(JSON.stringify(corpoToken).slice(0, 500));
  console.error('\nCausas habituais: client_id/secret errados, ou credencial eliminada.');
  process.exit(1);
}
console.error('   Token obtido.');

// ---- Passo 2: GetItems no marketplace espanhol ----
const API_URL = 'https://creatorsapi.amazon/catalog/v1/getItems';

console.error('2/2 A chamar GetItems (Kindle Paperwhite, amazon.es)...');
const respItens = await fetch(API_URL, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${corpoToken.access_token}`,
    'Content-Type': 'application/json',
    'x-marketplace': 'www.amazon.es',
  },
  body: JSON.stringify({
    itemIds: ['B0CFPWLGF2'], // Kindle Paperwhite 12.ª geração
    itemIdType: 'ASIN',
    marketplace: 'www.amazon.es',
    partnerTag: PARTNER_TAG,
    resources: ['itemInfo.title', 'images.primary.medium'],
  }),
});

const corpoItens = await respItens.json().catch(() => ({}));
const item = corpoItens.itemsResult?.items?.[0];

if (respItens.ok && item) {
  console.log('ACESSO OK — a Creators API respondeu com dados:');
  console.log(`  ASIN:   ${item.asin}`);
  console.log(`  Título: ${item.itemInfo?.title?.displayValue ?? '(sem título)'}`);
  console.log(`  Imagem: ${item.images?.primary?.medium?.url ?? '(não pedida/indisponível)'}`);
  console.log(`  Link:   ${item.detailPageURL ?? ''}`);
  console.log('\nElegibilidade confirmada. Podemos construir a integração de preços.');
  process.exit(0);
} else {
  console.error(`SEM ACESSO (HTTP ${respItens.status}):`);
  console.error(JSON.stringify(corpoItens).slice(0, 600));
  console.error('\nSe vires "AssociateNotEligible", a conta ainda não tem as 10 vendas');
  console.error('qualificadas nos últimos 30 dias (avaliação pode demorar até 48h após');
  console.error('criar a credencial).');
  process.exit(1);
}
