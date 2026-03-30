// Category API Service - GET /catalog/categories (public)
import BaseApiService from './base.js';
import API_CONFIG from './config.js';

const IMAGE_BASE = API_CONFIG.IMAGE_BASE_URL || 'https://api.curebasket.com';

function imageUrlFromFiles(files) {
  const path = files?.[0]?.docPath;
  return path ? `${IMAGE_BASE}${path}` : null;
}

const PUBLIC = { usePublicToken: true };

class CategoryApiService extends BaseApiService {
  /**
   * Get all active categories
   * Query: itemType=PRODUCT, status=ACTIVE, page=0, pageSize=50, sortBy=ID, sortOrder=ASC
   * Only state=ACTIVE; image from files[0].docPath
   */
  async getAllCategories(params = {}) {
    try {
      const queryParams = {
        itemType: 'PRODUCT',
        status: 'ACTIVE',
        page: params.page || 0,
        pageSize: params.pageSize || 50,
        sortBy: 'ID',
        sortOrder: 'ASC',
        ...params
      };
      const response = await this.get('/catalog/categories', queryParams, PUBLIC);
      if (response.unauthorized || !response.success) {
        return { success: true, data: { categories: [], pagination: {} } };
      }
      if (response.success && response.data) {
        const raw = response.data.content || response.data.categories || (Array.isArray(response.data) ? response.data : []);
        const activeOnly = raw.filter((cat) => String(cat.state ?? cat.status ?? '').toUpperCase() === 'ACTIVE');
        const categories = activeOnly.map((cat) => ({
          ...cat,
          id: cat.id,
          name: cat.categoryName ?? cat.name ?? '',
          description: cat.categoryDescription ?? cat.description ?? '',
          image: imageUrlFromFiles(cat.files) ?? cat.image ?? null
        }));
        const pagination = response.data.pageInfo || response.data.pagination || {};
        return {
          success: true,
          data: { categories, pagination }
        };
      }
      return { success: true, data: { categories: [], pagination: {} } };
    } catch (error) {
      return { success: true, data: { categories: [], pagination: {} } };
    }
  }

  /**
   * Get category by ID
   * @param {string|number} id - Category ID
   * @returns {Promise} Category object
   */
  async getCategoryById(id) {
    return this.get(`/catalog/categories/${id}`, {}, PUBLIC);
  }

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @returns {Promise} Created category object
   */
  async createCategory(categoryData) {
    return this.post('/catalog/add-category', categoryData, PUBLIC);
  }

  /**
   * Update category
   * @param {string|number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} Updated category object
   */
  async updateCategory(id, categoryData) {
    return this.post(`/catalog/update-category/${id}`, categoryData, PUBLIC);
  }

  /**
   * Delete category
   * @param {string|number} id - Category ID
   * @returns {Promise} Success response
   */
  async deleteCategory(id) {
    return this.post(`/catalog/delete-category/${id}`, {}, PUBLIC);
  }
}

// Create singleton instance
const categoryApi = new CategoryApiService();

export default categoryApi;
