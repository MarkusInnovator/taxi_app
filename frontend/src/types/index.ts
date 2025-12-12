// Type definitions for API responses and entities

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  created_at?: string;
  updated_at?: string;
}

export interface Ride {
  id: number;
  customer_id: number;
  driver_id: number | null;
  pickup_address: string;
  dropoff_address: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  estimated_price: string | number;
  final_price?: string | number | null;
  scheduled_for?: string | null;
  created_at?: string;
  updated_at?: string;
  customer_name?: string;
  driver_name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RidesResponse {
  rides: Ride[];
}

export interface StatsResponse {
  total_users: number;
  customers: number;
  drivers: number;
  admins: number;
  total_rides: number;
  requested_rides: number;
  ongoing_rides: number;
  completed_rides: number;
}

export interface ApiError {
  error: string;
  details?: string;
}

export type UserRole = User['role'];
export type RideStatus = Ride['status'];
