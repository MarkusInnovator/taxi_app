import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('taxiflow_token', response.data.token);
      localStorage.setItem('taxiflow_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('taxiflow_token');
    localStorage.removeItem('taxiflow_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('taxiflow_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('taxiflow_token');
  },

  async getMe() {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

export default authService;
