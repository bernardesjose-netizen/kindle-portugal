export const SITE = {
  nome: 'Kindle Portugal',
  tagline: 'Guias, reviews e dicas sobre Kindle e ebooks em Portugal',
  descricao:
    'O que saber antes de comprar um Kindle em Portugal, como enviar ebooks, conversores, bibliotecas digitais e reviews honestas — em português europeu.',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://kindleportugal.com',
  idioma: 'pt-PT',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'kindleportugal@gmail.com',
  amazonTag: import.meta.env.PUBLIC_AMAZON_TAG ?? '',
  autorOrganizacao: {
    nome: 'Kindle Portugal',
    url: 'https://kindleportugal.com',
  },
} as const;

/**
 * Autor editorial do site. Usado em assinaturas, schemas JSON-LD
 * (Person/Author) e na página /sobre.
 *
 * `desde` é o ano em que se começou a ler em Kindle.
 */
export const AUTOR = {
  nome: 'JC Bernardes',
  funcao: 'Editor',
  desde: 2009,
  modelosAtuais: ['Kindle básico', 'Kindle Paperwhite'] as readonly string[],
  resumo:
    'JC Bernardes é o editor do Kindle Portugal. Lê em Kindle desde 2009. Começou num Kindle 2, com teclado físico. Usa atualmente um Kindle básico e um Paperwhite.',
} as const;

export const NAVEGACAO_PRINCIPAL = [
  { label: 'Modelos', href: '/modelos' },
  { label: 'Guias', href: '/guias' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
] as const;

export const NAVEGACAO_RODAPE = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Divulgação de afiliados', href: '/divulgacao-afiliados' },
  { label: 'Política de privacidade', href: '/politica-privacidade' },
  { label: 'Termos', href: '/termos' },
] as const;
