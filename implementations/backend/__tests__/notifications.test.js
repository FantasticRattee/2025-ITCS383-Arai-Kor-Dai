const request = require('supertest');
const app = require('../server');
const db = require('../db');

const testEmail = `notiftest_${Date.now()}@test.com`;
let userId;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/users/register')
    .send({
      firstName: 'Notif',
      lastName: 'Tester',
      email: testEmail,
      password: 'password123',
    });
  userId = res.body.userId;

  // Insert test notifications (one read, one unread)
  await db.query(
    `INSERT INTO notifications (user_id, message, type, is_read) VALUES ($1, $2, $3, $4)`,
    [userId, 'Test notification message', 'info', 0]
  );
  await db.query(
    `INSERT INTO notifications (user_id, message, type, is_read) VALUES ($1, $2, $3, $4)`,
    [userId, 'Already read notification', 'success', 1]
  );
});

afterAll(async () => {
  if (userId) {
    await db.query('DELETE FROM notifications WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
  }
  await db.end();
});

describe('GET /api/notifications/:userId', () => {
  it('should return user notifications', async () => {
    const res = await request(app)
      .get(`/api/notifications/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('message');
    expect(res.body[0]).toHaveProperty('type');
    expect(res.body[0]).toHaveProperty('is_read');
    expect(res.body[0]).toHaveProperty('created_at');
  });

  it('should return notifications ordered by created_at desc', async () => {
    const res = await request(app)
      .get(`/api/notifications/${userId}`);

    expect(res.status).toBe(200);
    if (res.body.length >= 2) {
      const first = new Date(res.body[0].created_at);
      const second = new Date(res.body[1].created_at);
      expect(first.getTime()).toBeGreaterThanOrEqual(second.getTime());
    }
  });

  it('should return empty array for user with no notifications', async () => {
    const res = await request(app)
      .get('/api/notifications/99999');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should limit to 10 notifications max', async () => {
    const res = await request(app)
      .get(`/api/notifications/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(10);
  });
});

describe('PATCH /api/notifications/:userId/read-all', () => {
  it('should mark all notifications as read', async () => {
    const res = await request(app)
      .patch(`/api/notifications/${userId}/read-all`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify all are read
    const check = await request(app)
      .get(`/api/notifications/${userId}`);
    const unread = check.body.filter(n => n.is_read === 0);
    expect(unread.length).toBe(0);
  });

  it('should succeed even for user with no notifications', async () => {
    const res = await request(app)
      .patch('/api/notifications/99999/read-all');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
