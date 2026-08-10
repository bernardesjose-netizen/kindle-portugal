// Fallbacks de imagens sem handlers inline (a CSP bloqueia onerror inline).
// Imagens com data-fallback="hide" são ocultadas em caso de erro;
// com data-fallback="/caminho.svg" trocam o src uma única vez.
document.addEventListener(
  'error',
  function (e) {
    var el = e.target;
    if (!el || el.tagName !== 'IMG') return;
    var fb = el.getAttribute('data-fallback');
    if (!fb) return;
    if (fb === 'hide') {
      el.style.display = 'none';
    } else if (!el.dataset.fallbackAplicado) {
      el.dataset.fallbackAplicado = '1';
      el.src = fb;
    }
  },
  true
);
