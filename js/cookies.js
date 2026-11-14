/* Consentimiento de cookies: aviso con Aceptar, Rechazar y Configurar, y panel de preferencias.
   Guarda «si» o «no» para las estadísticas y avisa a js/analitica.js.
   La decisión se vuelve a pedir pasados doce meses. */
(function () {
  var CLAVE = 'kandisha-cookies';
  var CLAVE_FECHA = 'kandisha-cookies-fecha';
  var VIGENCIA = 365 * 24 * 60 * 60 * 1000;

  var aviso = document.getElementById('cookies');
  var panel = document.getElementById('cookies-config');
  if (!aviso || !panel) return;
  var casilla = document.getElementById('cookies-estadisticas');
  var origen = null;

  function leer() {
    try {
      var v = localStorage.getItem(CLAVE);
      if (v !== 'si' && v !== 'no') return null;
      var fecha = +localStorage.getItem(CLAVE_FECHA);
      if (!fecha || Date.now() - fecha > VIGENCIA) return null;
      return v;
    } catch (e) { return null; }
  }

  function cerrarPanel() {
    if (panel.open) { if (panel.close) panel.close(); else panel.removeAttribute('open'); }
  }

  function decidir(valor) {
    var antes = leer();
    try {
      localStorage.setItem(CLAVE, valor);
      localStorage.setItem(CLAVE_FECHA, String(Date.now()));
    } catch (e) {}
    aviso.hidden = true;
    cerrarPanel();
    document.dispatchEvent(new CustomEvent('kandisha:cookies', { detail: valor }));
    // Si retira un permiso ya dado, se recarga para que la medición deje de estar activa
    if (antes === 'si' && valor === 'no') { location.reload(); return; }
    if (origen && document.contains(origen) && !origen.closest('[hidden]')) origen.focus();
    origen = null;
  }

  function configurar(desde) {
    origen = desde;
    casilla.checked = leer() === 'si';
    if (panel.showModal) panel.showModal(); else panel.setAttribute('open', '');
  }

  document.getElementById('cookies-si').addEventListener('click', function () { decidir('si'); });
  document.getElementById('cookies-no').addEventListener('click', function () { decidir('no'); });
  document.getElementById('cookies-cfg').addEventListener('click', function () { configurar(this); });
  document.getElementById('cookies-cfg-si').addEventListener('click', function () { decidir('si'); });
  document.getElementById('cookies-cfg-no').addEventListener('click', function () { decidir('no'); });
  document.getElementById('cookies-cfg-guardar').addEventListener('click', function () { decidir(casilla.checked ? 'si' : 'no'); });
  var abrir = document.getElementById('cookies-abrir');
  if (abrir) abrir.addEventListener('click', function () { configurar(abrir); });
  panel.addEventListener('click', function (e) { if (e.target === panel) cerrarPanel(); });

  if (!leer()) aviso.hidden = false;
})();
