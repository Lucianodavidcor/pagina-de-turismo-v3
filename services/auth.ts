import api from '../lib/axios';
import { User } from '../types';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return data;
};

// Solo para SuperAdmin: Crear un nuevo admin o asignar localidad
export const registerAdmin = async (adminData: any) => {
    const { data } = await api.post('/auth/register-admin', adminData);
    return data;
};

// Obtener todos los usuarios (para SuperAdmin)
export const getAllUsers = async () => {
    const { data } = await api.get<User[]>('/auth/users');
    return data;
};