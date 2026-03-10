/**
 * Routes Configuration
 *
 * This file serves as the main router for all API endpoints.
 * All individual route files are imported and registered here.
 *
 * API Base Path: /api
 *
 * Available Routes:
 * - /api/health - Health check endpoint
 * - /api/customers - Customer management endpoints
 * - /api/shipments - Shipment processing endpoints
 * - /api/parcels - Parcel management endpoints
 * - /api/payments - Payment processing endpoints
 * - /api/tracking - Parcel tracking endpoints
 */

const express = require('express');
const router = express.Router();

// Import route modules
const customerRoutes = require('./customers');
const shipmentRoutes = require('./shipments');
const parcelRoutes = require('./parcels');
const paymentRoutes = require('./payments');
const trackingRoutes = require('./tracking');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Register API routes with /api prefix
router.use('/customers', customerRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/parcels', parcelRoutes);
router.use('/payments', paymentRoutes);
router.use('/tracking', trackingRoutes);

module.exports = router;
