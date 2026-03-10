const models = require('../models');

/**
 * Parcel Controller
 * Handles parcel-related API endpoints
 */
class ParcelController {
  /**
   * Get all parcels
   * GET /api/parcels
   */
  static async getAllParcels(req, res) {
    try {
      const parcels = await models.Parcel.findAll();
      res.json({
        success: true,
        data: parcels
      });
    } catch (error) {
      console.error('Error fetching parcels:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch parcels',
        error: error.message
      });
    }
  }

  /**
   * Get parcel by ID
   * GET /api/parcels/:id
   */
  static async getParcelById(req, res) {
    try {
      const { id } = req.params;
      const parcel = await models.Parcel.findById(parseInt(id));

      if (!parcel) {
        return res.status(404).json({
          success: false,
          message: 'Parcel not found'
        });
      }

      res.json({
        success: true,
        data: parcel
      });
    } catch (error) {
      console.error('Error fetching parcel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch parcel',
        error: error.message
      });
    }
  }

  /**
   * Get parcels by shipment ID
   * GET /api/parcels/shipment/:shipmentId
   */
  static async getParcelsByShipment(req, res) {
    try {
      const { shipmentId } = req.params;
      const parcels = await models.Parcel.findByShipmentId(parseInt(shipmentId));

      res.json({
        success: true,
        data: parcels
      });
    } catch (error) {
      console.error('Error fetching parcels by shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch parcels',
        error: error.message
      });
    }
  }

  /**
   * Create new parcel
   * POST /api/parcels
   */
  static async createParcel(req, res) {
    try {
      const parcelData = req.body;
      const parcel = await models.Parcel.create(parcelData);

      res.status(201).json({
        success: true,
        message: 'Parcel created successfully',
        data: parcel
      });
    } catch (error) {
      console.error('Error creating parcel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create parcel',
        error: error.message
      });
    }
  }

  /**
   * Update parcel
   * PUT /api/parcels/:id
   */
  static async updateParcel(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const parcel = await models.Parcel.update(parseInt(id), updateData);

      if (!parcel) {
        return res.status(404).json({
          success: false,
          message: 'Parcel not found'
        });
      }

      res.json({
        success: true,
        message: 'Parcel updated successfully',
        data: parcel
      });
    } catch (error) {
      console.error('Error updating parcel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update parcel',
        error: error.message
      });
    }
  }

  /**
   * Delete parcel
   * DELETE /api/parcels/:id
   */
  static async deleteParcel(req, res) {
    try {
      const { id } = req.params;
      const deleted = await models.Parcel.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Parcel not found'
        });
      }

      res.json({
        success: true,
        message: 'Parcel deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting parcel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete parcel',
        error: error.message
      });
    }
  }

  /**
   * Get total weight for a shipment
   * GET /api/parcels/shipment/:shipmentId/total-weight
   */
  static async getTotalWeight(req, res) {
    try {
      const { shipmentId } = req.params;
      const totalWeight = await models.Parcel.getTotalWeight(parseInt(shipmentId));

      res.json({
        success: true,
        data: {
          shipment_id: parseInt(shipmentId),
          total_weight: totalWeight
        }
      });
    } catch (error) {
      console.error('Error calculating total weight:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate total weight',
        error: error.message
      });
    }
  }

  /**
   * Get total declared value for a shipment
   * GET /api/parcels/shipment/:shipmentId/total-value
   */
  static async getTotalValue(req, res) {
    try {
      const { shipmentId } = req.params;
      const totalValue = await models.Parcel.getTotalValue(parseInt(shipmentId));

      res.json({
        success: true,
        data: {
          shipment_id: parseInt(shipmentId),
          total_value: totalValue
        }
      });
    } catch (error) {
      console.error('Error calculating total value:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate total value',
        error: error.message
      });
    }
  }

  /**
   * Create multiple parcels for a shipment
   * POST /api/parcels/bulk
   */
  static async createBulkParcels(req, res) {
    try {
      const { shipmentId, parcels } = req.body;

      if (!Array.isArray(parcels) || parcels.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Parcels array is required and must not be empty'
        });
      }

      const createdParcels = [];

      for (const parcelData of parcels) {
        const parcel = await models.Parcel.create({
          shipment_id: shipmentId,
          ...parcelData
        });
        createdParcels.push(parcel);
      }

      res.status(201).json({
        success: true,
        message: `${createdParcels.length} parcels created successfully`,
        data: createdParcels
      });
    } catch (error) {
      console.error('Error creating bulk parcels:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create parcels',
        error: error.message
      });
    }
  }
}

module.exports = ParcelController;