// Token Manager - Persists user auth token in localStorage so login survives refresh/navigation

import apiConfig from '../../config/apiConfig.js';

const AUTH_TOKEN_KEY = 'token';

class TokenManager {
  constructor() {
    this.publicApiKey = null;
    // Restore user token from localStorage so API calls work after refresh
    this.token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

    // Load public API key from config (priority: config > env > null)
    const configToken = apiConfig.PUBLIC_API_TOKEN || '';
    const envToken = import.meta.env.VITE_PUBLIC_API_KEY || '';
    this.publicApiKey = configToken || envToken || null;

    if (typeof window !== 'undefined') {
      window.setApiToken = (token) => this.setToken(token);
      window.getApiToken = () => this.getToken();
      window.clearApiToken = () => this.clearToken();
      window.setPublicApiKey = (key) => this.setPublicApiKey(key);
    }
  }

  /**
   * Set authentication token (memory + localStorage so login persists)
   * @param {string} token - JWT token
   */
  setToken(token) {
    if (token && typeof token === 'string') {
      this.token = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      return true;
    }
    return false;
  }

  /**
   * Get current authentication token
   * @returns {string|null} Token or null
   */
  getToken() {
    return this.token;
  }

  /**
   * Clear authentication token (memory + localStorage)
   */
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  /**
   * Set public API key (in memory)
   * @param {string} key - Public API key
   */
  setPublicApiKey(key) {
    if (key && typeof key === 'string') {
      this.publicApiKey = key;
      return true;
    }
    return false;
  }

  /**
   * Get public API key
   * @returns {string|null} Public API key or null
   */
  getPublicApiKey() {
    // First check in-memory, then environment variable
    return this.publicApiKey || import.meta.env.VITE_PUBLIC_API_KEY || null;
  }

  /**
   * Check if token exists
   * @returns {boolean}
   */
  hasToken() {
    return !!this.token;
  }

  /**
   * Check if public API key exists
   * @returns {boolean}
   */
  hasPublicApiKey() {
    return !!this.getPublicApiKey();
  }

  /**
   * Get authorization header value
   * Priority: User token > Public API key > null
   * @returns {string|null} Authorization header value (without "Bearer " prefix)
   */
  getAuthToken() {
    if (this.token) {
      return this.token;
    }
    if (this.getPublicApiKey()) {
      return this.getPublicApiKey();
    }
    return null;
  }

  /**
   * Check authentication status
   * @returns {object} Status object
   */
  getStatus() {
    const token = this.getToken();
    const publicKey = this.getPublicApiKey();
    const authToken = this.getAuthToken();

    return {
      hasToken: !!token,
      hasPublicKey: !!publicKey,
      hasAuth: !!authToken,
      token: token ? `${token.substring(0, 20)}...` : null,
      publicKey: publicKey ? `${publicKey.substring(0, 10)}...` : null,
      authToken: authToken ? `${authToken.substring(0, 20)}...` : null
    };
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

// Export singleton
export default tokenManager;
