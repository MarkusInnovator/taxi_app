import api from './api';
import { User, AuthResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
}

const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },
};

export default authService;
