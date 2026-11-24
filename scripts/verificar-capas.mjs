import { parse } from 'yaml';
import sharp from 'sharp';
import { urlCapaLivro } from '../src/lib/capa-livro.ts';

async function verificarImagem(url) {
  if (new URL(url).hostname !== 'm.media-amazon.com') throw new Error('Fonte de capa por verificar');
  const resposta = await fetch(url, {
    headers: { Range: 'bytes=0-32767' },
    signal: AbortSignal.timeout(10000),
    redirect: 'error',
  });
  const leitor = resposta.body?.getReader();
  if (!leitor) throw new Error('Imagem sem conteúdo');
  try {
    if (!resposta.ok || !resposta.headers.get('content-type')?.startsWith('image/')) {
      throw new Error('Imagem indisponível');
    }
    // Basta o cabeçalho para distinguir uma capa do píxel 1×1 do catálogo.
    const partes = [];
    let total = 0;
    while (total < 32768) {
      const { done, value } = await leitor.read();
      if (done) break;
      const parte = value.subarray(0, 32768 - total);
      partes.push(parte);
      total += parte.length;
    }
    const { width, height } = await sharp(Buffer.concat(partes), { failOn: 'none' }).metadata();
    if (!(width > 70 && height > 100)) throw new Error('Dimensões insuficientes');
  } finally {
    await leitor.cancel();
  }
}

export async function verificarCapas(frontmatter) {
  const { livros, convidado_ingles } = parse(frontmatter);
  if (!Array.isArray(livros) || livros.length !== 3) throw new Error('São necessários três livros.');
  for (const livro of convidado_ingles ? [...livros, convidado_ingles] : livros) {
    for (const tamanho of ['pequeno', 'medio']) {
      const url = urlCapaLivro(livro.asin, tamanho, livro.capa_amazon);
      for (let tentativa = 1; ; tentativa++) {
        try {
          await verificarImagem(url);
          break;
        } catch {
          if (tentativa === 2) throw new Error(`Verificar a capa de «${livro.titulo}» (${tamanho}).`);
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      }
    }
  }
}
