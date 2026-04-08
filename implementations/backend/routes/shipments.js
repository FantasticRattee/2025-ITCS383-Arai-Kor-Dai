const router = require('express').Router();
const db     = require('../db');

// ── IMPORTANT: Specific routes MUST come before param routes (:userId, :trackingNumber)

// GET /api/shipments/recent
router.get('/recent', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT tracking_number FROM shipments ORDER BY created_at DESC LIMIT 4`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shipments/track/:trackingNumber
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT tracking_number, status, origin, destination, recipient,
              eta, last_update, amount, type, service, weight, dims, contents, created_at
       FROM shipments WHERE tracking_number = $1`,
      [req.params.trackingNumber]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shipments/monthly/:userId
router.get('/monthly/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT TO_CHAR(created_at, 'Mon') as month, COUNT(*) as count
       FROM shipments
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '6 months'
       GROUP BY EXTRACT(MONTH FROM created_at), TO_CHAR(created_at, 'Mon')
       ORDER BY MIN(created_at)`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shipments/history/:userId  — full history for HistoryPage
router.get('/history/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         s.tracking_number,
         s.origin        AS "sAddr",
         s.destination   AS "rAddr",
         s.recipient     AS receiver,
         s.status,
         s.amount,
         s.created_at,
         p.method        AS "paymentMethod"
       FROM shipments s
       LEFT JOIN payments p ON p.shipment_id = s.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shipments/:userId
router.get('/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT tracking_number, recipient, origin, destination, status, eta, amount, created_at
       FROM shipments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/shipments  — save a new shipment after payment confirmation
router.post('/', async (req, res) => {
  const {
    userId,
    trackId, total, pkg, svc,
    sname, sphone, saddr, sprov, szip,
    rname, rphone, raddr, rprov, rzip,
    weight, dims, contents, declval, insurance, handling,
    paymentMethod, paymentRef,
  } = req.body;

  // Basic validation
  const required = { trackId, sname, rname, sprov, rprov, weight, contents };
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  // Parse numeric amount (strips currency symbol if present)
  const amount = parseFloat(String(total || '0').replace(/[^0-9.]/g, '')) || 0;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert shipment row
    const shipResult = await client.query(
      `INSERT INTO shipments
         (user_id, tracking_number, recipient, origin, destination,
          status, eta, last_update, amount,
          type, service, weight, dims, contents, insurance, handling)
       VALUES ($1, $2, $3, $4, $5, 'paid', NOW() + INTERVAL '3 days', $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [
        userId || 1,
        trackId,
        rname,
        sprov,
        rprov,
        `Payment confirmed via ${paymentMethod || 'Unknown'}`,
        amount,
        pkg      || 'Parcel',
        svc      || 'Standard',
        weight   || null,
        dims     || null,
        contents || null,
        insurance === 'Yes' ? 1 : 0,
        handling || 'None',
      ]
    );
    const shipmentId = shipResult.rows[0].id;

    // 2. Insert payment record
    await client.query(
      `INSERT INTO payments (user_id, shipment_id, amount, method)
       VALUES ($1, $2, $3, $4)`,
      [userId || 1, shipmentId, amount, paymentMethod || 'Unknown']
    );

    // 3. Add activity log entry
    await client.query(
      `INSERT INTO activity_log (user_id, type, title, subtitle)
       VALUES ($1, 'created', $2, $3)`,
      [
        userId || 1,
        `New shipment created`,
        `${trackId} · ${sprov} → ${rprov}`,
      ]
    );

    // 4. Add notification
    await client.query(
      `INSERT INTO notifications (user_id, message, type)
       VALUES ($1, $2, 'success')`,
      [
        userId || 1,
        `Shipment ${trackId} confirmed. Estimated delivery in 3 days.`,
      ]
    );

    await client.query('COMMIT');
    res.json({ success: true, shipmentId, trackId });

  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Shipment save error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

module.exports = router;
