const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

/**
 * Parcel Routes
 * Base path: /api/parcels
 */

// GET /api/parcels - Get all parcels
router.get('/', controllers.ParcelController.getAllParcels);

// GET /api/parcels/:id - Get parcel by ID
router.get('/:id', controllers.ParcelController.getParcelById);

// GET /api/parcels/shipment/:shipmentId - Get parcels by shipment ID
router.get('/shipment/:shipmentId', controllers.ParcelController.getParcelsByShipment);

// GET /api/parcels/shipment/:shipmentId/total-weight - Get total weight for shipment
router.get('/shipment/:shipmentId/total-weight', controllers.ParcelController.getTotalWeight);

// GET /api/parcels/shipment/:shipmentId/total-value - Get total declared value for shipment
router.get('/shipment/:shipmentId/total-value', controllers.ParcelController.getTotalValue);

// POST /api/parcels - Create new parcel
router.post('/', controllers.ParcelController.createParcel);

// POST /api/parcels/bulk - Create multiple parcels for a shipment
router.post('/bulk', controllers.ParcelController.createBulkParcels);

// PUT /api/parcels/:id - Update parcel
router.put('/:id', controllers.ParcelController.updateParcel);

// DELETE /api/parcels/:id - Delete parcel
router.delete('/:id', controllers.ParcelController.deleteParcel);

module.exports = router;