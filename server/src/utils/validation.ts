import Joi from 'joi';

export const validateRegister = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
    phone: Joi.string().pattern(/^[+]?[1-9][\d]{0,15}$/).required().messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please provide a valid phone number',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
    }),
    role: Joi.string().valid('customer', 'driver').required().messages({
      'string.empty': 'Role is required',
      'any.only': 'Role must be either customer or driver',
    }),
  });

  return schema.validate(data);
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  });

  return schema.validate(data);
};

export const validateBooking = (data: any) => {
  const schema = Joi.object({
    pickupLocation: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string().required(),
      details: Joi.string().optional(),
    }).required(),
    dropoffLocation: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string().required(),
      details: Joi.string().optional(),
    }).required(),
    vehicleType: Joi.string().valid('sedan', 'suv', 'van', 'luxury').required(),
    scheduledAt: Joi.date().min('now').optional(),
    paymentMethod: Joi.string().valid('cash', 'card', 'digital_wallet').required(),
    notes: Joi.string().max(500).optional(),
  });

  return schema.validate(data);
};

export const validateDriverProfile = (data: any) => {
  const schema = Joi.object({
    licenseNumber: Joi.string().required(),
    vehicleInfo: Joi.object({
      make: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.number().min(1990).max(new Date().getFullYear() + 1).required(),
      color: Joi.string().required(),
      licensePlate: Joi.string().required(),
      vehicleType: Joi.string().valid('sedan', 'suv', 'van', 'luxury').required(),
    }).required(),
    documents: Joi.object({
      driverLicense: Joi.string().required(),
      vehicleRegistration: Joi.string().required(),
      insurance: Joi.string().required(),
    }).required(),
  });

  return schema.validate(data);
};

export const validateLocationUpdate = (data: any) => {
  const schema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    heading: Joi.number().min(0).max(360).optional(),
    speed: Joi.number().min(0).optional(),
  });

  return schema.validate(data);
};