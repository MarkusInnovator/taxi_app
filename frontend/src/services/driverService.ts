import api from './api';
import { Ride, RidesResponse } from '../types';

const driverService = {
  async getOpenRides(): Promise<RidesResponse> {
    const response = await api.get<RidesResponse>('/driver/rides/open');
    return response.data;
  },

  async getMyRides(): Promise<RidesResponse> {
    const response = await api.get<RidesResponse>('/driver/rides/my');
    return response.data;
  },

  async acceptRide(id: number): Promise<Ride> {
    const response = await api.patch<Ride>(`/driver/rides/${id}/accept`);
    return response.data;
  },

  async startRide(id: number): Promise<Ride> {
    const response = await api.patch<Ride>(`/driver/rides/${id}/start`);
    return response.data;
  },

  async finishRide(id: number, finalPrice: number): Promise<Ride> {
    const response = await api.patch<Ride>(`/driver/rides/${id}/finish`, { finalPrice });
    return response.data;
  },
};

export default driverService;
