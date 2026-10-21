import api from './api';

/**
 * Advertising API — vendor-scoped campaigns & aggregate analytics.
 * Backend must enforce vendor ownership on every route.
 * Soft-handles 404 so UI can show a clear “API not deployed” state.
 */
const soft = async (fn) => {
  try {
    const data = await fn();
    return { ok: true, available: true, data };
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 501) {
      return { ok: false, available: false, data: null, error };
    }
    throw error;
  }
};

const adsService = {
  async listCampaigns(params = {}) {
    return soft(async () => (await api.get('/vendor/ads/campaigns', { params })).data);
  },

  async getCampaign(id) {
    return soft(async () => (await api.get(`/vendor/ads/campaigns/${id}`)).data);
  },

  async createCampaign(payload) {
    return soft(async () => (await api.post('/vendor/ads/campaigns', payload)).data);
  },

  async updateCampaign(id, payload) {
    return soft(async () => (await api.put(`/vendor/ads/campaigns/${id}`, payload)).data);
  },

  async setCampaignStatus(id, status) {
    return soft(async () => (await api.patch(`/vendor/ads/campaigns/${id}/status`, { status })).data);
  },

  async getAnalytics(params = {}) {
    return soft(async () => (await api.get('/vendor/ads/analytics', { params })).data);
  },

  async getAudienceSegments() {
    return soft(async () => (await api.get('/vendor/ads/audience-segments')).data);
  },

  async recordImpression(campaignId, meta = {}) {
    try {
      await api.post('/vendor/ads/events', { type: 'impression', campaign_id: campaignId, ...meta });
    } catch { /* non-blocking */ }
  },

  async recordClick(campaignId, meta = {}) {
    try {
      await api.post('/vendor/ads/events', { type: 'click', campaign_id: campaignId, ...meta });
    } catch { /* non-blocking */ }
  }
};

export default adsService;
