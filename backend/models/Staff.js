const db = require('../config/db');

/**
 * Staff Model
 * Handles staff-related database operations
 */
class Staff {
  /**
   * Create a new staff member
   * @param {Object} staffData - Staff data
   * @returns {Promise<Object>} Created staff member
   */
  static async create(staffData) {
    const { name, email, password_hash, role } = staffData;

    const query = `
      INSERT INTO staff (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [name, email, password_hash, role];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find staff by ID
   * @param {number} id - Staff ID
   * @returns {Promise<Object|null>} Staff data or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM staff WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find staff by email
   * @param {string} email - Staff email
   * @returns {Promise<Object|null>} Staff data or null
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM staff WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Get all staff members
   * @returns {Promise<Array>} Array of staff members
   */
  static async findAll() {
    const query = 'SELECT * FROM staff ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Update staff member
   * @param {number} id - Staff ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated staff member or null
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
      UPDATE staff
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete staff member
   * @param {number} id - Staff ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM staff WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Find staff by role
   * @param {string} role - Staff role
   * @returns {Promise<Array>} Array of staff members with the role
   */
  static async findByRole(role) {
    const query = 'SELECT * FROM staff WHERE role = $1 AND is_active = true';
    const result = await db.query(query, [role]);
    return result.rows;
  }
}

module.exports = Staff;