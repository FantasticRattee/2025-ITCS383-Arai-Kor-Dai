const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

/**
 * Customer Routes
 * Base path: /api/customers
 */

// GET /api/customers - Get all customers
router.get('/', controllers.CustomerController.getAllCustomers);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', controllers.CustomerController.getCustomerById);

// POST /api/customers - Create new customer
router.post('/', controllers.CustomerController.createCustomer);

// PUT /api/customers/:id - Update customer
router.put('/:id', controllers.CustomerController.updateCustomer);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', controllers.CustomerController.deleteCustomer);

// PUT /api/customers/:id/verify - Verify customer account
router.put('/:id/verify', controllers.CustomerController.verifyCustomer);

// POST /api/customers/login - Customer login
router.post('/login', controllers.CustomerController.login);

module.exports = router;

