// Authentication API Service
import BaseApiService from './base.js';
import API_CONFIG from './config.js';

class AuthApiService extends BaseApiService {
  /**
   * Login user
   * POST /auth/login with body { email, password } — no Bearer token required.
   * On success, saves the returned token and user; subsequent API calls use the customer token.
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Response with token and user data
   */
  async login(credentials) {
    const headers = { ...API_CONFIG.DEFAULT_HEADERS, Authorization: null };
    const body = {
      email: (credentials.email ?? '').trim(),
      password: credentials.password ?? ''
    };

    const tryLogin = async (path) =>
      this.request(path, { method: 'POST', body, headers });

    try {
      let response;
      try {
        response = await tryLogin('/auth/login');
      } catch (e) {
        const msg = (e.message || '').toLowerCase();
        const is404 = e.status === 404 || msg.includes('404') || msg.includes('not found');
        if (is404) {
          response = await tryLogin('/customer/login');
        } else {
          throw e;
        }
      }

      if (response.success && response.data) {
        const data = response.data;
        if (data.token) {
          this.setToken(data.token);
        }
        const user = data.user || {
          id: data.userId ?? data.id,
          customerId: data.customerId ?? data.userId ?? data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          name: [data.firstName, data.lastName].filter(Boolean).join(' ') || data.email
        };
        if (user && (user.id != null || user.customerId != null || user.email)) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        return {
          success: true,
          data: {
            token: data.token,
            user
          }
        };
      }

      return {
        success: false,
        error: response.error || response.message || 'Login failed. Please check your credentials.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed. Please check your credentials.'
      };
    }
  }

  /**
   * Logout user — clears in-memory token and localStorage user so next login uses credentials only.
   */
  async logout() {
    this.removeToken();
    localStorage.removeItem('user');
    return { success: true };
  }

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  async getProfile() {
    return this.get('/auth/profile');
  }

  /**
   * Verify token validity
   * @returns {Promise} Token verification response
   */
  async verifyToken() {
    try {
      const response = await this.get('/auth/verify');
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Customer signup
   * POST /customer/signup with Authorization: Bearer <PUBLIC_API_TOKEN> (website user token).
   * Always uses the public API token so signup works even when a customer token is in memory.
   * Body: { email, firstName, lastName, phoneNumber, password }
   * @param {Object} signupData - { email, firstName, lastName, phoneNumber, password }
   * @returns {Promise} Response with user/token data
   */
  async customerSignup(signupData) {
    const publicToken = this.tokenManager.getPublicApiKey();
    if (!publicToken) {
      return {
        success: false,
        error: 'Signup is not configured. Missing public API token (PUBLIC_API_TOKEN in apiConfig or VITE_PUBLIC_API_KEY).'
      };
    }

    const phone = (signupData.phoneNumber ?? signupData.phone ?? '').trim();

    try {
      // Website static JWT only (same as catalog); never send customer Bearer on signup.
      const response = await this.request('/customer/signup', {
        method: 'POST',
        usePublicToken: true,
        body: {
          email: (signupData.email ?? '').trim(),
          firstName: (signupData.firstName ?? '').trim(),
          lastName: (signupData.lastName ?? '').trim(),
          phoneNumber: phone,
          phone,
          password: signupData.password ?? ''
        }
      });

      if (response.success && response.data) {
        // Save token if provided (new customer token)
        if (response.data.token) {
          this.setToken(response.data.token);
        }

        // Save user data
        if (response.data.user || response.data) {
          const userData = response.data.user || response.data;
          localStorage.setItem('user', JSON.stringify(userData));
        }

        return {
          success: true,
          data: {
            token: response.data.token,
            user: response.data.user || response.data
          },
          message: response.message || 'Signup successful'
        };
      }

      return {
        success: false,
        error: response.error || response.message || 'Signup failed. Please check your details and try again.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Signup failed. Please try again.'
      };
    }
  }
}

// Create singleton instance
const authApi = new AuthApiService();

export default authApi;
