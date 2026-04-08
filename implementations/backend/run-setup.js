const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://postoffice_db_user:2LcWrTBacDnSVTJl1M9ePFaLqobQrRxv@dpg-d7b1l1fvfte5s73d26b6g-a.oregon-postgres.render.com/postoffice_db',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const sql = fs.readFileSync('./setup.sql', 'utf8');
  try {
    await pool.query(sql);
    console.log('Setup complete! Tables created and test data inserted.');

    // Verify
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const shipments = await pool.query('SELECT COUNT(*) FROM shipments');
    const payments = await pool.query('SELECT COUNT(*) FROM payments');
    console.log(`Users: ${users.rows[0].count}, Shipments: ${shipments.rows[0].count}, Payments: ${payments.rows[0].count}`);
  } catch (e) {
    console.error('Setup failed:', e.message);
  } finally {
    await pool.end();
  }
}

run();
