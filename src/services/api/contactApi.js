// Contact Us API - Get and submit contact details
// Requires Bearer token (PUBLIC_API_TOKEN from apiConfig) for getContactUs POST
import BaseApiService from './base.js';

class ContactApiService extends BaseApiService {
  constructor() {
    super();
  }

  /**
   * Get Contact Us details (POST, empty body)
   * Backend: POST /metadata/get/contact-us with Authorization: Bearer <token>
   * Token from tokenManager (PUBLIC_API_TOKEN in apiConfig.js)
   * Returns: phone, email, address, pincode for Contact page
   */
  async getContactUs() {
    try {
      const response = await this.post('/metadata/get/contact-us', {});
      if (response.unauthorized || !response.success) {
        return { success: false, data: null, error: response.error || 'Failed to load contact details' };
      }
      const raw = response.data;
      if (!raw || typeof raw !== 'object') {
        return { success: true, data: null, message: response.message };
      }
      // Normalize so Contact page always gets phone, email, address, pincode, hours (from backend when present)
      const data = {
        phone: raw.phone ?? raw.phoneNumber ?? '',
        email: raw.email ?? raw.emailAddress ?? '',
        address: raw.address ?? '',
        pincode: raw.pincode ?? raw.pinCode ?? raw.zipCode ?? '',
        hours: raw.hours ?? raw.operatingHours ?? ''
      };
      return {
        success: true,
        data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to load contact details'
      };
    }
  }

  /**
   * Submit contact form message (customer "Send message" on Contact page)
   * Backend: POST /metadata/contact-us/send-mail
   * Body: { firstName, lastName, phoneNumber, email, subject, message }
   */
  async submitContactMessage(payload) {
    try {
      const body = {
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        phoneNumber: payload.phoneNumber || '',
        email: payload.email || '',
        subject: payload.subject || '',
        message: payload.message || ''
      };
      const response = await this.post('/metadata/contact-us/send-mail', body);
      if (response.unauthorized || !response.success) {
        return { success: false, error: response.error || 'Failed to send message' };
      }
      return {
        success: true,
        data: response.data,
        message: response.message || 'Message sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send message'
      };
    }
  }

  /**
   * Configure Contact Us details (POST with body)
   * Used by admin or contact form to update contact details
   */
  async configureContactUs(payload) {
    try {
      const body = {
        phone: payload.phone != null ? Number(payload.phone) : undefined,
        email: payload.email || '',
        address: payload.address || '',
        pincode: payload.pincode != null ? String(payload.pincode) : undefined
      };
      const response = await this.post('/metadata/configure/contact-us', body);
      if (response.unauthorized || !response.success) {
        return { success: false, error: response.error || 'Failed to update contact details' };
      }
      return {
        success: true,
        data: response.data,
        message: response.message || 'Contact details updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update contact details'
      };
    }
  }
}

const contactApi = new ContactApiService();
export default contactApi;
