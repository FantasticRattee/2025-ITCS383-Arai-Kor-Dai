const router = require('express').Router();
const db     = require('../db');

// GET /api/activity/:userId
router.get('/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT type, title, subtitle, created_at
       FROM activity_log WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 10`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
