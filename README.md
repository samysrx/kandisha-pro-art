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

## Estadísticas de visitas

Las cinco páginas incluyen `js/analitica.js`, configurado para Cloudflare Web Analytics
en `samysrx.github.io`, con el token público facilitado por el propietario.
**La medición comenzará cuando se publiquen estos cambios.** Comprobar la recepción
de visitas en el panel de Cloudflare después del despliegue.

### Activar

1. Entrar en [Cloudflare](https://dash.cloudflare.com/) y abrir **Web Analytics → Add a site**.
2. Registrar el hostname de la web pública, sin protocolo ni ruta. Por ejemplo, para `https://nombre.github.io/proyecto/`, usar `nombre.github.io`.
3. En **Manage site**, copiar el **JS snippet**. Tomar el valor de `token` del atributo `data-cf-beacon` y ponerlo en `TOKEN` de `js/analitica.js`. Es un identificador público de medición; no usar una contraseña ni un API token de la cuenta.
4. Poner el hostname exacto en `HOSTNAME`. Si se usa un dominio propio, debe coincidir con el registrado en Cloudflare y con el que abre el visitante.
5. Si Cloudflare ofrece instalación automática, elegir la instalación manual mediante JS snippet para esta integración.
6. Publicar los cambios, abrir una página pública y comprobar que aparece actividad en **Web Analytics**. Los datos pueden tardar unos minutos.

No se necesita cambiar DNS ni el alojamiento. La integración solo carga el script oficial en HTTPS y en el hostname configurado; localhost y las previsualizaciones en otros dominios quedan excluidos. Si Cloudflare ya ha insertado su script, no se añade una segunda copia. Para detener la medición, vaciar `TOKEN` y publicar el archivo.

### Consultar los datos

En el panel de Cloudflare, seleccionar el sitio y el intervalo de fechas:

- **Visits / Page views:** visitas y páginas vistas. Las visitas no equivalen a personas únicas.
- **Country:** país de procedencia.
- **Referer:** sitios externos desde los que llegan las visitas, cuando el navegador proporciona esa información.
- **Path / Device type:** páginas consultadas y tipo de dispositivo.

El panel se consulta desde la cuenta de Cloudflare; no se expone un panel de administración en la web. La medición comienza después de activarla, sin recuperar visitas anteriores. Los bloqueadores pueden impedir que se registre parte del tráfico.

Documentación: [instalación](https://developers.cloudflare.com/web-analytics/get-started/), [dimensiones](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/), [métricas](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/).
