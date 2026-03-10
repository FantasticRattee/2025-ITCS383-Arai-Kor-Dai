/**
 * Models Module
 *
 * Models represent database entities and provide methods to interact with the database.
 * Each model corresponds to a table in PostgreSQL.
 *
 * Model Responsibilities:
 * - Define database schema/structure
 * - Provide CRUD (Create, Read, Update, Delete) operations
 * - Execute parameterized queries to prevent SQL injection
 * - Handle data validation
 *
 * Available Models:
 * - Customer - Customer information and authentication
 * - Staff - Staff user accounts and roles
 * - Shipment - Shipment records with tracking
 * - Parcel - Individual parcel details within shipments
 * - Payment - Payment transaction records
 * - TrackingHistory - Parcel tracking history
 * - Insurance - Shipment insurance policies
 * - Report - Admin reports and statistics
 */

module.exports = {
  Customer: require('./Customer'),
  Staff: require('./Staff'),
  Shipment: require('./Shipment'),
  Parcel: require('./Parcel'),
  Payment: require('./Payment'),
  TrackingHistory: require('./TrackingHistory'),
  Insurance: require('./Insurance'),
  Report: require('./Report')
};
