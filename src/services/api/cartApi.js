/**
 * Cart API Service – customer website cart flow
 *
 * Backend Cart DTO mapping (CatalogItem / CartDTOs.Cart):
 * - itemText1 = medicineId, itemText2 = customerId, itemText3 = itemQuantity
 * - itemText4 = orderStatus (IN_CART | SHIPPED), itemText5 = orderId
 * - Cart has: id, medicineId, customerId, itemQuantity, orderStatus, orderId, medicine (MedicineDTO)
 *
 * Endpoints (customer login Bearer token only):
 * - GET  /customer/cart/view-cart             → view cart
 * - POST /customer/cart/add-to-cart?medicineId=&quantity=
 * - POST /customer/cart/update/{cartItemId}?quantity=  → update quantity only
 * - POST /customer/cart/delete/{cartItemId}   → remove item
 * - POST /customer/cart/buy                   → place order from cart (customer from Bearer token)
 */

import BaseApiService from './base.js';
import API_CONFIG from './config.js';

const IMAGE_BASE = (API_CONFIG.IMAGE_BASE_URL || 'https://java.api.curebasket.com').replace(/\/$/, '');

/** Build full image URL for medicine.image path */
function toFullImageUrl(path) {
  if (!path || typeof path !== 'string') return null;
  const p = path.trim();
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${IMAGE_BASE}${p.startsWith('/') ? '' : '/'}${p}`;
}

/**
 * Transform backend Cart[] to frontend cart items for Cart page.
 * Each Cart has id (cart row id), medicineId, itemQuantity, medicine (MedicineDTO).
 * We return { id: cart.id, medicineId, quantity, name, price, image, ... } so update/remove use cart id.
 */
function cartResponseToItems(cartList) {
  if (!cartList || !Array.isArray(cartList)) return [];
  return cartList.map((cart) => {
    const med = cart.medicine || {};
    const img = med.image ? toFullImageUrl(med.image) : null;
    return {
      id: cart.id,
      medicineId: cart.medicineId,
      quantity: Number(cart.itemQuantity) || 1,
      name: med.name || '',
      description: med.description || '',
      price: med.price ?? 0,
      image: img,
      manufacturer: med.manufacturer || '',
      prescriptionRequired: med.prescriptionRequired || false,
      stock: med.stock ?? 0,
      originalPrice: med.originalPrice,
      sku: med.sku,
      category: med.category
    };
  });
}

/**
 * Merge cart items by medicineId so same medicine shows once with total quantity.
 * Returns { merged: items with one row per medicineId, duplicateIds: cart line ids to remove on backend }.
 */
export function mergeCartByMedicineId(items) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { merged: [], duplicateIds: [] };
  }
  const byKey = new Map();
  const duplicateIds = [];
  for (const item of items) {
    const key = item.medicineId ?? item.id;
    const existing = byKey.get(key);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + (item.quantity || 1);
      duplicateIds.push(item.id);
    } else {
      byKey.set(key, { ...item, quantity: item.quantity || 1 });
    }
  }
  return { merged: Array.from(byKey.values()), duplicateIds };
}

class CartApiService extends BaseApiService {
  /**
   * Headers for customer cart endpoints: use only the logged-in user's JWT.
   * When no token, pass Authorization: null so base does NOT add the static PUBLIC_API_TOKEN (backend would 401).
   */
  customerAuthHeaders() {
    const token = this.tokenManager.getToken();
    if (!token) return { Authorization: null };
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * View cart for logged-in customer.
   * GET /customer/cart/view-cart
   */
  async getCartByCustomer(customerId) {
    if (!customerId) return { success: true, data: [] };
    try {
      const response = await this.request('/customer/cart/view-cart', {
        method: 'GET',
        headers: this.customerAuthHeaders()
      });
      if (response.unauthorized || !response.success) {
        return { success: true, data: [] };
      }
      const raw = response.data;
      const list = Array.isArray(raw) ? raw : (raw?.cartList ?? raw?.content ?? raw?.items ?? raw?.cart ?? []);
      const cartItems = cartResponseToItems(list);
      return { success: true, data: cartItems, raw: list };
    } catch (e) {
      return { success: false, data: [], error: e.message };
    }
  }

  /**
   * Add item to cart (customer from Bearer token – customer login token only).
   * POST /customer/cart/add-to-cart?medicineId=&quantity=
   */
  async addToCart(customerId, medicineId, itemQuantity = 1) {
    if (!medicineId) return { success: false, error: 'medicineId required' };
    const quantity = Number(itemQuantity) || 1;
    const qs = this.buildQueryString({ medicineId: Number(medicineId), quantity });
    try {
      const response = await this.request(`/customer/cart/add-to-cart${qs}`, {
        method: 'POST',
        headers: this.customerAuthHeaders()
      });
      if (response.unauthorized || !response.success) {
        return { success: false, error: response.error || 'Failed to add to cart' };
      }
      return { success: true, data: response.data, message: response.message };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Update cart item quantity only (customer can only change quantity; no other fields).
   * POST /customer/cart/update/{cartItemId}?quantity=
   */
  async updateCartItem(cartItemId, itemQuantity) {
    if (!cartItemId) return { success: false, error: 'cartItemId required' };
    const quantity = Number(itemQuantity) || 1;
    const qs = this.buildQueryString({ quantity });
    try {
      const response = await this.request(`/customer/cart/update/${cartItemId}${qs}`, {
        method: 'POST',
        headers: this.customerAuthHeaders()
      });
      if (response.unauthorized || !response.success) {
        return { success: false, error: response.error || 'Failed to update cart' };
      }
      return { success: true, data: response.data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Remove one item from cart (don’t want medicine → delete).
   * POST /customer/cart/delete/{cartItemId}
   */
  async removeCartItem(cartItemId) {
    if (!cartItemId) return { success: false, error: 'cartItemId required' };
    try {
      const response = await this.request(`/customer/cart/delete/${cartItemId}`, {
        method: 'POST',
        headers: this.customerAuthHeaders()
      });
      if (response.unauthorized || !response.success) {
        return { success: false, error: response.error || 'Failed to remove item' };
      }
      return { success: true, data: response.data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Clear all cart items (uses delete per item if backend has no clear-all; optional).
   */
  async clearCart(customerId) {
    if (!customerId) return { success: true };
    const res = await this.getCartByCustomer(customerId);
    if (!res.success || !Array.isArray(res.data) || res.data.length === 0) return { success: true };
    for (const item of res.data) {
      await this.removeCartItem(item.id);
    }
    return { success: true };
  }

  /**
   * Place order from current cart (buy).
   * POST /customer/cart/buy – customer from Bearer token.
   */
  async buyCart() {
    try {
      const response = await this.request('/customer/cart/buy', {
        method: 'POST',
        headers: this.customerAuthHeaders()
      });
      if (response.unauthorized || !response.success) {
        return { success: false, error: response.error || 'Failed to place order' };
      }
      return { success: true, data: response.data, message: response.message };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

const cartApi = new CartApiService();
export default cartApi;
export { cartResponseToItems };
