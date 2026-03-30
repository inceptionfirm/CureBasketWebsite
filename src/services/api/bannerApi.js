// Banner API Service - GET /banner/get-all (public)
import BaseApiService from './base.js';
import API_CONFIG from './config.js';

const IMAGE_BASE = API_CONFIG.IMAGE_BASE_URL || 'https://api.curebasket.com';

/** Parse createDate e.g. "2026-01-16 11:15:02 IST" for sorting (most recent first) */
function parseBannerDate(dateString) {
  if (!dateString) return new Date(0);
  const clean = String(dateString).replace(/\s*IST\s*$/i, '').trim();
  return new Date(clean) || new Date(0);
}

const PUBLIC = { usePublicToken: true };

class BannerApiService extends BaseApiService {
  /**
   * Get all banners (no status filter; filter client-side for website banners)
   * Query: itemType=BANNER&page=0&pageSize=100&sortBy=priority&sortOrder=ASC
   */
  async getAllBanners(params = {}) {
    const queryParams = {
      itemType: 'BANNER',
      page: 0,
      pageSize: 100,
      sortBy: 'priority',
      sortOrder: 'ASC',
      ...params
    };
    return this.get('/banner/get-all', queryParams, PUBLIC);
  }

  /**
   * Get website banners: up to 3 — one per priority (1, 2, 3), most recent by createDate.
   * Filter: ACTIVE, priority in [1,2,3]. Image not required (use null/placeholder if missing).
   * Order: 1st = P1, 2nd = P2, 3rd = P3.
   */
  async getActiveBanners() {
    try {
      const response = await this.getAllBanners();
      if (response.unauthorized || !response.success) {
        return { success: true, data: [] };
      }
      const content = response.data?.content;
      if (!content || !Array.isArray(content)) {
        return { success: true, data: [] };
      }
      const statusOk = (b) => String(b.status || '').toUpperCase() === 'ACTIVE';
      const priorityOk = (b) => [1, 2, 3].includes(Number(b.priority));
      const activeBanners = content.filter((b) => statusOk(b) && priorityOk(b));
      const sortByDateDesc = (a, b) => parseBannerDate(b.createDate) - parseBannerDate(a.createDate);
      const by1 = activeBanners.filter((b) => Number(b.priority) === 1).sort(sortByDateDesc);
      const by2 = activeBanners.filter((b) => Number(b.priority) === 2).sort(sortByDateDesc);
      const by3 = activeBanners.filter((b) => Number(b.priority) === 3).sort(sortByDateDesc);
      const websiteBanners = [];
      if (by1.length > 0) websiteBanners.push(by1[0]);
      if (by2.length > 0) websiteBanners.push(by2[0]);
      if (by3.length > 0) websiteBanners.push(by3[0]);
      const path = (b) => b.files?.[0]?.docPath;
      const banners = websiteBanners.map((b) => ({
        ...b,
        image: path(b) ? `${IMAGE_BASE}${path(b)}` : (b.image || b.imageUrl || null),
        imageUrl: path(b) ? `${IMAGE_BASE}${path(b)}` : (b.imageUrl || b.image || null)
      }));
      return { success: true, data: banners };
    } catch (error) {
      return { success: true, data: [] };
    }
  }

  /**
   * Get banner by ID
   * @param {string|number} id - Banner ID
   * @returns {Promise} Banner object
   */
  async getBannerById(id) {
    return this.post(`/banner/get-banner/${id}`, {}, PUBLIC);
  }

  /**
   * Create new banner
   * @param {Object} bannerData - Banner data (new structure: itemType, position, type, title, description, status, priority)
   * @returns {Promise} Created banner object
   */
  async createBanner(bannerData) {
    // Build payload with new structure (only 7 fields allowed)
    const payload = {
      itemType: bannerData.itemType || 'BANNER',
      position: bannerData.position || '',
      type: bannerData.type || '',
      title: bannerData.title || bannerData.itemName || bannerData.itemHeading || '',
      description: bannerData.description || bannerData.itemDescription || '',
      status: bannerData.status || (bannerData.active ? 'ACTIVE' : 'INACTIVE'),
      priority: bannerData.priority !== undefined ? bannerData.priority : 0
    };
    
    // Remove null/undefined values (keep empty strings for optional fields)
    Object.keys(payload).forEach(key => {
      if (payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });
    
    return this.post('/banner/add-banner', payload, PUBLIC);
  }

  /**
   * Update banner
   * @param {string|number} id - Banner ID
   * @param {Object} bannerData - Updated banner data
   * @returns {Promise} Updated banner object
   */
  async updateBanner(id, bannerData) {
    return this.post(`/banner/update-banner/${id}`, bannerData, PUBLIC);
  }

  /**
   * Delete banner
   * @param {string|number} id - Banner ID
   * @returns {Promise} Success response
   */
  async deleteBanner(id) {
    return this.post(`/banner/delete/${id}`, {}, PUBLIC);
  }
}

// Create singleton instance
const bannerApi = new BannerApiService();

export default bannerApi;
