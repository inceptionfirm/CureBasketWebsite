// API Configuration – static token for public APIs (blog, banner, category, medicine)
// Blog does NOT use customer account – always uses this static token

export const PUBLIC_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ZWJzaXRlVXNlciIsImJ1c2luZXNzSWQiOjMsInVzZXJJZCI6NCwicm9sZUlkIjo0LCJpYXQiOjE3NzQ3ODg1NzUsImV4cCI6MTgwNjQ1MTIwMH0.8pSSy2-ZbqxlZvar017lRDhmsTp_60Gqq56x8oeilNc';

// Default: https://api.curebasket.com (signup/login show this host in Network, not localhost).
// If local dev hits CORS issues, set VITE_API_BASE_URL=/api and run Vite proxy (vite.config.js).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.curebasket.com';

// Image base URL (banner/blog/category/medicine asset URLs)
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://api.curebasket.com';

// Export config
export default {
  PUBLIC_API_TOKEN,
  API_BASE_URL,
  IMAGE_BASE_URL
};
