// Medicine API Service - GET /medicines/getAllMedicines (public)
import BaseApiService from './base.js';
import API_CONFIG from './config.js';

const IMAGE_BASE = API_CONFIG.IMAGE_BASE_URL || 'https://api.curebasket.com';

/** Backend MedicineDTO.medicineFaq has { serialId, question, answer }; normalize to { q, question, a, answer } for UI */
function normalizeMedicineFaq(medicineFaq) {
  if (!medicineFaq || !Array.isArray(medicineFaq)) return [];
  return medicineFaq.map((faq) => ({
    serialId: faq.serialId,
    q: faq.question ?? faq.q,
    question: faq.question ?? faq.q,
    a: faq.answer ?? faq.a,
    answer: faq.answer ?? faq.a
  }));
}

const PUBLIC = { usePublicToken: true };

class MedicineApiService extends BaseApiService {
  /**
   * Get all medicines with pagination
   * GET /medicines/getAllMedicines?page=0&size=1000&sortBy=name
   * Headers: Accept, Authorization Bearer, Content-Type application/json
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (starts from 0, default: 0)
   * @param {number} params.size - Items per page (default: 10; use 1000 for large list)
   * @param {string} params.sortBy - Field to sort by (e.g., "name", "price")
   * @param {string} params.search - Search query
   * @param {string} params.manufacturer - Filter by manufacturer
   * @param {string} params.dosageForm - Filter by form (Tablet, Capsule, etc.)
   * @param {boolean} params.active - Filter by active status
   * @returns {Promise} Response with medicines array and pagination info
   */
  async getAllMedicines(params = {}) {
    const {
      page = 0,
      size = 10,
      sortBy,
      search,
      manufacturer,
      dosageForm,
      active,
      ...otherParams
    } = params;

    const queryParams = {
      page,
      size,
      ...(sortBy && { sortBy }),
      ...(search && { search }),
      ...(manufacturer && { manufacturer }),
      ...(dosageForm && { dosageForm }),
      ...(active !== undefined && { active }),
      ...otherParams
    };

    try {
      const response = await this.get('/medicines/getAllMedicines', queryParams, PUBLIC);

      // Handle unauthorized response gracefully
      if (response.unauthorized || !response.success) {
        return {
          success: true,
          data: {
            medicines: [],
            pagination: {
              page: page + 1,
              pageSize: size,
              total: 0,
              totalPages: 0
            }
          }
        };
      }

      // Transform response to match frontend expectations (only ACTIVE on website)
      if (response.success && response.data) {
        const raw = response.data.content || response.data.medicines || response.data || [];
        const activeOnly = Array.isArray(raw)
          ? raw.filter((med) => (med.status || '').toUpperCase() === 'ACTIVE')
          : [];
        const medicines = activeOnly.map((med) => this.transformMedicine(med));
        const pageInfo = response.data.pageInfo || response.data.pagination || {};

        return {
          success: true,
          data: {
            medicines,
            pagination: {
              page: pageInfo.pageNumber !== undefined ? pageInfo.pageNumber + 1 : page + 1,
              pageSize: pageInfo.pageSize || size,
              total: pageInfo.totalRecords ?? pageInfo.total ?? medicines.length,
              totalPages: pageInfo.totalPages ?? Math.ceil((pageInfo.totalRecords ?? medicines.length) / size)
            }
          }
        };
      }

      // Return empty data if no success
      return {
        success: true,
        data: {
          medicines: [],
          pagination: {
            page: page + 1,
            pageSize: size,
            total: 0,
            totalPages: 0
          }
        }
      };
    } catch {
      // Return empty data instead of throwing
      return {
        success: true,
        data: {
          medicines: [],
          pagination: {
            page: page + 1,
            pageSize: size,
            total: 0,
            totalPages: 0
          }
        }
      };
    }
  }

  /**
   * Get medicine by ID
   * @param {string|number} id - Medicine ID
   * @returns {Promise} Medicine object
   */
  async getMedicineById(id) {
    const response = await this.get(`/medicines/getMedicineById/${id}`, {}, PUBLIC);

    if (response.success && response.data) {
      return {
        success: true,
        data: this.transformMedicine(response.data)
      };
    }

    return response;
  }

  /**
   * Create new medicine
   * @param {Object} medicineData - Medicine data
   * @returns {Promise} Created medicine object
   */
  async createMedicine(medicineData) {
    return this.post('/medicines/createMedicine', medicineData, PUBLIC);
  }

  /**
   * Update medicine
   * @param {string|number} id - Medicine ID
   * @param {Object} medicineData - Updated medicine data
   * @returns {Promise} Updated medicine object
   */
  async updateMedicine(id, medicineData) {
    return this.post(`/medicines/updateMedicine/${id}`, medicineData, PUBLIC);
  }

  /**
   * Delete medicine
   * @param {string|number} id - Medicine ID
   * @returns {Promise} Success response
   */
  async deleteMedicine(id) {
    return this.get(`/medicines/deleteMedicine/${id}`, {}, PUBLIC);
  }

  /**
   * Get all manufacturers
   * @returns {Promise} Array of manufacturer names
   */
  async getAllManufacturers() {
    const response = await this.get('/medicines/getAllManufacturers', {}, PUBLIC);

    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      };
    }

    return response;
  }

  /**
   * Get all medicine forms
   * @returns {Promise} Array of medicine form names
   */
  async getAllMedicineForms() {
    const response = await this.get('/medicines/getAllMedicineForms', {}, PUBLIC);

    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      };
    }

    return response;
  }

  /**
   * Search medicines
   * @param {string} query - Search query
   * @param {number} limit - Maximum results (default: 10)
   * @returns {Promise} Array of matching medicines
   */
  async searchMedicines(query, limit = 10) {
    const response = await this.getAllMedicines({
      search: query,
      size: limit,
      page: 0
    });

    return response;
  }

  /**
   * Get low stock medicines
   * @param {number} threshold - Stock threshold (default: 10)
   * @returns {Promise} Array of low stock medicines
   */
  async getLowStockMedicines(threshold = 10) {
    const response = await this.getAllMedicines({
      size: 100, // Get more items to filter
      page: 0
    });

    if (response.success && response.data) {
      const lowStock = response.data.medicines.filter(
        med => med.stock !== undefined && med.stock <= threshold
      );

      return {
        success: true,
        data: lowStock
      };
    }

    return response;
  }

  /**
   * Transform API medicine object to frontend format
   * Image URL: https://api.curebasket.com{image} when image is a path
   */
  transformMedicine(apiMedicine) {
    const isActive = apiMedicine.status === 'ACTIVE' || apiMedicine.active === true;
    const imgPath = apiMedicine.image;
    const image = !imgPath ? null
      : (imgPath.startsWith('http') ? imgPath : `${IMAGE_BASE}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`);

    return {
      id: String(apiMedicine.id),
      name: apiMedicine.name || '',
      description: apiMedicine.description || apiMedicine.genericName || '',
      price: apiMedicine.price || 0,
      image,
      stock: apiMedicine.stockQuantity || apiMedicine.stock || 0,
      manufacturer: apiMedicine.manufacturer || '',
      category: apiMedicine.category || apiMedicine.dosageForm || '',
      categoryId: apiMedicine.categoryId ?? apiMedicine.category_id ?? null,
      form: apiMedicine.medicineForm || apiMedicine.dosageForm || apiMedicine.form || '',
      medicineForm: apiMedicine.medicineForm || apiMedicine.dosageForm || apiMedicine.form || '',
      prescriptionRequired: apiMedicine.prescriptionRequired || false,
      status: isActive ? 'active' : 'inactive',
      genericName: apiMedicine.genericName,
      genericFor: apiMedicine.genericFor || apiMedicine.brandName || apiMedicine.brand,
      // Backend MedicineDTO: medicineSalt; we expose as activeIngredient for UI
      activeIngredient: apiMedicine.medicineSalt ?? apiMedicine.activeIngredient ?? apiMedicine.salt ?? apiMedicine.saltComposition,
      medicineSalt: apiMedicine.medicineSalt,
      strength: apiMedicine.strength,
      sku: apiMedicine.sku,
      barcode: apiMedicine.barcode,
      expiryDate: apiMedicine.expiryDate,
      countryOfOrigin: apiMedicine.countryOfOrigin,
      createdAt: apiMedicine.createdAt,
      updatedAt: apiMedicine.updatedAt,
      precautions: apiMedicine.precautions,
      sideEffects: apiMedicine.sideEffects,
      howToUse: apiMedicine.howToUse ?? apiMedicine.dosage ?? apiMedicine.usage,
      // Backend MedicineDTO: medicineFaq (MedicineFAQ: serialId, question, answer); we expose as faqs for UI
      faqs: normalizeMedicineFaq(apiMedicine.medicineFaq ?? apiMedicine.faqs),
      reviewsCount: apiMedicine.reviewsCount ?? apiMedicine.reviews ?? 0,
      rating: apiMedicine.rating ?? 0,
      availableDosages: apiMedicine.availableDosages || apiMedicine.dosages || apiMedicine.packages,
      originalPrice: apiMedicine.originalPrice
    };
  }
}

// Create singleton instance
const medicineApi = new MedicineApiService();

export default medicineApi;
