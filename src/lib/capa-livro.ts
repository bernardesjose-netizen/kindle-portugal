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
 *   O navegador redimensiona via CSS conforme o tamanho de visualização.
 *   Para 6 imagens por post (3 cards + 3 mosaico) o peso total ronda os
 *   400-600 KB, perfeitamente aceitável com `loading="lazy"`.
 *
 * Sobre o parâmetro `tamanho`:
 *   Mantido na assinatura para compatibilidade com chamadas existentes,
 *   mas atualmente ignorado — todos os tamanhos servem a versão máxima.
 *   Pode ser usado no futuro se for necessário otimizar peso (ex.: usando
 *   `_SL400_` para mosaicos), mas a Amazon não documenta o comportamento
 *   destes tokens de forma fiável e o ganho é marginal face a `_SCLZZZZZZZ_`.
 *
 * Limitações:
 *   - É específico para LIVROS. Para Kindles/Kobos use `imagemParaAsin`.
 *   - O CDN serve a "capa de catálogo"; para imagens editoriais ricas
 *     (mock-ups, ângulos, cores) é preciso outro caminho.
 */
export type TamanhoCapa = 'pequeno' | 'medio' | 'grande';

export function urlCapaLivro(asin: string, _tamanho: TamanhoCapa = 'medio'): string {
  return `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`;
}
