import api from './api';
import { mediaUrl } from '@/utils/mediaUrl';

function parseMoney(value) {
  if (typeof value === 'number') return value;
  if (value == null) return 0;
  const n = Number(String(value).replace(/[₦,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function normalizeOrder(raw = {}) {
  const id = raw.id ?? raw.order_id ?? raw.orderId;
  const status = String(raw.status || raw.order_status || 'Pending');
  const totalRaw = raw.total ?? raw.total_amount ?? raw.amount ?? 0;
  const items = (raw.items || raw.order_items || []).map((item) => ({
    name: item.name || item.product_name || 'Item',
    qty: item.qty ?? item.quantity ?? 1,
    price:
      typeof item.price === 'string'
        ? item.price
        : `₦${Number(item.price || item.unit_price || 0).toLocaleString()}`,
    image: item.image || item.image_url || item.product_image || null
  }));

  return {
    id: typeof id === 'string' && id.startsWith('ORD-') ? id : `ORD-${id}`,
    rawId: String(id).replace(/^ORD-/, ''),
    date: raw.date || raw.created_at || raw.ordered_at || '',
    status,
    total:
      typeof totalRaw === 'string' && totalRaw.includes('₦')
        ? totalRaw
        : `₦${parseMoney(totalRaw).toLocaleString()}`,
    totalAmount: parseMoney(totalRaw),
    items
  };
}

function buildStatsFromOrders(orders = []) {
  const pending = orders.filter((o) => /pending|unpaid/i.test(o.status)).length;
  const spent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  return {
    stats: [
      { label: 'Total Orders', value: String(orders.length), icon: 'OrderIcon', color: 'var(--color-primary)' },
      { label: 'Pending', value: String(pending), icon: 'PendingIcon', color: '#f59e0b' },
      { label: 'Total Spent', value: `₦${spent.toLocaleString()}`, icon: 'BalanceIcon', color: 'var(--color-success)' }
    ],
    recentOrders: orders.slice(0, 5).map((o) => ({
      id: o.rawId || o.id,
      date: o.date ? new Date(o.date).toLocaleDateString() : '—',
      total: o.total,
      status: o.status
    }))
  };
}

/** Strip null coords / empty postal so API validators don't 500. */
export function sanitizeCheckoutPayload(raw = {}) {
  const items = (raw.items || []).map((item) => ({
    id: Number(item.id),
    quantity: Math.max(1, Number(item.quantity) || 1)
  }));

  const payload = {
    items,
    delivery_street: String(raw.delivery_street || '').trim(),
    delivery_city: String(raw.delivery_city || '').trim(),
    delivery_state: String(raw.delivery_state || '').trim(),
    delivery_country: String(raw.delivery_country || 'Nigeria').trim() || 'Nigeria',
    contact_phone: String(raw.contact_phone || '').trim(),
    delivery_fee: Number(raw.delivery_fee)
  };

  if (!Number.isFinite(payload.delivery_fee) || payload.delivery_fee < 0) {
    payload.delivery_fee = 0;
  }

  const postal = String(raw.delivery_postal_code || raw.postalCode || '').trim();
  if (postal) payload.delivery_postal_code = postal;

  const lat = raw.latitude != null ? Number(raw.latitude) : null;
  const lng = raw.longitude != null ? Number(raw.longitude) : null;
  if (lat != null && Number.isFinite(lat)) payload.latitude = lat;
  if (lng != null && Number.isFinite(lng)) payload.longitude = lng;

  return payload;
}

const userService = {
  async getDashboard() {
    try {
      const { data } = await api.get('/user/dashboard');
      if (data?.stats) return data;
    } catch (err) {
      if (![404, 501].includes(err.response?.status)) throw err;
    }

    const orders = await this.getOrders();
    return buildStatsFromOrders(orders);
  },

  async getOrders() {
    const { data } = await api.get('/user/orders');
    const list = Array.isArray(data) ? data : data?.orders || data?.items || [];
    return list.map(normalizeOrder);
  },

  async getOrder(orderId) {
    const id = String(orderId).replace(/^ORD-/, '');
    const { data } = await api.get(`/user/orders/${id}`);
    if (data?.items || data?.status || data?.id) {
      return {
        ...data,
        id: data.id ?? id,
        items: (data.items || data.order_items || []).map((item) => ({
          id: item.id,
          product_id: item.product_id || item.productId,
          name: item.name || item.product_name || 'Item',
          qty: item.qty ?? item.quantity ?? 1,
          price:
            typeof item.price === 'string'
              ? item.price
              : `₦${Number(item.price || item.unit_price || 0).toLocaleString()}`,
          image: item.image || item.image_url || item.product_image || null,
          is_rated: item.is_rated
        })),
        subtotal: data.subtotal || data.sub_total || data.total,
        delivery_fee: data.delivery_fee || data.shipping_fee || '₦0',
        total: data.total || data.total_amount,
        delivery_address: data.delivery_address || data.address || '—',
        contact_phone: data.contact_phone || data.phone || '—',
        date: data.date || data.created_at || '',
        status: data.status || 'Pending'
      };
    }
    return data;
  },

  async cancelOrder(orderId, reason = 'not_paid') {
    const id = String(orderId).replace(/^ORD-/, '');
    const { data } = await api.post(`/user/orders/${id}/cancel`, { reason });
    return data;
  },

  async verifyPayment(reference, orderId) {
    const id = String(orderId).replace(/^ORD-/, '');
    // Send both shapes — API versions differ on orderId vs order_id
    const { data } = await api.post('/user/verify-payment', {
      reference,
      orderId: id,
      order_id: id
    });
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/user/profile');
    return data;
  },

  async updateProfile(payload) {
    const { data } = await api.put('/user/profile', payload);
    return data;
  },

  async calculateShipping(payload) {
    const { data } = await api.post('/user/calculate-shipping', payload);
    return data;
  },

  async checkout(payload) {
    const { data } = await api.post('/user/checkout', sanitizeCheckoutPayload(payload));
    return data;
  },

  async getReferrals() {
    try {
      const { data } = await api.get('/user/referrals');
      return data;
    } catch (err) {
      if ([404, 501].includes(err.response?.status)) {
        return { count: 0, code: '', link: '', rewards: 0 };
      }
      throw err;
    }
  },

  getImageUrl(path) {
    return mediaUrl(path);
  }
};

export default userService;
