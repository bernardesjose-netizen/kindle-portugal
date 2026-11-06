// Ativa a folha de estilos do Google Fonts sem bloquear a primeira pintura.
// O <link id="fontes-web"> chega com media="print" (descarrega em segundo
// plano sem atrasar a página) e passa a "all" quando este script corre
// (defer, depois de lido o HTML). Se a folha ainda não tiver chegado, é
// aplicada mal chegue. Ficheiro próprio porque a CSP do site não permite
// handlers inline (onload).
(function () {
  var link = document.getElementById('fontes-web');
  if (link) link.media = 'all';
})();
