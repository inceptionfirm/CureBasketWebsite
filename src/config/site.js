// Site Configuration - Easy to customize for different clients
import { API_BASE_URL } from './apiConfig.js';

export const siteConfig = {
  // Basic site information
  name: 'Cure Basket',
  tagline: 'Your Trusted Pharmaceutical Partner',
  description: 'Premium pharmaceutical products and healthcare solutions',
  
  // Contact information
  contact: {
    phone: '1-833-781-5773',
    email: 'info@curebasket.com',
    address: '123 Healthcare Street, Medical City, MC 12345',
    fax: '',
    hours: 'Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM'
  },
  
  // Social media
  social: {
    facebook: 'https://facebook.com/curebasket',
    twitter: 'https://twitter.com/curebasket',
    instagram: 'https://instagram.com/curebasket',
    linkedin: 'https://linkedin.com/company/curebasket'
  },
  
  // Features
  features: {
    freeShipping: true,
    prescriptionService: true,
    doctorConsultation: true,
    homeDelivery: true,
    emergencyService: true
  },
  
  // Pharmaceutical specific settings
  pharmaceutical: {
    prescriptionRequired: true,
    doctorConsultation: true,
    insuranceAccepted: true,
    genericAvailable: true,
    expiryTracking: true
  },
  
  // API configuration for FlyCanary Admin API
  api: {
    baseUrl: API_BASE_URL,
    version: import.meta.env.VITE_API_VERSION || 'v1',
    endpoints: {
      auth: '/auth',
      users: '/users',
      categories: '/categories',
      medicines: '/medicines',
      blogs: '/blogs',
      banners: '/banners',
      sidebar: '/sidebar',
      dashboard: '/dashboard',
      prescriptions: '/prescriptions'
    }
  },
  
  // Payment methods
  payment: {
    stripe: true,
    paypal: true,
    cod: true,
    insurance: true
  },
  
  // Shipping
  shipping: {
    freeShippingThreshold: 50,
    expressDelivery: true,
    sameDayDelivery: true,
    prescriptionDelivery: true
  }
};

export default siteConfig;
