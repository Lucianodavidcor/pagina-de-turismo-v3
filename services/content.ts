import api from '../lib/axios';
import { Attraction, Activity, DetailPageContent } from '../types';

// --- UPLOAD DE IMÁGENES ---
export const uploadImages = async (files: FileList | File[]): Promise<string[]> => {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('images', file));
  
  const { data } = await api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  if (data.results && Array.isArray(data.results)) {
      return data.results.map((img: any) => img.url);
  }
  return [];
};

// --- ATRACCIONES ---

export const getAttractions = async (locationId: number) => {
  const { data } = await api.get(`/attractions?location=${locationId}`);
  return data.map((a: any) => ({
    ...a,
    locationId: a.location_id,
    images: a.images ? a.images.map((i: any) => i.url) : [],
    coordinates: {
        lat: Number(a.latitude),
        lng: Number(a.longitude)
    }
  }));
};

export const saveAttraction = async (attraction: Partial<Attraction>) => {
  const payload = {
    ...attraction,
    location_id: attraction.locationId,
    latitude: attraction.coordinates?.lat,
    longitude: attraction.coordinates?.lng,
    images: attraction.images || []
  };
  delete (payload as any).coordinates;

  if (attraction.id) {
    return api.put(`/attractions/${attraction.id}`, payload);
  } else {
    return api.post('/attractions', payload);
  }
};

export const deleteAttraction = async (id: number) => {
  return api.delete(`/attractions/${id}`);
};

// --- ACTIVIDADES ---

export const getActivities = async (locationId: number) => {
  const { data } = await api.get(`/activities?location=${locationId}`);
  return data.map((a: any) => ({
    ...a,
    locationId: a.location_id,
    iconClass: a.icon_class
  }));
};

export const saveActivity = async (activity: Partial<Activity>) => {
  const payload = {
    ...activity,
    location_id: activity.locationId,
    icon_class: activity.iconClass
  };

  if (activity.id) {
    return api.put(`/activities/${activity.id}`, payload);
  } else {
    return api.post('/activities', payload);
  }
};

export const deleteActivity = async (id: number) => {
  return api.delete(`/activities/${id}`);
};

// --- DETAIL PAGES ---

export const getDetailPages = async (locationId: number) => {
  const { data } = await api.get(`/detail-pages/location/${locationId}`);
  return data;
};

export const getDetailPageById = async (id: number) => {
  const { data } = await api.get(`/detail-pages/${id}`);
  return { ...data, locationId: data.location_id };
};

export const saveDetailPage = async (page: Partial<DetailPageContent> & { locationId: number }) => {
  const payload = { ...page, location_id: page.locationId };
  if (page.id) {
    return api.put(`/detail-pages/${page.id}`, payload);
  } else {
    return api.post('/detail-pages', payload);
  }
};

export const deleteDetailPage = async (id: number) => {
  return api.delete(`/detail-pages/${id}`);
};

// --- GALERÍA (NUEVAS FUNCIONES CORREGIDAS) ---

export const getGallery = async (locationId: number) => {
  const { data } = await api.get(`/gallery/location/${locationId}`);
  return data;
};

// CORRECCIÓN: Ahora recibe un array de strings y lo envía como 'images'
export const saveGalleryImages = async (locationId: number, imageUrls: string[]) => {
  const payload = {
    location_id: locationId,
    images: imageUrls // <--- Esto es lo que esperaba tu backend (Array)
  };
  return api.post('/gallery', payload);
};

export const deleteGalleryImage = async (id: number) => {
  return api.delete(`/gallery/${id}`);
};