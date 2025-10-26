export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'driver' | 'admin';
  isActive: boolean;
  profileImage?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver extends User {
  role: 'driver';
  licenseNumber: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    vehicleType: 'sedan' | 'suv' | 'van' | 'luxury';
  };
  rating: number;
  totalRides: number;
  isOnline: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    lastUpdated: Date;
  };
  documents: {
    driverLicense: string;
    vehicleRegistration: string;
    insurance: string;
  };
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
}

export interface Booking {
  _id: string;
  customerId: string;
  driverId?: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
    details?: string;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    address: string;
    details?: string;
  };
  status: 'pending' | 'accepted' | 'driver_en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  vehicleType: 'sedan' | 'suv' | 'van' | 'luxury';
  scheduledAt?: Date;
  estimatedDuration: number; // in minutes
  estimatedDistance: number; // in kilometers
  estimatedFare: number;
  actualFare?: number;
  paymentMethod: 'cash' | 'card' | 'digital_wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  rating?: {
    customerRating?: number;
    driverRating?: number;
    customerFeedback?: string;
    driverFeedback?: string;
  };
  route?: {
    duration: number;
    distance: number;
    polyline: string;
  };
  timeline: {
    createdAt: Date;
    acceptedAt?: Date;
    driverArrivedAt?: Date;
    tripStartedAt?: Date;
    tripCompletedAt?: Date;
    cancelledAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  bookingId: string;
  customerId: string;
  driverId: string;
  amount: number;
  currency: string;
  method: 'cash' | 'card' | 'digital_wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  breakdown: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    surgeMultiplier: number;
    tip?: number;
    tax: number;
    total: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'driver';
}

export interface BookingRequest {
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
    details?: string;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    address: string;
    details?: string;
  };
  vehicleType: 'sedan' | 'suv' | 'van' | 'luxury';
  scheduledAt?: Date;
  paymentMethod: 'cash' | 'card' | 'digital_wallet';
  notes?: string;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
}