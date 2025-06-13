import request from 'supertest';
import app from '../server.js'; // export app from server.js instead of listen()

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
