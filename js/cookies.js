/* Aviso de cookies: guarda la decisión del visitante y avisa a js/analitica.js.
   «si» permite las estadísticas de visitas; «no» las deja desactivadas. */
(function () {
  var CLAVE = 'kandisha-cookies';
  var caja = document.getElementById('cookies');
  if (!caja) return;
  var abrir = document.getElementById('cookies-abrir');
  var origen = null;

  function leer() {
    try { var v = localStorage.getItem(CLAVE); return v === 'si' || v === 'no' ? v : null; } catch (e) { return null; }
  }

  function decidir(valor) {
    var antes = leer();
    try { localStorage.setItem(CLAVE, valor); } catch (e) {}
    caja.hidden = true;
    document.dispatchEvent(new CustomEvent('kandisha:cookies', { detail: valor }));
    // Si retira un permiso ya dado, se recarga para que la medición deje de estar activa
    if (antes === 'si' && valor === 'no') { location.reload(); return; }
    if (origen) { origen.focus(); origen = null; }
  }

  document.getElementById('cookies-si').addEventListener('click', function () { decidir('si'); });
  document.getElementById('cookies-no').addEventListener('click', function () { decidir('no'); });
  if (abrir) abrir.addEventListener('click', function () {
    origen = abrir;
    caja.hidden = false;
    document.getElementById('cookies-no').focus();
  });

  if (!leer()) caja.hidden = false;
})();
