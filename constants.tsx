import React from 'react';
import type { NavLink, LocationPageData, ForumPost } from './types';

export const HOME_NAV_LINKS: NavLink[] = [
  { label: 'Buta Ranquil', href: '/buta-ranquil' },
  { label: 'Chos Malal', href: '/chos-malal' },
  { label: 'Actividades', href: '/actividades' },
  { label: 'Foro', href: '/foro' },
];

export const BUTA_RANQUIL_DATA: LocationPageData = {
  name: 'Buta Ranquil',
  slug: 'buta-ranquil',
  accentColor: 'orange',
  bookingButton: false,
  hero: {
    title: 'Buta Ranquil: Aventura y Tradición',
    subtitle: 'Descubrí un tesoro escondido en el norte neuquino.',
    image: 'https://picsum.photos/seed/buta-ranquil-hero/1920/1080',
  },
  navLinks: [
    { label: 'Inicio', href: '/' },
    { label: 'Atracciones', href: '/buta-ranquil/atracciones' },
    { label: 'Actividades', href: '/buta-ranquil/actividades' },
    { label: 'Galería', href: '/buta-ranquil/galeria' },
  ],
  attractions: {
    title: 'Lugares que no te podés perder',
    items: [
      {
        title: 'Volcán Tromen',
        description: 'Un gigante dormido que domina el paisaje. Ideal para trekking y fotografía.',
        image: 'https://picsum.photos/seed/tromen/800/600',
          coordinates: { lat: -37.13, lng: -70.03 },
          phone: '+54 9 299 123-4567',
          email: 'info@tromen.example',
      },
      {
        title: 'Río Barrancas',
        description: 'Perfecto para la pesca deportiva y disfrutar de la tranquilidad del entorno.',
        image: 'https://picsum.photos/seed/barrancas/800/600',
          coordinates: { lat: -36.88, lng: -69.87 },
          phone: '+54 9 299 234-5678',
          email: 'contacto@barrancas.example',
      },
      {
        title: 'Bosques Petrificados',
        description: 'Un viaje al pasado prehistórico de la Patagonia, con árboles convertidos en piedra.',
        image: 'https://picsum.photos/seed/petrificados/800/600',
          coordinates: { lat: -37.25, lng: -69.80 },
          phone: '+54 9 299 345-6789',
          email: 'info@petrificados.example',
      },
    ],
  },
  activities: {
    title: 'Aventuras para todos',
    items: [
      { title: 'Trekking', description: 'Explorá senderos únicos.', icon: <i className="fa-solid fa-hiking" /> },
      { title: 'Cabalgatas', description: 'Recorré paisajes a caballo.', icon: <i className="fa-solid fa-horse" /> },
      { title: 'Pesca', description: 'Disfrutá de ríos cristalinos.', icon: <i className="fa-solid fa-fish" /> },
      { title: 'Fotografía', description: 'Capturá la belleza natural.', icon: <i className="fa-solid fa-camera-retro" /> },
      { title: 'Camping', description: 'Viví la naturaleza de cerca.', icon: <i className="fa-solid fa-campground" /> },
      { title: 'Kayak', description: 'Navegá por aguas tranquilas.', icon: <i className="fa-solid fa-water" /> },
    ],
  },
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
  detailPages: {
    'trekking': {
      title: 'Trekking en Buta Ranquil',
      content: <p>Descubre los mejores senderos para hacer trekking en la zona, desde caminatas familiares hasta ascensos desafiantes como el Volcán Tromen. La diversidad de paisajes te sorprenderá.</p>
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
  mapCenter: [-37.05, -69.9],
  hotels: {
    title: 'Alojamiento recomendado',
    items: [
      { title: 'Hostería El Tromen', description: 'Alojamiento familiar cerca del volcán.', image: 'https://picsum.photos/seed/hosteria1/800/600', coordinates: { lat: -37.14, lng: -70.02 }, phone: '+54 9 299 555-0001', email: 'reservas@hosteria-tromen.example' },
      { title: 'Cabañas Río Barrancas', description: 'Cabañas con vista al río.', image: 'https://picsum.photos/seed/cabanas1/800/600', coordinates: { lat: -36.89, lng: -69.86 }, phone: '+54 9 299 555-0002', email: 'info@cabanas-barrancas.example' },
    ],
  },
  restaurants: {
    title: 'Gastronomía local',
    items: [
      { title: 'Parrilla El Criollo', description: 'Asados y platos regionales.', image: 'https://picsum.photos/seed/parrilla1/800/600', coordinates: { lat: -37.06, lng: -69.92 }, phone: '+54 9 299 555-0101', email: 'contacto@parrilla-criollo.example' },
      { title: 'Café de la Plaza', description: 'Cafetería y repostería local.', image: 'https://picsum.photos/seed/cafe1/800/600', coordinates: { lat: -37.05, lng: -69.91 }, phone: '+54 9 299 555-0102', email: 'hola@cafedelaplaza.example' },
    ],
  },
};

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
          image: 'https://picsum.photos/seed/cerro-virgen/800/600',
          coordinates: { lat: -37.37, lng: -70.27 },
          phone: '+54 9 299 987-6543',
          email: 'info@cerrovirgen.example',
        },
        {
          title: 'Museo Histórico Manuel José Olascoaga',
          description: 'Un recorrido por la historia de la fundación de Neuquén.',
          image: 'https://picsum.photos/seed/museo-cm/800/600',
          coordinates: { lat: -37.38, lng: -70.27 },
          phone: '+54 9 299 876-5432',
          email: 'museo@chosmalal.example',
        },
        {
          title: 'Río Curi Leuvú',
          description: 'Un lugar ideal para el esparcimiento, la pesca y actividades acuáticas.',
          image: 'https://picsum.photos/seed/curi-leuvu/800/600',
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
        { title: 'Hotel Mirador', description: 'Hotel céntrico con vista al cerro.', image: 'https://picsum.photos/seed/hotel1/800/600', coordinates: { lat: -37.375, lng: -70.27 }, phone: '+54 9 299 555-0201', email: 'reservas@hotelmirador.example' },
        { title: 'Hostal Costanera', description: 'Económico y acogedor cerca del río.', image: 'https://picsum.photos/seed/hostal1/800/600', coordinates: { lat: -37.379, lng: -70.268 }, phone: '+54 9 299 555-0202', email: 'info@hostal-costanera.example' },
      ],
    },
    restaurants: {
      title: 'Gastronomía local',
      items: [
        { title: 'La Parrilla del Valle', description: 'Carnes y comidas regionales.', image: 'https://picsum.photos/seed/parrilla2/800/600', coordinates: { lat: -37.378, lng: -70.27 }, phone: '+54 9 299 555-0301', email: 'contacto@laparrilla.example' },
        { title: 'Panadería Central', description: 'Pan y facturas frescas cada mañana.', image: 'https://picsum.photos/seed/panaderia1/800/600', coordinates: { lat: -37.379, lng: -70.269 }, phone: '+54 9 299 555-0302', email: 'hola@panaderiacentral.example' },
      ],
    },
  };

  export const FORUM_POSTS: ForumPost[] = [
    {
      author: 'Aventurero_88',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      rating: 5,
      text: '¡El Volcán Tromen es increíble! Una caminata desafiante pero las vistas desde la cima valen cada paso. Recomiendo ir con guía. ¡Una experiencia inolvidable en Buta Ranquil!',
      images: [
        'https://picsum.photos/seed/post1-img1/200/150',
        'https://picsum.photos/seed/post1-img2/200/150',
      ],
    },
    {
      author: 'Familia Viajera',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
      rating: 4,
      text: 'Chos Malal es un lugar con mucha historia. A nuestros hijos les encantó el museo y aprendimos mucho sobre los inicios de la provincia. La costanera del río es ideal para mates por la tarde.',
      images: [
        'https://picsum.photos/seed/post2-img1/200/150',
      ],
    },
  ];
