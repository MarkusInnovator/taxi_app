import api from './api';

export const driverService = {
  async getOpenRides() {
    const response = await api.get('/api/driver/rides/open');
    return response.data;
  },

  async getMyRides() {
    const response = await api.get('/api/driver/rides/my');
    return response.data;
  },

  async acceptRide(id) {
    const response = await api.patch(`/api/driver/rides/${id}/accept`);
    return response.data;
  },

  async startRide(id) {
    const response = await api.patch(`/api/driver/rides/${id}/start`);
    return response.data;
  },

  async finishRide(id, finalPrice) {
    const response = await api.patch(`/api/driver/rides/${id}/finish`, { finalPrice });
    return response.data;
  },
};

export default driverService;
