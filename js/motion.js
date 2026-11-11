/* Movimiento: pantalla de carga, transición entre páginas, entradas al desplazar,
   paralaje y contador. Solo se activa si el visitante no ha pedido reducir el movimiento
   (la clase "anim" la pone un script en <head>). */
(function () {
  var raiz = document.documentElement;
  if (!raiz.classList.contains('anim')) return;
  raiz.classList.add('mov');

  var $$ = function (sel) { return [].slice.call(document.querySelectorAll(sel)); };

  /* ---------- Titulares palabra a palabra ---------- */
  function partir(el) {
    var palabras = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    palabras.forEach(function (p, i) {
      var caja = document.createElement('span');
      caja.className = 'pal';
      var dentro = document.createElement('span');
      dentro.textContent = p;
      dentro.style.setProperty('--i', i);
      caja.appendChild(dentro);
      el.appendChild(caja);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.classList.add('partido');
  }
  $$('.portada h1, .cabeza-pagina h1, .declaracion-frase, .fila-titulo h2, .seccion > h2, .estudio h2, .llamada h2')
    .forEach(partir);

  /* ---------- Entradas al desplazar ---------- */
  var grupos = [
    ['.declaracion-frase, .fila-titulo h2, .seccion > h2, .estudio h2, .llamada h2', 'rev'],
    ['.declaracion-texto, .estudio-texto > p, .datos > div, .estudio-texto > .enlace, .fila-titulo > .enlace, ' +
     '.llamada p, .llamada > div:last-child, .llamada > .boton, .principios > div, .pasos li, .servicio, ' +
     '.servicios-lista li, .contacto-lista > li, .formulario, .titulo-menor, .filtros', 'rev rev-sube'],
    ['.obra, .foto-ancha', 'rev rev-foto'],
    ['.sello', 'rev rev-sello']
  ];
  var objetivos = [];
  grupos.forEach(function (g) {
    $$(g[0]).forEach(function (el) {
      g[1].split(' ').forEach(function (c) { el.classList.add(c); });
      // escalonado entre hermanos
      var i = 0, h = el;
      while ((h = h.previousElementSibling)) if (h.classList.contains('rev')) i++;
      el.style.setProperty('--n', Math.min(i, 5));
      objetivos.push(el);
    });
  });

  if ('IntersectionObserver' in window) {
    var ojo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visto');
        ojo.unobserve(e.target);
        if (e.target.matches('.datos > div')) contar(e.target.querySelector('dt'));
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    objetivos.forEach(function (el) { ojo.observe(el); });
  } else {
    objetivos.forEach(function (el) { el.classList.add('visto'); });
  }

  /* ---------- Contador (solo cifras sin traducción, p. ej. «100 %») ---------- */
  function contar(dt) {
    if (!dt || dt.hasAttribute('data-i18n')) return;
    var m = dt.textContent.match(/^(\d+)(.*)$/);
    if (!m) return;
    var fin = +m[1], resto = m[2], t0 = performance.now();
    (function paso(ahora) {
      var p = Math.min(1, (ahora - t0) / 1400);
      dt.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))) + resto;
      if (p < 1) requestAnimationFrame(paso);
    })(t0);
  }

  /* ---------- Cabecera que se esconde al bajar ---------- */
  var cabecera = document.getElementById('cabecera');
  var ultimoY = window.scrollY, pendiente = false;
  function alDesplazar() {
    pendiente = false;
    var y = window.scrollY;
    if (cabecera && !cabecera.classList.contains('abierta')) {
      cabecera.classList.toggle('oculta', y > 400 && y > ultimoY);
    }
    ultimoY = y;
  }
  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(alDesplazar); }
  }, { passive: true });
  alDesplazar();

  /* ---------- Pantalla de carga (primera visita de la sesión) ---------- */
  function lista() { raiz.classList.add('lista'); }

  var carga = document.getElementById('carga');
  if (raiz.classList.contains('entrada-larga') && carga) {
    var num = document.getElementById('carga-num');
    var t0 = performance.now();
    var cargada = document.readyState === 'complete';
    window.addEventListener('load', function () { cargada = true; });
    (function paso(ahora) {
      var t = ahora - t0;
      var p = Math.min(1, t / 1900);
      if (!cargada && t < 4500) p = Math.min(p, 0.92);   // espera a que la página termine de cargar
      num.textContent = Math.round(p * 100);
      carga.style.setProperty('--p', p);
      if (p < 1) { requestAnimationFrame(paso); return; }
      try { sessionStorage.setItem('kandisha-visto', '1'); } catch (e) {}
      setTimeout(function () {
        carga.classList.add('fuera');
        setTimeout(lista, 250);
        setTimeout(function () { carga.remove(); }, 1200);
      }, 250);
    })(t0);
  } else {
    requestAnimationFrame(function () { requestAnimationFrame(lista); });
  }

  /* ---------- Transición al cambiar de página ---------- */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download')) return;
    var destino = new URL(a.href, location.href);
    if (destino.origin !== location.origin || !/\.html$|\/$/.test(destino.pathname)) return;
    if (destino.pathname === location.pathname) return;
    e.preventDefault();
    raiz.classList.add('saliendo');
    setTimeout(function () { location.href = destino.href; }, 360);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { raiz.classList.remove('saliendo'); lista(); }
  });
})();
