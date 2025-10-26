import { Schema, model, Document } from 'mongoose';

export interface IBooking extends Document {
  customerId: Schema.Types.ObjectId;
  driverId?: Schema.Types.ObjectId;
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
  estimatedDuration: number;
  estimatedDistance: number;
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
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    pickupLocation: {
      latitude: {
        type: Number,
        required: [true, 'Pickup latitude is required'],
        min: [-90, 'Invalid latitude'],
        max: [90, 'Invalid latitude'],
      },
      longitude: {
        type: Number,
        required: [true, 'Pickup longitude is required'],
        min: [-180, 'Invalid longitude'],
        max: [180, 'Invalid longitude'],
      },
      address: {
        type: String,
        required: [true, 'Pickup address is required'],
        trim: true,
      },
      details: {
        type: String,
        trim: true,
      },
    },
    dropoffLocation: {
      latitude: {
        type: Number,
        required: [true, 'Dropoff latitude is required'],
        min: [-90, 'Invalid latitude'],
        max: [90, 'Invalid latitude'],
      },
      longitude: {
        type: Number,
        required: [true, 'Dropoff longitude is required'],
        min: [-180, 'Invalid longitude'],
        max: [180, 'Invalid longitude'],
      },
      address: {
        type: String,
        required: [true, 'Dropoff address is required'],
        trim: true,
      },
      details: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'driver_en_route', 'arrived', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    vehicleType: {
      type: String,
      enum: ['sedan', 'suv', 'van', 'luxury'],
      required: [true, 'Vehicle type is required'],
    },
    scheduledAt: {
      type: Date,
    },
    estimatedDuration: {
      type: Number,
      required: [true, 'Estimated duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    estimatedDistance: {
      type: Number,
      required: [true, 'Estimated distance is required'],
      min: [0.1, 'Distance must be at least 0.1 km'],
    },
    estimatedFare: {
      type: Number,
      required: [true, 'Estimated fare is required'],
      min: [0, 'Fare cannot be negative'],
    },
    actualFare: {
      type: Number,
      min: [0, 'Fare cannot be negative'],
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'digital_wallet'],
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    rating: {
      customerRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      driverRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      customerFeedback: {
        type: String,
        trim: true,
        maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      },
      driverFeedback: {
        type: String,
        trim: true,
        maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      },
    },
    route: {
      duration: { type: Number },
      distance: { type: Number },
      polyline: { type: String },
    },
    timeline: {
      createdAt: { type: Date, default: Date.now },
      acceptedAt: { type: Date },
      driverArrivedAt: { type: Date },
      tripStartedAt: { type: Date },
      tripCompletedAt: { type: Date },
      cancelledAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ driverId: 1, createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ 'pickupLocation.latitude': 1, 'pickupLocation.longitude': 1 });

export const Booking = model<IBooking>('Booking', bookingSchema);