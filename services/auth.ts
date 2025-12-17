import api from '../lib/axios';
import { User } from '../types';

// --- Interfaces internas del Backend ---
interface BackendUser {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  location_id?: number | null; // Así viene de la base de datos
  created_at?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: BackendUser; // El backend devuelve snake_case
}

interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  role: string;
  locationId: number;
}

// --- ADAPTADOR (La clave para arreglar la tabla) ---
const adaptUser = (raw: BackendUser): User => ({
  id: raw.id,
  email: raw.email,
  name: raw.name,
  role: raw.role,
  // Transformamos location_id -> locationId
  locationId: raw.location_id ? Number(raw.location_id) : undefined 
});

// --- FUNCIONES ---

export const loginUser = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return {
    ...data,
    user: adaptUser(data.user) // Adaptamos el usuario al hacer login
  };
};

export const registerUser = async (name: string, email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return {
    ...data,
    user: adaptUser(data.user)
  };
};

// --- GESTIÓN DE USUARIOS (SUPERADMIN) ---

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get<BackendUser[]>('/auth/users');
  // Pasamos cada usuario por el adaptador antes de entregarlo al componente
  return data.map(adaptUser);
};

export const registerAdmin = async (adminData: CreateAdminData) => {
  // Convertimos locationId -> locationId (o location_id si el endpoint lo requiere, 
  // pero tu controlador createAdmin usa camelCase en el body: req.body.locationId)
  const payload = {
    name: adminData.name,
    email: adminData.email,
    password: adminData.password,
    role: adminData.role,
    locationId: adminData.locationId || null
  };
  
  const { data } = await api.post('/auth/register-admin', payload);
  return {
    ...data,
    user: adaptUser(data.user)
  };
};

export const updateUser = async (id: number, role: string, locationId: number | null) => {
  const { data } = await api.put(`/auth/users/${id}`, { role, locationId });
  return {
    ...data,
    user: adaptUser(data.user)
  };
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/auth/users/${id}`);
  return data;
};