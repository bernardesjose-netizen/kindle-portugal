// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkAmazonTag } from './src/lib/remark-amazon-tag.ts';
import { campanhaVisivel } from './src/lib/promocoes.ts';
import { caminhoPublico } from './src/lib/urls.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://kindleportugal.com',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt'],
  },
  markdown: {
    remarkPlugins: [remarkAmazonTag],
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkAmazonTag],
    }),
    sitemap({
      // Fora da campanha, /promocoes mostra apenas um aviso e tem noindex.
      // Usar a mesma condição da página para a incluir apenas quando indexável.
      filter: (page) => caminhoPublico(new URL(page).pathname) !== '/promocoes' || campanhaVisivel(),
      i18n: {
        defaultLocale: 'pt',
        locales: { pt: 'pt-PT' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Nunca embutir scripts no HTML: a CSP (public/_headers) só aceita
      // scripts servidos como ficheiro ('self'), e um script embutido é
      // bloqueado em produção sem aviso (foi assim que a contagem parou).
      assetsInlineLimit: (caminho) => (/\.(js|mjs|ts)$/.test(caminho) ? false : undefined),
    },
  },
  build: {
    assets: 'assets',
    // 'file' gera /pagina.html (servida em /pagina sem redirect no
    // Cloudflare Pages) — coerente com trailingSlash: 'never' e com os
    // canonicals/sitemap sem barra final.
    format: 'file',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
