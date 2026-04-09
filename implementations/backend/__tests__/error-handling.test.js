const request = require('supertest');

// Mock the database module to simulate errors
jest.mock('../db', () => {
  const mockQuery = jest.fn().mockRejectedValue(new Error('Database connection failed'));
  const mockConnect = jest.fn().mockResolvedValue({
    query: jest.fn().mockRejectedValue(new Error('Transaction failed')),
    release: jest.fn(),
  });
  return {
    query: mockQuery,
    connect: mockConnect,
    end: jest.fn(),
  };
});

const app = require('../server');

describe('Error handling - database failures', () => {

  // --- Shipments error handling ---
  describe('GET /api/shipments/recent - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/shipments/recent');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/shipments/track/:id - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/shipments/track/TEST-123');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/shipments/monthly/:userId - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/shipments/monthly/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/shipments/history/:userId - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/shipments/history/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/shipments/:userId - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/shipments/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/shipments - DB error', () => {
    it('should return 500 and rollback on database failure', async () => {
      const res = await request(app)
        .post('/api/shipments')
        .send({
          userId: 1,
          trackId: 'PO-ERR-001',
          sname: 'Sender',
          rname: 'Receiver',
          sprov: 'Bangkok',
          rprov: 'Chiang Mai',
          weight: '1 kg',
          contents: 'Error test',
        });
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  // --- Notifications error handling ---
  describe('GET /api/notifications/:userId - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/notifications/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('PATCH /api/notifications/:userId/read-all - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).patch('/api/notifications/1/read-all');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  // --- Activity error handling ---
  describe('GET /api/activity/:userId - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/activity/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  // --- Users error handling ---
  describe('POST /api/users/register - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'error@test.com',
          password: 'password123',
        });
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/users/login - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@test.com', password: 'password123' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/user/profile/:id - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/user/profile/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/user/stats/:id - DB error', () => {
    it('should return 500 when database fails', async () => {
      const res = await request(app).get('/api/user/stats/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });
});
