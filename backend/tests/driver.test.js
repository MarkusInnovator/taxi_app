import request from 'supertest';
import app from '../src/index.js';
import db from '../src/config/db.js';
import resetDatabase from '../src/db/reset.js';
import migrate from '../src/db/migrate.js';

let dbAvailable = false;
let driverToken = null;
let customerToken = null;
let driverId = null;
let customerId = null;
let testRideId = null;

beforeAll(async () => {
  try {
    await db.query('SELECT 1');
    dbAvailable = true;
    await resetDatabase();
    await migrate();

    if (dbAvailable) {
      // Create driver user
      const driverReg = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Driver',
          email: 'driver@test.com',
          password: 'driver123',
          role: 'DRIVER',
          phone: '2222222222'
        });
      driverId = driverReg.body.user.id;

      const driverLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'driver@test.com',
          password: 'driver123'
        });
      driverToken = driverLogin.body.token;

      // Create customer user
      const customerReg = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Customer',
          email: 'customer@test.com',
          password: 'customer123',
          role: 'CUSTOMER'
        });
      customerId = customerReg.body.user.id;

      const customerLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@test.com',
          password: 'customer123'
        });
      customerToken = customerLogin.body.token;

      // Create a test ride
      const rideResponse = await request(app)
        .post('/api/rides')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          pickupAddress: 'Downtown Station',
          dropoffAddress: 'Airport Terminal 1',
          estimatedPrice: 45.00
        });
      testRideId = rideResponse.body.ride.id;
    }
  } catch (error) {
    console.log('⚠️  Database not available, skipping driver tests');
  }
});

afterAll(async () => {
  if (dbAvailable) {
    await db.end();
  }
});

describe('Driver API', () => {
  describe('GET /api/driver/rides/open', () => {
    it('should get all open rides', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/driver/rides/open')
        .set('Authorization', `Bearer ${driverToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('rides');
      expect(Array.isArray(response.body.rides)).toBe(true);
      expect(response.body.rides.length).toBeGreaterThan(0);
      expect(response.body.rides[0].status).toBe('REQUESTED');
    });

    it('should reject access without driver role', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/driver/rides/open')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body.error).toContain('Forbidden');
    });
  });

  describe('PATCH /api/driver/rides/:id/accept', () => {
    it('should accept an open ride', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/driver/rides/${testRideId}/accept`)
        .set('Authorization', `Bearer ${driverToken}`)
        .expect(200);

      expect(response.body.message).toContain('accepted');
      expect(response.body.ride.status).toBe('ACCEPTED');
      expect(response.body.ride.driver_id).toBe(driverId);
    });

    it('should not accept already accepted ride', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/driver/rides/${testRideId}/accept`)
        .set('Authorization', `Bearer ${driverToken}`)
        .expect(400);

      expect(response.body.error).toContain('Cannot accept ride');
    });
  });

  describe('PATCH /api/driver/rides/:id/start', () => {
    it('should start an accepted ride', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/driver/rides/${testRideId}/start`)
        .set('Authorization', `Bearer ${driverToken}`)
        .expect(200);

      expect(response.body.message).toContain('started');
      expect(response.body.ride.status).toBe('ONGOING');
    });

    it('should prevent starting ride that driver does not own', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      // Create another driver
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another Driver',
          email: 'driver2@test.com',
          password: 'driver123',
          role: 'DRIVER'
        });

      const login2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'driver2@test.com',
          password: 'driver123'
        });

      const response = await request(app)
        .patch(`/api/driver/rides/${testRideId}/start`)
        .set('Authorization', `Bearer ${login2.body.token}`)
        .expect(403);

      expect(response.body.error).toContain('Not your ride');
    });
  });

  describe('PATCH /api/driver/rides/:id/finish', () => {
    it('should complete an ongoing ride', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/driver/rides/${testRideId}/finish`)
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          finalPrice: 47.50
        })
        .expect(200);

      expect(response.body.message).toContain('completed');
      expect(response.body.ride.status).toBe('COMPLETED');
      expect(parseFloat(response.body.ride.final_price)).toBe(47.50);
    });

    it('should reject finishing without final price', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      // Create another ride
      const ride2 = await request(app)
        .post('/api/rides')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          pickupAddress: 'Home',
          dropoffAddress: 'Office',
          estimatedPrice: 15.00
        });

      await request(app)
        .patch(`/api/driver/rides/${ride2.body.ride.id}/accept`)
        .set('Authorization', `Bearer ${driverToken}`);

      await request(app)
        .patch(`/api/driver/rides/${ride2.body.ride.id}/start`)
        .set('Authorization', `Bearer ${driverToken}`);

      const response = await request(app)
        .patch(`/api/driver/rides/${ride2.body.ride.id}/finish`)
        .set('Authorization', `Bearer ${driverToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toContain('Final price');
    });
  });

  describe('GET /api/driver/rides/my', () => {
    it('should get all rides for the driver', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/driver/rides/my')
        .set('Authorization', `Bearer ${driverToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('rides');
      expect(Array.isArray(response.body.rides)).toBe(true);
      expect(response.body.rides.length).toBeGreaterThan(0);
    });
  });
});
