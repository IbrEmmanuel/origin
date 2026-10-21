<template>
  <div class="ads">
    <div class="glass-card section-card">
      <div class="section-head">
        <div>
          <h3>Advertising</h3>
          <p class="text-secondary">
            Create sponsored placements and track impressions, clicks, conversions, and ROAS.
            Metrics are aggregate only — no individual customer identities are shown.
          </p>
        </div>
        <button type="button" class="btn primary-btn" @click="showForm = !showForm" :disabled="!available">
          {{ showForm ? 'Cancel' : 'New campaign' }}
        </button>
      </div>

      <div v-if="!available" class="notice notice-warn">
        Advertising API not deployed. Required vendor-scoped routes under
        <code>/vendor/ads/campaigns</code> and <code>/vendor/ads/analytics</code>.
        Until then, this tab is configuration-ready and will light up when the backend is available.
      </div>

      <form v-if="showForm && available" class="campaign-form" @submit.prevent="saveCampaign">
        <div class="grid-2">
          <label class="field">
            <span>Name</span>
            <input v-model="form.name" class="form-input" required maxlength="120" />
          </label>
          <label class="field">
            <span>Type</span>
            <select v-model="form.type" class="form-input">
              <option value="sponsored_product">Sponsored product</option>
              <option value="banner">Promotional banner</option>
            </select>
          </label>
          <label class="field">
            <span>Budget (₦)</span>
            <input v-model.number="form.budget" type="number" min="0" step="1000" class="form-input" required />
          </label>
          <label class="field">
            <span>Daily cap (₦, optional)</span>
            <input v-model.number="form.daily_cap" type="number" min="0" step="500" class="form-input" />
          </label>
          <label class="field">
            <span>Start date</span>
            <input v-model="form.starts_at" type="date" class="form-input" required />
          </label>
          <label class="field">
            <span>End date</span>
            <input v-model="form.ends_at" type="date" class="form-input" required />
          </label>
          <label class="field" v-if="form.type === 'sponsored_product'">
            <span>Product ID</span>
            <input v-model="form.product_id" class="form-input" placeholder="Marketplace product id" />
          </label>
          <label class="field" v-else>
            <span>Banner image URL</span>
            <input v-model="form.banner_url" class="form-input" placeholder="https://…" />
          </label>
        </div>
        <label class="field">
          <span>Targeting notes (first-party segments only)</span>
          <textarea v-model="form.targeting_notes" class="form-input" rows="2" placeholder="e.g. category:solar, cart abandoners (consented)" />
        </label>
        <div class="actions-inline">
          <button type="submit" class="btn primary-btn" :disabled="saving">
            {{ saving ? 'Saving…' : 'Create campaign' }}
          </button>
        </div>
      </form>
    </div>

    <div class="glass-card section-card mt-4" v-if="available">
      <div class="section-head">
        <h3>Performance</h3>
        <div class="filters">
          <input type="date" v-model="range.from" class="form-input sm" @change="loadAnalytics" />
          <span class="sep">→</span>
          <input type="date" v-model="range.to" class="form-input sm" @change="loadAnalytics" />
        </div>
      </div>

      <div v-if="analytics" class="kpi-grid">
        <div class="kpi" v-for="k in kpiCards" :key="k.label">
          <span class="kpi-label">{{ k.label }}</span>
          <strong class="kpi-value">{{ k.value }}</strong>
        </div>
      </div>
      <div v-else class="state">No analytics yet.</div>

      <div v-if="chartBars.length" class="chart">
        <div v-for="bar in chartBars" :key="bar.label" class="chart-row">
          <span class="chart-label">{{ bar.label }}</span>
          <div class="chart-track"><div class="chart-fill" :style="{ width: bar.pct + '%' }"></div></div>
          <span class="chart-val">{{ bar.value }}</span>
        </div>
      </div>
    </div>

    <div class="glass-card section-card mt-4" v-if="available">
      <h3>Campaigns</h3>
      <div v-if="loading" class="state">Loading…</div>
      <div v-else-if="!campaigns.length" class="state">No campaigns yet.</div>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Budget</th>
              <th>Schedule</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in campaigns" :key="c.id">
              <td>
                <strong>{{ c.name }}</strong>
                <span class="sponsored-tag">Sponsored</span>
              </td>
              <td>{{ formatType(c.type) }}</td>
              <td>₦{{ Number(c.budget || 0).toLocaleString() }}</td>
              <td class="muted">{{ c.starts_at || '—' }} → {{ c.ends_at || '—' }}</td>
              <td><span class="badge" :class="c.status">{{ c.status }}</span></td>
              <td class="row-actions">
                <button
                  v-for="action in actionsFor(c)"
                  :key="action"
                  type="button"
                  class="linkish"
                  @click="setStatus(c, action)"
                >
                  {{ action }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="glass-card section-card mt-4" v-if="available && segments.length">
      <h3>Audience segments</h3>
      <p class="text-secondary mb">Aggregated first-party interest buckets (consent-aware). No PII.</p>
      <ul class="segment-list">
        <li v-for="s in segments" :key="s.id || s.key">
          <strong>{{ s.name || s.key }}</strong>
          <span class="muted">{{ s.size_label || s.count || '—' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import adsService from '@/services/ads.service';

const available = ref(true);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const campaigns = ref([]);
const analytics = ref(null);
const segments = ref([]);

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const range = ref({
  from: iso(new Date(today.getFullYear(), today.getMonth(), 1)),
  to: iso(today)
});

const form = ref({
  name: '',
  type: 'sponsored_product',
  budget: 50000,
  daily_cap: null,
  starts_at: iso(today),
  ends_at: iso(new Date(today.getTime() + 14 * 86400000)),
  product_id: '',
  banner_url: '',
  targeting_notes: ''
});

const formatType = (t) =>
  t === 'banner' ? 'Banner' : t === 'sponsored_product' ? 'Sponsored product' : t || '—';

const kpiCards = computed(() => {
  const a = analytics.value || {};
  const impressions = a.impressions ?? 0;
  const clicks = a.clicks ?? 0;
  const conversions = a.conversions ?? 0;
  const spend = a.spend ?? 0;
  const revenue = a.attributed_revenue ?? a.revenue ?? 0;
  const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) + '%' : '—';
  const cpc = clicks ? '₦' + Math.round(spend / clicks).toLocaleString() : '—';
  const cpa = conversions ? '₦' + Math.round(spend / conversions).toLocaleString() : '—';
  const convRate = clicks ? ((conversions / clicks) * 100).toFixed(2) + '%' : '—';
  const roas = spend ? (revenue / spend).toFixed(2) + 'x' : '—';
  return [
    { label: 'Impressions', value: Number(impressions).toLocaleString() },
    { label: 'Clicks', value: Number(clicks).toLocaleString() },
    { label: 'CTR', value: ctr },
    { label: 'CPC', value: cpc },
    { label: 'Conversions', value: Number(conversions).toLocaleString() },
    { label: 'Conv. rate', value: convRate },
    { label: 'CPA', value: cpa },
    { label: 'Spend', value: '₦' + Number(spend).toLocaleString() },
    { label: 'Attr. revenue', value: '₦' + Number(revenue).toLocaleString() },
    { label: 'ROAS', value: roas }
  ];
});

const chartBars = computed(() => {
  const series = analytics.value?.series || analytics.value?.daily || [];
  if (!Array.isArray(series) || !series.length) return [];
  const max = Math.max(...series.map((s) => Number(s.clicks || s.value || 0)), 1);
  return series.slice(-14).map((s) => ({
    label: s.date || s.label || '',
    value: Number(s.clicks || s.value || 0).toLocaleString(),
    pct: Math.round((Number(s.clicks || s.value || 0) / max) * 100)
  }));
});

const actionsFor = (c) => {
  const s = String(c.status || '').toLowerCase();
  if (s === 'draft') return ['submit', 'archive'];
  if (s === 'pending' || s === 'pending_approval') return ['archive'];
  if (s === 'active' || s === 'approved') return ['pause', 'archive'];
  if (s === 'paused') return ['resume', 'archive'];
  if (s === 'scheduled') return ['pause', 'archive'];
  return ['archive'];
};

const loadCampaigns = async () => {
  loading.value = true;
  try {
    const res = await adsService.listCampaigns();
    available.value = res.available;
    if (!res.available) {
      campaigns.value = [];
      return;
    }
    const data = res.data;
    campaigns.value = Array.isArray(data) ? data : data?.campaigns || [];
  } catch (e) {
    alert(e.response?.data?.message || 'Failed to load campaigns');
  } finally {
    loading.value = false;
  }
};

const loadAnalytics = async () => {
  if (!available.value) return;
  try {
    const res = await adsService.getAnalytics({ from: range.value.from, to: range.value.to });
    if (res.available) analytics.value = res.data;
  } catch {
    analytics.value = null;
  }
};

const loadSegments = async () => {
  if (!available.value) return;
  try {
    const res = await adsService.getAudienceSegments();
    if (res.available) {
      const data = res.data;
      segments.value = Array.isArray(data) ? data : data?.segments || [];
    }
  } catch {
    segments.value = [];
  }
};

const saveCampaign = async () => {
  saving.value = true;
  try {
    const payload = { ...form.value, status: 'draft' };
    const res = await adsService.createCampaign(payload);
    if (!res.available) {
      available.value = false;
      return;
    }
    showForm.value = false;
    form.value.name = '';
    await loadCampaigns();
  } catch (e) {
    alert(e.response?.data?.message || 'Could not create campaign');
  } finally {
    saving.value = false;
  }
};

const setStatus = async (campaign, action) => {
  const map = {
    submit: 'pending_approval',
    pause: 'paused',
    resume: 'active',
    archive: 'archived'
  };
  const status = map[action] || action;
  try {
    await adsService.setCampaignStatus(campaign.id, status);
    await loadCampaigns();
  } catch (e) {
    alert(e.response?.data?.message || 'Status update failed');
  }
};

onMounted(async () => {
  await loadCampaigns();
  if (available.value) {
    await Promise.all([loadAnalytics(), loadSegments()]);
  }
});
</script>

<style scoped>
.section-card { padding: 1.5rem; }
.section-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  align-items: flex-start;
}
.section-head h3 { margin: 0 0 0.35rem; }
.text-secondary { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }
.mb { margin-bottom: 0.75rem; }
.notice {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  line-height: 1.5;
}
.notice-warn { background: #fff4ea; color: #9a4d00; border: 1px solid #ffd2a8; }
.campaign-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; }
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.85rem;
}
.field { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; }
.form-input {
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font: inherit;
}
.form-input.sm { width: auto; }
.filters { display: flex; align-items: center; gap: 0.4rem; }
.sep { color: var(--text-muted); }
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.65rem;
  margin-bottom: 1rem;
}
.kpi {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem;
}
.kpi-label { display: block; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.25rem; }
.kpi-value { font-size: 1.05rem; }
.chart { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.5rem; }
.chart-row { display: grid; grid-template-columns: 72px 1fr 48px; gap: 0.5rem; align-items: center; font-size: 0.75rem; }
.chart-track { height: 8px; background: var(--bg-secondary); border-radius: 99px; overflow: hidden; }
.chart-fill { height: 100%; background: var(--color-primary); }
.chart-val { text-align: right; color: var(--text-secondary); }
.table-wrap { overflow-x: auto; margin-top: 0.75rem; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table th, .data-table td {
  text-align: left;
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
.sponsored-tag {
  display: inline-block;
  margin-left: 0.4rem;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  vertical-align: middle;
}
.badge {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
  background: var(--bg-secondary);
}
.badge.active, .badge.approved { background: #e8f5e9; color: #2e7d32; }
.badge.paused, .badge.draft { background: #fff8e1; color: #f57f17; }
.badge.archived { background: var(--bg-secondary); color: var(--text-muted); }
.badge.pending, .badge.pending_approval { background: #eef2ff; color: #1a56db; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  font-family: inherit;
}
.primary-btn { background: var(--color-primary); color: #fff; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.linkish {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  margin-right: 0.5rem;
  text-transform: capitalize;
}
.actions-inline { display: flex; gap: 0.5rem; }
.state { padding: 1.5rem; text-align: center; color: var(--text-secondary); }
.muted { color: var(--text-muted); font-size: 0.8rem; }
.segment-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem; }
.segment-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}
.mt-4 { margin-top: 1.25rem; }
</style>
