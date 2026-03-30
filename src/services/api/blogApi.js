// Blog API Service - GET /blog/get-all (public, status=PUBLISHED only)
import BaseApiService from './base.js';
import API_CONFIG from './config.js';

const IMAGE_BASE = API_CONFIG.IMAGE_BASE_URL || 'https://api.curebasket.com';

const PUBLIC = { usePublicToken: true };

class BlogApiService extends BaseApiService {
  /**
   * Get all blogs (query: itemType=BLOG, status=PUBLISHED, sortBy=ID, sortOrder=DESC)
   */
  async getAllBlogs(params = {}) {
    const queryParams = {
      itemType: 'BLOG',
      status: 'PUBLISHED',
      page: params.page ?? 0,
      pageSize: params.pageSize ?? params.size ?? 10,
      sortBy: 'ID',
      sortOrder: 'DESC',
      ...params
    };
    return this.get('/blog/get-all', queryParams, PUBLIC);
  }

  /**
   * Get published blogs (for website); image from files[0].docPath
   */
  async getPublishedBlogs(params = {}) {
    const res = await this.getAllBlogs(params);
    if (!res.success || !res.data) return { success: true, data: [] };
    const raw = res.data.content || res.data.blogs || (Array.isArray(res.data) ? res.data : []);
    const published = raw.filter((b) => (b.status || '').toUpperCase() === 'PUBLISHED');
    const path = (b) => b.files?.[0]?.docPath;
    const blogs = published.map((b) => ({
      ...b,
      imageUrl: path(b) ? `${IMAGE_BASE}${path(b)}` : (b.imageUrl || b.image || null)
    }));
    return { success: true, data: blogs, pageInfo: res.data.pageInfo };
  }

  /**
   * Get blog by ID
   * @param {string|number} id - Blog ID
   * @returns {Promise} Blog object
   */
  async getBlogById(id) {
    return this.post(`/blog/get-blog/${id}`, {}, PUBLIC);
  }

  /**
   * Create new blog
   * @param {Object} blogData - Blog data (new structure: itemType, position, type, title, description, status, priority)
   * @returns {Promise} Created blog object
   */
  async createBlog(blogData) {
    // Build payload with new structure (only 7 fields allowed)
    const payload = {
      itemType: blogData.itemType || 'BLOG',
      position: blogData.position || '',
      type: blogData.type || '',
      title: blogData.title || blogData.itemName || blogData.itemHeading || '',
      description: blogData.description || blogData.content || blogData.itemDescription || '',
      status: blogData.status || (blogData.active ? 'PUBLISHED' : 'DRAFT'),
      priority: blogData.priority !== undefined ? blogData.priority : 0
    };
    
    // Remove null/undefined values (keep empty strings for optional fields)
    Object.keys(payload).forEach(key => {
      if (payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });
    
    return this.post('/blog/add-blog', payload, PUBLIC);
  }

  /**
   * Update blog
   * @param {string|number} id - Blog ID
   * @param {Object} blogData - Updated blog data
   * @returns {Promise} Updated blog object
   */
  async updateBlog(id, blogData) {
    return this.post(`/blog/update-blog/${id}`, blogData, PUBLIC);
  }

  /**
   * Delete blog
   * @param {string|number} id - Blog ID
   * @returns {Promise} Success response
   */
  async deleteBlog(id) {
    return this.post(`/blog/delete/${id}`, {}, PUBLIC);
  }
}

// Create singleton instance
const blogApi = new BlogApiService();

export default blogApi;
