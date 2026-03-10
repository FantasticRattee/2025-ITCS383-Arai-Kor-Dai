/**
 * Controllers Module
 *
 * Controllers handle the business logic for API endpoints.
 * They process requests from routes, interact with models/database,
 * and send responses back to the client.
 *
 * Controller Structure:
 * - Receive request data
 * - Validate input
 * - Call appropriate model/database functions
 * - Format and send response
 *
 * Available Controllers:
 * - CustomerController - Customer management operations
 * - ShipmentController - Shipment processing and tracking
 * - ParcelController - Parcel details and management
 * - PaymentController - Payment processing and transactions
 * - TrackingController - Parcel tracking and history
 */

module.exports = {
  CustomerController: require('./CustomerController'),
  ShipmentController: require('./ShipmentController'),
  ParcelController: require('./ParcelController'),
  PaymentController: require('./PaymentController'),
  TrackingController: require('./TrackingController')
};
