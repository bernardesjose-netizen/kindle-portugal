/**
 * Com build.format: 'file', Astro.url.pathname contém /pagina.html (e
 * /index.html na entrada). O Cloudflare Pages publica esses ficheiros em
 * /pagina e /: os metadados devem usar esses mesmos endereços públicos.
 */
export function caminhoPublico(pathname: string): string {
  return pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '') || '/';
}
