import api from './api';

export const adminService = {
  async getAllUsers() {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  async getAllRides() {
    const response = await api.get('/api/admin/rides');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },

  async updateUserRole(userId, role) {
    const response = await api.patch(`/api/admin/users/${userId}/role`, { role });
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  },
};

export default adminService;
