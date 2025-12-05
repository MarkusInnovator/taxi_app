import request from 'supertest';
import app from '../src/index.js';
import db from '../src/config/db.js';
import resetDatabase from '../src/db/reset.js';
import migrate from '../src/db/migrate.js';

// Check if database is available
let dbAvailable = false;
let testUser = null;

beforeAll(async () => {
  try {
    await db.query('SELECT 1');
    dbAvailable = true;
    await resetDatabase();
    await migrate();
  } catch (error) {
    console.log('⚠️  Database not available, skipping auth tests');
  }
});

afterAll(async () => {
  if (dbAvailable) {
    await db.end();
  }
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new customer user', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '1234567890'
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe('John Doe');
      expect(response.body.user.email).toBe('john@example.com');
      expect(response.body.user.role).toBe('CUSTOMER');
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('password_hash');

      testUser = response.body.user;
    });

    it('should register a driver user', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Driver',
          email: 'jane@driver.com',
          password: 'driver123',
          role: 'DRIVER',
          phone: '0987654321'
        })
        .expect(201);

      expect(response.body.user.role).toBe('DRIVER');
    });

    it('should reject registration with missing fields', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Incomplete User'
          // missing email and password
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should reject registration with duplicate email', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      // Try to register with same email as first test
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another John',
          email: 'john@example.com',
          password: 'different123'
        })
        .expect(409);

      expect(response.body.error).toContain('already registered');
    });

    it('should reject invalid role', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bad Role User',
          email: 'bad@role.com',
          password: 'pass123',
          role: 'INVALID_ROLE'
        })
        .expect(400);

      expect(response.body.error).toContain('Invalid role');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('john@example.com');
      expect(response.body.user).not.toHaveProperty('password_hash');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('should reject login with wrong password', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.error).toContain('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.error).toContain('Invalid email or password');
    });

    it('should reject login with missing fields', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com'
          // missing password
        })
        .expect(400);

      expect(response.body.error).toContain('Missing required fields');
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeAll(async () => {
      if (!dbAvailable) return;

      // Login to get token
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      authToken = response.body.token;
    });

    it('should get current user with valid token', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('john@example.com');
    });

    it('should reject request without token', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.error).toContain('No token provided');
    });

    it('should reject request with invalid token', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token_here')
        .expect(401);

      expect(response.body.error).toContain('Invalid token');
    });
  });
});
