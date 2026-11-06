import { SITE } from '@lib/site';

interface DadosFicha {
  nome: string;
  fabricante: string;
  descricao: string;
  asin?: string;
  /** Preço confirmado. Sem ele não há `Offer`. */
  preco?: number;
  urlOferta?: string;
  /** URL schema.org da disponibilidade (p. ex. https://schema.org/InStock). */
  disponibilidade?: string;
  dataPublicacao: Date;
  dataRevisao?: Date;
  /** URL absoluto da ficha no site. */
  urlPagina: string;
  /** URL absoluto de uma imagem da ficha, se houver. */
  imagem?: string;
}

/**
 * JSON-LD de uma ficha de modelo (Kindle, Boox).
 *
 * O Google só aceita um `Product` com `offers`, `review` ou `aggregateRating`;
 * sem nenhum dos três, a página é marcada como inválida nos Fragmentos do
 * produto. Por isso:
 *  - com preço e URL de compra confirmados, a ficha é um `Product` com `Offer`;
 *  - sem preço, é descrita como `Article`. Não inventamos preços, e as estrelas
 *    da Amazon não podem ser usadas (cláusula t do acordo dos Afiliados).
 */
export function fichaJsonLd(f: DadosFicha): Record<string, unknown> {
  if (f.preco && f.urlOferta) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: f.nome,
      brand: { '@type': 'Brand', name: f.fabricante },
      description: f.descricao,
      url: f.urlPagina,
      ...(f.asin ? { sku: f.asin } : {}),
      ...(f.imagem ? { image: f.imagem } : {}),
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: f.preco,
        url: f.urlOferta,
        ...(f.disponibilidade ? { availability: f.disponibilidade } : {}),
      },
    };
  }

  const organizacao = {
    '@type': 'Organization',
    name: SITE.autorOrganizacao.nome,
    url: SITE.autorOrganizacao.url,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: f.nome,
    description: f.descricao,
    inLanguage: 'pt-PT',
    datePublished: f.dataPublicacao.toISOString(),
    dateModified: (f.dataRevisao ?? f.dataPublicacao).toISOString(),
    author: organizacao,
    publisher: organizacao,
    mainEntityOfPage: f.urlPagina,
    ...(f.imagem ? { image: f.imagem } : {}),
  };
}
