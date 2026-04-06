<template>
  <div class="overview-grid">
    <div v-for="stat in stats" :key="stat.label" class="stat-card glass-card">
      <div class="stat-icon-wrapper" :style="{ backgroundColor: stat.color + '15', color: stat.color }">
        <component :is="stat.icon" class="icon-md" />
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>
    
    <!-- Navigation Cards Section -->
    <div class="nav-cards">
      <router-link to="/energy-ai" class="nav-item-card glass-card">
        <div class="nav-icon ai-soft-bg">
          <SparklesIcon class="icon-sm" />
        </div>
        <div class="nav-info">
          <h3>Energy AI</h3>
          <p>Smart savings and analysis.</p>
        </div>
        <ArrowRightIcon class="icon-xs arrow" />
      </router-link>

      <router-link to="/account/market" class="nav-item-card glass-card">
        <div class="nav-icon market-soft-bg">
          <ShoppingBagIcon class="icon-sm" />
        </div>
        <div class="nav-info">
          <h3>Marketplace</h3>
          <p>Premium energy hardware.</p>
        </div>
        <ArrowRightIcon class="icon-xs arrow" />
      </router-link>
    </div>

    <!-- Recent Orders Section -->
    <div class="wide-card glass-card">
      <div class="card-header">
        <h3>Recent Orders</h3>
        <router-link to="/account/orders" class="text-link">View All</router-link>
      </div>
      <div class="orders-table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td class="order-id">#{{ order.id }}</td>
              <td>{{ order.date }}</td>
              <td class="order-total">{{ order.total }}</td>
              <td>
                <span class="status-badge" :class="order.status.toLowerCase()">
                  {{ order.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  ShoppingBag as OrderIcon, 
  Clock as PendingIcon, 
  Wallet as BalanceIcon,
  Sparkles as SparklesIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowRight as ArrowRightIcon,
  Zap as ZapIcon,
  Layout as LayoutIcon
} from 'lucide-vue-next';

const stats = ref([
  { label: 'Total Orders', value: '0', icon: OrderIcon, color: '#0066cc' },
  { label: 'Pending Orders', value: '0', icon: PendingIcon, color: '#f59e0b' },
  { label: 'Total Spent', value: '₦0', icon: BalanceIcon, color: '#10b981' }
]);

const recentOrders = ref([]);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      
      // Update stats and preserve the Lucide icons
      stats.value = data.stats.map(s => {
        let icon = OrderIcon;
        if (s.icon === 'PendingIcon') icon = PendingIcon;
        if (s.icon === 'BalanceIcon') icon = BalanceIcon;
        
        return {
          ...s,
          icon
        };
      });

      recentOrders.value = data.recentOrders;
    } else {
      console.error('Failed to fetch dashboard data');
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
});
</script>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}

.stat-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.wide-card {
  grid-column: 1 / -1;
  padding: var(--space-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.text-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-blue-primary);
  text-decoration: none;
}

/* Orders Table Style */
.orders-table-wrapper {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.orders-table th {
  padding: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-color);
}

.orders-table td {
  padding: 12px;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border-color);
}

.order-id { font-weight: 700; color: var(--color-blue-primary); }
.order-total { font-weight: 700; }

.status-badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.status-badge.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge.shipped { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

.activity-list {
  margin-top: var(--space-xs);
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-dot {
  width: 8px;
  height: 8px;
  background: var(--color-blue-primary);
  border-radius: 50%;
  margin-top: 6px;
}

.activity-title {
  font-weight: 600;
  font-size: 0.9rem;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.icon-md { width: 28px; height: 28px; }

/* Navigation Cards Styling */
.nav-cards {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-top: calc(-1 * var(--space-xs));
}

.nav-item-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  text-decoration: none;
  transition: all 0.2s ease-out;
  border: 1px solid var(--border-color);
}

.nav-item-card:hover {
  border-color: var(--color-blue-primary);
  background: var(--bg-primary);
  transform: translateY(-2px);
}

.nav-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-soft-bg { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
.market-soft-bg { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.nav-info h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.nav-info p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.arrow {
  margin-left: auto;
  color: var(--text-secondary);
  opacity: 0.5;
  transition: all 0.2s;
}

.nav-item-card:hover .arrow {
  opacity: 1;
  color: var(--color-blue-primary);
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .nav-cards {
    grid-template-columns: 1fr;
  }
}
</style>
