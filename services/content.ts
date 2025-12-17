import api from '../lib/axios';
import { Attraction, Activity, DetailPageContent } from '../types';

// --- UPLOAD DE IMÁGENES ---
export const uploadImages = async (files: FileList | File[]): Promise<string[]> => {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('images', file));
  
  const { data } = await api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  // El backend devuelve { message, results: [...] }
  if (data.results && Array.isArray(data.results)) {
      return data.results.map((img: any) => img.url);
  }
  return [];
};

// --- ATRACCIONES ---

export const getAttractions = async (locationId: number) => {
  const { data } = await api.get(`/attractions?location=${locationId}`);
  
  // AL LEER (GET): El backend sí devuelve objetos (ej: {id: 1, url: '...'})
  // Los transformamos a string[] para que el frontend los entienda
  return data.map((a: any) => ({
    ...a,
    locationId: a.location_id,
    images: a.images ? a.images.map((i: any) => i.url) : []
  }));
};

export const saveAttraction = async (attraction: Partial<Attraction>) => {
  // AL GUARDAR (POST/PUT): Enviamos solo strings, no objetos
  const payload = {
    ...attraction,
    location_id: attraction.locationId,
    // CORRECCIÓN AQUÍ: Enviamos el array de strings directo
    // Antes hacíamos .map(url => ({ url })), eso causaba el error en la DB
    images: attraction.images || [] 
  };

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
  const payload = {
    ...page,
    location_id: page.locationId
  };

  if (page.id) {
    return api.put(`/detail-pages/${page.id}`, payload);
  } else {
    return api.post('/detail-pages', payload);
  }
};

export const deleteDetailPage = async (id: number) => {
  return api.delete(`/detail-pages/${id}`);
};