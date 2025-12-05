import request from 'supertest';
import app from '../src/index.js';
import db from '../src/config/db.js';
import resetDatabase from '../src/db/reset.js';
import migrate from '../src/db/migrate.js';

let dbAvailable = false;
let adminToken = null;
let customerToken = null;
let adminId = null;
let testUserId = null;

beforeAll(async () => {
  try {
    await db.query('SELECT 1');
    dbAvailable = true;
    await resetDatabase();
    await migrate();

    if (dbAvailable) {
      // Create admin user
      const adminReg = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@test.com',
          password: 'admin123',
          role: 'ADMIN'
        });
      adminId = adminReg.body.user.id;

      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'admin123'
        });
      adminToken = adminLogin.body.token;

      // Create test user to manage
      const userReg = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@user.com',
          password: 'test123',
          role: 'CUSTOMER'
        });
      testUserId = userReg.body.user.id;

      // Create customer for access control tests
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Customer User',
          email: 'customer@test.com',
          password: 'customer123',
          role: 'CUSTOMER'
        });

      const customerLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@test.com',
          password: 'customer123'
        });
      customerToken = customerLogin.body.token;
    }
  } catch (error) {
    console.log('⚠️  Database not available, skipping admin tests');
  }
});

afterAll(async () => {
  if (dbAvailable) {
    await db.end();
  }
});

describe('Admin API', () => {
  describe('GET /api/admin/users', () => {
    it('should get all users', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThanOrEqual(3);
    });

    it('should reject non-admin access', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body.error).toContain('Forbidden');
    });
  });

  describe('GET /api/admin/rides', () => {
    it('should get all rides', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/admin/rides')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('rides');
      expect(Array.isArray(response.body.rides)).toBe(true);
    });
  });

  describe('PATCH /api/admin/users/:id/role', () => {
    it('should update user role', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/admin/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'DRIVER' })
        .expect(200);

      expect(response.body.message).toContain('updated');
      expect(response.body.user.role).toBe('DRIVER');
    });

    it('should reject invalid role', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/admin/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'INVALID_ROLE' })
        .expect(400);

      expect(response.body.error).toContain('Invalid role');
    });

    it('should reject missing role', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch(`/api/admin/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toContain('Role is required');
    });

    it('should return 404 for non-existent user', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .patch('/api/admin/users/99999/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'DRIVER' })
        .expect(404);

      expect(response.body.error).toContain('User not found');
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete a user', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      // Create user to delete
      const userToDelete = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Delete Me',
          email: 'deleteme@test.com',
          password: 'delete123'
        });

      const response = await request(app)
        .delete(`/api/admin/users/${userToDelete.body.user.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toContain('deleted');
    });

    it('should prevent admin from deleting themselves', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .delete(`/api/admin/users/${adminId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.error).toContain('Cannot delete your own account');
    });

    it('should return 404 for non-existent user', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .delete('/api/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.error).toContain('User not found');
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should get system statistics', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('stats');
      expect(response.body.stats).toHaveProperty('totalUsers');
      expect(response.body.stats).toHaveProperty('usersByRole');
      expect(response.body.stats).toHaveProperty('totalRides');
      expect(response.body.stats).toHaveProperty('ridesByStatus');
    });
  });
});
