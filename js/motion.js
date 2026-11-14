/* Movimiento: pantalla de carga, transición entre páginas, entradas al desplazar,
   paralaje y contador. Solo se activa si el visitante no ha pedido reducir el movimiento
   (la clase "anim" la pone un script en <head>). */
(function () {
  var raiz = document.documentElement;
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
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
  var titulares = '.portada h1, .cabeza-pagina h1, .declaracion-frase, .fila-titulo h2, .seccion > h2, .estudio h2, .llamada h2';
  $$(titulares).forEach(partir);
  document.addEventListener('kandisha:idioma', function () { $$(titulares).forEach(partir); });

  /* ---------- Entradas al desplazar ---------- */
  var grupos = [
    ['.declaracion-frase, .fila-titulo h2, .seccion > h2, .estudio h2, .llamada h2', 'rev'],
    ['.declaracion-texto, .estudio-texto > p, .datos > div, .estudio-texto > .enlace, .fila-titulo > .enlace, ' +
     '.llamada p, .llamada > div:last-child, .llamada > .boton, .principios > div, .pasos li, .servicio, ' +
     '.servicios-lista li, .contacto-lista > li, .formulario, .titulo-menor, .filtros, .pie-columnas > *, .pie-legal, ' +
     '.destacado-texto, .servicio-bloque-texto, .servicio-carta', 'rev rev-sube'],
    ['.obra, .foto-ancha, .servicio-bloque-foto', 'rev rev-foto'],
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

  /* ---------- Cabecera, progreso y profundidad al desplazar ---------- */
  var cabecera = document.getElementById('cabecera');
  var pendiente = false;
  var profundidad = $$('.portada-foto, .foto-ancha');
  var lineas = $$('.fila-titulo, .pasos');
  function alDesplazar() {
    pendiente = false;
    var y = window.scrollY;
    var alto = window.innerHeight;
    if (cabecera) {
      cabecera.classList.toggle('compacta', y > 80);
      cabecera.style.setProperty('--lectura', Math.max(0, Math.min(1, y / Math.max(1, document.documentElement.scrollHeight - alto))));
    }
    profundidad.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > alto) return;
      var p = Math.max(-1, Math.min(1, (alto / 2 - r.top - r.height / 2) / alto));
      el.style.setProperty('--profundidad', reducir.matches ? '0px' : (p * Math.min(30, r.height * .035)).toFixed(2) + 'px');
    });
    lineas.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--trazo', Math.max(0, Math.min(1, (alto - r.top) / (alto * .7))));
    });
  }
  function pedirCuadro() {
    if (!pendiente) { pendiente = true; requestAnimationFrame(alDesplazar); }
  }
  window.addEventListener('scroll', pedirCuadro, { passive: true });
  window.addEventListener('resize', pedirCuadro);
  window.addEventListener('load', pedirCuadro);
  document.addEventListener('kandisha:idioma', pedirCuadro);
  document.addEventListener('kandisha:filtro', pedirCuadro);
  alDesplazar();

  /* Respuesta al puntero solo en dispositivos con ratón. */
  var raton = window.matchMedia('(hover: hover) and (pointer: fine)');
  $$('.cabecera .marca, .boton').forEach(function (el) {
    var frame = 0;
    el.addEventListener('pointermove', function (e) {
      if (!raton.matches || reducir.matches) return;
      var r = el.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        el.style.setProperty('--puntero-x', (x * .045).toFixed(2) + 'px');
        el.style.setProperty('--puntero-y', (y * .08).toFixed(2) + 'px');
      });
    });
    el.addEventListener('pointerleave', function () {
      cancelAnimationFrame(frame);
      el.style.setProperty('--puntero-x', '0px'); el.style.setProperty('--puntero-y', '0px');
    });
  });

  /* Al filtrar, vuelven a entrar las imágenes que permanecen visibles. */
  document.addEventListener('kandisha:filtro', function () {
    if (reducir.matches) return;
    $$('.obra').forEach(function (el, i) {
      if (el._filtroAnimacion) el._filtroAnimacion.cancel();
      if (el.hidden || !el.animate) return;
      el._filtroAnimacion = el.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 480, delay: Math.min(i, 5) * 45, easing: 'cubic-bezier(.2,.7,.2,1)' });
    });
  });

  /* Si la preferencia cambia durante la visita, se muestra todo sin animación. */
  reducir.addEventListener('change', function () {
    raiz.classList.toggle('anim', !reducir.matches);
    raiz.classList.toggle('mov', !reducir.matches);
    if (reducir.matches) {
      raiz.classList.add('lista');
      objetivos.forEach(function (el) { el.classList.add('visto'); });
      $$('.obra').forEach(function (el) { if (el._filtroAnimacion) el._filtroAnimacion.cancel(); });
    }
    pedirCuadro();
  });

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
      var p = Math.min(1, t / 2400);
      if (!cargada && t < 4500) p = Math.min(p, 0.92);   // espera a que la página termine de cargar
      num.textContent = Math.round(p * 100);
      carga.style.setProperty('--p', p);
      // La foto empieza a sustituir al plano cuando el alzado ya está casi trazado
      var r = Math.max(0, (p - 0.38) / 0.62);
      carga.style.setProperty('--r', r * r * (3 - 2 * r));
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
