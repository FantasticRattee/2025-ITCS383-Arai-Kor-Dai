/**
 * Routes Configuration
 * 
 * This file serves as the main router for all API endpoints.
 * All individual route files are imported and registered here.
 * 
 * Example:
 *   const authRoutes = require('./auth');
 *   router.use('/auth', authRoutes);
 * 
 * Available Routes (to be implemented):
 * - /auth - Authentication endpoints (login, logout, register)
 * - /customers - Customer management endpoints
 * - /parcels - Parcel management endpoints
 * - /tracking - Tracking endpoints
 * - /payments - Payment endpoints
 * - /notifications - Notification endpoints
 */

const express = require('express');
const router = express.Router();

// Placeholder route for API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// TODO: Import and register individual route modules
// const authRoutes = require('./auth');
// const customerRoutes = require('./customers');
// const parcelRoutes = require('./parcels');
// const trackingRoutes = require('./tracking');
// const paymentRoutes = require('./payments');

// TODO: Register routes
// router.use('/auth', authRoutes);
// router.use('/customers', customerRoutes);
// router.use('/parcels', parcelRoutes);
// router.use('/tracking', trackingRoutes);
// router.use('/payments', paymentRoutes);

module.exports = router;
