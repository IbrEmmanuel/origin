<template>
  <div class="vendor-orders-pipeline">
    <!-- Status Pipeline Tabs -->
    <div class="pipeline-navigation">
      <div class="pipeline-scroll">
        <button 
          v-for="status in statusTabs" 
          :key="status.id"
          :class="['pipeline-tab', { active: activeStatus === status.id }]"
          @click="activeStatus = status.id"
        >
          <span class="tab-label">{{ status.label }}</span>
          <span v-if="getCount(status.id) > 0" class="tab-badge">{{ getCount(status.id) }}</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="shimmer-container">
        <div v-for="i in 3" :key="i" class="shimmer-card"></div>
      </div>
    </div>

    <div v-else-if="filteredOrders.length > 0" class="pipeline-content">
      <div class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-pipeline-item glass-card">
          <div class="order-main">
            <div class="order-id-section">
              <div class="id-icon">
                <HashIcon class="icon-xs" />
              </div>
              <div class="id-details">
                <span class="id-num">{{ order.id }}</span>
                <span class="placed-date">{{ formatDate(order.created_at) }}</span>
              </div>
            </div>

            <div class="order-summary-section">
              <div class="summary-item">
                <PackageIcon class="icon-xs text-secondary" />
                <span>{{ order.items_count }} {{ order.items_count === 1 ? 'Item' : 'Items' }}</span>
              </div>
              <div class="summary-item">
                <WalletIcon class="icon-xs text-secondary" />
                <span class="earnings">₦{{ Number(order.vendor_total).toLocaleString() }}</span>
              </div>
            </div>

            <div class="order-status-section">
              <div :class="['status-pill', order.status.toLowerCase()]">
                <span class="dot"></span>
                {{ order.status }}
              </div>
              <div v-if="order.status === 'Cancelled' && order.cancel_reason" class="cancel-reason-inline">
                Reason: {{ order.cancel_reason.replace(/_/g, ' ') }}
              </div>
            </div>

            <div class="order-action-section">
              <button 
                v-if="order.status !== 'Pending' && order.status !== 'Cancelled'"
                @click="$emit('view-details', order.id)" 
                class="btn-fulfill"
              >
                <span class="btn-label">Fulfill Order</span>
                <ArrowRightIcon class="icon-sm" />
              </button>
              <button 
                v-else-if="order.status === 'Cancelled'"
                @click="$emit('view-details', order.id)" 
                class="btn-details-only"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-pipeline glass-card">
      <div class="empty-visual">
        <ShoppingBagIcon class="empty-icon" />
      </div>
      <h3>Nothing in this stage</h3>
      <p>There are no orders currently {{ activeStatus === 'all' ? 'available' : `marked as ${activeStatus}` }}.</p>
      <button v-if="activeStatus !== 'all'" @click="activeStatus = 'all'" class="btn-text">View all orders</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  ShoppingBag as ShoppingBagIcon, 
  Hash as HashIcon,
  Package as PackageIcon,
  Wallet as WalletIcon,
  ArrowRight as ArrowRightIcon
} from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';

const props = defineProps(['vendorId']);
const emit = defineEmits(['view-details']);

const orders = ref([]);
const loading = ref(true);
const activeStatus = ref('all');

const statusTabs = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'New Orders' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'packaged', label: 'Packaged' },
  { id: 'shipped', label: 'Shipped/Delivered' }
];

const fetchOrders = async () => {
  try {
    const data = await vendorService.getOrders();
    orders.value = data;
  } catch (err) {
    console.error('Failed to fetch vendor orders', err);
  } finally {
    loading.value = false;
  }
};

const filteredOrders = computed(() => {
  if (activeStatus.value === 'all') return orders.value;
  return orders.value.filter(o => o.status.toLowerCase() === activeStatus.value);
});

const getCount = (statusId) => {
  if (statusId === 'all') return orders.value.length;
  return orders.value.filter(o => o.status.toLowerCase() === statusId).length;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

onMounted(fetchOrders);
</script>

<style scoped>
.vendor-orders-pipeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pipeline Tabs */
.pipeline-navigation {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: var(--radius-lg);
}

.pipeline-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 4px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.pipeline-scroll::-webkit-scrollbar { display: none; }

.pipeline-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.pipeline-tab:hover {
  border-color: var(--color-blue-primary);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.pipeline-tab.active {
  background: var(--color-blue-primary);
  border-color: var(--color-blue-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.25);
}

.tab-badge {
  background: var(--bg-secondary);
  color: inherit;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
}

.pipeline-tab.active .tab-badge {
  background: rgba(255, 255, 255, 0.2);
}

/* Order Pipeline Items */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.order-pipeline-item {
  padding: 1.25rem 1.75rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.order-pipeline-item:hover {
  border-color: var(--color-blue-primary);
  box-shadow: var(--shadow-md);
  transform: scale(1.005);
}

.order-main {
  display: grid;
  grid-template-columns: 1.25fr 1.5fr 1fr 1.25fr;
  align-items: center;
  gap: 2rem;
}

/* ID Section */
.order-id-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.id-icon {
  width: 36px;
  height: 36px;
  background: var(--bg-secondary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.id-details {
  display: flex;
  flex-direction: column;
}

.id-num { font-weight: 800; font-size: 1.05rem; color: var(--text-primary); }
.placed-date { font-size: 0.8rem; color: var(--text-secondary); }

/* Summary Section */
.order-summary-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.earnings { color: #10b981; font-weight: 800; }

/* Status Section */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  width: fit-content;
}

.status-pill.pending { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
.status-pill.processing { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
.status-pill.accepted { background: rgba(0, 102, 204, 0.1); color: #0066cc; border: 1px solid rgba(0, 102, 204, 0.2); }
.status-pill.packaged { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2); }
.status-pill.shipped { background: rgba(2, 132, 199, 0.1); color: #0284c7; border: 1px solid rgba(2, 132, 199, 0.2); }
.status-pill.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }

.status-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Action Section */
.order-action-section {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-details-only {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-details-only:hover {
  background: var(--border-color);
}

.btn-fulfill {
  background: var(--color-blue-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-fulfill:hover {
  background: var(--color-blue-primary);
  transform: translateX(4px);
}

/* Mobile Responsive */
@media (max-width: 992px) {
  .order-main {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .order-main {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .order-action-section {
    justify-content: flex-start;
  }
  
  .btn-fulfill { width: 100%; justify-content: center; }
}

/* Empty State */
.empty-pipeline {
  padding: 5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-visual {
  width: 80px;
  height: 80px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.empty-icon { width: 40px; height: 40px; color: var(--border-color); }

.empty-pipeline h3 { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0; }
.empty-pipeline p { color: var(--text-secondary); max-width: 320px; margin: 0 auto; line-height: 1.5; }

.btn-text {
  background: none;
  border: none;
  color: var(--color-blue-primary);
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
}

/* Loading Shimmer */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.shimmer-card {
  height: 80px;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-lg);
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.icon-xs { width: 12px; height: 12px; }
.icon-sm { width: 18px; height: 18px; }
.text-secondary { color: var(--text-secondary); }

.cancel-reason-inline {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 4px;
  font-weight: 600;
  text-transform: capitalize;
}
</style>
