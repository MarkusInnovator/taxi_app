import { Driver } from '../models/Driver';

interface Location {
  latitude: number;
  longitude: number;
}

interface FareCalculation {
  estimatedFare: number;
  estimatedDistance: number;
  estimatedDuration: number;
}

export const calculateFare = async (
  pickup: Location,
  dropoff: Location,
  vehicleType: string
): Promise<FareCalculation> => {
  // Calculate distance using Haversine formula
  const distance = calculateDistance(pickup.latitude, pickup.longitude, dropoff.latitude, dropoff.longitude);
  
  // Base fare configuration (from environment variables)
  const baseFare = parseFloat(process.env.BASE_FARE || '3.50');
  const pricePerKm = parseFloat(process.env.PRICE_PER_KM || '1.80');
  const pricePerMinute = parseFloat(process.env.PRICE_PER_MINUTE || '0.35');
  const surgeMultiplier = parseFloat(process.env.SURGE_MULTIPLIER || '1.0');

  // Vehicle type multipliers
  const vehicleMultiplier = {
    sedan: 1.0,
    suv: 1.2,
    van: 1.4,
    luxury: 1.8,
  }[vehicleType] || 1.0;

  // Estimate duration (assuming average speed of 30 km/h in city)
  const estimatedDuration = Math.round((distance / 30) * 60); // in minutes

  // Calculate fare
  const distanceFare = distance * pricePerKm;
  const timeFare = estimatedDuration * pricePerMinute;
  const subtotal = (baseFare + distanceFare + timeFare) * vehicleMultiplier;
  const estimatedFare = Math.round(subtotal * surgeMultiplier * 100) / 100;

  return {
    estimatedFare,
    estimatedDistance: Math.round(distance * 100) / 100,
    estimatedDuration,
  };
};

export const findNearbyDrivers = async (
  latitude: number,
  longitude: number,
  vehicleType: string,
  radiusKm: number = 10
): Promise<any[]> => {
  try {
    // Find online drivers with matching vehicle type within radius
    const drivers = await Driver.find({
      isOnline: true,
      isVerified: true,
      'vehicleInfo.vehicleType': vehicleType,
      'currentLocation.latitude': {
        $gte: latitude - (radiusKm / 111), // roughly 1 degree = 111km
        $lte: latitude + (radiusKm / 111),
      },
      'currentLocation.longitude': {
        $gte: longitude - (radiusKm / (111 * Math.cos(latitude * Math.PI / 180))),
        $lte: longitude + (radiusKm / (111 * Math.cos(latitude * Math.PI / 180))),
      },
    })
    .populate('userId', 'name phone profileImage')
    .limit(20);

    // Calculate actual distances and sort
    const driversWithDistance = drivers.map(driver => {
      const distance = calculateDistance(
        latitude,
        longitude,
        driver.currentLocation?.latitude || 0,
        driver.currentLocation?.longitude || 0
      );
      return { ...driver.toObject(), distance };
    }).filter(driver => driver.distance <= radiusKm);

    // Sort by distance and rating
    driversWithDistance.sort((a, b) => {
      const distanceWeight = 0.7;
      const ratingWeight = 0.3;
      
      const scoreA = (1 / (a.distance + 1)) * distanceWeight + (a.rating / 5) * ratingWeight;
      const scoreB = (1 / (b.distance + 1)) * distanceWeight + (b.rating / 5) * ratingWeight;
      
      return scoreB - scoreA;
    });

    return driversWithDistance.slice(0, 10); // Return top 10 drivers
  } catch (error) {
    console.error('Error finding nearby drivers:', error);
    return [];
  }
};

// Haversine formula to calculate distance between two points
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};