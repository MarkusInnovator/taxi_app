// MongoDB initialization script
db = db.getSiblingDB('taxi_app');

// Create collections
db.createCollection('users');
db.createCollection('drivers');
db.createCollection('bookings');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

db.drivers.createIndex({ userId: 1 }, { unique: true });
db.drivers.createIndex({ licenseNumber: 1 }, { unique: true });
db.drivers.createIndex({ 'vehicleInfo.licensePlate': 1 }, { unique: true });
db.drivers.createIndex({ isOnline: 1, isVerified: 1 });
db.drivers.createIndex({ 'currentLocation.latitude': 1, 'currentLocation.longitude': 1 });

db.bookings.createIndex({ customerId: 1, createdAt: -1 });
db.bookings.createIndex({ driverId: 1, createdAt: -1 });
db.bookings.createIndex({ status: 1, createdAt: -1 });
db.bookings.createIndex({ 'pickupLocation.latitude': 1, 'pickupLocation.longitude': 1 });

// Create an admin user (optional)
db.users.insertOne({
  name: 'Admin User',
  email: 'admin@taxiapp.com',
  phone: '+491234567890',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj12PSyZzJ5i', // password: admin123
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully!');