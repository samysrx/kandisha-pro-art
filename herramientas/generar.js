// Genera las cinco páginas y los diccionarios francés y árabe. Uso: node herramientas/generar.js
const fs = require('fs');
const path = require('path');
const DEST = process.argv[2] || path.join(__dirname, '..');

const T = {
  'skip': ['Saltar al contenido', 'Aller au contenu'],
  'menu': ['Menú', 'Menu'],
  'nav.home': ['Inicio', 'Accueil'],
  'nav.projects': ['Proyectos', 'Projets'],
  'nav.services': ['Servicios', 'Services'],
  'nav.studio': ['Estudio', 'Studio'],
  'nav.contact': ['Contacto', 'Contact'],

  'hero.title': ['Vea su espacio antes de construirlo.', 'Voyez votre espace avant de le construire.'],
  'hero.sub': ['Arquitectura de interiores, diseño exterior y visualización 3D en Tánger. Estudio dirigido por Kamal Bounous.', "Architecture d'intérieur, aménagement extérieur et visualisation 3D à Tanger. Studio dirigé par Kamal Bounous."],
  'hero.cta': ['Cuéntenos su proyecto', 'Parlez-nous de votre projet'],
  'hero.cta2': ['Ver proyectos', 'Voir les projets'],

  'claim.quote': ['Cuando piensa en su casa, el espacio exterior es tan importante como el interior.', "Lorsque vous pensez à votre maison, l'espace extérieur est tout aussi important que l'intérieur."],
  'claim.text': ['Por eso proyectamos los dos a la vez: la distribución, la luz y los materiales de dentro, y la terraza, el jardín y la fachada de fuera. Todo modelado en 3D para que decida sobre imágenes y no sobre suposiciones.', "C'est pourquoi nous concevons les deux en même temps : la distribution, la lumière et les matériaux du dedans, la terrasse, le jardin et la façade du dehors. Le tout modélisé en 3D, pour décider sur des images et non sur des suppositions."],

  'home.proj': ['Proyectos recientes', 'Projets récents'],
  'home.proj.all': ['Ver todos los proyectos', 'Voir tous les projets'],
  'home.serv': ['Lo que hacemos', 'Ce que nous faisons'],
  'home.serv.all': ['Ver los servicios en detalle', 'Voir les services en détail'],

  'cat.all': ['Todo', 'Tout'],
  'cat.ext': ['Exterior', 'Extérieur'],
  'cat.int': ['Interior', 'Intérieur'],
  'cat.com': ['Comercial', 'Commercial'],

  'p.porche1': ['Vivienda con porche y entrada de lamas de madera', 'Maison avec auvent et entrée en lames de bois'],
  'p.porche2': ['La misma vivienda, vista desde la calle', 'La même maison, vue depuis la rue'],
  'p.ladrillo': ['Casa de una planta con ladrillo visto', 'Maison de plain-pied en brique apparente'],
  'p.patio': ['Patio trasero con porche', 'Cour arrière avec porche'],
  'p.pergola': ['Pérgola de madera junto a la piscina', 'Pergola en bois au bord de la piscine'],
  'p.apto': ['Apartamento: salón, comedor y dormitorio', 'Appartement : salon, salle à manger et chambre'],
  'p.salon': ['Salón marroquí con techo iluminado', 'Salon marocain au plafond lumineux'],
  'p.resto1': ['Restaurante de estilo industrial', 'Restaurant de style industriel'],
  'p.ladera': ['Villa en ladera con terrazas', 'Villa à flanc de colline avec terrasses'],
  'p.villa': ['Villa con piscina y jardín', 'Villa avec piscine et jardin'],
  'p.paste': ['Pastelería y salón de té', 'Pâtisserie et salon de thé'],
  'p.cafe': ['Cafetería en dos niveles', 'Café sur deux niveaux'],
  'p.resto2': ['Restaurante con techo de lamas', 'Restaurant au plafond à lames'],

  'p.porche3': ['El camino de entrada entre el jardín', "L'allée d'entrée à travers le jardin"],
  'p.dosplantas': ['Casa de dos plantas con alero de madera', 'Maison à étage avec débord de toit en bois'],
  'p.celosia': ['Casa con celosía en el porche', "Maison avec claustra sous l'auvent"],
  'p.pabellon': ['Pabellón de jardín con paneles de madera', 'Pavillon de jardin aux panneaux de bois'],
  'p.pasillo': ['Pasillo con vigas de madera y escalera', 'Couloir aux poutres en bois et escalier'],
  'p.marmol': ['Cocina y baño en mármol', 'Cuisine et salle de bain en marbre'],
  'p.salon1': ['Salón y comedor abiertos a la luz', 'Salon et salle à manger ouverts à la lumière'],
  'p.patioint': ['Patio interior acristalado', 'Patio intérieur vitré'],
  'p.salon2': ['Salón diáfano con jardín vertical', 'Salon ouvert avec jardin vertical'],
  'proj.more': ['Más proyectos', "D'autres projets"],
  'lb.open': ['Ampliar la foto', 'Agrandir la photo'],
  'lb.close': ['Cerrar', 'Fermer'],
  'lb.prev': ['Anterior', 'Précédente'],
  'lb.next': ['Siguiente', 'Suivante'],
  'lb.label': ['Foto ampliada', 'Photo agrandie'],
  'stu.n2': ['1,4 mil', '1,4 k'],
  'form.subject': ['Proyecto', 'Projet'],

  'proj.h1': ['Proyectos', 'Projets'],
  'proj.lead': ['Viviendas, interiores y locales comerciales diseñados y modelados en 3D por el estudio.', 'Maisons, intérieurs et locaux commerciaux conçus et modélisés en 3D par le studio.'],
  'proj.cta.t': ['¿Tiene un espacio en mente?', 'Vous avez un espace en tête ?'],
  'proj.cta.p': ['Enséñenos el plano, unas fotos o solo la idea. Le diremos cómo lo abordaríamos.', "Montrez-nous le plan, quelques photos ou simplement l'idée. Nous vous dirons comment nous l'aborderions."],

  's1.t': ['Arquitectura de interiores', "Architecture d'intérieur"],
  's1.d': ['Distribución, iluminación, carpintería a medida y elección de materiales para viviendas, locales y oficinas.', 'Distribution, éclairage, menuiserie sur mesure et choix des matériaux pour logements, commerces et bureaux.'],
  's1.a': ['Planos de distribución', 'Plans de distribution'], 's1.b': ['Techos e iluminación', 'Plafonds et éclairage'], 's1.c': ['Mobiliario a medida', 'Mobilier sur mesure'],
  's2.t': ['Diseño exterior', 'Aménagement extérieur'],
  's2.d': ['Fachadas, terrazas, jardines y piscinas pensados como una continuación de la casa.', 'Façades, terrasses, jardins et piscines pensés comme le prolongement de la maison.'],
  's2.a': ['Fachadas y accesos', 'Façades et accès'], 's2.b': ['Jardín y pérgolas', 'Jardin et pergolas'], 's2.c': ['Piscina y terraza', 'Piscine et terrasse'],
  's3.t': ['Realización 3D', 'Réalisation 3D'],
  's3.d': ['Modelos y renders fotorrealistas de cada estancia antes de empezar la obra.', 'Maquettes et rendus photoréalistes de chaque pièce avant le début des travaux.'],
  's3.a': ['Modelado del proyecto', 'Modélisation du projet'], 's3.b': ['Renders de interior y exterior', "Rendus d'intérieur et d'extérieur"], 's3.c': ['Variantes de materiales', 'Variantes de matériaux'],
  's4.t': ['Decoración', 'Décoration'],
  's4.d': ['Mobiliario, textiles, color y arte para terminar un espacio o renovarlo sin obra.', 'Mobilier, textiles, couleurs et art pour finir un espace ou le renouveler sans travaux.'],
  's4.a': ['Paleta de color', 'Palette de couleurs'], 's4.b': ['Selección de mobiliario', 'Sélection du mobilier'], 's4.c': ['Textiles y arte', 'Textiles et art'],
  's5.t': ['Exposiciones', 'Expositions'],
  's5.d': ['Stands y espacios efímeros para ferias, tiendas y eventos.', 'Stands et espaces éphémères pour salons, boutiques et événements.'],
  's5.a': ['Stands de feria', 'Stands de salon'], 's5.b': ['Escaparates', 'Vitrines'], 's5.c': ['Espacios para eventos', 'Espaces événementiels'],
  's6.t': ['Diseño web', 'Webdesign'],
  's6.d': ['Identidad y sitios web para los negocios cuyos espacios diseñamos.', 'Identité et sites web pour les entreprises dont nous concevons les espaces.'],
  's6.a': ['Identidad visual', 'Identité visuelle'], 's6.b': ['Sitios web', 'Sites web'], 's6.c': ['Imágenes para redes', 'Visuels pour les réseaux'],

  'serv.h1': ['Servicios', 'Services'],
  'serv.lead': ['Del plano al último cojín: puede encargarnos el proyecto completo o solo la parte que necesite.', "Du plan au dernier coussin : confiez-nous le projet complet ou seulement la partie dont vous avez besoin."],

  'proc.title': ['Del primer croquis a la entrega', 'Du premier croquis à la livraison'],
  'proc.1.t': ['Visita y medidas', 'Visite et relevé'],
  'proc.1.d': ['Vemos el espacio, tomamos medidas y escuchamos cómo quiere vivirlo y con qué presupuesto.', "Nous voyons l'espace, prenons les mesures et écoutons comment vous voulez y vivre, et avec quel budget."],
  'proc.2.t': ['Concepto', 'Concept'],
  'proc.2.d': ['Proponemos distribución, materiales y ambiente en planos y láminas de referencia.', 'Nous proposons distribution, matériaux et ambiance sur plans et planches de référence.'],
  'proc.3.t': ['Modelo 3D', 'Maquette 3D'],
  'proc.3.d': ['Recorre el proyecto en renders y pide los cambios cuando todavía no cuestan nada.', "Vous parcourez le projet en rendus et demandez les changements tant qu'ils ne coûtent rien."],
  'proc.4.t': ['Obra y entrega', 'Chantier et livraison'],
  'proc.4.d': ['Coordinamos a los oficios y seguimos la ejecución hasta que el resultado coincide con el render.', "Nous coordonnons les corps de métier et suivons l'exécution jusqu'à ce que le résultat corresponde au rendu."],

  'stu.h1': ['El estudio', 'Le studio'],
  'stu.lead': ["Kandisha Pro'Art es el estudio de Kamal Bounous en Tánger.", "Kandisha Pro'Art est le studio de Kamal Bounous à Tanger."],
  'stu.title': ['Un estudio de Tánger, con firma propia', 'Un studio de Tanger, avec sa propre signature'],
  'stu.p1': ['Trabajamos desde el centro de Tánger en viviendas, comercios y espacios de exposición. Cada proyecto sale del estudio con su sello: diseño original, hecho para un cliente y un lugar concretos.', "Nous travaillons depuis le centre de Tanger sur des logements, des commerces et des espaces d'exposition. Chaque projet quitte le studio avec son sceau : un design original, fait pour un client et un lieu précis."],
  'stu.f1': ['de recomendaciones en 19 opiniones de Facebook', 'de recommandations sur 19 avis Facebook'],
  'stu.f2': ['personas siguen el trabajo del estudio', 'personnes suivent le travail du studio'],
  'stu.fb': ['Ver el estudio en Facebook', 'Voir le studio sur Facebook'],
  'stu.how': ['Cómo trabajamos', 'Notre façon de travailler'],
  'stu.v1.t': ['Dentro y fuera, a la vez', 'Dedans et dehors, ensemble'],
  'stu.v1.d': ['La fachada, el jardín y el salón se diseñan juntos, para que la casa se lea como un solo proyecto.', 'La façade, le jardin et le salon se conçoivent ensemble, pour que la maison se lise comme un seul projet.'],
  'stu.v2.t': ['Primero la imagen', "L'image d'abord"],
  'stu.v2.d': ['Nada se construye sin haberlo visto antes en 3D. Los cambios se hacen en pantalla, no en obra.', "Rien ne se construit sans avoir été vu en 3D. Les changements se font à l'écran, pas sur le chantier."],
  'stu.v3.t': ['Diseño con sello', 'Un design signé'],
  'stu.v3.d': ['No repetimos proyectos. Cada diseño es original y lleva la firma del estudio.', 'Nous ne répétons pas les projets. Chaque design est original et porte la signature du studio.'],

  'con.h1': ['Hablemos de su espacio', 'Parlons de votre espace'],
  'con.lead': ['Llámenos, escríbanos o pase por el estudio. La primera conversación sirve para entender qué necesita.', 'Appelez-nous, écrivez-nous ou passez au studio. Le premier échange sert à comprendre ce dont vous avez besoin.'],
  'con.phone': ['Teléfono', 'Téléphone'], 'con.mail': ['Correo', 'E-mail'], 'con.addr': ['Estudio', 'Studio'],
  'con.city': ['Tánger, Marruecos', 'Tanger, Maroc'],
  'con.map': ['Cómo llegar', 'Itinéraire'],
  'con.cta': ['Escribir al estudio', 'Écrire au studio'],
  'form.name': ['Nombre', 'Nom'], 'form.tel': ['Teléfono', 'Téléphone'], 'form.type': ['Tipo de proyecto', 'Type de projet'],
  'form.msg': ['Cuéntenos el proyecto', 'Décrivez-nous le projet'],
  'form.error': ['Escriba su nombre y unas líneas sobre el proyecto.', 'Indiquez votre nom et quelques lignes sur le projet.'],
  'form.send': ['Abrir el correo con mi mensaje', "Ouvrir l'e-mail avec mon message"],
  'form.note': ['Se abrirá su programa de correo con el mensaje listo para enviar.', "Votre messagerie s'ouvrira avec le message prêt à envoyer."],
  'foot': ["© 2026 Kandisha Pro'Art, Kamal Bounous. Tánger.", "© 2026 Kandisha Pro'Art, Kamal Bounous. Tanger."]
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const t = k => { if (!T[k]) throw new Error('falta ' + k); return ` data-i18n="${k}">${esc(T[k][0])}`; };
const es = k => T[k][0];

const NAV = [['index.html', 'nav.home'], ['proyectos.html', 'nav.projects'], ['servicios.html', 'nav.services'], ['estudio.html', 'nav.studio'], ['contacto.html', 'nav.contact']];
const CAT = { ext: 'cat.ext', int: 'cat.int', com: 'cat.com' };

const ta = k => ` data-i18n-aria="${k}" aria-label="${es(k)}"`;

// grande = true: la foto se puede ampliar en el visor
function obra(archivo, clave, cat, w, h, grande) {
  const img = `<img loading="lazy" src="assets/proyectos/${archivo}" width="${w}" height="${h}" alt="${es(clave)}">`;
  return `<figure class="obra" data-tipo="${cat}" style="--ar:${(w / h).toFixed(3)}">
        ${grande ? `<button type="button" class="obra-abrir"${ta('lb.open')}>${img}</button>` : img}
        <figcaption><span${t(clave)}</span><small${t(CAT[cat])}</small></figcaption>
      </figure>`;
}
const GR = {
  porche1: ['villa-porche-1.webp', 'p.porche1', 'ext', 1279, 719],
  dosplantas: ['casa-dos-plantas.jpg', 'p.dosplantas', 'ext', 1180, 719],
  marmol: ['cocina-bano-marmol.jpg', 'p.marmol', 'int', 1054, 2048],
  celosia: ['casa-celosia.jpg', 'p.celosia', 'ext', 996, 899],
  salon1: ['salon-comedor.jpg', 'p.salon1', 'int', 960, 576],
  porche2: ['villa-porche-2.webp', 'p.porche2', 'ext', 1279, 915],
  pasillo: ['pasillo-madera.jpg', 'p.pasillo', 'int', 1200, 1756],
  villa: ['villa-piscina.jpg', 'p.villa', 'ext', 1290, 1544],
  patioint: ['patio-interior.jpg', 'p.patioint', 'int', 960, 960],
  ladrillo: ['casa-ladrillo.webp', 'p.ladrillo', 'ext', 1279, 1129],
  salon2: ['salon-abierto.jpg', 'p.salon2', 'int', 960, 450],
  porche3: ['villa-porche-3.jpg', 'p.porche3', 'ext', 1279, 719],
  pabellon: ['pabellon-jardin.jpg', 'p.pabellon', 'ext', 771, 433]
};
const g = k => obra(...GR[k], true);
const MURO = Object.keys(GR).map(g).join('\n      ');
const PEQ = [
  ['villa-ladera.png', 'p.ladera', 'ext'], ['salon-marroqui.png', 'p.salon', 'int'],
  ['apartamento.png', 'p.apto', 'int'], ['pasteleria.png', 'p.paste', 'com'], ['cafe-azul.png', 'p.cafe', 'com'],
  ['restaurante-madera.png', 'p.resto2', 'com'], ['restaurante-industrial.png', 'p.resto1', 'com'],
  ['pergola-piscina.png', 'p.pergola', 'ext'], ['patio-palmera.png', 'p.patio', 'ext']
].map(p => obra(p[0], p[1], p[2], 206, 206)).join('\n      ');

const pasos = `<ol class="pasos">
      ${[1, 2, 3, 4].map(n => `<li><h3${t('proc.' + n + '.t')}</h3><p${t('proc.' + n + '.d')}</p></li>`).join('\n      ')}
    </ol>`;

const llamada = (tit, par) => `<section class="seccion malla llamada">
    <div>
      <h2${t(tit)}</h2>
      <p${t(par)}</p>
    </div>
    <div>
      <a class="llamada-tel" href="tel:+212539321959">+212 5393-21959</a>
      <a class="boton boton-sello" href="contacto.html"${t('con.cta')}</a>
    </div>
  </section>`;

const cabeza = (h1, lead) => `<section class="cabeza-pagina malla">
    <h1${t(h1)}</h1>
    <p${t(lead)}</p>
  </section>`;

// Alzado de una vivienda que se traza línea a línea en la pantalla de carga
const TRAZOS = [
  'M8 162 H312',
  'M40 82 H192 V98 H40 Z',
  'M48 98 V162',
  'M176 98 V162',
  'M152 60 H300',
  'M192 60 V82',
  'M290 60 V162',
  'M214 30 H250 V162',
  'M214 30 V162',
  'M223 30 V162', 'M232 30 V162', 'M241 30 V162',
  'M258 112 H284 V162', 'M258 112 V162', 'M271 112 V162',
  'M70 162 V128 H150 V162',
  'M22 162 C22 138 20 120 18 104',
  'M18 104 C8 94 2 98 -2 106', 'M18 104 C28 92 36 96 40 104', 'M18 104 C14 90 6 86 0 88', 'M18 104 C24 88 32 86 37 90'
];
const CARGA = `<div class="carga malla" id="carga" aria-hidden="true">
  <svg class="carga-dibujo" viewBox="-4 20 320 150" role="presentation">
    ${TRAZOS.map((d, i) => `<path${i > 8 ? ' class="fino"' : ''} pathLength="1" style="--d:${i}" d="${d}"/>`).join('\n    ')}
  </svg>
  <div class="carga-barra"></div>
  <div class="carga-pie">
    <span class="carga-marca">Kandisha <em>Pro'Art</em></span>
    <span class="carga-num" id="carga-num">0</span>
  </div>
</div>
<div class="telon" aria-hidden="true"></div>
`;
const CINTA = `<div class="cinta malla" aria-hidden="true">
    <div class="cinta-pista">
      ${[0, 1].map(() => '<div class="cinta-grupo"><span>Architecture</span><i></i><span>Conception</span><i></i><span>Design</span><i></i><span>3D</span><i></i></div>').join('\n      ')}
    </div>
  </div>`;

const PAGINAS = {
  'index.html': {
    titulo: "Kandisha Pro'Art — Arquitectura interior, exterior y 3D en Tánger",
    desc: "Kandisha Pro'Art, estudio de Kamal Bounous en Tánger: arquitectura de interiores, diseño exterior, decoración y visualización 3D.",
    cuerpo: `<section class="portada malla">
    <div class="portada-texto">
      <h1${t('hero.title')}</h1>
      <p class="portada-sub"${t('hero.sub')}</p>
      <div class="acciones">
        <a class="boton boton-sello" href="contacto.html"${t('hero.cta')}</a>
        <a class="boton boton-linea" href="proyectos.html"${t('hero.cta2')}</a>
      </div>
    </div>
    <figure class="portada-foto">
      <img src="assets/proyectos/villa-porche-1.webp" width="1279" height="719" alt="${es('p.porche1')}">
    </figure>
  </section>

  <section class="seccion declaracion">
    <p class="declaracion-frase"${t('claim.quote')}</p>
    <p class="declaracion-texto"${t('claim.text')}</p>
  </section>

  <section class="seccion seccion-blanca">
    <div class="fila-titulo">
      <h2${t('home.proj')}</h2>
      <a class="enlace" href="proyectos.html"${t('home.proj.all')}</a>
    </div>
    <div class="obras-grandes">
      ${g('dosplantas')}
      ${g('celosia')}
    </div>
  </section>

  ${CINTA}

  <section class="seccion">
    <div class="fila-titulo">
      <h2${t('home.serv')}</h2>
      <a class="enlace" href="servicios.html"${t('home.serv.all')}</a>
    </div>
    <ul class="servicios-lista">
      ${[1, 2, 3, 4, 5, 6].map(n => `<li><h3${t('s' + n + '.t')}</h3><p${t('s' + n + '.d')}</p></li>`).join('\n      ')}
    </ul>
  </section>

  ${llamada('con.h1', 'con.lead')}`
  },

  'proyectos.html': {
    titulo: "Proyectos — Kandisha Pro'Art",
    desc: "Viviendas, interiores y locales comerciales diseñados y modelados en 3D por Kandisha Pro'Art en Tánger.",
    cuerpo: `${cabeza('proj.h1', 'proj.lead')}

  <section class="seccion seccion-blanca">
    <div class="fila-titulo">
      <div class="filtros" role="group" aria-label="Filtrar proyectos">
        <button type="button" class="filtro" data-filtro="todo" aria-pressed="true"${t('cat.all')}</button>
        <button type="button" class="filtro" data-filtro="ext" aria-pressed="false"${t('cat.ext')}</button>
        <button type="button" class="filtro" data-filtro="int" aria-pressed="false"${t('cat.int')}</button>
        <button type="button" class="filtro" data-filtro="com" aria-pressed="false"${t('cat.com')}</button>
      </div>
    </div>
    <div class="obras-muro">
      ${MURO}
    </div>
    <h2 class="titulo-menor"${t('proj.more')}</h2>
    <div class="obras-pequenas">
      ${PEQ}
    </div>
  </section>

  ${llamada('proj.cta.t', 'proj.cta.p')}`
  },

  'servicios.html': {
    titulo: "Servicios — Kandisha Pro'Art",
    desc: "Arquitectura de interiores, diseño exterior, realización 3D, decoración, exposiciones y diseño web en Tánger.",
    cuerpo: `${cabeza('serv.h1', 'serv.lead')}

  <section class="seccion">
    ${[1, 2, 3, 4, 5, 6].map(n => `<article class="servicio">
      <h2${t('s' + n + '.t')}</h2>
      <p${t('s' + n + '.d')}</p>
      <ul>
        <li${t('s' + n + '.a')}</li>
        <li${t('s' + n + '.b')}</li>
        <li${t('s' + n + '.c')}</li>
      </ul>
    </article>`).join('\n    ')}
  </section>

  <section class="seccion malla">
    <h2${t('proc.title')}</h2>
    ${pasos}
  </section>

  <section class="seccion seccion-blanca llamada">
    <div>
      <h2${t('proj.cta.t')}</h2>
    </div>
    <a class="boton boton-sello" href="contacto.html"${t('hero.cta')}</a>
  </section>`
  },

  'estudio.html': {
    titulo: "El estudio — Kandisha Pro'Art",
    desc: "Kandisha Pro'Art es el estudio de diseño de interiores y exteriores de Kamal Bounous en Tánger.",
    cuerpo: `${cabeza('stu.h1', 'stu.lead')}

  <section class="seccion estudio">
    <div class="estudio-texto">
      <h2${t('stu.title')}</h2>
      <p${t('stu.p1')}</p>
      <dl class="datos">
        <div><dt>100 %</dt><dd${t('stu.f1')}</dd></div>
        <div><dt${t('stu.n2')}</dt><dd${t('stu.f2')}</dd></div>
      </dl>
      <a class="enlace" href="https://www.facebook.com/KandishaProArt/" target="_blank" rel="noopener"${t('stu.fb')}</a>
    </div>
    <img class="sello" src="assets/sello-kandisha.webp" width="480" height="502" loading="lazy" alt="Sello de copyright Kandisha, Tánger">
  </section>

  <figure class="foto-ancha">
    <img loading="lazy" src="assets/proyectos/villa-porche-2.webp" width="1279" height="915" alt="${es('p.porche2')}">
  </figure>

  <section class="seccion seccion-blanca">
    <h2${t('stu.how')}</h2>
    <div class="principios">
      ${[1, 2, 3].map(n => `<div><h3${t('stu.v' + n + '.t')}</h3><p${t('stu.v' + n + '.d')}</p></div>`).join('\n      ')}
    </div>
  </section>

  ${llamada('con.h1', 'con.lead')}`
  },

  'contacto.html': {
    titulo: "Contacto — Kandisha Pro'Art",
    desc: "Teléfono, correo y dirección de Kandisha Pro'Art en Tánger.",
    cuerpo: `${cabeza('con.h1', 'con.lead')}

  <section class="seccion contacto">
    <ul class="contacto-lista">
      <li>
        <span${t('con.phone')}</span>
        <a class="dato" href="tel:+212539321959">+212 5393-21959</a>
      </li>
      <li>
        <span${t('con.mail')}</span>
        <a class="dato" href="mailto:kandisha.pro.art@gmail.com">kandisha.pro.art@gmail.com</a>
      </li>
      <li>
        <span${t('con.addr')}</span>
        <address>Imm. Côte d'Or, n.º 38<br>Angle Av. Youssef Ben Tachfin et Rue Rachid Reda<br><span${t('con.city')}</span></address>
        <a class="enlace" href="https://www.google.com/maps/search/?api=1&amp;query=Imm+C%C3%B4te+d%27Or+Avenue+Youssef+Ben+Tachfine+Tanger" target="_blank" rel="noopener"${t('con.map')}</a>
      </li>
      <li>
        <span>Facebook</span>
        <a class="enlace" href="https://www.facebook.com/KandishaProArt/" target="_blank" rel="noopener">KandishaProArt</a>
      </li>
    </ul>

    <form class="formulario" id="formulario" novalidate>
      <div class="campo">
        <label for="f-nombre"${t('form.name')}</label>
        <input id="f-nombre" name="nombre" type="text" autocomplete="name" required>
      </div>
      <div class="campo">
        <label for="f-tel"${t('form.tel')}</label>
        <input id="f-tel" name="telefono" type="tel" autocomplete="tel">
      </div>
      <div class="campo">
        <label for="f-tipo"${t('form.type')}</label>
        <select id="f-tipo" name="tipo">
          ${[1, 2, 3, 4, 5, 6].map(n => `<option${t('s' + n + '.t')}</option>`).join('\n          ')}
        </select>
      </div>
      <div class="campo">
        <label for="f-msg"${t('form.msg')}</label>
        <textarea id="f-msg" name="mensaje" rows="5" required></textarea>
      </div>
      <p class="form-error" id="form-error" role="alert" hidden${t('form.error')}</p>
      <button class="boton boton-sello" type="submit"${t('form.send')}</button>
      <p class="form-nota"${t('form.note')}</p>
    </form>
  </section>`
  }
};

function pagina(archivo, p) {
  const nav = NAV.map(([href, k]) => `<a href="${href}"${href === archivo ? ' aria-current="page"' : ''}${t(k)}</a>`).join('\n    ');
  const pieNav = NAV.map(([href, k]) => `<a href="${href}"${t(k)}</a>`).join('\n      ');
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.titulo)}</title>
<meta name="description" content="${p.desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800&family=Cabin:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Kufi+Arabic:wght@400;600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/motion.css">
<script>
// Decide antes de pintar si hay animaciones y qué entrada toca: carga completa o telón corto
(function (r) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var visto = false;
  try { visto = !!sessionStorage.getItem("kandisha-visto"); } catch (e) {}
  r.classList.add("anim", visto ? "entrada-corta" : "entrada-larga");
})(document.documentElement);
</script>
</head>
<body>
${CARGA}
<a class="saltar" href="#contenido"${t('skip')}</a>

<header class="cabecera" id="cabecera">
  <a class="marca" href="index.html" aria-label="Kandisha Pro'Art, inicio">
    <span class="marca-k" aria-hidden="true">K</span>
    <span class="marca-texto">Kandisha <em>Pro'Art</em></span>
  </a>
  <nav class="nav" id="nav" aria-label="Principal">
    ${nav}
  </nav>
  <select class="idioma" id="idioma" aria-label="Idioma / Langue / اللغة">
    <option value="es">ES</option>
    <option value="fr">FR</option>
    <option value="ar">عربي</option>
  </select>
  <button class="menu-boton" id="menu-boton" type="button" aria-expanded="false" aria-controls="nav"${t('menu')}</button>
</header>

<main id="contenido">
  ${p.cuerpo}
</main>

<footer class="pie">
  <img class="pie-logo" src="assets/logo-kandisha.webp" width="2000" height="1047" loading="lazy" alt="Kamal Bounous, Kandisha Pro'Art: architecture, conception, design">
  <div class="pie-fila">
    <span${t('foot')}</span>
    <nav class="pie-nav" aria-label="Pie">
      ${pieNav}
    </nav>
    <a href="tel:+212539321959">+212 5393-21959</a>
  </div>
</footer>

${p.cuerpo.includes('obra-abrir') ? `<dialog class="visor" id="visor"${ta('lb.label')}>
  <div class="visor-barra">
    <span id="visor-cuenta" dir="ltr"></span>
    <button type="button" class="visor-boton" id="visor-cerrar"${t('lb.close')}</button>
  </div>
  <div class="visor-foto" id="visor-foto"></div>
  <div class="visor-pie">
    <button type="button" class="visor-boton" id="visor-ant"${t('lb.prev')}</button>
    <p id="visor-texto"></p>
    <button type="button" class="visor-boton" id="visor-sig"${t('lb.next')}</button>
  </div>
</dialog>

` : ''}<script src="js/textos-fr.js" defer></script>
<script src="js/textos-ar.js" defer></script>
<script src="js/main.js" defer></script>
<script src="js/motion.js" defer></script>
</body>
</html>
`;
}

for (const [archivo, p] of Object.entries(PAGINAS)) fs.writeFileSync(path.join(DEST, archivo), pagina(archivo, p));

const AR = require('./ar.js');
const faltan = Object.keys(T).filter(k => !AR[k]);
if (faltan.length) throw new Error('faltan en árabe: ' + faltan.join(', '));
fs.writeFileSync(path.join(DEST, 'js', 'textos-ar.js'),
  '// Textos en árabe.\nwindow.KANDISHA_AR = ' + JSON.stringify(AR, null, 2) + ';\n');

const fr = {};
for (const k in T) fr[k] = T[k][1];
fs.writeFileSync(path.join(DEST, 'js', 'textos-fr.js'),
  '// Textos en francés. El español está escrito en cada página HTML.\nwindow.KANDISHA_FR = ' + JSON.stringify(fr, null, 2) + ';\n');
console.log('ok', Object.keys(PAGINAS).join(', '));
