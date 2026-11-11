# Kandisha Pro'Art — sitio web

Web del estudio Kandisha Pro'Art (Kamal Bounous, Tánger). Sitio estático en español, francés y árabe.

## Ver en local

```bash
node servidor.js
```

Abre http://localhost:5173

## Cambiar textos, fotos o páginas

Las cinco páginas HTML y `js/textos-fr.js` / `js/textos-ar.js` se generan; no las edite a mano porque se sobrescriben.

- Textos en español y francés, lista de fotos y estructura de cada página: `herramientas/generar.js`
- Textos en árabe: `herramientas/ar.js`

Después de cambiar algo:

```bash
node herramientas/generar.js
```

Estilos en `css/styles.css` y comportamiento (idiomas, filtros, visor, formulario) en `js/main.js`; estos sí se editan directamente.

## Fotos

En `assets/proyectos/`. Las `.png` de 206 px son miniaturas pendientes de sustituir por sus originales.
