(function () {
  var CORREO = 'kandisha.pro.art@gmail.com';
  var raiz = document.documentElement;

  /* ---------- Cabecera y menú móvil ---------- */
  var cabecera = document.getElementById('cabecera');
  var menuBoton = document.getElementById('menu-boton');
  var nav = document.getElementById('nav');
  var pantallaMovil = window.matchMedia('(max-width: 60rem)');

  function menu(abrir) {
    cabecera.classList.toggle('abierta', abrir);
    menuBoton.setAttribute('aria-expanded', String(abrir));
  }
  menuBoton.addEventListener('click', function () { menu(!cabecera.classList.contains('abierta')); });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) menu(false);
  });
  document.addEventListener('click', function (e) {
    if (!cabecera.contains(e.target)) menu(false);
  });
  document.addEventListener('focusin', function (e) {
    if (!cabecera.contains(e.target)) menu(false);
  });
  pantallaMovil.addEventListener('change', function () { menu(false); });
  window.addEventListener('pageshow', function () { menu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cabecera.classList.contains('abierta')) { menu(false); menuBoton.focus(); }
  });

  /* ---------- Idiomas ----------
     El español está escrito en el HTML; francés y árabe en js/textos-fr.js y js/textos-ar.js.
     El árabe cambia además la página a lectura de derecha a izquierda. */
  var nodos = [].slice.call(document.querySelectorAll('[data-i18n]'));
  var nodosAria = [].slice.call(document.querySelectorAll('[data-i18n-aria]'));
  var ES = {};
  nodos.forEach(function (n) { ES[n.getAttribute('data-i18n')] = n.textContent; });
  nodosAria.forEach(function (n) { ES[n.getAttribute('data-i18n-aria')] = n.getAttribute('aria-label'); });
  var DIC = { es: ES, fr: window.KANDISHA_FR || {}, ar: window.KANDISHA_AR || {} };

  var selector = document.getElementById('idioma');
  var idioma = 'es';

  function texto(clave) { return DIC[idioma][clave] || ES[clave] || ''; }

  function ponerIdioma(cual) {
    idioma = DIC[cual] ? cual : 'es';
    nodos.forEach(function (n) { n.textContent = texto(n.getAttribute('data-i18n')); });
    nodosAria.forEach(function (n) { n.setAttribute('aria-label', texto(n.getAttribute('data-i18n-aria'))); });
    raiz.lang = idioma;
    raiz.dir = idioma === 'ar' ? 'rtl' : 'ltr';
    selector.value = idioma;
    try { localStorage.setItem('kandisha-idioma', idioma); } catch (e) {}
  }

  selector.addEventListener('change', function () { ponerIdioma(selector.value); });

  var guardado = null;
  try { guardado = localStorage.getItem('kandisha-idioma'); } catch (e) {}
  var navegador = (navigator.language || '').slice(0, 2).toLowerCase();
  var inicial = guardado || (DIC[navegador] ? navegador : 'es');
  if (inicial !== 'es') ponerIdioma(inicial);

  /* ---------- Filtro de proyectos ---------- */
  var filtros = [].slice.call(document.querySelectorAll('.filtro'));
  var obras = [].slice.call(document.querySelectorAll('.obra'));
  filtros.forEach(function (f) {
    f.addEventListener('click', function () {
      var tipo = f.getAttribute('data-filtro');
      filtros.forEach(function (o) { o.setAttribute('aria-pressed', String(o === f)); });
      obras.forEach(function (o) {
        o.hidden = tipo !== 'todo' && o.getAttribute('data-tipo') !== tipo;
      });
      var menores = document.querySelector('.obras-pequenas');
      var titulo = document.querySelector('.titulo-menor');
      if (menores && titulo) titulo.hidden = !menores.querySelector('.obra:not([hidden])');
    });
  });

  /* ---------- Visor de fotos a pantalla completa ---------- */
  var visor = document.getElementById('visor');
  if (visor && visor.showModal) {
    var vImg = document.createElement('img');
    document.getElementById('visor-foto').appendChild(vImg);
    var vTexto = document.getElementById('visor-texto');
    var vCuenta = document.getElementById('visor-cuenta');
    var lista = [], actual = 0, origen = null;

    function mostrar(i) {
      actual = (i + lista.length) % lista.length;
      var boton = lista[actual];
      var img = boton.querySelector('img');
      var titulo = boton.parentNode.querySelector('figcaption span');
      vImg.src = img.getAttribute('src');
      vImg.alt = titulo ? titulo.textContent : img.alt;
      vTexto.textContent = titulo ? titulo.textContent : '';
      vCuenta.textContent = (actual + 1) + ' / ' + lista.length;
    }

    function abrir(boton) {
      lista = [].slice.call(document.querySelectorAll('.obra:not([hidden]) .obra-abrir'));
      origen = boton;
      mostrar(lista.indexOf(boton));
      visor.showModal();
      raiz.classList.add('visor-abierto');
    }

    document.addEventListener('click', function (e) {
      var boton = e.target.closest && e.target.closest('.obra-abrir');
      if (boton) abrir(boton);
    });
    document.getElementById('visor-cerrar').addEventListener('click', function () { visor.close(); });
    document.getElementById('visor-ant').addEventListener('click', function () { mostrar(actual - 1); });
    document.getElementById('visor-sig').addEventListener('click', function () { mostrar(actual + 1); });
    visor.addEventListener('click', function (e) {
      if (e.target === visor || e.target.classList.contains('visor-foto')) visor.close();
    });
    visor.addEventListener('close', function () {
      raiz.classList.remove('visor-abierto');
      if (origen) origen.focus({ preventScroll: true });
    });
    visor.addEventListener('keydown', function (e) {
      var avance = raiz.dir === 'rtl' ? -1 : 1;
      if (e.key === 'ArrowRight') mostrar(actual + avance);
      if (e.key === 'ArrowLeft') mostrar(actual - avance);
    });

    // Deslizar con el dedo
    var x0 = null, y0 = null;
    var foto = document.getElementById('visor-foto');
    foto.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { x0 = null; return; }
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    foto.addEventListener('touchcancel', function () { x0 = null; }, { passive: true });
    foto.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;
      var avance = raiz.dir === 'rtl' ? -1 : 1;
      mostrar(actual + (dx < 0 ? avance : -avance));
    });
  }

  /* ---------- Formulario: prepara un correo en el programa del visitante ---------- */
  var form = document.getElementById('formulario');
  if (form) {
    var error = document.getElementById('form-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = form.nombre, mensaje = form.mensaje;
      var faltan = [nombre, mensaje].filter(function (c) { return !c.value.trim(); });
      [nombre, mensaje].forEach(function (c) {
        if (c.value.trim()) c.removeAttribute('aria-invalid');
        else c.setAttribute('aria-invalid', 'true');
      });
      error.hidden = faltan.length === 0;
      if (faltan.length) { faltan[0].focus(); return; }

      var tipo = form.tipo.options[form.tipo.selectedIndex].text;
      var asunto = (DIC[idioma]['form.subject'] || 'Proyecto') + ': ' + tipo;
      var cuerpo = mensaje.value.trim() + '\n\n' + nombre.value.trim() +
        (form.telefono.value.trim() ? '\n' + form.telefono.value.trim() : '');
      window.location.href = 'mailto:' + CORREO +
        '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
    });
  }
})();
