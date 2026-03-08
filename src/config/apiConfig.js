// API Configuration – static token for public APIs (blog, banner, category, medicine)
// Blog does NOT use customer account – always uses this static token

export const PUBLIC_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ZWJzaXRlVXNlciIsImJ1c2luZXNzSWQiOjIsInVzZXJJZCI6Niwicm9sZUlkIjo0LCJpYXQiOjE3NjgzOTAxMjIsImV4cCI6MTgxMTcwMTgwMH0.ljo22QB9NiTbZxovOJDsBXgU260CEXJ7-nQ8UkkZEC4';

// API Base URL (backend endpoints)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://java.api.curebasket.com/backend';

// Image base URL (for banner/blog/category/medicine images - no /backend)
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://java.api.curebasket.com';

// Export config
export default {
  PUBLIC_API_TOKEN,
  API_BASE_URL,
  IMAGE_BASE_URL
};
