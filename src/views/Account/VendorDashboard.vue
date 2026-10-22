<template>
  <div class="vendor-dash">
    <div v-if="loading" class="state">
      <span class="loader"></span>
      <p>Loading store metrics…</p>
    </div>

    <template v-else>
      <div v-if="error" class="banner">{{ error }}</div>

      <div class="stats">
        <article v-for="stat in statCards" :key="stat.label" class="stat">
          <div class="stat-icon" :style="{ color: stat.color }">
            <component :is="stat.icon" />
          </div>
          <div>
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">{{ stat.value }}</p>
          </div>
        </article>
      </div>

      <div class="quick">
        <button type="button" class="quick-btn" @click="$emit('switch-tab', 'products')">Manage products</button>
        <button type="button" class="quick-btn" @click="$emit('switch-tab', 'bulk')">Bulk upload</button>
        <button type="button" class="quick-btn" @click="$emit('switch-tab', 'orders')">Sales orders</button>
        <button type="button" class="quick-btn" @click="$emit('switch-tab', 'wallet')">Wallet</button>
      </div>

      <section class="panel">
        <div class="panel-head">
          <h3>Recent sales</h3>
          <button type="button" class="text-btn" @click="$emit('switch-tab', 'orders')">View all</button>
        </div>

        <div v-if="activities.length" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in activities" :key="activity.id">
                <td><strong>#{{ activity.id }}</strong></td>
                <td>{{ activity.product_name }}</td>
                <td>{{ activity.qty }}</td>
                <td>₦{{ Number((activity.price || 0) * (activity.qty || 0)).toLocaleString() }}</td>
                <td>{{ formatDate(activity.created_at) }}</td>
                <td><span class="pill" :class="statusClass(activity.status)">{{ activity.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty">
          <p>No sales yet. Add products or run a bulk import to start selling.</p>
          <button type="button" class="btn primary" @click="$emit('switch-tab', 'bulk')">Start bulk upload</button>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  Package as ProductIcon,
  ShoppingBag as OrderIcon,
  TrendingUp as SalesIcon
} from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';

defineEmits(['switch-tab']);

const loading = ref(true);
const error = ref('');
const activities = ref([]);
const statCards = ref([
  { label: 'Active products', value: '0', icon: ProductIcon, color: 'var(--color-primary)' },
  { label: 'Total orders', value: '0', icon: OrderIcon, color: 'var(--color-success)' },
  { label: 'Gross sales', value: '₦0', icon: SalesIcon, color: '#f59e0b' }
]);

const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
};

const statusClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (s.includes('deliver') || s.includes('complete') || s.includes('paid')) return 'ok';
  if (s.includes('cancel') || s.includes('fail')) return 'err';
  if (s.includes('ship') || s.includes('process')) return 'info';
  return 'warn';
};

const fetchStats = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await vendorService.getDashboardStats();
    statCards.value[0].value = String(data.totalProducts ?? data.total_products ?? 0);
    statCards.value[1].value = String(data.totalOrders ?? data.total_orders ?? 0);
    const sales = data.totalSales ?? data.total_sales ?? 0;
    statCards.value[2].value = `₦${Number(sales).toLocaleString()}`;
    activities.value = data.recentActivity || data.recent_activity || [];
  } catch (err) {
    console.error('Failed to fetch vendor stats', err);
    error.value = err.response?.data?.message || 'Could not load vendor dashboard stats.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStats);
</script>

<style scoped>
.vendor-dash {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.state,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.loader {
  width: 26px;
  height: 26px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.banner {
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: var(--status-warn-bg);
  color: var(--status-warn-fg);
  border: 1px solid var(--status-warn-border);
  font-size: 0.88rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
}

.stat {
  padding: 1rem;
  border-radius: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.stat-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.stat-label {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.stat-value {
  margin: 0.2rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 3.5vw, 1.4rem);
  font-weight: 500;
  color: var(--text-primary);
}

.quick {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
}

.quick-btn {
  min-height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
}

.quick-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.panel {
  padding: 1rem;
  border-radius: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
}

.panel-head h3 {
  margin: 0;
  font-size: 1.05rem;
}

.text-btn {
  border: none;
  background: none;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
}

.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
  font-size: 0.88rem;
}

th,
td {
  text-align: left;
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.pill {
  display: inline-flex;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: capitalize;
}

.pill.ok { background: var(--status-ok-bg); color: var(--status-ok-fg); }
.pill.warn { background: var(--status-warn-bg); color: var(--status-warn-fg); }
.pill.err { background: var(--status-err-bg); color: var(--status-err-fg); }
.pill.info { background: var(--status-info-bg); color: var(--status-info-fg); }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.1rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.btn.primary {
  background: var(--color-primary);
  color: #fff;
}

@media (max-width: 520px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .stat {
    flex-direction: row;
    align-items: center;
  }
}

@media (min-width: 900px) {
  .quick {
    grid-template-columns: repeat(4, 1fr);
  }

  .stat {
    flex-direction: row;
    align-items: center;
  }
}
</style>
