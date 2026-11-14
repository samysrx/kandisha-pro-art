/* Opciones de accesibilidad: tamaño del texto, alto contraste, enlaces subrayados y
   animaciones detenidas. Se carga en <head> para aplicar las preferencias antes de pintar. */
(function () {
  var raiz = document.documentElement;
  var CLAVE = 'kandisha-accesibilidad';
  var op = { texto: 0, contraste: false, enlaces: false, quieto: false };

  try {
    var guardado = JSON.parse(localStorage.getItem(CLAVE) || '{}');
    Object.keys(op).forEach(function (k) { if (typeof guardado[k] === typeof op[k]) op[k] = guardado[k]; });
  } catch (e) {}
  if (op.texto < 0 || op.texto > 2) op.texto = 0;

  function aplicar() {
    raiz.classList.toggle('acc-texto-1', op.texto === 1);
    raiz.classList.toggle('acc-texto-2', op.texto === 2);
    raiz.classList.toggle('acc-contraste', op.contraste);
    raiz.classList.toggle('acc-enlaces', op.enlaces);
    raiz.classList.toggle('acc-quieto', op.quieto);
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(op)); } catch (e) {} }
  aplicar();

  document.addEventListener('DOMContentLoaded', function () {
    var caja = document.getElementById('acc');
    var boton = document.getElementById('acc-boton');
    var panel = document.getElementById('acc-panel');
    if (!caja || !boton || !panel) return;
    var tamanos = [].slice.call(panel.querySelectorAll('[data-acc-texto]'));
    var opciones = [].slice.call(panel.querySelectorAll('[data-acc]'));

    function pintar() {
      tamanos.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-acc-texto') === op.texto)); });
      opciones.forEach(function (b) { b.setAttribute('aria-pressed', String(!!op[b.getAttribute('data-acc')])); });
    }
    function abrir(si) {
      panel.hidden = !si;
      boton.setAttribute('aria-expanded', String(si));
    }
    // Las animaciones se deciden al cargar la página: al cambiar esa opción se recarga
    function cambiar(recargar) {
      aplicar(); guardar(); pintar();
      if (recargar) location.reload();
    }

    boton.addEventListener('click', function () { abrir(panel.hidden); });
    tamanos.forEach(function (b) {
      b.addEventListener('click', function () { op.texto = +b.getAttribute('data-acc-texto'); cambiar(false); });
    });
    opciones.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-acc');
        op[k] = !op[k];
        cambiar(k === 'quieto');
      });
    });
    document.getElementById('acc-reset').addEventListener('click', function () {
      var recargar = op.quieto;
      op = { texto: 0, contraste: false, enlaces: false, quieto: false };
      cambiar(recargar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { abrir(false); boton.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !caja.contains(e.target)) abrir(false);
    });
    pintar();
  });
})();
