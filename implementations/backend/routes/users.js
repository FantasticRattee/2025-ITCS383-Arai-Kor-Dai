const router = require('express').Router();
const db     = require('../db');
const bcrypt = require('bcrypt');

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const existing = await db.query(
      `SELECT id FROM users WHERE email = $1`, [email]
    );
    if (existing.rows.length) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'member') RETURNING id`,
      [`${firstName} ${lastName}`, email, hashed]
    );

    res.json({ success: true, userId: result.rows[0].id, name: `${firstName} ${lastName}` });

  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await db.query(
      `SELECT id, name, email, password, role FROM users WHERE email = $1`, [email]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user  = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      userId:  user.id,
      name:    user.name,
      email:   user.email,
      role:    user.role,
    });

  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET profile
router.get('/profile/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, created_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'User not found.' });

    res.json(result.rows[0]);

  } catch (e) {
    console.error('Profile error:', e);
    res.status(500).json({ error: e.message });
  }
});

// stats
router.get('/stats/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await db.query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
         SUM(CASE WHEN status = 'in transit' THEN 1 ELSE 0 END) AS transit,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
         COALESCE(SUM(amount), 0) AS "totalSpend"
       FROM shipments
       WHERE user_id = $1`,
      [userId]
    );

    const totals = result.rows[0];
    res.json({
      total: parseInt(totals.total) || 0,
      delivered: parseInt(totals.delivered) || 0,
      transit: parseInt(totals.transit) || 0,
      pending: parseInt(totals.pending) || 0,
      totalSpend: parseFloat(totals.totalSpend) || 0,
    });

  } catch (e) {
    console.error('Stats error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
