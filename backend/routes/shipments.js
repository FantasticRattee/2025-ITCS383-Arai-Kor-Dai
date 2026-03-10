const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

/**
 * Shipment Routes
 * Base path: /api/shipments
 */

// GET /api/shipments - Get all shipments
router.get('/', controllers.ShipmentController.getAllShipments);

// GET /api/shipments/:id - Get shipment by ID
router.get('/:id', controllers.ShipmentController.getShipmentById);

// GET /api/shipments/track/:trackingNumber - Get shipment by tracking number
router.get('/track/:trackingNumber', controllers.ShipmentController.getShipmentByTracking);

// GET /api/shipments/customer/:customerId - Get shipments by customer ID
router.get('/customer/:customerId', controllers.ShipmentController.getShipmentsByCustomer);

// GET /api/shipments/status/:status - Get shipments by status
router.get('/status/:status', controllers.ShipmentController.getShipmentsByStatus);

// POST /api/shipments - Create new shipment
router.post('/', controllers.ShipmentController.createShipment);

// PUT /api/shipments/:id - Update shipment
router.put('/:id', controllers.ShipmentController.updateShipment);

// PUT /api/shipments/:id/status - Update shipment status
router.put('/:id/status', controllers.ShipmentController.updateShipmentStatus);

// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', controllers.ShipmentController.deleteShipment);

module.exports = router;