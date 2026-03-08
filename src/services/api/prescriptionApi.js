// Prescription API Service
import BaseApiService from './base.js';

class PrescriptionApiService extends BaseApiService {
  /**
   * Get prescriptions for the logged-in customer.
   * GET /customer/view-prescriptions — uses the customer's Bearer token.
   * @returns {Promise} Response with customer's prescriptions array
   */
  async getCustomerPrescriptions() {
    return this.get('/customer/view-prescriptions');
  }

  /**
   * Get all prescriptions
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with prescriptions array
   */
  async getAllPrescriptions(params = {}) {
    const queryParams = {
      itemType: 'PRESCRIPTION',
      ...params
    };
    return this.get('/prescriptions/get-all', queryParams);
  }

  /**
   * Get prescription by ID
   * @param {string|number} id - Prescription ID
   * @returns {Promise} Prescription object
   */
  async getPrescriptionById(id) {
    return this.post(`/prescriptions/get-prescription/${id}`);
  }

  /**
   * Create new prescription (save data first).
   * POST /prescriptions/add-prescription — uses customer Bearer token.
   * Response data includes id; use that id for uploadPrescriptionFiles(itemId, formData).
   * @param {Object} prescriptionData - prescriptionNumber, itemType, patientName, patientId, doctorName, doctorId, note, diagnosis, status, priority
   * @returns {Promise} { success, data: { id, prescriptionNumber, ... } }
   */
  async createPrescription(prescriptionData) {
    return this.post('/prescriptions/add-prescription', prescriptionData);
  }

  /**
   * Update prescription
   * @param {string|number} id - Prescription ID
   * @param {Object} prescriptionData - Updated prescription data
   * @returns {Promise} Updated prescription object
   */
  async updatePrescription(id, prescriptionData) {
    return this.post(`/prescriptions/update-prescription/${id}`, prescriptionData);
  }

  /**
   * Delete prescription
   * @param {string|number} id - Prescription ID
   * @returns {Promise} Success response
   */
  async deletePrescription(id) {
    return this.post(`/prescriptions/delete/${id}`);
  }

  /**
   * Upload prescription files to a prescription item.
   * POST /catalog/upload/file/{itemId}
   * Form: file (multiple), itemType="PRESCRIPTION", documentType="file1, file2, ..."
   * @param {string|number} itemId - Prescription/item ID (e.g. from add-prescription response)
   * @param {FormData} formData - Must include: file(s), itemType, documentType
   * @returns {Promise} Response from upload
   */
  async uploadPrescriptionFiles(itemId, formData) {
    return this.request(`/catalog/upload/file/${itemId}`, {
      method: 'POST',
      body: formData
    });
  }
}

// Create singleton instance
const prescriptionApi = new PrescriptionApiService();

export default prescriptionApi;
