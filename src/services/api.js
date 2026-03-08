// Main API Service - Backward compatible wrapper for dynamic API
// This file maintains compatibility while using the new dynamic API structure
import apiService from './api/index.js';

// Export the new dynamic API service as default
export default apiService;

// Also export individual services for direct access
export { authApi, medicineApi } from './api/index.js';
