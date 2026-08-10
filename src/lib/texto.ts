/**
 * Converte markdown/MDX simples em texto corrido, para uso em campos
 * de texto de JSON-LD (acceptedAnswer.text, etc.).
 */
export function mdParaTexto(md: string): string {
  return md
    .replace(/^import\s.+$/gm, '') // imports MDX
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '') // comentários MDX
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // imagens
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → texto
    .replace(/[*_`#>]/g, '') // ênfases, títulos, citações
    .replace(/\|/g, ' ') // tabelas
    .replace(/\s+/g, ' ')
    .trim();
}
