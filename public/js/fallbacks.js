// Fallbacks de imagens sem handlers inline (a CSP bloqueia onerror inline).
// data-fallback="hide" oculta a imagem; "hide-pai" oculta o elemento pai;
// "hide-li" oculta o <li> mais próximo; qualquer outro valor troca o src
// uma única vez.
document.addEventListener(
  'error',
  function (e) {
    var el = e.target;
    if (!el || el.tagName !== 'IMG') return;
    var fb = el.getAttribute('data-fallback');
    if (!fb) return;
    if (fb === 'hide') {
      el.style.display = 'none';
    } else if (fb === 'hide-pai') {
      if (el.parentElement) el.parentElement.style.display = 'none';
    } else if (fb === 'hide-li') {
      var li = el.closest('li');
      if (li) li.style.display = 'none';
    } else if (!el.dataset.fallbackAplicado) {
      el.dataset.fallbackAplicado = '1';
      el.src = fb;
    }
  },
  true
);
