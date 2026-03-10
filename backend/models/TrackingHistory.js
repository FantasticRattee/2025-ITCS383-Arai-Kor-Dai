const db = require('../config/db');

/**
 * TrackingHistory Model
 * Handles tracking history-related database operations
 */
class TrackingHistory {
  /**
   * Create a new tracking entry
   * @param {Object} trackingData - Tracking data
   * @returns {Promise<Object>} Created tracking entry
   */
  static async create(trackingData) {
    const { shipment_id, status, location, notes } = trackingData;

    const query = `
      INSERT INTO tracking_history (shipment_id, status, location, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [shipment_id, status, location, notes];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find tracking entry by ID
   * @param {number} id - Tracking entry ID
   * @returns {Promise<Object|null>} Tracking data or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM tracking_history WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get all tracking history for a shipment
   * @param {number} shipmentId - Shipment ID
   * @returns {Promise<Array>} Array of tracking entries
   */
  static async findByShipmentId(shipmentId) {
    const query = 'SELECT * FROM tracking_history WHERE shipment_id = $1 ORDER BY timestamp DESC';
    const result = await db.query(query, [shipmentId]);
    return result.rows;
  }

  /**
   * Get all tracking history
   * @returns {Promise<Array>} Array of tracking entries
   */
  static async findAll() {
    const query = 'SELECT * FROM tracking_history ORDER BY timestamp DESC';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update tracking entry
   * @param {number} id - Tracking entry ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated tracking entry or null
   */
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    const query = `
      UPDATE tracking_history
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete tracking entry
   * @param {number} id - Tracking entry ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM tracking_history WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get latest tracking status for a shipment
   * @param {number} shipmentId - Shipment ID
   * @returns {Promise<Object|null>} Latest tracking entry or null
   */
  static async getLatestStatus(shipmentId) {
    const query = 'SELECT * FROM tracking_history WHERE shipment_id = $1 ORDER BY timestamp DESC LIMIT 1';
    const result = await db.query(query, [shipmentId]);
    return result.rows[0] || null;
  }

  /**
   * Get tracking history by status
   * @param {string} status - Tracking status
   * @returns {Promise<Array>} Array of tracking entries
   */
  static async findByStatus(status) {
    const query = 'SELECT * FROM tracking_history WHERE status = $1 ORDER BY timestamp DESC';
    const result = await db.query(query, [status]);
    return result.rows;
  }

  /**
   * Get tracking statistics
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Statistics object
   */
  static async getStatistics(startDate, endDate) {
    const query = `
      SELECT
        status,
        COUNT(*) as count
      FROM tracking_history
      WHERE DATE(timestamp) BETWEEN $1 AND $2
      GROUP BY status
      ORDER BY count DESC
    `;
    const result = await db.query(query, [startDate, endDate]);
    return result.rows;
  }
}

module.exports = TrackingHistory;