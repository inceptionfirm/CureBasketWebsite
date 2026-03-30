// Public API Service - For website visitors (no auth required)
// Base URL: https://api.curebasket.com (PUBLIC_API_TOKEN). getHeaders always uses website static token.
import BaseApiService from './base.js';
import API_CONFIG from './config.js';
import apiConfig from '../../config/apiConfig.js';
import medicineApi from './medicineApi.js';

const IMAGE_BASE = (API_CONFIG.IMAGE_BASE_URL || 'https://api.curebasket.com').replace(/\/$/, '');

/** Build full image URL – if path is already absolute (http/https) use as-is, else prepend IMAGE_BASE */
function toFullImageUrl(path) {
  if (!path || typeof path !== 'string') return null;
  const p = path.trim();
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${IMAGE_BASE}${p.startsWith('/') ? '' : '/'}${p}`;
}

/** Get image URL from files array (e.g. category.files, blog.files) */
function imageUrlFromFiles(files) {
  if (!files || !Array.isArray(files) || files.length === 0) return null;
  const path = files[0].docPath ?? files[0].url ?? files[0].filePath;
  return toFullImageUrl(path);
}

/** Get image URL from banner – try files[0], then top-level docPath/filePath/imageUrl/image */
function imageUrlFromBanner(banner) {
  if (!banner) return null;
  const fromFiles = banner.files?.[0];
  const path =
    fromFiles?.docPath ??
    fromFiles?.url ??
    fromFiles?.filePath ??
    banner.docPath ??
    banner.filePath ??
    banner.imageUrl ??
    banner.image;
  return toFullImageUrl(path);
}

/** Parse createDate e.g. "2026-01-16 11:15:02 IST" for sorting (most recent first) */
function parseBannerDate(dateString) {
  if (!dateString) return new Date(0);
  const clean = String(dateString).replace(/\s*IST\s*$/i, '').trim();
  return new Date(clean) || new Date(0);
}

class PublicApiService extends BaseApiService {
  constructor() {
    super();
  }

  /**
   * Override getHeaders: PUBLIC endpoints (banner, category, medicine, blog) always use
   * the static PUBLIC_API_TOKEN. Customer token is only for prescriptions/customer APIs.
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...customHeaders
    };

    const publicToken = this.tokenManager.getPublicApiKey() || apiConfig.PUBLIC_API_TOKEN || null;
    if (publicToken) {
      headers['Authorization'] = `Bearer ${publicToken}`;
    }
    return headers;
  }

  /**
   * Get website banners: exactly 3 slots by priority.
   * - For priority 1: take the most recent (by createDate) banner → slot 1.
   * - For priority 2: take the most recent banner → slot 2.
   * - For priority 3: take the most recent banner → slot 3.
   * If backend has 4 banners with priority 1, we take the single most recent one for slot 1. Same for 2 and 3.
   * Display order: slot 1 (P1), slot 2 (P2), slot 3 (P3). Uses public/website Bearer token.
   */
  async getActiveBanners() {
    try {
      const publicToken = this.tokenManager.getPublicApiKey();
      const headers = this.getHeaders();
      if (publicToken) {
        headers['Authorization'] = `Bearer ${publicToken}`;
      }
      const queryString = this.buildQueryString({
        itemType: 'BANNER',
        page: 0,
        pageSize: 100,
        sortBy: 'priority',
        sortOrder: 'ASC'
      });
      const response = await this.request(`/banner/get-all${queryString}`, {
        method: 'GET',
        headers
      });
      if (response.unauthorized || !response.success) {
        return { success: true, data: [] };
      }
      const raw = response.data;
      const content = Array.isArray(raw)
        ? raw
        : (Array.isArray(raw?.content) ? raw.content : Array.isArray(raw?.list) ? raw.list : Array.isArray(raw?.items) ? raw.items : []);
      if (content.length === 0) {
        return { success: true, data: [] };
      }
      const statusOk = (b) => String(b.status || '').toUpperCase() === 'ACTIVE';
      const priorityOk = (b) => [1, 2, 3].includes(Number(b.priority));
      const activeBanners = content.filter((b) => statusOk(b) && priorityOk(b));
      const sortByDateDesc = (a, b) => parseBannerDate(b.createDate) - parseBannerDate(a.createDate);
      const byPriority1 = activeBanners.filter((b) => Number(b.priority) === 1).sort(sortByDateDesc);
      const byPriority2 = activeBanners.filter((b) => Number(b.priority) === 2).sort(sortByDateDesc);
      const byPriority3 = activeBanners.filter((b) => Number(b.priority) === 3).sort(sortByDateDesc);
      const websiteBanners = [];
      if (byPriority1.length > 0) websiteBanners.push(byPriority1[0]);
      if (byPriority2.length > 0) websiteBanners.push(byPriority2[0]);
      if (byPriority3.length > 0) websiteBanners.push(byPriority3[0]);
      const placeholder = (slot) => ({
        id: `placeholder-${slot}`,
        priority: slot,
        title: '',
        description: '',
        files: [],
        createDate: null,
        _placeholder: true
      });
      while (websiteBanners.length < 3) {
        websiteBanners.push(placeholder(websiteBanners.length + 1));
      }
      const transformedBanners = websiteBanners.map((banner) => {
        const image = banner._placeholder ? null : (imageUrlFromBanner(banner) || null);
        return {
          ...banner,
          image,
          imageUrl: image,
          title: banner.title || banner.itemName || banner.itemHeading || '',
          description: banner.description || banner.itemDescription || '',
          linkText: banner.linkText || 'Shop Now',
          linkUrl: banner.linkUrl || '/products'
        };
      });
      return { success: true, data: transformedBanners };
    } catch (error) {
      return { success: true, data: [] };
    }
  }

  /**
   * Get single banner: priority 1, latest by createDate (for home hero).
   * Returns one banner with .image as full backend URL, or null if none.
   */
  async getPriority1Banner() {
    const res = await this.getActiveBanners();
    if (!res.success || !Array.isArray(res.data) || res.data.length === 0) {
      return { success: true, data: null };
    }
    const first = res.data[0];
    if (!first || first._placeholder) {
      return { success: true, data: null };
    }
    return { success: true, data: first };
  }

  /**
   * Get active categories (public)
   * GET /catalog/categories?itemType=PRODUCT&status=ACTIVE&page=0&pageSize=50&sortBy=ID&sortOrder=ASC
   * Image: https://api.curebasket.com{files[0].docPath}; only state=ACTIVE shown
   */
  async getActiveCategories(pageSize = 100) {
    try {
      const response = await this.get('/catalog/categories', {
        itemType: 'PRODUCT',
        status: 'ACTIVE',
        state: 'ACTIVE',
        page: 0,
        pageSize: pageSize || 100,
        sortBy: 'ID',
        sortOrder: 'ASC'
      });

      if (response.unauthorized || !response.success) {
        return { success: true, data: { categories: [], pagination: {} } };
      }

      if (response.success && response.data) {
        // Same pattern as getActiveMedicines: support content, categories, result, body, or nested data
        const raw = response.data;
        let rawList;
        if (Array.isArray(raw)) {
          rawList = raw;
        } else if (raw && typeof raw === 'object') {
          rawList =
            raw.content ||
            raw.categories ||
            raw.result ||
            raw.body ||
            (Array.isArray(raw.data) ? raw.data : (raw.data && (raw.data.content || raw.data.categories))) ||
            [];
        } else {
          rawList = [];
        }
        const list = Array.isArray(rawList) ? rawList : [];
        const pageInfo = (raw && typeof raw === 'object' && !Array.isArray(raw))
          ? (raw.pageInfo || raw.pagination || {})
          : {};
        const activeOnly = list.filter((cat) => {
          const s = String(cat.state ?? cat.status ?? '').trim().toUpperCase();
          return s === 'ACTIVE' || s === '';
        });
        const categories = activeOnly.map((cat) => {
          try {
            return {
              id: cat.id,
              name: cat.categoryName ?? cat.name ?? '',
              description: cat.categoryDescription ?? cat.description ?? '',
              status: 'ACTIVE',
              itemType: cat.itemType,
              files: cat.files ?? [],
              image: imageUrlFromFiles(cat.files) ?? cat.image ?? null
            };
          } catch {
            return {
              id: cat.id,
              name: cat.categoryName ?? cat.name ?? '',
              description: cat.categoryDescription ?? cat.description ?? '',
              status: 'ACTIVE',
              itemType: cat.itemType,
              files: [],
              image: cat.image ?? null
            };
          }
        });
        const pagination = {
          pageNumber: pageInfo.pageNumber,
          pageSize: pageInfo.pageSize,
          totalRecords: categories.length,
          totalPages: pageInfo.totalPages
        };

        return {
          success: true,
          data: {
            categories,
            pagination
          }
        };
      }

      return { success: true, data: { categories: [], pagination: {} } };
    } catch (error) {
      return { success: true, data: { categories: [], pagination: {} } };
    }
  }

  /**
   * Get published blogs (public).
   * GET /blog/get-all?itemType=BLOG&status=PUBLISHED&page=0&pageSize=100&sortBy=ID&sortOrder=DESC
   * Fetches all pages if totalRecords > first page content (so all published blogs show).
   * Image: files[0].docPath → https://api.curebasket.com + docPath
   */
  async getPublishedBlogs(requestedPageSize = 100) {
    const pageSize = Math.max(Number(requestedPageSize) || 100, 100);
    const allBlogs = [];
    let page = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        const queryParams = {
          itemType: 'BLOG',
          status: 'PUBLISHED',
          page,
          pageSize,
          sortBy: 'ID',
          sortOrder: 'DESC'
        };
        const response = await this.get('/blog/get-all', queryParams);

        if (response.unauthorized || !response.success) {
          break;
        }

        if (!response.success || !response.data) {
          break;
        }

        const raw = response.data;
        let rawList;
        if (Array.isArray(raw)) {
          rawList = raw;
        } else if (raw && typeof raw === 'object') {
          rawList =
            raw.content ||
            raw.blogs ||
            raw.result ||
            raw.body ||
            (Array.isArray(raw.data) ? raw.data : (raw.data && (raw.data.content || raw.data.blogs))) ||
            [];
        } else {
          rawList = [];
        }

        const list = Array.isArray(rawList) ? rawList : [];
        const published = list.filter((b) => {
          const s = String(b.status ?? '').trim().toUpperCase();
          const enabled = b.enabled;
          return (s === 'PUBLISHED' || s === '') && (enabled !== false);
        });
        const withImages = published.map((blog) => ({
          ...blog,
          imageUrl: imageUrlFromFiles(blog.files) || blog.imageUrl || blog.image || null
        }));
        allBlogs.push(...withImages);

        const pageInfo = raw && typeof raw === 'object' ? (raw.pageInfo || raw.pagination || {}) : {};
        const totalRecords = pageInfo.totalRecords ?? pageInfo.total ?? 0;
        const totalPages = pageInfo.totalPages ?? (pageSize > 0 ? Math.ceil(totalRecords / pageSize) : 0);

        if (list.length === 0) {
          hasMore = false;
        } else if (totalRecords > 0 && allBlogs.length >= totalRecords) {
          hasMore = false;
        } else if (totalPages > 0 && page + 1 >= totalPages) {
          hasMore = false;
        } else if (list.length < pageSize) {
          hasMore = false;
        } else {
          page += 1;
        }
      }

      return { success: true, data: allBlogs };
    } catch (error) {
      return { success: true, data: allBlogs.length ? allBlogs : [] };
    }
  }

  /**
   * Get active medicines (public)
   * When size is not passed: fetch ALL pages (no limit) so 1 lakh+ from backend all show on website.
   * When size is passed (e.g. 12 for Home): single request with that size.
   */
  async getActiveMedicines(params = {}) {
    const pageSize = params.size !== undefined && params.size !== null ? Number(params.size) : 500;
    const fetchAll = params.size === undefined || params.size === null;

    const transformPage = (raw) => {
      const list = Array.isArray(raw) ? raw : [];
      const activeOnly = list.filter((med) => (med.status || '').toUpperCase() === 'ACTIVE');
      return activeOnly.map((med) => {
        const transformed = medicineApi.transformMedicine(med);
        if (transformed.image && !transformed.image.startsWith('http')) {
          transformed.image = `${IMAGE_BASE}${transformed.image.startsWith('/') ? '' : '/'}${transformed.image}`;
        }
        return transformed;
      });
    };

    try {
      if (!fetchAll) {
        const queryParams = {
          page: params.page || 0,
          size: pageSize,
          sortBy: params.sortBy || 'name',
          ...(params.search && { search: params.search }),
          ...(params.dosageForm && { dosageForm: params.dosageForm })
        };
        const response = await this.get('/medicines/getAllMedicines', queryParams);
        if (response.unauthorized || !response.success) {
          return { success: true, data: { medicines: [], pagination: { page: 1, pageSize, total: 0, totalPages: 0 } } };
        }
        const raw = response.data?.content ?? response.data?.medicines ?? response.data?.data ?? [];
        const pageInfo = response.data?.pageInfo ?? response.data?.pagination ?? {};
        const medicines = transformPage(raw);
        return {
          success: true,
          data: {
            medicines,
            pagination: {
              page: (pageInfo.pageNumber ?? params.page ?? 0) + 1,
              pageSize: pageInfo.pageSize ?? pageSize,
              total: pageInfo.totalRecords ?? pageInfo.total ?? medicines.length,
              totalPages: pageInfo.totalPages ?? Math.ceil((pageInfo.totalRecords ?? medicines.length) / pageSize)
            }
          }
        };
      }

      const allMedicines = [];
      let page = 0;
      let totalRecords = 0;
      let hasMore = true;

      while (hasMore) {
        const queryParams = {
          page,
          size: pageSize,
          sortBy: params.sortBy || 'name',
          ...(params.search && { search: params.search }),
          ...(params.dosageForm && { dosageForm: params.dosageForm })
        };
        const response = await this.get('/medicines/getAllMedicines', queryParams);
        if (response.unauthorized || !response.success) break;

        const raw = response.data?.content ?? response.data?.medicines ?? response.data?.data ?? [];
        const pageInfo = response.data?.pageInfo ?? response.data?.pagination ?? {};
        const list = Array.isArray(raw) ? raw : [];
        totalRecords = pageInfo.totalRecords ?? pageInfo.total ?? 0;

        const batch = transformPage(list);
        allMedicines.push(...batch);

        if (list.length < pageSize || (totalRecords > 0 && allMedicines.length >= totalRecords)) {
          hasMore = false;
        } else {
          page += 1;
        }
      }

      return {
        success: true,
        data: {
          medicines: allMedicines,
          pagination: {
            page: 1,
            pageSize: allMedicines.length,
            total: totalRecords || allMedicines.length,
            totalPages: 1
          }
        }
      };
    } catch (error) {
      return {
        success: true,
        data: {
          medicines: [],
          pagination: { page: 1, pageSize: 0, total: 0, totalPages: 0 }
        }
      };
    }
  }

  /**
   * Get single medicine by ID (public – static token)
   */
  async getMedicineById(id) {
    if (!id) return { success: false, data: null };
    try {
      const response = await this.get(`/medicines/getMedicineById/${id}`);
      if (response.unauthorized || !response.success || !response.data) {
        return { success: false, data: null };
      }
      const transformed = medicineApi.transformMedicine(response.data);
      if (transformed.image && !transformed.image.startsWith('http')) {
        transformed.image = `${IMAGE_BASE}${transformed.image.startsWith('/') ? '' : '/'}${transformed.image}`;
      }
      return { success: true, data: transformed };
    } catch {
      return { success: false, data: null };
    }
  }

  /**
   * Get single blog by ID (public – static token)
   */
  async getBlogById(id) {
    if (!id) return { success: false, data: null };
    try {
      const response = await this.post(`/blog/get-blog/${id}`, {});
      if (response.unauthorized || !response.success || !response.data) {
        return { success: false, data: null };
      }
      const blog = response.data;
      const imageUrl = imageUrlFromFiles(blog.files) || blog.imageUrl || blog.image || null;
      return {
        success: true,
        data: { ...blog, imageUrl }
      };
    } catch {
      return { success: false, data: null };
    }
  }

  /**
   * Get single category by ID (public – static token)
   */
  async getCategoryById(id) {
    if (!id) return { success: false, data: null };
    try {
      const response = await this.get(`/catalog/categories/${id}`);
      if (response.unauthorized || !response.success || !response.data) {
        return { success: false, data: null };
      }
      const cat = response.data;
      const image = imageUrlFromFiles(cat.files) ?? cat.image ?? null;
      return {
        success: true,
        data: {
          id: cat.id,
          name: cat.categoryName ?? cat.name ?? '',
          description: cat.categoryDescription ?? cat.description ?? '',
          status: cat.state ?? cat.status,
          itemType: cat.itemType,
          files: cat.files ?? [],
          image,
          ...cat
        }
      };
    } catch {
      return { success: false, data: null };
    }
  }
}

// Create singleton instance
const publicApiService = new PublicApiService();

export default publicApiService;
