const models = require('../models');

/**
 * Customer Controller
 * Handles customer-related API endpoints
 */
class CustomerController {
  /**
   * Get all customers
   * GET /api/customers
   */
  static async getAllCustomers(req, res) {
    try {
      const customers = await models.Customer.findAll();
      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customers',
        error: error.message
      });
    }
  }

  /**
   * Get customer by ID
   * GET /api/customers/:id
   */
  static async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await models.Customer.findById(parseInt(id));

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer',
        error: error.message
      });
    }
  }

  /**
   * Create new customer
   * POST /api/customers
   */
  static async createCustomer(req, res) {
    try {
      const customerData = req.body;
      const customer = await models.Customer.create(customerData);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create customer',
        error: error.message
      });
    }
  }

  /**
   * Update customer
   * PUT /api/customers/:id
   */
  static async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const customer = await models.Customer.update(parseInt(id), updateData);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update customer',
        error: error.message
      });
    }
  }

  /**
   * Delete customer
   * DELETE /api/customers/:id
   */
  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const deleted = await models.Customer.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete customer',
        error: error.message
      });
    }
  }

  /**
   * Verify customer account
   * PUT /api/customers/:id/verify
   */
  static async verifyCustomer(req, res) {
    try {
      const { id } = req.params;
      const customer = await models.Customer.verify(parseInt(id));

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        message: 'Customer verified successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error verifying customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify customer',
        error: error.message
      });
    }
  }

  /**
   * Login customer
   * POST /api/customers/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const customer = await models.Customer.findByEmail(email);

      if (!customer) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // In a real application, you would verify the password hash
      // For now, we'll just check if the customer exists
      if (!customer.is_verified) {
        return res.status(401).json({
          success: false,
          message: 'Account not verified'
        });
      }

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          is_verified: customer.is_verified
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }
}

module.exports = CustomerController;