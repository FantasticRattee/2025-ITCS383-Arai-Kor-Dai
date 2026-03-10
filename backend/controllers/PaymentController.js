const models = require('../models');

/**
 * Payment Controller
 * Handles payment-related API endpoints
 */
class PaymentController {
  /**
   * Get all payments
   * GET /api/payments
   */
  static async getAllPayments(req, res) {
    try {
      const payments = await models.Payment.findAll();
      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payments',
        error: error.message
      });
    }
  }

  /**
   * Get payment by ID
   * GET /api/payments/:id
   */
  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await models.Payment.findById(parseInt(id));

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment',
        error: error.message
      });
    }
  }

  /**
   * Get payment by transaction ID
   * GET /api/payments/transaction/:transactionId
   */
  static async getPaymentByTransactionId(req, res) {
    try {
      const { transactionId } = req.params;
      const payment = await models.Payment.findByTransactionId(transactionId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Error fetching payment by transaction ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment',
        error: error.message
      });
    }
  }

  /**
   * Get payments by shipment ID
   * GET /api/payments/shipment/:shipmentId
   */
  static async getPaymentsByShipment(req, res) {
    try {
      const { shipmentId } = req.params;
      const payments = await models.Payment.findByShipmentId(parseInt(shipmentId));

      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching payments by shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payments',
        error: error.message
      });
    }
  }

  /**
   * Get payments by customer ID
   * GET /api/payments/customer/:customerId
   */
  static async getPaymentsByCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const payments = await models.Payment.findByCustomerId(parseInt(customerId));

      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching payments by customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payments',
        error: error.message
      });
    }
  }

  /**
   * Create new payment
   * POST /api/payments
   */
  static async createPayment(req, res) {
    try {
      const paymentData = req.body;

      // Generate transaction ID if not provided
      if (!paymentData.transaction_id) {
        paymentData.transaction_id = await PaymentController.generateTransactionId();
      }

      const payment = await models.Payment.create(paymentData);

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment',
        error: error.message
      });
    }
  }

  /**
   * Update payment
   * PUT /api/payments/:id
   */
  static async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const payment = await models.Payment.update(parseInt(id), updateData);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update payment',
        error: error.message
      });
    }
  }

  /**
   * Update payment status
   * PUT /api/payments/:id/status
   */
  static async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const payment = await models.Payment.updateStatus(parseInt(id), status);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update payment status',
        error: error.message
      });
    }
  }

  /**
   * Delete payment
   * DELETE /api/payments/:id
   */
  static async deletePayment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await models.Payment.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete payment',
        error: error.message
      });
    }
  }

  /**
   * Generate unique transaction ID
   * @returns {string} Transaction ID
   */
  static async generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN${timestamp}${random}`;
  }

  /**
   * Get payments by status
   * GET /api/payments/status/:status
   */
  static async getPaymentsByStatus(req, res) {
    try {
      const { status } = req.params;
      const payments = await models.Payment.findByStatus(status);

      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching payments by status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payments',
        error: error.message
      });
    }
  }

  /**
   * Get payments by method
   * GET /api/payments/method/:method
   */
  static async getPaymentsByMethod(req, res) {
    try {
      const { method } = req.params;
      const payments = await models.Payment.findByMethod(method);

      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching payments by method:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payments',
        error: error.message
      });
    }
  }

  /**
   * Get total revenue for date range
   * GET /api/payments/revenue?startDate=2024-01-01&endDate=2024-12-31
   */
  static async getTotalRevenue(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate query parameters are required'
        });
      }

      const totalRevenue = await models.Payment.getTotalRevenue(startDate, endDate);

      res.json({
        success: true,
        data: {
          start_date: startDate,
          end_date: endDate,
          total_revenue: totalRevenue
        }
      });
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate total revenue',
        error: error.message
      });
    }
  }
}

module.exports = PaymentController;