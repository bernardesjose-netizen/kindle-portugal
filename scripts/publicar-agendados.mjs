// Publica automaticamente os posts agendados do blog, de "Três Ebooks"
// e dos guias.
//
// Percorre src/content/blog, src/content/tres-livros e src/content/guias,
// procura ficheiros com `rascunho: true` cuja `data_publicacao` ja chegou
// (<= hoje, hora de Lisboa) e muda-os para `rascunho: false`. Imprime no
// stdout o caminho de cada post publicado (um por linha, no formato
// `blog/slug`, `tres-livros/slug` ou `guias/slug`) para o workflow
// consumir; as mensagens informativas vao para o stderr.
//
// So mexe no frontmatter (primeiro bloco --- ... ---) e so altera o
// proprio campo `rascunho` — nao toca em mais nada.
//
// Uso: `node scripts/publicar-agendados.mjs`

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Coleções abrangidas: o nome da pasta coincide com o segmento do URL.
const DIRS = ['blog', 'tres-livros', 'guias'];
// YYYY-MM-DD na hora local de Portugal (en-CA da formato ISO).
// Assim, a corrida da meia-noite de Lisboa ja conta o dia novo.
const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Lisbon' });

const publicados = [];

for (const colecao of DIRS)
for (const nome of readdirSync(join('src/content', colecao))) {
  if (!/\.(mdx?|md)$/.test(nome)) continue;

  const caminho = join('src/content', colecao, nome);
  const texto = readFileSync(caminho, 'utf8').replace(/^\uFEFF/, '');

  // Isola o frontmatter: primeiro bloco entre --- e ---
  const fm = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const bloco = fm[1];

  // So nos interessam os que estao mesmo em rascunho
  if (!/^rascunho:\s*true\s*$/m.test(bloco)) continue;

  // Le a data de publicacao (YYYY-MM-DD)
  const md = bloco.match(/^\s*data_publicacao:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
  if (!md) continue;
  const data = md[1];

  // Comparacao lexicografica funciona para datas ISO (YYYY-MM-DD)
  if (data > hoje) continue; // ainda nao chegou a data

  // Muda rascunho: true -> false, apenas dentro do frontmatter
  const novoBloco = bloco.replace(/^(rascunho:\s*)true(\s*)$/m, '$1false$2');
  const novoTexto = texto.replace(bloco, () => novoBloco);
  writeFileSync(caminho, novoTexto, 'utf8');

  publicados.push(`${colecao}/${nome.replace(/\.(mdx?|md)$/, '')}`);
}

if (publicados.length === 0) {
  console.error(`Nada a publicar hoje (${hoje}).`);
} else {
  console.error(`Publicados hoje (${hoje}): ${publicados.join(', ')}`);
}

// stdout: um caminho por linha, ex. `blog/slug` (consumido pelo GitHub Action)
for (const slug of publicados) console.log(slug);
