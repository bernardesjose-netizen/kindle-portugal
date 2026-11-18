import type { ImageMetadata } from 'astro';

interface LojaBlackFriday {
  loja: 'amazon' | 'worten' | 'outra';
  nomeLoja?: string;
  url: string;
  linkAfiliado?: string;
}

export interface OfertaBlackFriday extends LojaBlackFriday {
  id: string;
  nome: string;
  detalhe: string;
  verificadaEm: string;
  imagem?: {
    src: string | ImageMetadata;
    largura?: number;
    altura?: number;
    alt: string;
    credito?: string;
    fonte?: string;
    licenca?: { nome: string; url: string };
    alteracao?: string;
    destino?: LojaBlackFriday;
  };
  destaque?: boolean;
  etiqueta?: string;
  alternativa?: LojaBlackFriday;
  expiraEm?: string;
  preco?: string;
  referencia?: string;
}

export const GUIA_BLACK_FRIDAY = '/guias/black-friday-2026-kindle';
