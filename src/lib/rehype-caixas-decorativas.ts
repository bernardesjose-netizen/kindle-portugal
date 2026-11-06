/**
 * As listas de verificação do Markdown (`- [ ] item`) geram
 * `<input type="checkbox" disabled>` sem rótulo. São só decoração (o texto
 * do item já diz tudo e não se podem marcar), por isso ficam escondidas dos
 * leitores de ecrã, em vez de serem anunciadas como campos sem nome.
 */
interface NoHast {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: NoHast[];
}

function visitar(no: NoHast): void {
  if (
    no.type === 'element' &&
    no.tagName === 'input' &&
    no.properties?.type === 'checkbox' &&
    no.properties?.disabled
  ) {
    no.properties.ariaHidden = 'true';
  }
  no.children?.forEach(visitar);
}

export function rehypeCaixasDecorativas() {
  return (arvore: NoHast) => visitar(arvore);
}
