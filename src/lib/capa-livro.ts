import { redimensionarImagemAmazon } from './asin-images';

/**
 * Constrói o URL da capa de um livro a partir do seu ASIN, usando o CDN
 * público de imagens de produto da Amazon (m.media-amazon.com/images/P/).
 *
 * Diferente de `imagemParaAsin` em `asin-images.ts`, esta função:
 *   - Funciona universalmente para qualquer livro com ASIN, sem mapa estático.
 *   - Usa o endpoint `images/P/{ASIN}.01._SCLZZZZZZZ_.jpg` que serve capas
 *     genéricas direto do CDN público, sem passar pelo widget Amazon Associates
 *     (que está bloqueado a partir de Workers Cloudflare).
 *
 * Sobre a resolução:
 *   O token `_SCLZZZZZZZ_` é o "tamanho legacy/máximo" da Amazon, que serve
 *   a imagem na resolução nativa que a Amazon tem indexada para cada livro
 *   (tipicamente 600 a 1800px de altura, dependendo da idade e categoria
 *   do livro). É a melhor qualidade disponível sem widget.
 *
 * Sobre o parâmetro `tamanho`:
 *   Quando há `capaAmazon` (URL `images/I/`), pede ao CDN a capa já reduzida
 *   (`_SL400_`, `_SL500_` ou `_SL1000_`, ver PX_CAPA). Medido em 06/11/2026:
 *   uma capa de 1000×1500 com 216 KB passa a 333×500 com 43 KB. As capas
 *   `images/P/` continuam na resolução nativa.
 *
 * Limitações:
 *   - É específico para LIVROS. Para Kindles/Kobos use `imagemParaAsin`.
 *   - O CDN serve a "capa de catálogo"; para imagens editoriais ricas
 *     (mock-ups, ângulos, cores) é preciso outro caminho.
 */
export type TamanhoCapa = 'pequeno' | 'medio' | 'grande';

// O lado maior corresponde ao dobro do tamanho mostrado em cada contexto.
const PX_CAPA: Record<TamanhoCapa, number> = { pequeno: 400, medio: 500, grande: 1000 };

export function urlCapaLivro(asin: string | undefined, tamanho: TamanhoCapa = 'medio', capaAmazon?: string): string {
  if (capaAmazon) return redimensionarImagemAmazon(capaAmazon, PX_CAPA[tamanho]);
  if (!asin) return '/placeholder-livro.svg';
  return `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`;
}
