import api from './api';

export const rideService = {
  async createRide(rideData) {
    const response = await api.post('/api/rides', rideData);
    return response.data;
  },

  async getMyRides() {
    const response = await api.get('/api/rides/my');
    return response.data;
  },

  async getRideById(id) {
    const response = await api.get(`/api/rides/${id}`);
    return response.data;
  },

  async cancelRide(id) {
    const response = await api.patch(`/api/rides/${id}/cancel`);
    return response.data;
  },
};

export default rideService;
