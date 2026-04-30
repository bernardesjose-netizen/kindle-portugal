/**
 * Constrói o URL da capa de um livro a partir do seu ASIN, usando o CDN
 * público de imagens de produto da Amazon (m.media-amazon.com/images/P/).
 *
 * Diferente de `imagemParaAsin` em `asin-images.ts`, esta função:
 *   - Funciona universalmente para qualquer livro com ASIN, sem mapa estático.
 *   - Usa o endpoint `images/P/{ASIN}.01._SC...` que serve capas genéricas
 *     direto do CDN público, sem passar pelo widget Amazon Associates
 *     (que está bloqueado a partir de Workers Cloudflare).
 *
 * Limitações:
 *   - É específico para LIVROS. Para Kindles/Kobos use `imagemParaAsin`.
 *   - O CDN serve a "capa de catálogo" mais simples; para imagens
 *     editoriais ricas (mock-ups, ângulos, cores) é preciso outro caminho.
 *
 * Tamanhos suportados pelo token _SC...:
 *   - SL250 (~250px) — para mosaicos pequenos
 *   - SL500 (~500px) — para cards e hero compactos
 *   - SL1000 (~1000px) — para hero amplo ou retina
 */
export type TamanhoCapa = 'pequeno' | 'medio' | 'grande';

const TOKENS_TAMANHO: Record<TamanhoCapa, string> = {
  pequeno: 'SL250',
  medio: 'SL500',
  grande: 'SL1000',
};

export function urlCapaLivro(asin: string, tamanho: TamanhoCapa = 'medio'): string {
  const token = TOKENS_TAMANHO[tamanho];
  return `https://m.media-amazon.com/images/P/${asin}.01._SC${token}_.jpg`;
}
