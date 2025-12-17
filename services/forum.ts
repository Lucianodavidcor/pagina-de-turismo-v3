import api from '../lib/axios';

export interface ForumPost {
  id: number;
  author: string;
  userId: number; // Nuevo: ID del autor para verificar propiedad
  avatar_url?: string;
  rating: number;
  text: string;
  location_id: number;
  location_name?: string;
  images: string[];
  created_at: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// --- PÚBLICO ---

export const getPublicPosts = async (locationId?: number): Promise<ForumPost[]> => {
  const url = locationId ? `/forum?locationId=${locationId}` : '/forum';
  const { data } = await api.get(url);
  return data.map((post: any) => ({
    ...post,
    userId: post.user_id || post.author_id, // Mapeamos el ID del backend
    images: post.images?.map((img: any) => typeof img === 'string' ? img : img.url) || []
  }));
};

export const createPost = async (data: { location_id: number; rating: number; text: string; images: string[] }) => {
  return api.post('/forum', data);
};

export const deletePost = async (id: number) => {
  return api.delete(`/forum/${id}`);
};

// --- ADMIN / MODERACIÓN ---

export const getPendingPosts = async (locationId?: number): Promise<ForumPost[]> => {
  const url = locationId ? `/forum/pending?locationId=${locationId}` : '/forum/pending';
  const { data } = await api.get(url);
  return data.map((post: any) => ({
    ...post,
    userId: post.user_id || post.author_id,
    images: post.images?.map((img: any) => typeof img === 'string' ? img : img.url) || []
  }));
};

export const moderatePost = async (id: number, status: 'APPROVED' | 'REJECTED') => {
  return api.put(`/forum/${id}/moderate`, { status });
};