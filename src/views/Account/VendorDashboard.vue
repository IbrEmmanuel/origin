<template>
  <div class="vendor-dashboard">
    <div class="stats-grid">
      <div v-for="stat in statCards" :key="stat.label" class="stat-card glass-card">
        <div class="stat-icon-wrapper" :style="{ color: stat.color }">
          <component :is="stat.icon" class="icon-md" />
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ stat.label }}</p>
          <h3 class="stat-value">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <div class="dashboard-sections mt-8">
      <div class="wide-card glass-card">
        <div class="card-header">
          <h3>Recent Sales Activity</h3>
          <button @click="$emit('switch-tab', 'orders')" class="btn-text">View All Orders</button>
        </div>
        
        <div v-if="stats.recentActivity && stats.recentActivity.length > 0" class="activity-table-wrapper">
          <table class="activity-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in stats.recentActivity" :key="activity.id">
                <td><span class="order-id">#{{ activity.id }}</span></td>
                <td class="product-cell">{{ activity.product_name }}</td>
                <td>{{ activity.qty }}</td>
                <td class="amount">₦{{ (activity.price * activity.qty).toLocaleString() }}</td>
                <td class="date">{{ new Date(activity.created_at).toLocaleDateString() }}</td>
                <td>
                  <span class="status-badge" :class="activity.status.toLowerCase()">{{ activity.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="placeholder-content">
          <p class="text-secondary">Sales charts and recent order logs will appear here once you have transactions.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  Package as ProductIcon, 
  ShoppingBag as OrderIcon, 
  TrendingUp as SalesIcon,
  Zap as ActivityIcon
} from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';

const emit = defineEmits(['switch-tab']);

const stats = ref({
  totalProducts: 0,
  totalSales: 0,
  totalOrders: 0
});

const statCards = ref([
  { label: 'Active Products', value: '0', icon: ProductIcon, color: 'var(--color-blue-primary)' },
  { label: 'Total Orders', value: '0', icon: OrderIcon, color: '#10b981' },
  { label: 'Gross Sales', value: '₦0.00', icon: SalesIcon, color: '#f59e0b' }
]);

const fetchStats = async () => {
  try {
    const data = await vendorService.getDashboardStats();
    stats.value = data;
    
    statCards.value[0].value = data.totalProducts.toString();
    statCards.value[1].value = data.totalOrders.toString();
    statCards.value[2].value = `₦${data.totalSales.toLocaleString()}`;
  } catch (err) {
    console.error('Failed to fetch vendor stats', err);
  }
};

onMounted(fetchStats);
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.stat-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
}

.mt-8 { margin-top: 2rem; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-text {
  background: none;
  border: none;
  color: var(--color-blue-primary);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.placeholder-content {
  padding: 3rem;
  text-align: center;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
}

.icon-md { width: 24px; height: 24px; }

/* Activity Table Styles */
.activity-table-wrapper {
  overflow-x: auto;
  margin: -1.5rem;
  margin-top: 0;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

.activity-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.activity-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.order-id { font-weight: 700; color: var(--color-blue-primary); }
.product-cell { font-weight: 600; max-width: 250px; overflow: hidden; text-overflow: ellipsis; }
.amount { font-weight: 800; color: var(--text-primary); }
.date { color: var(--text-secondary); }

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.status-badge.processing { background: rgba(0, 102, 204, 0.1); color: #0066cc; }
.status-badge.shipped { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.status-badge.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

@media (max-width: 768px) {
  .activity-table td, .activity-table th {
    padding: 0.75rem 1rem;
  }
}
</style>
