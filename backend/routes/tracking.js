const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

/**
 * Tracking Routes
 * Base path: /api/tracking
 */

// GET /api/tracking - Get all tracking history
router.get('/', controllers.TrackingController.getAllTracking);

// GET /api/tracking/:id - Get tracking entry by ID
router.get('/:id', controllers.TrackingController.getTrackingById);

// GET /api/tracking/shipment/:shipmentId - Get tracking history for shipment
router.get('/shipment/:shipmentId', controllers.TrackingController.getTrackingByShipment);

// GET /api/tracking/shipment/:shipmentId/latest - Get latest tracking status
router.get('/shipment/:shipmentId/latest', controllers.TrackingController.getLatestTracking);

// GET /api/tracking/track/:trackingNumber - Track shipment by tracking number
router.get('/track/:trackingNumber', controllers.TrackingController.trackShipment);

// GET /api/tracking/status/:status - Get tracking by status
router.get('/status/:status', controllers.TrackingController.getTrackingByStatus);

// GET /api/tracking/statistics - Get tracking statistics
router.get('/statistics', controllers.TrackingController.getTrackingStatistics);

// POST /api/tracking - Create new tracking entry
router.post('/', controllers.TrackingController.createTracking);

// POST /api/tracking/shipment/:shipmentId/update - Add tracking update
router.post('/shipment/:shipmentId/update', controllers.TrackingController.addTrackingUpdate);

// PUT /api/tracking/:id - Update tracking entry
router.put('/:id', controllers.TrackingController.updateTracking);

// DELETE /api/tracking/:id - Delete tracking entry
router.delete('/:id', controllers.TrackingController.deleteTracking);

module.exports = router;