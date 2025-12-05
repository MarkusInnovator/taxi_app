import request from 'supertest';
import app from '../src/index.js';
import db from '../src/config/db.js';
import resetDatabase from '../src/db/reset.js';
import migrate from '../src/db/migrate.js';

// Check if database is available
let dbAvailable = false;
let customerToken = null;
let customerId = null;
let testRideId = null;

beforeAll(async () => {
  try {
    await db.query('SELECT 1');
    dbAvailable = true;
    await resetDatabase();
    await migrate();

    // Create and login a customer user
    if (dbAvailable) {
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Customer User',
          email: 'customer@test.com',
          password: 'customer123',
          role: 'CUSTOMER',
          phone: '1111111111'
        });

      customerId = registerResponse.body.user.id;

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@test.com',
          password: 'customer123'
        });

      customerToken = loginResponse.body.token;
    }
  } catch (error) {
    console.log('⚠️  Database not available, skipping ride tests');
  }
});

afterAll(async () => {
  if (dbAvailable) {
    await db.end();
  }
});

describe('Ride API - Customer Endpoints', () => {
  describe('POST /api/rides', () => {
    it('should create a new ride request', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/rides')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          pickupAddress: '123 Main St, City',
          dropoffAddress: '456 Oak Ave, City',
          scheduledFor: null,
          estimatedPrice: 25.50
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('ride');
      expect(response.body.ride.customer_id).toBe(customerId);
      expect(response.body.ride.status).toBe('REQUESTED');
      expect(response.body.ride.pickup_address).toBe('123 Main St, City');
      expect(response.body.ride.dropoff_address).toBe('456 Oak Ave, City');

      testRideId = response.body.ride.id;
    });

    it('should reject ride creation without authentication', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/rides')
        .send({
          pickupAddress: '123 Main St',
          dropoffAddress: '456 Oak Ave'
        })
        .expect(401);

      expect(response.body.error).toContain('No token provided');
    });

    it('should reject ride creation with missing fields', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/rides')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          pickupAddress: '123 Main St'
          // missing dropoffAddress
        })
        .expect(400);

      expect(response.body.error).toContain('Missing required fields');
    });
  });

  describe('GET /api/rides/my', () => {
    it('should get all rides for the logged-in customer', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/rides/my')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('rides');
      expect(Array.isArray(response.body.rides)).toBe(true);
      expect(response.body.rides.length).toBeGreaterThan(0);
      expect(response.body.rides[0].customer_id).toBe(customerId);
    });

    it('should reject request without authentication', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      await request(app)
        .get('/api/rides/my')
        .expect(401);
    });
  });

  describe('GET /api/rides/:id', () => {
    it('should get specific ride by ID', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get(`/api/rides/${testRideId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ride');
      expect(response.body.ride.id).toBe(testRideId);
      expect(response.body.ride.customer_name).toBe('Customer User');
    });

    it('should return 404 for non-existent ride', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/rides/99999')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(404);

      expect(response.body.error).toContain('Ride not found');
    });
  });

  describe('PATCH /api/rides/:id/cancel', () => {
    it('should cancel a ride', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/rides/${testRideId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.ride.status).toBe('CANCELLED');
    });

    it('should not cancel already cancelled ride', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/rides/${testRideId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(400);

      expect(response.body.error).toContain('Cannot cancel ride');
    });

    it('should reject cancellation without authentication', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      await request(app)
        .patch(`/api/rides/${testRideId}/cancel`)
        .expect(401);
    });
  });

  describe('Role-based access control', () => {
    let driverToken;

    beforeAll(async () => {
      if (!dbAvailable) return;

      // Create a driver user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Driver User',
          email: 'driver@test.com',
          password: 'driver123',
          role: 'DRIVER'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'driver@test.com',
          password: 'driver123'
        });

      driverToken = loginResponse.body.token;
    });

    it('should prevent driver from creating rides', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/rides')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          pickupAddress: '123 Main St',
          dropoffAddress: '456 Oak Ave'
        })
        .expect(403);

      expect(response.body.error).toContain('Forbidden');
    });
  });
});
