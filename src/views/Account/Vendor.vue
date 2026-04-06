<template>
  <div class="content-section">
    <!-- Redirect/Fallback for non-approved users -->
    <div v-if="!isLoading && status !== 'approved'" class="redirect-card glass-card">
      <div class="status-icon-wrapper">
        <ClockIcon v-if="status === 'pending'" class="status-icon pending" />
        <AlertTriangleIcon v-else-if="status === 'rejected'" class="status-icon rejected" />
        <StoreIcon v-else class="status-icon" />
      </div>
      <h3>Vendor Account Required</h3>
      <p v-if="status === 'pending'">Your application is still under review. You can track progress on the application page.</p>
      <p v-else-if="status === 'rejected'">Your application was not approved. Please visit the application page for details.</p>
      <p v-else>You need a vendor account to access these tools.</p>
      
      <router-link to="/vendor-apply" class="btn primary-btn">
        {{ status === null ? 'Become a Vendor' : 'View Application Status' }}
      </router-link>
    </div>

    <!-- Approved State: Full Dashboard -->
    <div v-else-if="status === 'approved'" class="dashboard-area">
      <div class="dashboard-nav-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-btn', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          <component :is="tab.icon" class="icon-sm" />
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content mt-6">
        <VendorDashboard v-if="currentTab === 'overview'" @switch-tab="id => currentTab = id" />
        <VendorProducts v-if="currentTab === 'products'" />
        <VendorSettings v-if="currentTab === 'settings'" />
        <VendorWallet v-if="currentTab === 'wallet'" />
        <div v-if="currentTab === 'orders'">
          <VendorOrderDetails v-if="selectedOrderId" :order-id="selectedOrderId" @back="selectedOrderId = null" />
          <VendorOrders v-else @view-details="id => selectedOrderId = id" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loader-container">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import vendorService from '@/services/vendor.service';
import VendorDashboard from './VendorDashboard.vue';
import VendorProducts from './VendorProducts.vue';
import VendorOrders from './VendorOrders.vue';
import VendorOrderDetails from './VendorOrderDetails.vue';
import VendorSettings from './VendorSettings.vue';
import VendorWallet from './VendorWallet.vue';
import { 
  ArrowLeft as ArrowLeftIcon, 
  Clock as ClockIcon, 
  CheckCircle as CheckCircleIcon, 
  AlertTriangle as AlertTriangleIcon,
  LayoutDashboard as DashboardIcon,
  Package as ProductIcon,
  ShoppingBag as ShoppingBagIcon,
  Wallet as WalletIcon,
  Settings as SettingsIcon
} from 'lucide-vue-next';

const route = useRoute();
const status = ref(null);
const isLoading = ref(true);
const currentTab = ref('overview');
const selectedOrderId = ref(null);

const tabs = [
  { id: 'overview', label: 'Overview', icon: DashboardIcon },
  { id: 'products', label: 'Products', icon: ProductIcon },
  { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
  { id: 'wallet', label: 'Wallet', icon: WalletIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon }
];

const fetchStatus = async () => {
  try {
    const data = await vendorService.getStatus();
    status.value = data.status;
  } catch (err) {
    console.error('Failed to fetch vendor status', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchStatus();
  if (route.query.tab && tabs.some(t => t.id === route.query.tab)) {
    currentTab.value = route.query.tab;
  }
});
</script>

<style scoped>
.redirect-card {
  padding: 5rem 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.status-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.status-icon { width: 32px; height: 32px; color: var(--text-secondary); }
.status-icon.pending { color: var(--color-blue-primary); }
.status-icon.rejected { color: #ef4444; }

.redirect-card h3 { font-size: 1.75rem; font-weight: 800; }
.redirect-card p { color: var(--text-secondary); max-width: 450px; font-size: 1.05rem; line-height: 1.6; }

.loader-container {
  display: flex;
  justify-content: center;
  padding: 5rem;
}

/* Vendor Dashboard Specifics */
.dashboard-nav-tabs {
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--color-blue-primary);
  color: white;
}

.mt-6 { margin-top: 1.5rem; }

.placeholder-view {
  padding: 5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.icon-lg { width: 64px; height: 64px; color: var(--border-color); }

.primary-btn {
  background: var(--color-blue-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(0, 102, 204, 0.3);
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid var(--border-color);
  border-radius: 50%;
  border-top-color: var(--color-blue-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-grid, .form-grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
