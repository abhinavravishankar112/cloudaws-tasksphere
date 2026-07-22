jest.mock('../../src/services/auth.service', () => ({
  registerUser: jest.fn().mockResolvedValue({
    user: {
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com'
    },
    token: 'signed-token'
  }),
  loginUser: jest.fn().mockResolvedValue({
    user: {
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com'
    },
    token: 'signed-token'
  })
}));

const request = require('supertest');
const { createApp } = require('../../src/app');

describe('Express app integration', () => {
  const app = createApp();

  test('GET /api/v1/health returns service status', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe('ok');
    expect(response.body.mode).toBe('live');
  });

  test('POST /api/v1/auth/register returns mocked auth response', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'password123'
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.token).toBe('signed-token');
  });
});
