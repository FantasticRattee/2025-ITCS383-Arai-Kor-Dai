/**
 * API Module - Frontend API Communication
 * 
 * This module provides a centralized interface for making API calls to the backend.
 * It handles:
 * - REST API requests (GET, POST, PUT, DELETE)
 * - Base URL configuration
 * - Headers configuration (Content-Type, Authentication)
 * - Error handling
 * - Request/response logging
 * 
 * Usage:
 *   api.get('/parcels').then(data => console.log(data));
 *   api.post('/parcels', { name: 'Package' }).then(data => console.log(data));
 */

class APIClient {
  /**
   * Constructor for APIClient
   * @param {string} baseURL - Base URL for API server (default: http://localhost:3000)
   */
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.apiPrefix = '/api';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   */
  buildURL(endpoint) {
    return `${this.baseURL}${this.apiPrefix}${endpoint}`;
  }

  /**
   * Set authentication token in headers
   * @param {string} token - Authentication token (JWT)
   */
  setToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   * @example
   *   const parcels = await api.get('/parcels');
   */
  async get(endpoint, options = {}) {
    return this._request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   * @example
   *   const newParcel = await api.post('/parcels', { trackingNumber: '12345' });
   */
  async post(endpoint, data = {}, options = {}) {
    return this._request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   * @example
   *   const updated = await api.put('/parcels/1', { status: 'delivered' });
   */
  async put(endpoint, data = {}, options = {}) {
    return this._request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   * @example
   *   const deleted = await api.delete('/parcels/1');
   */
  async delete(endpoint, options = {}) {
    return this._request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Internal method to handle all requests
   * @private
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async _request(endpoint, options = {}) {
    const url = this.buildURL(endpoint);

    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      // Log request details in development mode
      if (window.DEBUG_API) {
        console.log(`[API] ${options.method} ${endpoint}`, response.status);
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Parse and return response data
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[API Error] ${options.method} ${endpoint}:`, error.message);
      throw error;
    }
  }
}

// Create global API instance
const api = new APIClient();

// Enable debug mode in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.DEBUG_API = true;
}
