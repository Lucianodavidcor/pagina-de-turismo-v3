import React from 'react';
import type { NavLink, LocationPageData, ForumPost } from './types';

// =================================================================
// GUÍA PARA AÑADIR NUEVAS LOCALIZACIONES Y DATOS
// =================================================================
// Para añadir una nueva localización, sigue estos pasos:
//
// 1. DUPLICAR UNA LOCALIZACIÓN EXISTENTE:
//    Copia todo el bloque de `BUTA_RANQUIL_DATA` o `CHOS_MALAL_DATA`.
//
// 2. RENOMBRAR LA CONSTANTE:
//    Cambia el nombre de la constante (p. ej., de `BUTA_RANQUIL_DATA` a `NUEVA_LOCALIZACION_DATA`).
//
// 3. ACTUALIZAR LOS DATOS BÁSICOS:
//    - `name`: El nombre que se mostrará en la página (p. ej., "Villa Pehuenia").
//    - `slug`: La URL amigable (p. ej., "villa-pehuenia"). Debe ser único.
//    - `accentColor`: El color principal para la UI de la página ('orange', 'cyan', 'green').
//    - `bookingButton`: `true` si quieres mostrar un botón de "Reservar ahora", `false` si no.
//
// 4. CONFIGURAR EL HERO SECTION:
//    - `title`: Título principal que aparece en la imagen grande.
//    - `subtitle`: Texto secundario debajo del título.
//    - `image`: URL de la imagen de fondo.
//
// 5. DEFINIR LOS ENLACES DE NAVEGACIÓN:
//    - `navLinks`: Son los enlaces que aparecen en el encabezado de la página de la localización.
//      - `label`: El texto del enlace.
//      - `href`: La ruta a la que apunta. Usa el `slug` que definiste (p. ej., `"/villa-pehuenia/atracciones"`).
//
// 6. AÑADIR ATRACCIONES, HOTELES Y RESTAURANTES:
//    - Rellena `attractions`, `hotels`, y `restaurants`.
//    - Cada elemento debe tener `title`, `description`, `image` y `coordinates`.
//    - Opcionalmente, puedes añadir `phone` y `email`.
//
// 7. AÑADIR ACTIVIDADES:
//    - En `activities`, cada `item` tiene `title`, `description` y un `icon`.
//    - El ícono es un elemento de React, usualmente de FontAwesome (p. ej., `<i className="fa-solid fa-hiking" />`).
//
// 8. CONFIGURAR LA GALERÍA Y EL MAPA:
//    - `gallery`: Añade URLs de imágenes para la galería.
//    - `mapCenter`: Coordenadas [latitud, longitud] para centrar el mapa.
//
// 9. CREAR PÁGINAS DE DETALLE:
//    - `detailPages`: Contenido para sub-páginas como "historia", "trekking", etc.
//      - La clave (p. ej., 'trekking') debe coincidir con el `slug` de la URL.
//      - `title`: Título de la página de detalle.
//      - `content`: Puede ser texto simple o JSX más complejo.
//
// 10. ACTUALIZAR ARCHIVOS ADICIONALES:
//     - Ve a `App.tsx` y añade una nueva ruta para tu localización:
//       <Route path="/villa-pehuenia" element={<LocationPage data={NUEVA_LOCALIZACION_DATA} />} />
//     - Añade un enlace en `HOME_NAV_LINKS` para que aparezca en el menú principal.
// =================================================================

/**
 * @description Enlaces de navegación para la página de inicio.
 * Cada objeto representa un enlace en la barra de navegación principal.
 */
export const HOME_NAV_LINKS: NavLink[] = [
  { label: 'Buta Ranquil', href: '/buta-ranquil' },
  { label: 'Chos Malal', href: '/chos-malal' },
  { label: 'Actividades', href: '/actividades' },
  { label: 'Foro', href: '/foro' },
];

// ========================================================
// DATOS DE LA LOCALIZACIÓN: BUTA RANQUIL
// ========================================================
export const BUTA_RANQUIL_DATA: LocationPageData = {
  // --- Configuración General ---
  name: 'Buta Ranquil', // Nombre visible de la localidad.
  slug: 'buta-ranquil', // Identificador para la URL (ej. /buta-ranquil).
  accentColor: 'orange', // Color temático para esta sección ('orange', 'cyan', 'green').
  bookingButton: false, // Define si se muestra o no el botón "Reservar ahora".

  // --- Sección Principal (Hero) ---
  hero: {
    title: 'Buta Ranquil: Aventura y Tradición', // Título principal.
    subtitle: 'Descubrí un tesoro escondido en el norte neuquino.', // Subtítulo.
    image: 'https://municipiosycomunas.com.ar/wp-content/uploads/2018/11/BUTA-RANQUIL.jpg', // URL de la imagen de fondo.
  },

  // --- Enlaces de Navegación Específicos de la Página ---
  navLinks: [
    { label: 'Inicio', href: '/' },
    { label: 'Atracciones', href: '/buta-ranquil/atracciones' },
    { label: 'Actividades', href: '/buta-ranquil/actividades' },
    { label: 'Galería', href: '/buta-ranquil/galeria' },
  ],

  // --- Listado de Atracciones Turísticas ---
  attractions: {
    title: 'Lugares que no te podés perder',
    items: [
      {
        title: 'Area Natural Protegida El Tromen',
        description: 'Un gigante dormido que domina el paisaje. Ideal para trekking y fotografía.',
        images: [
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/ed/37/56/volcan-y-escorial.jpg?w=1000&h=-1&s=1', 
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/2c/0d/f2/el-escorial.jpg?w=1000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/ed/37/19/escorial.jpg?w=1000&h=-1&s=1'],

          coordinates: { lat: -37.13, lng: -70.03 }, // Coordenadas para el mapa.
          phone: '+54 9 299 123-4567', // Opcional: teléfono de contacto.
          email: 'info@butaranquil.example', // Opcional: email de contacto.
      },
      
      {
        title: 'Volcán Domuyo',
        description: 'Lugar fantastico!, caminos de cornisa, y la naturaleza increible, aguas termales que brotan del pie del volcan.',
        images: [
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/50/37/7a/los-bolillos.jpg?w=1000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/67/50/70/geiser-en-los-tachos.jpg?w=1000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/50/36/a4/geiser-en-los-tachos.jpg?w=1000&h=-1&s=1'],

          coordinates: { lat: -36.579711, lng: -70.421468 },
          phone: '+54 9 299 234-5678',
          email: 'info@butaranquil.example',
      },
      {
        title: 'Río Colorado',
        description: 'Perfecto para la pesca deportiva y disfrutar de la tranquilidad del entorno.',
        images: [
          'https://apn.lapampa.gob.ar/images/multimedia/153690_imagen-de-whatsapp-2024-01-04-a-las-13.30.44_0fadb52f.jpg',
          'https://mtbbutaranquil.wordpress.com/wp-content/uploads/2013/09/laguna-el-aparato-unos-15-km-de-buta-ranquil1.jpg?w=900&h=509',
          'https://pxcdn.laarena.com.ar/062023/1687719156461.jpeg'],

          coordinates: { lat: -36.88, lng: -69.87 },
          
      },
      {
        title: 'Los Cactus',
        description: 'Es un lugar donde hay una especie de cactus (llamada Denmoza rhodacantha), y este sitio es su punto más austral de distribución.',
        images: ['https://www.turismoruta40.com.ar/images/neuquen/cactus-pehuenco-600px.jpg'],

          coordinates: { lat: -37.1449, lng: -69.6878 },
          phone: '+54 9 299 234-5678',
          email: 'info@butaranquil.example',
      },
      {
        title: 'Caverna La Salamanca',
        description: 'Dista 2 km del pueblo, hacia Barrancas, por la Ruta 40. Situado en el paraje "Aguada de los Pajaritos", posee formaciones geológicas de gran valor científico y paisajístico.',
        images: ['https://www.turismoruta40.com.ar/images/neuquen/caverna-salamanca-600px.jpg'],

          coordinates: { lat: -37.03324924351327, lng: -69.87443933337082 },
          phone: '+54 9 299 345-6789',
          email: 'info@butaranquil.example',
      },
      {
        title: 'Cueva de la Manos',
        description: 'Perfecto para la pesca deportiva y disfrutar de la tranquilidad del entorno.',
        images: ['https://upload.wikimedia.org/wikipedia/commons/5/51/Marianoc_IMG_8565_copy.jpg'],
        
          coordinates: { lat: -36.88, lng: -69.87 },
          phone: '+54 9 299 234-5678',
          email: 'info@butaranquil.example',
      },
    ],
  },

  // --- Listado de Actividades ---
  activities: {
    title: 'Aventuras para todos',
    items: [
      // El ícono debe ser un componente de React. Aquí usamos FontAwesome.
      { title: 'Trekking', description: 'Explorá senderos únicos.', icon: <i className="fa-solid fa-hiking" /> },
      { title: 'Cabalgatas', description: 'Recorré paisajes a caballo.', icon: <i className="fa-solid fa-horse" /> },
      { title: 'Pesca', description: 'Disfrutá de ríos cristalinos.', icon: <i className="fa-solid fa-fish" /> },
      { title: 'Fotografía', description: 'Capturá la belleza natural.', icon: <i className="fa-solid fa-camera-retro" /> },
      { title: 'Camping', description: 'Viví la naturaleza de cerca.', icon: <i className="fa-solid fa-campground" /> },
      { title: 'Kayak', description: 'Navegá por aguas tranquilas.', icon: <i className="fa-solid fa-water" /> },
    ],
  },

  // --- Galería de Imágenes ---
  gallery: {
    title: 'Postales de Buta Ranquil',
    images: [
      'https://picsum.photos/seed/br-gal1/600/400',
      'https://picsum.photos/seed/br-gal2/600/400',
      'https://picsum.photos/seed/br-gal3/600/400',
      'https://picsum.photos/seed/br-gal4/600/400',
      'https://picsum.photos/seed/br-gal5/600/400',
      'https://picsum.photos/seed/br-gal6/600/400',
    ],
  },

  // --- Páginas de Detalle ---
  // Cada clave ('trekking', 'historia') corresponde a una URL (ej. /buta-ranquil/trekking).
  detailPages: {
    'trekking': {
      title: 'Trekking en Buta Ranquil',
      content: <p>Descubre los mejores senderos para hacer trekking en la zona, desde caminatas familiares hasta ascensos desafiantes como el Volcán Tromen. La diversidad de paisajes te sorprenderá.</p> // El contenido puede ser JSX.
    },
    'historia': {
      title: 'Historia de Buta Ranquil',
      content: <p>Conoce la rica historia de este pueblo neuquino, marcado por la cultura criancera y los vestigios de pueblos originarios. Un lugar donde el pasado y el presente se entrelazan.</p>
    },
    'actividades': {
      title: 'Actividades en Buta Ranquil',
      content: (
        <div>
          <p>En Buta Ranquil podés disfrutar de trekking, cabalgatas, pesca deportiva y camping. Existen guías locales que organizan travesías de medio día y excursiones de varios días con todo incluido.</p>
          <ul>
            <li>Trekking guiado al Volcán Tromen</li>
            <li>Cabalgatas por los cerros</li>
            <li>Pesca en Río Barrancas (permitida con guía)</li>
          </ul>
        </div>
      )
    },
    'atracciones': {
      title: 'Atracciones principales',
      content: (
        <div>
          <p>Las principales atracciones incluyen el Volcán Tromen, el Río Barrancas y los Bosques Petrificados. Cada sitio ofrece servicios básicos y miradores preparados para visitantes.</p>
        </div>
      )
    },
    'galeria': {
      title: 'Galería de Buta Ranquil',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['br-gal1','br-gal2','br-gal3','br-gal4','br-gal5','br-gal6'].map((s, i) => (
            <img key={i} src={`https://picsum.photos/seed/${s}/600/400`} alt={`Galería ${i+1}`} className="w-full h-48 object-cover rounded" />
          ))}
        </div>
      )
    }
  },

  // --- Configuración del Mapa ---
  mapCenter: [-37.05, -69.9], // Coordenadas [lat, lng] para centrar el mapa.

  // --- Opcional: Hoteles y Restaurantes ---
  hotels: {
    title: 'Alojamiento recomendado',
    items: [
      { title: 'Hotel el Porton', description: 'Confort y tradición en el corazón de Buta Ranquil.', 
        images: ['https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrOPy17ayaVUUrmiVkzZMGP7NH19ZWVaoYLy8T0EQ93K57nep91oolNt5Byusiq7ftkUTdFYMbhsVGQMnHzvhcYfpz5Lj1MH2LrRvRQmfnjW0IlTRuLOXlFcp9xMgPhDwNIAu7dHbT-mE8=s680-w680-h510-rw'], 
        coordinates: { lat: -37.14, lng: -70.02 }, phone: '+54 9 299 555-0001', email: 'reservas@hosteria-tromen.example' },

      { title: 'Portal Norte', description: 'Hospedaje confortable con vistas panorámicas.', 
        images: ['https://dynamic-media-cdn.tripadvisor.com/media/partner/bookingcom/photo-o/30/0d/29/20/portal-norte.jpg?w=1000&h=-1&s=1'], 
        coordinates: { lat: -36.89, lng: -69.86 }, phone: '+54 9 299 555-0002', email: 'info@cabanas-barrancas.example' },
      
      { title: 'Villa Butacoin3', description: 'Cabañas equipadas para una estancia inolvidable.', 
        images: ['https://butacoin3.hoteles-neuquen-province.com/data/Images/1920x1080w/16302/1630275/1630275649/image-buta-ranquil-butacoin3-1.JPEG'], 
        coordinates: { lat: -36.89, lng: -69.86 }, phone: '+54 9 299 555-0002', email: 'info@cabanas-barrancas.example' },
    ],
  },
  restaurants: {
    title: 'Gastronomía local',
    items: [
      { title: 'Parrilla El Criollo', description: 'Asados y platos regionales.', images: ['https://picsum.photos/seed/parrilla1/800/600'], coordinates: { lat: -37.06, lng: -69.92 }, phone: '+54 9 299 555-0101', email: 'contacto@parrilla-criollo.example' },
      { title: 'Café de la Plaza', description: 'Cafetería y repostería local.', images: ['https://picsum.photos/seed/cafe1/800/600'], coordinates: { lat: -37.05, lng: -69.91 }, phone: '+54 9 299 555-0102', email: 'hola@cafedelaplaza.example' },
    ],
  },
};

// ========================================================
// DATOS DE LA LOCALIZACIÓN: CHOS MALAL
// (Sigue la misma estructura que Buta Ranquil)
// ========================================================
export const CHOS_MALAL_DATA: LocationPageData = {
    name: 'Chos Malal',
    slug: 'chos-malal',
    accentColor: 'cyan',
    bookingButton: false,
    hero: {
      title: 'Chos Malal: Cuna de la Historia Neuquina',
      subtitle: 'Explorá la primera capital de la provincia y sus alrededores.',
      image: 'https://picsum.photos/seed/chos-malal-hero/1920/1080',
    },
    navLinks: [
      { label: 'Inicio', href: '/' },
      { label: 'Atracciones', href: '/chos-malal/atracciones' },
      { label: 'Actividades', href: '/chos-malal/actividades' },
      { label: 'Galería', href: '/chos-malal/galeria' },
    ],
    attractions: {
      title: 'Imperdibles de Chos Malal',
      items: [
        {
          title: 'Cerro de la Virgen',
          description: 'Ofrece una vista panorámica impresionante de la ciudad y el valle.',
          images: ['https://picsum.photos/seed/cerro-virgen/800/600'],
          coordinates: { lat: -37.37, lng: -70.27 },
          phone: '+54 9 299 987-6543',
          email: 'info@cerrovirgen.example',
        },
        {
          title: 'Museo Histórico Manuel José Olascoaga',
          description: 'Un recorrido por la historia de la fundación de Neuquén.',
          images: ['https://picsum.photos/seed/museo-cm/800/600'],
          coordinates: { lat: -37.38, lng: -70.27 },
          phone: '+54 9 299 876-5432',
          email: 'museo@chosmalal.example',
        },
        {
          title: 'Río Curi Leuvú',
          description: 'Un lugar ideal para el esparcimiento, la pesca y actividades acuáticas.',
          images: ['https://picsum.photos/seed/curi-leuvu/800/600'],
          coordinates: { lat: -37.36, lng: -70.25 },
          phone: '+54 9 299 765-4321',
          email: 'info@curileuvu.example',
        },
      ],
    },
    activities: {
      title: 'Experiencias Únicas',
      items: [
        { title: 'Trekking', description: 'Senderos con vistas increíbles.', icon: <i className="fa-solid fa-hiking" /> },
        { title: 'Kayak', description: 'Aventura en el río.', icon: <i className="fa-solid fa-water" /> },
        { title: 'Pesca', description: 'Relax y deporte.', icon: <i className="fa-solid fa-fish" /> },
        { title: 'Fotografía', description: 'Paisajes urbanos y naturales.', icon: <i className="fa-solid fa-camera-retro" /> },
        { title: 'Camping', description: 'Noches bajo las estrellas.', icon: <i className="fa-solid fa-campground" /> },
        { title: 'Cabalgatas', description: 'Conectá con la naturaleza.', icon: <i className="fa-solid fa-horse" /> },
      ],
    },
    gallery: {
      title: 'Postales de Chos Malal',
      images: [
        'https://picsum.photos/seed/cm-gal1/600/400',
        'https://picsum.photos/seed/cm-gal2/600/400',
        'https://picsum.photos/seed/cm-gal3/600/400',
        'https://picsum.photos/seed/cm-gal4/600/400',
        'https://picsum.photos/seed/cm-gal5/600/400',
        'https://picsum.photos/seed/cm-gal6/600/400',
      ],
    },
    detailPages: {
      'museos': {
          title: 'Museos en Chos Malal',
          content: <p>Explora la cultura e historia en los museos de la ciudad, especialmente el Museo Histórico Provincial Manuel José Olascoaga, que alberga el pasado de la primera capital del territorio.</p>
      },
      'gastronomia': {
          title: 'Gastronomía Local',
          content: <p>Saborea los platos típicos de la región del norte neuquino, donde el chivito criollo es el rey. Descubrí restaurantes y parrillas que mantienen viva la tradición culinaria local.</p>
      }
    ,
    'actividades': {
      title: 'Actividades en Chos Malal',
      content: (
        <div>
          <p>Chos Malal ofrece kayaking, pesca, cabalgatas y trekking en sus cerros cercanos. Hay operadores locales que alquilan equipos y guían salidas seguras.</p>
        </div>
      )
    },
    'atracciones': {
      title: 'Atracciones de Chos Malal',
      content: (
        <div>
          <p>Visita el Cerro de la Virgen para una vista panorámica, el museo histórico para conocer la fundación, y disfrutá de la costanera del Río Curi Leuvú.</p>
        </div>
      )
    },
    'galeria': {
      title: 'Galería de Chos Malal',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['cm-gal1','cm-gal2','cm-gal3','cm-gal4','cm-gal5','cm-gal6'].map((s, i) => (
            <img key={i} src={`https://picsum.photos/seed/${s}/600/400`} alt={`Galería ${i+1}`} className="w-full h-48 object-cover rounded" />
          ))}
        </div>
      )
    }
    },
    mapCenter: [-37.38, -70.27],
    hotels: {
      title: 'Alojamiento recomendado',
      items: [
        { title: 'Hotel Mirador', description: 'Hotel céntrico con vista al cerro.', images: ['https://picsum.photos/seed/hotel1/800/600'], coordinates: { lat: -37.375, lng: -70.27 }, phone: '+54 9 299 555-0201', email: 'reservas@hotelmirador.example' },
        { title: 'Hostal Costanera', description: 'Económico y acogedor cerca del río.', images: ['https://picsum.photos/seed/hostal1/800/600'], coordinates: { lat: -37.379, lng: -70.268 }, phone: '+54 9 299 555-0202', email: 'info@hostal-costanera.example' },
      ],
    },
    restaurants: {
      title: 'Gastronomía local',
      items: [
        { title: 'La Parrilla del Valle', description: 'Carnes y comidas regionales.', images: ['https://picsum.photos/seed/parrilla2/800/600'], coordinates: { lat: -37.378, lng: -70.27 }, phone: '+54 9 299 555-0301', email: 'contacto@laparrilla.example' },
        { title: 'Panadería Central', description: 'Pan y facturas frescas cada mañana.', images: ['https://picsum.photos/seed/panaderia1/800/600'], coordinates: { lat: -37.379, lng: -70.269 }, phone: '+54 9 299 555-0302', email: 'hola@panaderiacentral.example' },
      ],
    },
  };

// ========================================================
// DATOS DEL FORO DE VIAJEROS
// ========================================================
/**
 * @description Contenido de ejemplo para el foro de viajeros.
 * Estos son los posts que se muestran en la página de inicio y en la sección del foro.
 */
  export const FORUM_POSTS: ForumPost[] = [
    {
      author: 'Ana María',
      avatar: 'https://thumbs.dreamstime.com/b/mujer-joven-hermosa-31169974.jpg',
      rating: 5, // Rating de 1 a 5 estrellas.
      text: '¡El Volcán Tromen es increíble! Una caminata desafiante pero las vistas desde la cima valen cada paso. Recomiendo ir con guía. ¡Una experiencia inolvidable en Buta Ranquil!',
      images: [ // Lista de URLs de imágenes adjuntas al post.
        'https://masneuquen.com/wp-content/uploads/2017/12/Area-natural-protegida-el-Tromen-Neuqu%C3%A9n-05.jpg',
        'https://media.elpatagonico.com/p/5ad27784c0d9ea67c3a8aa44589b235a/adjuntos/193/imagenes/037/477/0037477766/1200x675/smart/chosmalal3jpg.jpg',
      ],
    },
    {
      author: 'Familia Viajera',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
      rating: 4,
      text: 'Chos Malal es un lugar con mucha historia. A nuestros hijos les encantó el museo y aprendimos mucho sobre los inicios de la provincia. La costanera del río es ideal para mates por la tarde.',
      images: [
        'https://www.laangosturadigital.com.ar/wp-content/uploads/2024/01/museo-chos-malal-24-412348779_755553336608170_977211772401218623_n.jpg',
        'https://media.lmneuquen.com/p/5173c4f1c85121773fac1797642344f8/adjuntos/195/imagenes/007/231/0007231806/chos-malal-postales-un-domingo-primavera-costanera-19jpg.jpg',
      ],
    },
  ];