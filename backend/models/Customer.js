const db = require('../config/db');

/**
 * Customer Model
 * Handles customer-related database operations
 */
class Customer {
  /**
   * Create a new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise<Object>} Created customer
   */
  static async create(customerData) {
    const { name, email, phone, address, password_hash, verification_documents } = customerData;

    const query = `
      INSERT INTO customers (name, email, phone, address, password_hash, verification_documents)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [name, email, phone, address, password_hash, JSON.stringify(verification_documents)];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise<Object|null>} Customer data or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM customers WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find customer by email
   * @param {string} email - Customer email
   * @returns {Promise<Object|null>} Customer data or null
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM customers WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Get all customers
   * @returns {Promise<Array>} Array of customers
   */
  static async findAll() {
    const query = 'SELECT * FROM customers ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update customer
   * @param {number} id - Customer ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated customer or null
   */
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(key === 'verification_documents' ? JSON.stringify(updateData[key]) : updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    const query = `
      UPDATE customers
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete customer
   * @param {number} id - Customer ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM customers WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Verify customer account
   * @param {number} id - Customer ID
   * @returns {Promise<Object|null>} Updated customer or null
   */
  static async verify(id) {
    const query = 'UPDATE customers SET is_verified = true WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = Customer;