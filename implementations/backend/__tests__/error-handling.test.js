/**
 * Error handling tests - uses jest.mock to simulate database failures.
 * This file tests all catch blocks in route handlers.
 *
 * IMPORTANT: jest.mock hoists to the top, so this file gets its own
 * mocked version of db.js. Other test files are unaffected because
 * Jest isolates modules per test file when using --forceExit.
 */

// Mock db BEFORE requiring app
jest.mock('../db', () => ({
  query: jest.fn().mockRejectedValue(new Error('Database connection failed')),
  connect: jest.fn().mockResolvedValue({
    query: jest.fn()
      .mockResolvedValueOnce(undefined) // BEGIN
      .mockRejectedValueOnce(new Error('Insert failed')), // INSERT fails
    release: jest.fn(),
  }),
  end: jest.fn().mockResolvedValue(undefined),
}));

// Must require AFTER mock
const request = require('supertest');
const app = require('../server');

afterAll(async () => {
  // Nothing to clean up - db is mocked
});

describe('Error handling - shipments routes', () => {
  it('GET /api/shipments/recent should return 500 on DB error', async () => {
    const res = await request(app).get('/api/shipments/recent');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/shipments/track/:id should return 500 on DB error', async () => {
    const res = await request(app).get('/api/shipments/track/TEST-123');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/shipments/monthly/:userId should return 500 on DB error', async () => {
    const res = await request(app).get('/api/shipments/monthly/1');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/shipments/history/:userId should return 500 on DB error', async () => {
    const res = await request(app).get('/api/shipments/history/1');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/shipments/:userId should return 500 on DB error', async () => {
    const res = await request(app).get('/api/shipments/1');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/shipments should return 500 and rollback on DB error', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId: 1, trackId: 'PO-ERR-001',
        sname: 'S', rname: 'R', sprov: 'BKK', rprov: 'CM',
        weight: '1 kg', contents: 'Error test',
      });
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

describe('Error handling - notifications routes', () => {
  it('GET /api/notifications/:userId should return 500 on DB error', async () => {
    const res = await request(app).get('/api/notifications/1');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('PATCH /api/notifications/:userId/read-all should return 500 on DB error', async () => {
    const res = await request(app).patch('/api/notifications/1/read-all');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

describe('Error handling - activity routes', () => {
  it('GET /api/activity/:userId should return 500 on DB error', async () => {
    const res = await request(app).get('/api/activity/1');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

describe('Error handling - users routes', () => {
  it('POST /api/users/register should return 500 on DB error', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstName: 'Test', lastName: 'User',
        email: 'error@test.com', password: 'pass123',
      });
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/users/login should return 500 on DB error', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@test.com', password: 'pass123' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/user/profile/:id should return 500 on DB error', async () => {
    const res = await request(app).get('/api/user/profile/1');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/user/stats/:id should return 500 on DB error', async () => {
    const res = await request(app).get('/api/user/stats/1');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
