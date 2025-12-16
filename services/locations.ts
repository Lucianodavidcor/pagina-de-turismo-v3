import api from '../lib/axios'; 
import { LocationPageData, LocationData, Attraction, Activity } from '../types';

export const getLocationBySlug = async (slug: string): Promise<LocationPageData> => {
  try {
    // 1. Datos base de la localidad
    const { data: location } = await api.get<LocationData>(`/locations/${slug}`);

    // 2. Pedir todo lo demás en paralelo
    const [attractionsRes, activitiesRes, galleryRes] = await Promise.all([
      api.get<Attraction[]>(`/attractions?locationId=${location.id}`),
      api.get<Activity[]>(`/activities?locationId=${location.id}`),
      api.get<{ url: string }[]>(`/gallery/location/${location.id}`)
    ]);

    // 3. Organizar la respuesta
    const fullData: LocationPageData = {
      ...location,
      attractions: {
        title: "Imperdibles",
        items: attractionsRes.data.filter(a => a.type === 'attraction')
      },
      hotels: {
        title: "Dónde Dormir",
        items: attractionsRes.data.filter(a => a.type === 'hotel')
      },
      restaurants: {
        title: "Dónde Comer",
        items: attractionsRes.data.filter(a => a.type === 'restaurant')
      },
      activities: {
        title: "Qué hacer",
        items: activitiesRes.data.map(act => ({
            ...act,
            // Si el backend no envía el icono como componente React, usaremos la clase
            icon: undefined 
        }))
      },
      gallery: {
        title: `Galería de ${location.name}`,
        images: galleryRes.data.map(img => img.url)
      },
      navLinks: [
        { label: 'Inicio', href: '/' },
        { label: 'Atracciones', href: `/${slug}/atracciones` },
        { label: 'Actividades', href: `/${slug}/actividades` },
        { label: 'Galería', href: `/${slug}/galeria` },
      ],
      detailPages: {} // Se llenará dinámicamente luego si es necesario
    };

    return fullData;
  } catch (error) {
    console.error(`Error al cargar localidad ${slug}:`, error);
    throw error;
  }
};