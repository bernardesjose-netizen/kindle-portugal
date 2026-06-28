// Inicialização do Google Analytics 4 (gtag.js).
// Vive num ficheiro próprio (servido do mesmo domínio) porque a
// Content-Security-Policy do site não permite scripts inline.
// O loader externo (googletagmanager.com) é carregado no componente
// GoogleAnalytics.astro; este ficheiro apenas arranca o dataLayer.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-MYS02Z55WX');
