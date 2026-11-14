// Cloudflare Web Analytics: token público del JS snippet y hostname de producción.
// Vaciar TOKEN desactiva la medición. No usar aquí credenciales de la cuenta.
(function () {
  var TOKEN = '7ad31430c11c4ff9a6d3d0a82e6d8cbd';
  var HOSTNAME = 'samysrx.github.io';
  var BEACON = 'https://static.cloudflareinsights.com/beacon.min.js';

  if (!/^[a-f0-9]{32}$/i.test(TOKEN) || !HOSTNAME) return;
  // Las pruebas locales y otros dominios no deben contar como visitas.
  if (location.protocol !== 'https:' || location.hostname !== HOSTNAME) return;
  function cargar() {
    if (document.querySelector('script[data-cf-beacon]')) return;
    var script = document.createElement('script');
    script.type = 'module';
    script.src = BEACON;
    script.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }));
    document.body.appendChild(script);
  }

  // Solo se mide si el visitante lo ha aceptado en el aviso de cookies (js/cookies.js).
  var permiso = null;
  try { permiso = localStorage.getItem('kandisha-cookies'); } catch (e) {}
  if (permiso === 'si') cargar();
  document.addEventListener('kandisha:cookies', function (e) { if (e.detail === 'si') cargar(); });
})();
