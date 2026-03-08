// Main API Service - Exports all API services
import authApi from './authApi.js';
import medicineApi from './medicineApi.js';
import bannerApi from './bannerApi.js';
import categoryApi from './categoryApi.js';
import blogApi from './blogApi.js';
import prescriptionApi from './prescriptionApi.js';
import publicApiService from './publicApiService.js';
import contactApi from './contactApi.js';
import cartApi from './cartApi.js';
import BaseApiService from './base.js';

// Create a unified API service that combines all endpoints
class ApiService extends BaseApiService {
  constructor() {
    super();
    
    // Include all API services
    this.auth = authApi;
    this.medicines = medicineApi;
    this.banners = bannerApi;
    this.categories = categoryApi;
    this.blogs = blogApi;
    this.prescriptions = prescriptionApi;
    this.contact = contactApi;
    this.cart = cartApi;
  }

  // Authentication methods
  async login(credentials) {
    return this.auth.login(credentials);
  }

  async logout() {
    return this.auth.logout();
  }

  async customerSignup(signupData) {
    return this.auth.customerSignup(signupData);
  }

  // Medicine methods
  async getMedicines(params = {}) {
    return this.medicines.getAllMedicines(params);
  }

  async getMedicine(id) {
    return this.medicines.getMedicineById(id);
  }

  async createMedicine(medicineData) {
    return this.medicines.createMedicine(medicineData);
  }

  async updateMedicine(id, medicineData) {
    return this.medicines.updateMedicine(id, medicineData);
  }

  async deleteMedicine(id) {
    return this.medicines.deleteMedicine(id);
  }

  async getMedicineManufacturers() {
    return this.medicines.getAllManufacturers();
  }

  async getMedicineForms() {
    return this.medicines.getAllMedicineForms();
  }

  async searchMedicines(query, limit = 10) {
    return this.medicines.searchMedicines(query, limit);
  }

  async getLowStockMedicines(threshold = 10) {
    return this.medicines.getLowStockMedicines(threshold);
  }

  // Banner methods
  async getActiveBanners() {
    return this.banners.getActiveBanners();
  }

  async getAllBanners(params = {}) {
    return this.banners.getAllBanners(params);
  }

  // Category methods
  async getCategories(params = {}) {
    return this.categories.getAllCategories(params);
  }

  async getCategory(id) {
    return this.categories.getCategoryById(id);
  }

  async createCategory(categoryData) {
    return this.categories.createCategory(categoryData);
  }

  async updateCategory(id, categoryData) {
    return this.categories.updateCategory(id, categoryData);
  }

  async deleteCategory(id) {
    return this.categories.deleteCategory(id);
  }

  // Banner methods (additional)
  async getBanner(id) {
    return this.banners.getBannerById(id);
  }

  async createBanner(bannerData) {
    return this.banners.createBanner(bannerData);
  }

  async updateBanner(id, bannerData) {
    return this.banners.updateBanner(id, bannerData);
  }

  async deleteBanner(id) {
    return this.banners.deleteBanner(id);
  }

  // Blog methods
  async getBlogs(params = {}) {
    return this.blogs.getAllBlogs(params);
  }

  async getBlog(id) {
    return this.blogs.getBlogById(id);
  }

  async createBlog(blogData) {
    return this.blogs.createBlog(blogData);
  }

  async updateBlog(id, blogData) {
    return this.blogs.updateBlog(id, blogData);
  }

  async deleteBlog(id) {
    return this.blogs.deleteBlog(id);
  }

  // Prescription methods
  async getPrescriptions(params = {}) {
    return this.prescriptions.getAllPrescriptions(params);
  }

  /** Get prescriptions for the logged-in customer (GET /customer/view-prescriptions). */
  async getCustomerPrescriptions() {
    return this.prescriptions.getCustomerPrescriptions();
  }

  async getPrescription(id) {
    return this.prescriptions.getPrescriptionById(id);
  }

  async createPrescription(prescriptionData) {
    return this.prescriptions.createPrescription(prescriptionData);
  }

  async updatePrescription(id, prescriptionData) {
    return this.prescriptions.updatePrescription(id, prescriptionData);
  }

  async deletePrescription(id) {
    return this.prescriptions.deletePrescription(id);
  }

  /** Upload prescription files: POST /catalog/upload/file/{itemId} (multipart). */
  async uploadPrescriptionFiles(itemId, formData) {
    return this.prescriptions.uploadPrescriptionFiles(itemId, formData);
  }

  // Public API methods (for website visitors)
  async getPublicBanners() {
    return publicApiService.getActiveBanners();
  }

  /** Single banner: priority 1, latest by createDate (for home hero). */
  async getPublicPriority1Banner() {
    return publicApiService.getPriority1Banner();
  }

  async getPublicCategories(pageSize = 8) {
    return publicApiService.getActiveCategories(pageSize);
  }

  async getPublicMedicines(params = {}) {
    return publicApiService.getActiveMedicines(params);
  }

  async getPublicBlogs(pageSize = 10) {
    return publicApiService.getPublishedBlogs(pageSize);
  }

  async getPublicMedicineById(id) {
    return publicApiService.getMedicineById(id);
  }

  async getPublicBlogById(id) {
    return publicApiService.getBlogById(id);
  }

  async getPublicCategoryById(id) {
    return publicApiService.getCategoryById(id);
  }

  // Contact Us methods
  async getContactUs() {
    return this.contact.getContactUs();
  }

  async configureContactUs(payload) {
    return this.contact.configureContactUs(payload);
  }

  async submitContactMessage(payload) {
    return this.contact.submitContactMessage(payload);
  }

  // Cart methods (use customerId from user.id after login)
  async getCartByCustomer(customerId) {
    return this.cart.getCartByCustomer(customerId);
  }

  async addToCartApi(customerId, medicineId, itemQuantity = 1) {
    return this.cart.addToCart(customerId, medicineId, itemQuantity);
  }

  async updateCartItemApi(cartItemId, itemQuantity) {
    return this.cart.updateCartItem(cartItemId, itemQuantity);
  }

  async removeCartItemApi(cartItemId) {
    return this.cart.removeCartItem(cartItemId);
  }

  async clearCartApi(customerId) {
    return this.cart.clearCart(customerId);
  }

  async buyCartApi() {
    return this.cart.buyCart();
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export individual services as well
export { authApi, medicineApi, bannerApi, categoryApi, blogApi, prescriptionApi, publicApiService, contactApi, cartApi };
export default apiService;
