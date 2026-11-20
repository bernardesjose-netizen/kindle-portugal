(() => {
  let iniciado = false;

  function iniciar() {
    if (iniciado) return;
    iniciado = true;

    const id = document.currentScript?.dataset.gaId
      || document.querySelector('script[data-ga-id]')?.dataset.gaId;
    if (!id) return;

    const configuracao = document.createElement('script');
    configuracao.src = '/gtag-init.js';
    configuracao.defer = true;
    document.head.append(configuracao);

    const biblioteca = document.createElement('script');
    biblioteca.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    biblioteca.async = true;
    document.head.append(biblioteca);
  }

  const opcoes = { once: true, passive: true };
  ['pointerdown', 'keydown', 'touchstart'].forEach((evento) => {
    window.addEventListener(evento, iniciar, opcoes);
  });

  window.addEventListener('load', () => {
    window.setTimeout(iniciar, 20000);
  }, { once: true });
})();
