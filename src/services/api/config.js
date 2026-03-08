import apiConfig from '../../config/apiConfig.js';

// API Configuration - Centralized API settings
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://java.api.curebasket.com/backend',
  // Image base URL (for banner/blog/category/medicine - no /backend)
  IMAGE_BASE_URL: apiConfig.IMAGE_BASE_URL || 'https://java.api.curebasket.com',
  
  // API Version (if needed)
  VERSION: import.meta.env.VITE_API_VERSION || '',
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Token storage key
  TOKEN_KEY: 'flycanary_token', // Primary token key
  AUTH_TOKEN_KEY: 'authToken', // Alternative token key
  
  // Response format
  RESPONSE_FORMAT: {
    SUCCESS_FIELD: 'success',
    DATA_FIELD: 'data',
    ERROR_FIELD: 'error',
    MESSAGE_FIELD: 'message'
  }
};

export default API_CONFIG;
