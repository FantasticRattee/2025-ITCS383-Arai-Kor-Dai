/**
 * Application Configuration
 * 
 * This module centralizes all configuration settings for the application.
 * It reads from environment variables and provides default values.
 * 
 * Environment variables are defined in .env file (development) or process.env (production)
 */

module.exports = {
  // Server Configuration
  server: {
    port: process.env.SERVER_PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'post_office_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },

  // API Configuration
  api: {
    prefix: process.env.API_PREFIX || '/api',
    version: 'v1',
  },

  // Application Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
