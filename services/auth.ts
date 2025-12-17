import api from '../lib/axios';
import { User } from '../types';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  location_id: number;
}

// Login
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
};

// Registro Público
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return data;
};

// --- GESTIÓN DE USUARIOS (SUPERADMIN) ---

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/auth/users');
  return data;
};

export const registerAdmin = async (adminData: CreateAdminData) => {
  const { data } = await api.post('/auth/register-admin', adminData);
  return data;
};

// Actualizar rol o localidad de un usuario
export const updateUser = async (id: number, role: string, locationId: number | null) => {
  const { data } = await api.put(`/auth/users/${id}`, { role, locationId });
  return data;
};

// Eliminar usuario
export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/auth/users/${id}`);
  return data;
};