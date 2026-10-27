import api from './api';

/** Normalize products list responses from the Origin marketplace API. */
export function normalizeProductsResponse(res) {
  if (!res) return { products: [], total: 0, totalPages: 1, page: 1, limit: 0 };
  const products = Array.isArray(res.products)
    ? res.products
    : Array.isArray(res)
      ? res
      : [];
  return {
    products,
    total: Number(res.total ?? products.length) || products.length,
    totalPages: Number(res.totalPages) || 1,
    page: Number(res.page) || 1,
    limit: Number(res.limit) || products.length
  };
}

/** Normalize categories — API may return [], { value: [] }, or slug→name map. */
export function normalizeCategories(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.value)) return res.value;
  if (typeof res === 'object') {
    return Object.entries(res)
      .filter(([key]) => !['Count', 'count', 'total', 'value'].includes(key))
      .map(([slug, name]) => ({
        id: slug,
        slug,
        name: typeof name === 'string' ? name : slug
      }));
  }
  return [];
}

const marketplaceService = {
  async getProducts(params = {}) {
    try {
      const response = await api.get('/marketplace/products', { params });
      return response.data;
    } catch (error) {
      console.error('Marketplace fetch error:', error);
      throw error;
    }
  },

  async getProduct(id) {
    const response = await api.get(`/marketplace/products/${id}`);
    return response.data;
  },

  async checkEligibility(id) {
    const response = await api.get(`/marketplace/products/${id}/eligibility`);
    return response.data;
  },

  async submitReview(id, data) {
    const response = await api.post(`/marketplace/products/${id}/reviews`, data);
    return response.data;
  },

  async submitComment(id, data) {
    const response = await api.post(`/marketplace/products/${id}/comments`, data);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/marketplace/categories');
    return response.data;
  },

  /**
   * Server-side cart validation (stock + price).
   * POST /marketplace/cart/validate { items: [{ id, quantity }] }
   * Returns validated lines or throws. Soft-fails if endpoint missing.
   */
  async validateCart(items) {
    try {
      const response = await api.post('/marketplace/cart/validate', {
        items: items.map((i) => ({ id: i.id, quantity: i.quantity }))
      });
      return { ok: true, data: response.data, available: true };
    } catch (error) {
      if (error.response?.status === 404) {
        return { ok: true, data: null, available: false };
      }
      throw error;
    }
  },

  /** First-party analytics event (product_view, add_to_cart, purchase, etc.) */
  async trackEvent(payload) {
    try {
      await api.post('/marketplace/events', payload);
      return true;
    } catch {
      return false;
    }
  }
};

export default marketplaceService;
