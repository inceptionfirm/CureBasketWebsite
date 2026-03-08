// API Token Configuration - Simple initialization
// Token is loaded from apiConfig.js (PUBLIC_API_TOKEN variable)

import tokenManager from '../services/api/tokenManager.js';

/**
 * Initialize API token from config
 * Token is set in: src/config/apiConfig.js (PUBLIC_API_TOKEN variable)
 */
export const initializeApiToken = () => {
  // Token is automatically loaded from apiConfig.js in tokenManager constructor
};

// Auto-initialize when this module is imported
initializeApiToken();

export default {
  initializeApiToken
};
