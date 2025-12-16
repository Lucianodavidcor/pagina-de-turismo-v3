import type { ReactElement, ReactNode } from 'react';

// --- Entidades Base ---
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  locationId?: number;
}

export interface NavLink {
  id?: number;
  label: string;
  href: string;
  orderPosition?: number;
}

// --- Localidades ---
export interface LocationData {
  id: number;
  name: string;
  slug: string;
  accentColor: 'orange' | 'cyan' | 'green';
  bookingButton: boolean;
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  mapCenter: {
    lat: number;
    lng: number;
  };
}

// --- Atracciones ---
export type AttractionType = 'attraction' | 'hotel' | 'restaurant';

export interface Attraction {
  id: number;
  locationId: number;
  type: AttractionType;
  title: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  images: string[];
}

// --- Actividades ---
export interface Activity {
  id: number;
  locationId: number;
  title: string;
  description: string;
  iconClass: string; 
  icon?: ReactElement; // Mantenemos compatibilidad opcional
}

// --- Páginas de Detalle ---
export interface DetailPageContent {
  id: number;
  slug: string;
  title: string;
  content: string | ReactNode;
}

// --- Datos Completos de Página ---
export interface LocationPageData extends LocationData {
  navLinks: NavLink[];
  attractions: {
    title: string;
    items: Attraction[];
  };
  hotels?: {
    title: string;
    items: Attraction[];
  };
  restaurants?: {
    title: string;
    items: Attraction[];
  };
  activities: {
    title: string;
    items: Activity[];
  };
  gallery: {
    title: string;
    images: string[];
  };
  detailPages: Record<string, DetailPageContent>;
}

export interface ForumPost {
    id?: number;
    author: string;
    avatar: string;
    rating: number;
    text: string;
    images: string[];
    createdAt?: string;
}