import apiConfig, { API_BASE_URL } from '../../config/apiConfig.js';

// API Configuration - Centralized API settings
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  // Image base URL (banner/blog/category/medicine assets)
  IMAGE_BASE_URL: apiConfig.IMAGE_BASE_URL || 'https://api.curebasket.com',
  
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
