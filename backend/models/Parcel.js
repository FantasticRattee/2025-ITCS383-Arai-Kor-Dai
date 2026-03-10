const db = require('../config/db');

/**
 * Parcel Model
 * Handles parcel-related database operations
 */
class Parcel {
  /**
   * Create a new parcel
   * @param {Object} parcelData - Parcel data
   * @returns {Promise<Object>} Created parcel
   */
  static async create(parcelData) {
    const { shipment_id, description, weight, declared_value } = parcelData;

    const query = `
      INSERT INTO parcels (shipment_id, description, weight, declared_value)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [shipment_id, description, weight, declared_value];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find parcel by ID
   * @param {number} id - Parcel ID
   * @returns {Promise<Object|null>} Parcel data or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM parcels WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get all parcels for a shipment
   * @param {number} shipmentId - Shipment ID
   * @returns {Promise<Array>} Array of parcels
   */
  static async findByShipmentId(shipmentId) {
    const query = 'SELECT * FROM parcels WHERE shipment_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [shipmentId]);
    return result.rows;
  }

  /**
   * Get all parcels
   * @returns {Promise<Array>} Array of parcels
   */
  static async findAll() {
    const query = 'SELECT * FROM parcels ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update parcel
   * @param {number} id - Parcel ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated parcel or null
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
      UPDATE parcels
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete parcel
   * @param {number} id - Parcel ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM parcels WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get total weight for a shipment
   * @param {number} shipmentId - Shipment ID
   * @returns {Promise<number>} Total weight
   */
  static async getTotalWeight(shipmentId) {
    const query = 'SELECT COALESCE(SUM(weight), 0) as total_weight FROM parcels WHERE shipment_id = $1';
    const result = await db.query(query, [shipmentId]);
    return parseFloat(result.rows[0].total_weight);
  }

  /**
   * Get total declared value for a shipment
   * @param {number} shipmentId - Shipment ID
   * @returns {Promise<number>} Total declared value
   */
  static async getTotalValue(shipmentId) {
    const query = 'SELECT COALESCE(SUM(declared_value), 0) as total_value FROM parcels WHERE shipment_id = $1';
    const result = await db.query(query, [shipmentId]);
    return parseFloat(result.rows[0].total_value);
  }
}

module.exports = Parcel;