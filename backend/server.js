/**
 * Post Office Management System - Main Server File
 * 
 * This file initializes the Express server, sets up middleware,
 * configures database connections, and starts listening for requests.
 * 
 * Entry Point: node server.js or npm start
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/config');
const db = require('./config/database');

// Initialize Express Application
const app = express();

// ========================================
// Middleware Configuration
// ========================================

// CORS middleware - allows cross-origin requests from frontend
app.use(cors());

// Body parser middleware - parses incoming JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========================================
// Routes Configuration
// ========================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// API Routes
app.use('/api', require('./routes'));

// ========================================
// Error Handling Middleware
// ========================================

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ========================================
// Server Startup
// ========================================

const PORT = config.server.port || 3000;

// Test database connection before starting server
db.testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${config.env}`);
      console.log(`✓ Database: ${config.database.name}`);
    });
  })
  .catch((err) => {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  });

module.exports = app;
