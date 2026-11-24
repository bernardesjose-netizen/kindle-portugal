/** Imagens autorizadas pela Creators API. Não guardar os bytes da fotografia. */
const IMAGENS = {
  '9897228411': { largura: 300, altura: 450 },
  B0G4SHH6YH: { largura: 313, altura: 500 },
  B0CFPWLGF2: { largura: 500, altura: 500 },
  B0CM7ZXQWC: { largura: 500, altura: 500 },
  B0C4LSRTYT: { largura: 500, altura: 500 },
} as const;

export function imagemAmazonApi(asin: string) {
  if (!Object.hasOwn(IMAGENS, asin)) return null;
  return {
    src: `/api/amazon-imagem/${asin}?site=kindle`,
    ...IMAGENS[asin as keyof typeof IMAGENS],
  };
}

export function temImagemAmazonApi(livro: { asin?: string }): boolean {
  return Boolean(livro.asin && Object.hasOwn(IMAGENS, livro.asin));
}

/** JSON público com o detailPageURL oficial; nunca é usado como href de uma âncora. */
export function endpointProdutoAmazonApi(asin: string): string | null {
  return Object.hasOwn(IMAGENS, asin) ? `/api/amazon-produto/${asin}?site=kindle` : null;
}
