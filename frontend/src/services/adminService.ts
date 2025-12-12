import api from './api';
import { User, Ride, StatsResponse } from '../types';

const adminService = {
  async getAllUsers(): Promise<{ users: User[] }> {
    const response = await api.get<{ users: User[] }>('/admin/users');
    return response.data;
  },

  async getAllRides(): Promise<{ rides: Ride[] }> {
    const response = await api.get<{ rides: Ride[] }>('/admin/rides');
    return response.data;
  },

  async updateUserRole(userId: number, role: string): Promise<User> {
    const response = await api.patch<User>(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/users/${userId}`);
    return response.data;
  },

  async getStats(): Promise<StatsResponse> {
    const response = await api.get<StatsResponse>('/admin/stats');
    return response.data;
  },
};

export default adminService;
