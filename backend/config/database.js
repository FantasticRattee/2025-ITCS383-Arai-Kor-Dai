/**
 * Database Configuration and Connection
 * 
 * This module manages PostgreSQL database connections using the 'pg' library.
 * It provides connection pooling and query execution methods.
 * 
 * Usage:
 *   const db = require('./config/database');
 *   const result = await db.query('SELECT * FROM users');
 */

const { Pool } = require('pg');
const config = require('./config');

// Create connection pool for database
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
});

/**
 * Test the database connection
 * @returns {Promise<boolean>} - True if connection successful
 */
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Execute a parameterized query
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters for parameterized queries (prevents SQL injection)
 * @returns {Promise<Object>} - Query result object
 * 
 * Example:
 *   const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
 */
const query = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

/**
 * Close all database connections
 * Used during server shutdown
 */
const closePool = async () => {
  await pool.end();
  console.log('Database connection pool closed');
};

module.exports = {
  pool,
  query,
  testConnection,
  closePool,
};
