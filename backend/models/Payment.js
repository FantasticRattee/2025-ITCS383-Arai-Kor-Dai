const db = require('../config/db');

/**
 * Payment Model
 * Handles payment-related database operations
 */
class Payment {
  /**
   * Create a new payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Created payment
   */
  static async create(paymentData) {
    const { shipment_id, amount, method, transaction_id, payment_details } = paymentData;

    const query = `
      INSERT INTO payments (shipment_id, amount, method, transaction_id, payment_details)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [shipment_id, amount, method, transaction_id, JSON.stringify(payment_details)];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find payment by ID
   * @param {number} id - Payment ID
   * @returns {Promise<Object|null>} Payment data or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM payments WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find payment by transaction ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object|null>} Payment data or null
   */
  static async findByTransactionId(transactionId) {
    const query = 'SELECT * FROM payments WHERE transaction_id = $1';
    const result = await db.query(query, [transactionId]);
    return result.rows[0] || null;
  }

  /**
   * Get all payments for a shipment
   * @param {number} shipmentId - Shipment ID
   * @returns {Promise<Array>} Array of payments
   */
  static async findByShipmentId(shipmentId) {
    const query = 'SELECT * FROM payments WHERE shipment_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [shipmentId]);
    return result.rows;
  }

  /**
   * Get all payments for a customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Array of payments
   */
  static async findByCustomerId(customerId) {
    const query = `
      SELECT p.* FROM payments p
      JOIN shipments s ON p.shipment_id = s.id
      WHERE s.customer_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(query, [customerId]);
    return result.rows;
  }

  /**
   * Get all payments
   * @returns {Promise<Array>} Array of payments
   */
  static async findAll() {
    const query = 'SELECT * FROM payments ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update payment
   * @param {number} id - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated payment or null
   */
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(key === 'payment_details' ? JSON.stringify(updateData[key]) : updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    const query = `
      UPDATE payments
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Update payment status
   * @param {number} id - Payment ID
   * @param {string} status - New status
   * @returns {Promise<Object|null>} Updated payment or null
   */
  static async updateStatus(id, status) {
    const query = 'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *';
    const result = await db.query(query, [status, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete payment
   * @param {number} id - Payment ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM payments WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get payments by status
   * @param {string} status - Payment status
   * @returns {Promise<Array>} Array of payments
   */
  static async findByStatus(status) {
    const query = 'SELECT * FROM payments WHERE status = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [status]);
    return result.rows;
  }

  /**
   * Get payments by method
   * @param {string} method - Payment method
   * @returns {Promise<Array>} Array of payments
   */
  static async findByMethod(method) {
    const query = 'SELECT * FROM payments WHERE method = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [method]);
    return result.rows;
  }

  /**
   * Get total revenue for a date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<number>} Total revenue
   */
  static async getTotalRevenue(startDate, endDate) {
    const query = `
      SELECT COALESCE(SUM(amount), 0) as total_revenue
      FROM payments
      WHERE status = 'completed'
      AND DATE(created_at) BETWEEN $1 AND $2
    `;
    const result = await db.query(query, [startDate, endDate]);
    return parseFloat(result.rows[0].total_revenue);
  }
}

module.exports = Payment;