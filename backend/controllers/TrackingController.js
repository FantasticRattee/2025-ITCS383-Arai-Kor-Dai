const models = require('../models');

/**
 * Tracking Controller
 * Handles tracking-related API endpoints
 */
class TrackingController {
  /**
   * Get all tracking history
   * GET /api/tracking
   */
  static async getAllTracking(req, res) {
    try {
      const tracking = await models.TrackingHistory.findAll();
      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      console.error('Error fetching tracking history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tracking history',
        error: error.message
      });
    }
  }

  /**
   * Get tracking entry by ID
   * GET /api/tracking/:id
   */
  static async getTrackingById(req, res) {
    try {
      const { id } = req.params;
      const tracking = await models.TrackingHistory.findById(parseInt(id));

      if (!tracking) {
        return res.status(404).json({
          success: false,
          message: 'Tracking entry not found'
        });
      }

      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      console.error('Error fetching tracking entry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tracking entry',
        error: error.message
      });
    }
  }

  /**
   * Get tracking history for a shipment
   * GET /api/tracking/shipment/:shipmentId
   */
  static async getTrackingByShipment(req, res) {
    try {
      const { shipmentId } = req.params;
      const tracking = await models.TrackingHistory.findByShipmentId(parseInt(shipmentId));

      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      console.error('Error fetching tracking by shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tracking history',
        error: error.message
      });
    }
  }

  /**
   * Get latest tracking status for a shipment
   * GET /api/tracking/shipment/:shipmentId/latest
   */
  static async getLatestTracking(req, res) {
    try {
      const { shipmentId } = req.params;
      const tracking = await models.TrackingHistory.getLatestStatus(parseInt(shipmentId));

      if (!tracking) {
        return res.status(404).json({
          success: false,
          message: 'No tracking information found for this shipment'
        });
      }

      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      console.error('Error fetching latest tracking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch latest tracking status',
        error: error.message
      });
    }
  }

  /**
   * Track shipment by tracking number
   * GET /api/tracking/track/:trackingNumber
   */
  static async trackShipment(req, res) {
    try {
      const { trackingNumber } = req.params;

      // First find the shipment
      const shipment = await models.Shipment.findByTrackingNumber(trackingNumber);

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      // Get tracking history
      const tracking = await models.TrackingHistory.findByShipmentId(shipment.id);

      res.json({
        success: true,
        data: {
          shipment: {
            id: shipment.id,
            tracking_number: shipment.tracking_number,
            origin: shipment.origin,
            destination: shipment.destination,
            status: shipment.status,
            created_at: shipment.created_at
          },
          tracking_history: tracking
        }
      });
    } catch (error) {
      console.error('Error tracking shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track shipment',
        error: error.message
      });
    }
  }

  /**
   * Create new tracking entry
   * POST /api/tracking
   */
  static async createTracking(req, res) {
    try {
      const trackingData = req.body;
      const tracking = await models.TrackingHistory.create(trackingData);

      res.status(201).json({
        success: true,
        message: 'Tracking entry created successfully',
        data: tracking
      });
    } catch (error) {
      console.error('Error creating tracking entry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create tracking entry',
        error: error.message
      });
    }
  }

  /**
   * Update tracking entry
   * PUT /api/tracking/:id
   */
  static async updateTracking(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const tracking = await models.TrackingHistory.update(parseInt(id), updateData);

      if (!tracking) {
        return res.status(404).json({
          success: false,
          message: 'Tracking entry not found'
        });
      }

      res.json({
        success: true,
        message: 'Tracking entry updated successfully',
        data: tracking
      });
    } catch (error) {
      console.error('Error updating tracking entry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update tracking entry',
        error: error.message
      });
    }
  }

  /**
   * Delete tracking entry
   * DELETE /api/tracking/:id
   */
  static async deleteTracking(req, res) {
    try {
      const { id } = req.params;
      const deleted = await models.TrackingHistory.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Tracking entry not found'
        });
      }

      res.json({
        success: true,
        message: 'Tracking entry deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting tracking entry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete tracking entry',
        error: error.message
      });
    }
  }

  /**
   * Add tracking update for shipment
   * POST /api/tracking/shipment/:shipmentId/update
   */
  static async addTrackingUpdate(req, res) {
    try {
      const { shipmentId } = req.params;
      const { status, location, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      // Verify shipment exists
      const shipment = await models.Shipment.findById(parseInt(shipmentId));
      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      // Create tracking entry
      const tracking = await models.TrackingHistory.create({
        shipment_id: parseInt(shipmentId),
        status,
        location,
        notes
      });

      // Update shipment status if provided
      if (status !== shipment.status) {
        await models.Shipment.updateStatus(parseInt(shipmentId), status);
      }

      res.status(201).json({
        success: true,
        message: 'Tracking update added successfully',
        data: tracking
      });
    } catch (error) {
      console.error('Error adding tracking update:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add tracking update',
        error: error.message
      });
    }
  }

  /**
   * Get tracking statistics
   * GET /api/tracking/statistics?startDate=2024-01-01&endDate=2024-12-31
   */
  static async getTrackingStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate query parameters are required'
        });
      }

      const statistics = await models.TrackingHistory.getStatistics(startDate, endDate);

      res.json({
        success: true,
        data: {
          start_date: startDate,
          end_date: endDate,
          statistics: statistics
        }
      });
    } catch (error) {
      console.error('Error fetching tracking statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tracking statistics',
        error: error.message
      });
    }
  }

  /**
   * Get tracking by status
   * GET /api/tracking/status/:status
   */
  static async getTrackingByStatus(req, res) {
    try {
      const { status } = req.params;
      const tracking = await models.TrackingHistory.findByStatus(status);

      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      console.error('Error fetching tracking by status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tracking entries',
        error: error.message
      });
    }
  }
}

module.exports = TrackingController;