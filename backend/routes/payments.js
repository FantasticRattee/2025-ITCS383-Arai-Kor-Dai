const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

/**
 * Payment Routes
 * Base path: /api/payments
 */

// GET /api/payments - Get all payments
router.get('/', controllers.PaymentController.getAllPayments);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', controllers.PaymentController.getPaymentById);

// GET /api/payments/transaction/:transactionId - Get payment by transaction ID
router.get('/transaction/:transactionId', controllers.PaymentController.getPaymentByTransactionId);

// GET /api/payments/shipment/:shipmentId - Get payments by shipment ID
router.get('/shipment/:shipmentId', controllers.PaymentController.getPaymentsByShipment);

// GET /api/payments/customer/:customerId - Get payments by customer ID
router.get('/customer/:customerId', controllers.PaymentController.getPaymentsByCustomer);

// GET /api/payments/status/:status - Get payments by status
router.get('/status/:status', controllers.PaymentController.getPaymentsByStatus);

// GET /api/payments/method/:method - Get payments by method
router.get('/method/:method', controllers.PaymentController.getPaymentsByMethod);

// GET /api/payments/revenue - Get total revenue for date range
router.get('/revenue', controllers.PaymentController.getTotalRevenue);

// POST /api/payments - Create new payment
router.post('/', controllers.PaymentController.createPayment);

// PUT /api/payments/:id - Update payment
router.put('/:id', controllers.PaymentController.updatePayment);

// PUT /api/payments/:id/status - Update payment status
router.put('/:id/status', controllers.PaymentController.updatePaymentStatus);

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', controllers.PaymentController.deletePayment);

module.exports = router;