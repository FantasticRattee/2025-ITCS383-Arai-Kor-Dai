const db = require('../config/db');

/**
 * Insurance Model
 * Handles insurance-related database operations
 */
class Insurance {
  /**
   * Create a new insurance policy
   * @param {Object} insuranceData - Insurance data
   * @returns {Promise<Object>} Created insurance policy
   */
  static async create(insuranceData) {
    const { shipment_id, coverage_amount, premium } = insuranceData;

    const query = `
      INSERT INTO insurance (shipment_id, coverage_amount, premium)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [shipment_id, coverage_amount, premium];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find insurance by ID
   * @param {number} id - Insurance ID
   * @returns {Promise<Object|null>} Insurance data or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM insurance WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find insurance by shipment ID
   * @param {number} shipmentId - Shipment ID
   * @returns {Promise<Object|null>} Insurance data or null
   */
  static async findByShipmentId(shipmentId) {
    const query = 'SELECT * FROM insurance WHERE shipment_id = $1';
    const result = await db.query(query, [shipmentId]);
    return result.rows[0] || null;
  }

  /**
   * Get all insurance policies
   * @returns {Promise<Array>} Array of insurance policies
   */
  static async findAll() {
    const query = 'SELECT * FROM insurance ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update insurance policy
   * @param {number} id - Insurance ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated insurance policy or null
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
      UPDATE insurance
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete insurance policy
   * @param {number} id - Insurance ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM insurance WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Calculate insurance premium based on coverage amount
   * @param {number} coverageAmount - Coverage amount
   * @returns {number} Calculated premium
   */
  static calculatePremium(coverageAmount) {
    // Simple calculation: 1% of coverage amount
    return coverageAmount * 0.01;
  }

  /**
   * Get insurance statistics
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Statistics object
   */
  static async getStatistics(startDate, endDate) {
    const query = `
      SELECT
        COUNT(*) as total_policies,
        SUM(coverage_amount) as total_coverage,
        SUM(premium) as total_premium
      FROM insurance
      WHERE DATE(created_at) BETWEEN $1 AND $2
    `;
    const result = await db.query(query, [startDate, endDate]);
    return result.rows[0];
  }
}

module.exports = Insurance;