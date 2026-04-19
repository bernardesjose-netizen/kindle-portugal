const LOCALE = 'pt-PT';

export function formatarPreco(valor: number | undefined | null): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return '—';
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(valor);
}

export function formatarData(data: Date | string | undefined): string {
  if (!data) return '';
  const d = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatarDataCurta(data: Date | string | undefined): string {
  if (!data) return '';
  const d = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatarIso(data: Date | string | undefined): string {
  if (!data) return '';
  const d = typeof data === 'string' ? new Date(data) : data;
  return d.toISOString();
}

export function estimarTempoLeitura(texto: string): number {
  const palavras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palavras / 220));
}
