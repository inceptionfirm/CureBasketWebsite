// Base API Service - Handles all HTTP requests
import API_CONFIG from './config.js';
import tokenManager from './tokenManager.js';

class BaseApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.config = API_CONFIG;
    this.tokenManager = tokenManager;
  }

  /**
   * Get authentication token from token manager (in-memory, NOT localStorage)
   */
  getToken() {
    return this.tokenManager.getToken();
  }

  /**
   * Set authentication token (in-memory, NOT localStorage)
   */
  setToken(token) {
    return this.tokenManager.setToken(token);
  }

  /**
   * Remove authentication token
   */
  removeToken() {
    this.tokenManager.clearToken();
  }

  /**
   * Build full URL
   */
  buildURL(endpoint) {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  /**
   * Build query string from params
   */
  buildQueryString(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Get request headers.
   * If customHeaders already has Authorization, it is kept (so callers can force public/customer token).
   * If customHeaders['Authorization'] is null, no auth is sent (used by customer-only endpoints when no login token).
   * Otherwise the in-memory auth token (user or public) is used.
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...customHeaders
    };

    // Explicitly no auth (e.g. customer cart when not logged in) – do not fall back to public token
    if (customHeaders['Authorization'] === null) {
      delete headers['Authorization'];
      return headers;
    }
    if (headers['Authorization'] !== undefined) {
      return headers;
    }
    const authToken = this.tokenManager.getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    // Handle 401 Unauthorized - return empty data instead of throwing
    if (response.status === 401) {
      return {
        success: false,
        data: [],
        error: 'Authentication required',
        unauthorized: true
      };
    }
    
    // Handle non-JSON responses
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      if (!response.ok) {
        // Don't throw for 401, return empty data
        if (response.status === 401) {
          return {
            success: false,
            data: [],
            error: 'Authentication required',
            unauthorized: true
          };
        }
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
      // Return text response as data
      return {
        success: true,
        data: text,
        message: text
      };
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      // If 401, return empty data
      if (response.status === 401) {
        return {
          success: false,
          data: [],
          error: 'Authentication required',
          unauthorized: true
        };
      }
      throw new Error(`Invalid JSON response: ${error.message}`);
    }

    // Check if response indicates success
    if (!response.ok) {
      // Handle 401 specifically
      if (response.status === 401) {
        return {
          success: false,
          data: [],
          error: data.error || data.message || 'Authentication required',
          unauthorized: true
        };
      }
      
      const errorMessage = data.error || 
                          data.message || 
                          data.errorMessage ||
                          data.msg ||
                          `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Return standardized response
    // Handle different response formats
    return {
      success: data.success !== false, // Default to true if not specified
      data: data.data !== undefined ? data.data : (data.content !== undefined ? data : data),
      message: data.message || data.msg,
      error: data.error || data.errorMessage
    };
  }

  /**
   * Generic request method
   */
  async request(endpoint, options = {}) {
    const url = this.buildURL(endpoint);
    const headers = this.getHeaders(options.headers || {});
    
    const config = {
      method: options.method || 'GET',
      headers,
      ...options
    };

    // Add body for POST/PUT/PATCH requests
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    } else if (options.body) {
      config.body = options.body;
      if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    }

    const response = await fetch(url, config);
      return await this.handleResponse(response);
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = this.buildQueryString(params);
    const url = queryString ? `${endpoint}${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default BaseApiService;
