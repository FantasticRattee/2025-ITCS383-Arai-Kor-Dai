const db = require('../config/db');

/**
 * Shipment Model
 * Handles shipment-related database operations
 */
class Shipment {
  /**
   * Create a new shipment
   * @param {Object} shipmentData - Shipment data
   * @returns {Promise<Object>} Created shipment
   */
  static async create(shipmentData) {
    const {
      customer_id,
      tracking_number,
      origin,
      destination,
      weight,
      dimensions,
      service_type,
      shipping_cost,
      insurance_id
    } = shipmentData;

    const query = `
      INSERT INTO shipments (
        customer_id, tracking_number, origin, destination,
        weight, dimensions, service_type, shipping_cost, insurance_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      customer_id, tracking_number, origin, destination,
      weight, JSON.stringify(dimensions), service_type, shipping_cost, insurance_id
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find shipment by ID
   * @param {number} id - Shipment ID
   * @returns {Promise<Object|null>} Shipment data or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM shipments WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find shipment by tracking number
   * @param {string} trackingNumber - Tracking number
   * @returns {Promise<Object|null>} Shipment data or null
   */
  static async findByTrackingNumber(trackingNumber) {
    const query = 'SELECT * FROM shipments WHERE tracking_number = $1';
    const result = await db.query(query, [trackingNumber]);
    return result.rows[0] || null;
  }

  /**
   * Get all shipments for a customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Array of shipments
   */
  static async findByCustomerId(customerId) {
    const query = 'SELECT * FROM shipments WHERE customer_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [customerId]);
    return result.rows;
  }

  /**
   * Get all shipments
   * @returns {Promise<Array>} Array of shipments
   */
  static async findAll() {
    const query = 'SELECT * FROM shipments ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update shipment
   * @param {number} id - Shipment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated shipment or null
   */
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(key === 'dimensions' ? JSON.stringify(updateData[key]) : updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    const query = `
      UPDATE shipments
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Update shipment status
   * @param {number} id - Shipment ID
   * @param {string} status - New status
   * @returns {Promise<Object|null>} Updated shipment or null
   */
  static async updateStatus(id, status) {
    const query = 'UPDATE shipments SET status = $1 WHERE id = $2 RETURNING *';
    const result = await db.query(query, [status, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete shipment
   * @param {number} id - Shipment ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM shipments WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get shipments by status
   * @param {string} status - Shipment status
   * @returns {Promise<Array>} Array of shipments
   */
  static async findByStatus(status) {
    const query = 'SELECT * FROM shipments WHERE status = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [status]);
    return result.rows;
  }
}

module.exports = Shipment;