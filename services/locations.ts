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
  image_url: string; 
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

// --- FUNCIONES DE LECTURA (PÚBLICAS) ---

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

export const getAllLocations = async (): Promise<LocationData[]> => {
  try {
    const { data } = await api.get<BackendLocation[]>('/locations');
    return data.map(adaptLocation);
  } catch (error) {
    console.error('Error fetching all locations:', error);
    return [];
  }
};

export const getGalleryByLocationId = async (id: number): Promise<string[]> => {
  try {
    const { data } = await api.get<BackendGalleryImage[]>(`/gallery/location/${id}`);
    return data.map(img => img.image_url);
  } catch (error) {
    console.error(`Error fetching gallery for location ${id}:`, error);
    return [];
  }
};

// --- FUNCIONES DE ESCRITURA (ADMIN / SUPERADMIN) ---

export const createLocation = async (data: Partial<LocationData>) => {
    // Transformamos camelCase (Frontend) -> snake_case (Backend)
    const payload = {
        name: data.name,
        slug: data.slug,
        accent_color: data.accentColor,
        booking_button: data.bookingButton,
        hero_title: data.hero?.title,
        hero_subtitle: data.hero?.subtitle,
        hero_image: data.hero?.image,
        map_center_lat: data.mapCenter?.lat,
        map_center_lng: data.mapCenter?.lng
    };
    const { data: response } = await api.post('/locations', payload);
    return response;
};

export const updateLocation = async (id: number, data: Partial<LocationData>) => {
    // Solo enviamos los campos que vienen definidos
    const payload: any = {};
    
    if (data.name) payload.name = data.name;
    if (data.slug) payload.slug = data.slug;
    if (data.accentColor) payload.accent_color = data.accentColor;
    if (data.bookingButton !== undefined) payload.booking_button = data.bookingButton;
    
    // Objetos anidados: Backend espera campos planos (hero_title, etc.)
    if (data.hero?.title) payload.hero_title = data.hero.title;
    if (data.hero?.subtitle) payload.hero_subtitle = data.hero.subtitle;
    if (data.hero?.image) payload.hero_image = data.hero.image;
    
    if (data.mapCenter?.lat) payload.map_center_lat = data.mapCenter.lat;
    if (data.mapCenter?.lng) payload.map_center_lng = data.mapCenter.lng;

    const { data: response } = await api.put(`/locations/${id}`, payload);
    return response;
};

export const deleteLocation = async (id: number) => {
    const { data } = await api.delete(`/locations/${id}`);
    return data;
};