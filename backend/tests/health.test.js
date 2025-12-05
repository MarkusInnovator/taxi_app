import request from 'supertest';
import app from '../src/index.js';

describe('Health Check Endpoints', () => {
  describe('GET /health', () => {
    it('should return status ok', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /health/db', () => {
    it('should return database status', async () => {
      const response = await request(app)
        .get('/health/db')
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('database');
      
      // DB might not be connected in test, so we check both cases
      if (response.status === 200) {
        expect(response.body.status).toBe('ok');
        expect(response.body.database).toBe('connected');
        expect(response.body).toHaveProperty('timestamp');
      }
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Route not found');
    });
  });
});

