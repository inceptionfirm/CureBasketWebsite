// API Token Helper - For testing and debugging
// Uses tokenManager (in-memory, NOT localStorage)
import tokenManager from '../services/api/tokenManager.js';

/**
 * Set API token manually (for testing)
 * Usage: In browser console, type:
 *   window.setApiToken('your-token-here')
 * 
 * Note: Token is stored in-memory, NOT in localStorage
 */
export const setApiToken = (token) => {
  const result = tokenManager.setToken(token);
  if (result) {
    console.log('💡 Token is stored in-memory (NOT localStorage)');
    console.log('💡 Refresh the page to use the new token');
  }
  return result;
};

/**
 * Get current API token (from in-memory storage)
 */
export const getApiToken = () => {
  return tokenManager.getToken();
};

/**
 * Clear API token (from in-memory storage)
 */
export const clearApiToken = () => {
  tokenManager.clearToken();
};

/**
 * Check if token exists (in-memory)
 */
export const hasApiToken = () => {
  const token = getApiToken();
  if (token) {
    console.log('✅ Token found (in-memory):', token.substring(0, 20) + '...');
    return true;
  } else {
    console.log('❌ No token found');
    console.log('💡 To set a token, use: window.setApiToken("your-token-here")');
    return false;
  }
};

/**
 * Set public API key (in-memory)
 */
export const setPublicApiKey = (key) => {
  return tokenManager.setPublicApiKey(key);
};

/**
 * Get authentication status
 */
export const getAuthStatus = () => {
  return tokenManager.getStatus();
};

// Make functions available globally for easy testing (no console spam)
if (typeof window !== 'undefined') {
  window.setApiToken = setApiToken;
  window.getApiToken = getApiToken;
  window.clearApiToken = clearApiToken;
  window.hasApiToken = hasApiToken;
  window.setPublicApiKey = setPublicApiKey;
  window.getAuthStatus = getAuthStatus;
}

export default {
  setApiToken,
  getApiToken,
  clearApiToken,
  hasApiToken,
  setPublicApiKey,
  getAuthStatus
};
