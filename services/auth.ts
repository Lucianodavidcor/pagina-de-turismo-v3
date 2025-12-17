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

// Login de usuario (Cualquier rol)
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
};

// Registro de usuario normal (Público)
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return data;
};

// --- SOLO SUPERADMIN ---

// Obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/auth/users');
  return data;
};

// Crear un nuevo Administrador y asignarle una localidad
export const registerAdmin = async (adminData: CreateAdminData) => {
  const { data } = await api.post('/auth/register-admin', adminData);
  return data;
};