// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkAmazonTag } from './src/lib/remark-amazon-tag.ts';

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
      i18n: {
        defaultLocale: 'pt',
        locales: { pt: 'pt-PT' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
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
