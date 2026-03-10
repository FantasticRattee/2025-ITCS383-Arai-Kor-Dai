const models = require('../models');

/**
 * Shipment Controller
 * Handles shipment-related API endpoints
 */
class ShipmentController {
  /**
   * Get all shipments
   * GET /api/shipments
   */
  static async getAllShipments(req, res) {
    try {
      const shipments = await models.Shipment.findAll();
      res.json({
        success: true,
        data: shipments
      });
    } catch (error) {
      console.error('Error fetching shipments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch shipments',
        error: error.message
      });
    }
  }

  /**
   * Get shipment by ID
   * GET /api/shipments/:id
   */
  static async getShipmentById(req, res) {
    try {
      const { id } = req.params;
      const shipment = await models.Shipment.findById(parseInt(id));

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      res.json({
        success: true,
        data: shipment
      });
    } catch (error) {
      console.error('Error fetching shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch shipment',
        error: error.message
      });
    }
  }

  /**
   * Get shipment by tracking number
   * GET /api/shipments/track/:trackingNumber
   */
  static async getShipmentByTracking(req, res) {
    try {
      const { trackingNumber } = req.params;
      const shipment = await models.Shipment.findByTrackingNumber(trackingNumber);

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      res.json({
        success: true,
        data: shipment
      });
    } catch (error) {
      console.error('Error fetching shipment by tracking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch shipment',
        error: error.message
      });
    }
  }

  /**
   * Get shipments by customer ID
   * GET /api/shipments/customer/:customerId
   */
  static async getShipmentsByCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const shipments = await models.Shipment.findByCustomerId(parseInt(customerId));

      res.json({
        success: true,
        data: shipments
      });
    } catch (error) {
      console.error('Error fetching customer shipments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch shipments',
        error: error.message
      });
    }
  }

  /**
   * Create new shipment
   * POST /api/shipments
   */
  static async createShipment(req, res) {
    try {
      const shipmentData = req.body;

      // Generate tracking number if not provided
      if (!shipmentData.tracking_number) {
        shipmentData.tracking_number = await ShipmentController.generateTrackingNumber();
      }

      const shipment = await models.Shipment.create(shipmentData);

      res.status(201).json({
        success: true,
        message: 'Shipment created successfully',
        data: shipment
      });
    } catch (error) {
      console.error('Error creating shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create shipment',
        error: error.message
      });
    }
  }

  /**
   * Update shipment
   * PUT /api/shipments/:id
   */
  static async updateShipment(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const shipment = await models.Shipment.update(parseInt(id), updateData);

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      res.json({
        success: true,
        message: 'Shipment updated successfully',
        data: shipment
      });
    } catch (error) {
      console.error('Error updating shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update shipment',
        error: error.message
      });
    }
  }

  /**
   * Update shipment status
   * PUT /api/shipments/:id/status
   */
  static async updateShipmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const shipment = await models.Shipment.updateStatus(parseInt(id), status);

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      res.json({
        success: true,
        message: 'Shipment status updated successfully',
        data: shipment
      });
    } catch (error) {
      console.error('Error updating shipment status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update shipment status',
        error: error.message
      });
    }
  }

  /**
   * Delete shipment
   * DELETE /api/shipments/:id
   */
  static async deleteShipment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await models.Shipment.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      res.json({
        success: true,
        message: 'Shipment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete shipment',
        error: error.message
      });
    }
  }

  /**
   * Generate unique tracking number
   * @returns {string} Tracking number
   */
  static async generateTrackingNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TH${timestamp}${random}`;
  }

  /**
   * Get shipments by status
   * GET /api/shipments/status/:status
   */
  static async getShipmentsByStatus(req, res) {
    try {
      const { status } = req.params;
      const shipments = await models.Shipment.findByStatus(status);

      res.json({
        success: true,
        data: shipments
      });
    } catch (error) {
      console.error('Error fetching shipments by status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch shipments',
        error: error.message
      });
    }
  }
}

module.exports = ShipmentController;