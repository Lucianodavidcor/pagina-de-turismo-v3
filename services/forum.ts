import api from '../lib/axios';

export interface ForumPost {
  id: number;
  author: string;
  avatar_url?: string;
  rating: number;
  text: string;
  location_id: number;
  location_name?: string; // Viene del join en backend
  images: string[]; // URLs
  created_at: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// --- PÚBLICO ---

// Obtener posts aprobados (Opcional: filtrar por localidad)
export const getPublicPosts = async (locationId?: number): Promise<ForumPost[]> => {
  const url = locationId ? `/forum?locationId=${locationId}` : '/forum';
  const { data } = await api.get(url);
  // El backend devuelve las imágenes dentro de un array de objetos o strings, aseguramos strings
  return data.map((post: any) => ({
    ...post,
    images: post.images?.map((img: any) => typeof img === 'string' ? img : img.url) || []
  }));
};

// Crear nuevo post (Requiere estar logueado)
export const createPost = async (data: { location_id: number; rating: number; text: string; images: string[] }) => {
  return api.post('/forum', data);
};

// --- ADMIN / MODERACIÓN ---

// Obtener posts pendientes de revisión
export const getPendingPosts = async (locationId?: number): Promise<ForumPost[]> => {
  const url = locationId ? `/forum/pending?locationId=${locationId}` : '/forum/pending';
  const { data } = await api.get(url);
  return data.map((post: any) => ({
    ...post,
    images: post.images?.map((img: any) => typeof img === 'string' ? img : img.url) || []
  }));
};

// Aprobar o Rechazar post
export const moderatePost = async (id: number, status: 'APPROVED' | 'REJECTED') => {
  return api.put(`/forum/${id}/moderate`, { status });
};