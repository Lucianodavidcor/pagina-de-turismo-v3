import api from '../lib/axios'; 
import { LocationPageData, LocationData, Attraction, Activity } from '../types';

// --- Interfaces para los datos CRUDOS del Backend (Snake Case) ---

interface BackendLocation {
  id: number;
  name: string;
  slug: string;
  accent_color: 'orange' | 'cyan' | 'green';
  booking_button: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  map_center_lat: string | number;
  map_center_lng: string | number;
}

interface BackendImageObj {
  id: number;
  url: string;
  order: number;
}

interface BackendAttraction {
  id: number;
  location_id: number;
  type: 'attraction' | 'hotel' | 'restaurant';
  title: string;
  description: string;
  latitude: string | number;
  longitude: string | number;
  phone?: string;
  email?: string;
  // TU BASE DE DATOS ENVÍA UN ARRAY DE OBJETOS, NO DE STRINGS
  images: BackendImageObj[] | null; 
}

interface BackendActivity {
  id: number;
  location_id: number;
  title: string;
  description: string;
  icon_class: string;
}

interface BackendGalleryImage {
  id: number;
  location_id: number;
  image_url: string; // En la tabla gallery_images la columna es image_url
  caption?: string;
}

// --- ADAPTADORES (Transforman Snake_Case -> camelCase) ---

const adaptLocation = (raw: BackendLocation): LocationData => ({
  id: raw.id,
  name: raw.name,
  slug: raw.slug,
  accentColor: raw.accent_color,
  bookingButton: raw.booking_button,
  hero: {
    title: raw.hero_title,
    subtitle: raw.hero_subtitle,
    image: raw.hero_image,
  },
  mapCenter: {
    lat: Number(raw.map_center_lat),
    lng: Number(raw.map_center_lng),
  },
});

const adaptAttraction = (raw: BackendAttraction): Attraction => ({
  id: raw.id,
  locationId: raw.location_id,
  type: raw.type,
  title: raw.title,
  description: raw.description,
  coordinates: {
    lat: Number(raw.latitude),
    lng: Number(raw.longitude),
  },
  phone: raw.phone,
  email: raw.email,
  // CORRECCIÓN AQUÍ: Extraemos solo la URL del objeto de imagen
  images: raw.images && Array.isArray(raw.images) 
    ? raw.images.map((img) => img.url) 
    : [], 
});

const adaptActivity = (raw: BackendActivity): Activity => ({
  id: raw.id,
  locationId: raw.location_id,
  title: raw.title,
  description: raw.description,
  iconClass: raw.icon_class,
});

// --- SERVICIO PRINCIPAL ---

export const getLocationBySlug = async (slug: string): Promise<LocationPageData> => {
  try {
    // 1. Pedimos los datos base de la localidad
    const { data: rawLocation } = await api.get<BackendLocation>(`/locations/${slug}`);
    
    // 2. Adaptamos inmediatamente para tener el ID a mano
    const location = adaptLocation(rawLocation);

    // 3. Pedimos el resto en paralelo
    const [attractionsRes, activitiesRes, galleryRes] = await Promise.all([
      api.get<BackendAttraction[]>(`/attractions?location=${location.id}`), 
      api.get<BackendActivity[]>(`/activities?location=${location.id}`),
      api.get<BackendGalleryImage[]>(`/gallery/location/${location.id}`)
    ]);

    // 4. Adaptamos las respuestas
    const adaptedAttractions = attractionsRes.data.map(adaptAttraction);
    const adaptedActivities = activitiesRes.data.map(adaptActivity);

    // 5. Construimos el objeto final para la UI
    const fullData: LocationPageData = {
      ...location,
      attractions: {
        title: "Imperdibles",
        items: adaptedAttractions.filter(a => a.type === 'attraction')
      },
      hotels: {
        title: "Dónde Dormir",
        items: adaptedAttractions.filter(a => a.type === 'hotel')
      },
      restaurants: {
        title: "Dónde Comer",
        items: adaptedAttractions.filter(a => a.type === 'restaurant')
      },
      activities: {
        title: "Qué hacer",
        items: adaptedActivities
      },
      gallery: {
        title: `Galería de ${location.name}`,
        // CORRECCIÓN AQUÍ: Mapeamos image_url (nombre de columna en DB) a string
        images: galleryRes.data.map(img => img.image_url)
      },
      navLinks: [
        { label: 'Inicio', href: '/' },
        { label: 'Atracciones', href: `/${slug}#atracciones` },
        { label: 'Actividades', href: `/${slug}#actividades` },
        { label: 'Galería', href: `/${slug}#galeria` },
      ],
      detailPages: {} 
    };

    return fullData;
  } catch (error) {
    console.error(`Error fetching location ${slug}:`, error);
    throw error;
  }
};

// --- NUEVAS FUNCIONES PARA EL HOME ---

// 1. Obtener todas las localidades (para las tarjetas del Home)
export const getAllLocations = async (): Promise<LocationData[]> => {
  try {
    const { data } = await api.get<BackendLocation[]>('/locations');
    // Reutilizamos el adaptador que ya creamos
    return data.map(adaptLocation);
  } catch (error) {
    console.error('Error fetching all locations:', error);
    return [];
  }
};

// 2. Obtener galería por ID (para el grid de aventuras)
export const getGalleryByLocationId = async (id: number): Promise<string[]> => {
  try {
    const { data } = await api.get<BackendGalleryImage[]>(`/gallery/location/${id}`);
    return data.map(img => img.image_url);
  } catch (error) {
    console.error(`Error fetching gallery for location ${id}:`, error);
    return [];
  }
};