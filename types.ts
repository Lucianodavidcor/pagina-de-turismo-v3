import type { ReactElement, ReactNode } from 'react';

export interface NavLink {
  label: string;
  href: string;
}

export interface Attraction {
  title: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
}

export interface Activity {
  title: string;
  description: string;
  icon: ReactElement;
}

export interface ForumPost {
    author: string;
    avatar: string;
    rating: number;
    text: string;
    images: string[];
}

export interface DetailPageContent {
    title: string;
    content: ReactNode;
}

export interface LocationPageData {
  name: string;
  slug: string;
  accentColor: 'orange' | 'cyan' | 'green';
  bookingButton: boolean;
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
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
  mapCenter: [number, number];
}
