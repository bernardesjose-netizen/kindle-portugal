// Publica automaticamente os posts de "Três Ebooks" agendados.
//
// Percorre src/content/tres-livros, procura ficheiros com
// `rascunho: true` cuja `data_publicacao` ja chegou (<= hoje, UTC) e
// muda-os para `rascunho: false`. Imprime no stdout o slug de cada
// post publicado (um por linha) para o workflow consumir; as mensagens
// informativas vao para o stderr.
//
// So mexe no frontmatter (primeiro bloco --- ... ---) e so altera o
// proprio campo `rascunho` — nao toca em mais nada.
//
// Uso: `node scripts/publicar-agendados.mjs`

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/tres-livros';
const hoje = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)

const publicados = [];

for (const nome of readdirSync(DIR)) {
  if (!/\.(mdx?|md)$/.test(nome)) continue;

  const caminho = join(DIR, nome);
  const texto = readFileSync(caminho, 'utf8');

  // Isola o frontmatter: primeiro bloco entre --- e ---
  const fm = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const bloco = fm[1];

  // So nos interessam os que estao mesmo em rascunho
  if (!/^\s*rascunho:\s*true\s*$/m.test(bloco)) continue;

  // Le a data de publicacao (YYYY-MM-DD)
  const md = bloco.match(/^\s*data_publicacao:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
  if (!md) continue;
  const data = md[1];

  // Comparacao lexicografica funciona para datas ISO (YYYY-MM-DD)
  if (data > hoje) continue; // ainda nao chegou a data

  // Muda rascunho: true -> false, apenas dentro do frontmatter
  const novoBloco = bloco.replace(/^(\s*rascunho:\s*)true(\s*)$/m, '$1false$2');
  const novoTexto = texto.replace(bloco, () => novoBloco);
  writeFileSync(caminho, novoTexto, 'utf8');

  publicados.push(nome.replace(/\.(mdx?|md)$/, ''));
}

if (publicados.length === 0) {
  console.error(`Nada a publicar hoje (${hoje}).`);
} else {
  console.error(`Publicados hoje (${hoje}): ${publicados.join(', ')}`);
}

// stdout: um slug por linha (consumido pelo GitHub Action)
for (const slug of publicados) console.log(slug);
