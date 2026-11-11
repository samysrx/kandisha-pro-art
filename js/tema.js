// Se ejecuta en <head> para aplicar el tema antes del primer pintado.
(function () {
  var raiz = document.documentElement;
  var sistema = window.matchMedia('(prefers-color-scheme: dark)');
  var preferencia = null;
  var clave = 'kandisha-tema';
  var etiquetas = {
    es: ['Activar modo oscuro', 'Activar modo claro'],
    fr: ['Activer le mode sombre', 'Activer le mode clair'],
    ar: ['تفعيل الوضع الداكن', 'تفعيل الوضع الفاتح']
  };

  function validar(valor) { return valor === 'dark' || valor === 'light' ? valor : null; }
  try { preferencia = validar(localStorage.getItem(clave)); } catch (e) {}

  function actualizarBoton() {
    var boton = document.getElementById('tema-boton');
    if (!boton) return;
    var oscuro = raiz.dataset.tema === 'dark';
    var textos = etiquetas[raiz.lang] || etiquetas.es;
    var etiqueta = textos[oscuro ? 1 : 0];
    boton.setAttribute('aria-label', etiqueta);
    boton.title = etiqueta;
    boton.hidden = false;
  }

  function aplicar() {
    var tema = preferencia || (sistema.matches ? 'dark' : 'light');
    raiz.dataset.tema = tema;
    raiz.style.colorScheme = tema;
    actualizarBoton();
  }

  aplicar();
  sistema.addEventListener('change', function () { if (!preferencia) aplicar(); });
  window.addEventListener('storage', function (e) {
    if (e.key !== clave && e.key !== null) return;
    preferencia = validar(e.newValue);
    aplicar();
  });
  document.addEventListener('DOMContentLoaded', function () {
    var boton = document.getElementById('tema-boton');
    if (!boton) return;
    actualizarBoton();
    boton.addEventListener('click', function () {
      preferencia = raiz.dataset.tema === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(clave, preferencia); } catch (e) {}
      aplicar();
    });
    new MutationObserver(actualizarBoton).observe(raiz, { attributes: true, attributeFilter: ['lang'] });
  });
})();
