// Home Page API Services
// This file contains all API calls for the home page
// Ready for backend integration

const API_BASE_URL = 'http://localhost:3000/api';

// Generic API helper
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    return await apiCall('/categories');
  },

  // Get active categories only
  getActive: async () => {
    return await apiCall('/categories?status=active');
  },

  // Get category by slug
  getBySlug: async (slug) => {
    return await apiCall(`/categories/${slug}`);
  },

  // Get category products
  getProducts: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/categories/${categoryId}/products?${queryString}`);
  }
};

// Products API
export const productsApi = {
  // Get featured products
  getFeatured: async () => {
    return await apiCall('/products?featured=true');
  },

  // Get products by category
  getByCategory: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/products?category=${categoryId}&${queryString}`);
  },

  // Get product by ID
  getById: async (productId) => {
    return await apiCall(`/products/${productId}`);
  },

  // Search products
  search: async (query, params = {}) => {
    const searchParams = new URLSearchParams({ q: query, ...params });
    return await apiCall(`/products/search?${searchParams}`);
  }
};

// Banners API
export const bannersApi = {
  // Get all banners
  getAll: async () => {
    return await apiCall('/banners');
  },

  // Get active banners
  getActive: async () => {
    return await apiCall('/banners?status=active');
  }
};

// Statistics API
export const statsApi = {
  // Get home page statistics
  getHomeStats: async () => {
    return await apiCall('/stats/home');
  },

  // Get category statistics
  getCategoryStats: async () => {
    return await apiCall('/stats/categories');
  }
};

// Combined home page data service
export const homeApi = {
  // Load all home page data in one call
  loadHomeData: async () => {
    try {
      const [banners, categories, products, stats] = await Promise.all([
        bannersApi.getActive(),
        categoriesApi.getActive(),
        productsApi.getFeatured(),
        statsApi.getHomeStats()
      ]);

      return {
        banners,
        categories,
        products,
        stats,
        success: true
      };
    } catch (error) {
      console.error('Failed to load home data:', error);
      return {
        banners: [],
        categories: [],
        products: [],
        stats: {},
        success: false,
        error: error.message
      };
    }
  }
};

// Mock data for development (remove when API is ready)
export const mockData = {
  categories: [
    { 
      id: 1,
      name: "Prescription Medicines", 
      slug: "prescription-medicines",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300", 
      count: 150, 
      type: "prescription",
      description: "Medicines that require a valid prescription from a licensed doctor",
      parentCategory: null,
      status: "active",
      sortOrder: 1,
      features: ["Doctor Consultation Required", "Licensed Pharmacist Review", "Insurance Coverage Available"]
    },
    { 
      id: 2,
      name: "Over-the-Counter (OTC)", 
      slug: "over-the-counter",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300", 
      count: 200, 
      type: "otc",
      description: "Medicines available without prescription for common ailments",
      parentCategory: null,
      status: "active",
      sortOrder: 2,
      features: ["No Prescription Needed", "Quick Purchase", "Common Ailments"]
    },
    { 
      id: 3,
      name: "Health Supplements", 
      slug: "health-supplements",
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300", 
      count: 75, 
      type: "supplement",
      description: "Vitamins, minerals, and nutritional supplements for wellness",
      parentCategory: null,
      status: "active",
      sortOrder: 3,
      features: ["Vitamins & Minerals", "Nutritional Support", "Wellness Products"]
    },
    { 
      id: 4,
      name: "Medical Equipment", 
      slug: "medical-equipment",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300", 
      count: 120, 
      type: "equipment",
      description: "Medical devices and equipment for home healthcare",
      parentCategory: null,
      status: "active",
      sortOrder: 4,
      features: ["Home Healthcare", "Monitoring Devices", "Medical Tools"]
    },
    { 
      id: 5,
      name: "Chronic Care", 
      slug: "chronic-care",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300", 
      count: 85, 
      type: "chronic",
      description: "Specialized medicines for chronic conditions like diabetes, hypertension",
      parentCategory: null,
      status: "active",
      sortOrder: 5,
      features: ["Diabetes Care", "Heart Health", "Long-term Management"]
    },
    { 
      id: 6,
      name: "Women's Health", 
      slug: "womens-health",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300", 
      count: 60, 
      type: "womens",
      description: "Specialized healthcare products for women's wellness",
      parentCategory: null,
      status: "active",
      sortOrder: 6,
      features: ["Prenatal Care", "Hormonal Health", "Feminine Hygiene"]
    }
  ],
  products: [
    {
      id: 1,
      name: "Paracetamol 500mg",
      price: 12.99,
      originalPrice: 15.99,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      rating: 4.8,
      reviews: 124,
      type: "otc",
      description: "Effective pain relief and fever reducer"
    },
    {
      id: 2,
      name: "Vitamin D3 1000IU",
      price: 24.99,
      originalPrice: 29.99,
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400",
      rating: 4.6,
      reviews: 89,
      type: "supplement",
      description: "Essential vitamin for bone health"
    },
    {
      id: 3,
      name: "Amoxicillin 250mg",
      price: 18.99,
      originalPrice: 22.99,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      rating: 4.7,
      reviews: 156,
      type: "prescription",
      description: "Antibiotic for bacterial infections"
    },
    {
      id: 4,
      name: "Blood Pressure Monitor",
      price: 89.99,
      originalPrice: 109.99,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
      rating: 4.5,
      reviews: 203,
      type: "equipment",
      description: "Digital blood pressure monitoring device"
    }
  ]
};
