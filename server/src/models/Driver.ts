import { Schema, model, Document } from 'mongoose';

export interface IDriver extends Document {
  userId: Schema.Types.ObjectId;
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
  isVerified: boolean;
}

const driverSchema = new Schema<IDriver>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    vehicleInfo: {
      make: {
        type: String,
        required: [true, 'Vehicle make is required'],
        trim: true,
      },
      model: {
        type: String,
        required: [true, 'Vehicle model is required'],
        trim: true,
      },
      year: {
        type: Number,
        required: [true, 'Vehicle year is required'],
        min: [1990, 'Vehicle must be from 1990 or newer'],
        max: [new Date().getFullYear() + 1, 'Invalid vehicle year'],
      },
      color: {
        type: String,
        required: [true, 'Vehicle color is required'],
        trim: true,
      },
      licensePlate: {
        type: String,
        required: [true, 'License plate is required'],
        unique: true,
        trim: true,
        uppercase: true,
      },
      vehicleType: {
        type: String,
        enum: ['sedan', 'suv', 'van', 'luxury'],
        required: [true, 'Vehicle type is required'],
      },
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    totalRides: {
      type: Number,
      default: 0,
      min: [0, 'Total rides cannot be negative'],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      heading: { type: Number },
      speed: { type: Number },
      lastUpdated: { type: Date, default: Date.now },
    },
    documents: {
      driverLicense: {
        type: String,
        required: [true, 'Driver license document is required'],
      },
      vehicleRegistration: {
        type: String,
        required: [true, 'Vehicle registration document is required'],
      },
      insurance: {
        type: String,
        required: [true, 'Insurance document is required'],
      },
    },
    earnings: {
      today: { type: Number, default: 0 },
      thisWeek: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for location-based queries
driverSchema.index({ 'currentLocation.latitude': 1, 'currentLocation.longitude': 1 });
driverSchema.index({ isOnline: 1, isVerified: 1 });

export const Driver = model<IDriver>('Driver', driverSchema);