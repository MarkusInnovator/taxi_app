import api from './api';
import { Ride, RidesResponse } from '../types';

interface CreateRideData {
  pickupAddress: string;
  dropoffAddress: string;
  scheduledFor?: string;
  estimatedPrice?: string | number;
}

const rideService = {
  async createRide(data: CreateRideData): Promise<Ride> {
    const response = await api.post<Ride>('/rides', data);
    return response.data;
  },

  async getMyRides(): Promise<RidesResponse> {
    const response = await api.get<RidesResponse>('/rides/my');
    return response.data;
  },

  async getRideById(id: number): Promise<Ride> {
    const response = await api.get<Ride>(`/rides/${id}`);
    return response.data;
  },

  async cancelRide(id: number): Promise<Ride> {
    const response = await api.patch<Ride>(`/rides/${id}/cancel`);
    return response.data;
  },
};

export default rideService;
