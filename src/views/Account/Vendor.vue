<template>
  <div class="vendor-hub">
    <div v-if="isLoading" class="state">
      <span class="loader"></span>
      <p>Checking vendor access…</p>
    </div>

    <div v-else-if="status !== 'approved'" class="gate">
      <div class="gate-icon">
        <ClockIcon v-if="status === 'pending'" />
        <AlertTriangleIcon v-else-if="status === 'rejected'" />
        <StoreIcon v-else />
      </div>
      <h3>Vendor account required</h3>
      <p v-if="status === 'pending'">Your application is under review. Track progress on the application page.</p>
      <p v-else-if="status === 'rejected'">Your application was not approved. Open the application page for details.</p>
      <p v-else>Apply once to unlock catalog tools, bulk import, wallet, and sales.</p>
      <router-link to="/vendor-apply" class="btn primary">
        {{ status === null ? 'Become a vendor' : 'View application' }}
      </router-link>
    </div>

    <div v-else class="hub">
      <div class="live-bar" role="status">
        <span class="live-dot" aria-hidden="true"></span>
        <span>Supplier workspace · live Origin API</span>
      </div>
      <div class="tab-rail" role="tablist" aria-label="Vendor sections">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="tab"
          :class="{ active: currentTab === tab.id }"
          :aria-selected="currentTab === tab.id"
          @click="currentTab = tab.id"
        >
          <component :is="tab.icon" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <div class="tab-panel">
        <VendorDashboard v-if="currentTab === 'overview'" @switch-tab="id => currentTab = id" />
        <VendorProducts v-else-if="currentTab === 'products'" />
        <VendorBulkUpload v-else-if="currentTab === 'bulk'" @imported="currentTab = 'batches'" />
        <VendorBatchDashboard v-else-if="currentTab === 'batches'" />
        <VendorSettings v-else-if="currentTab === 'settings'" />
        <VendorWallet v-else-if="currentTab === 'wallet'" />
        <div v-else-if="currentTab === 'orders'">
          <VendorOrderDetails v-if="selectedOrderId" :order-id="selectedOrderId" @back="selectedOrderId = null" />
          <VendorOrders v-else @view-details="id => selectedOrderId = id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import vendorService from '@/services/vendor.service';
import VendorDashboard from './VendorDashboard.vue';
import VendorProducts from './VendorProducts.vue';
import VendorBulkUpload from './VendorBulkUpload.vue';
import VendorBatchDashboard from './VendorBatchDashboard.vue';
import VendorOrders from './VendorOrders.vue';
import VendorOrderDetails from './VendorOrderDetails.vue';
import VendorSettings from './VendorSettings.vue';
import VendorWallet from './VendorWallet.vue';
import {
  Clock as ClockIcon,
  AlertTriangle as AlertTriangleIcon,
  LayoutDashboard as DashboardIcon,
  Package as ProductIcon,
  ShoppingBag as ShoppingBagIcon,
  Wallet as WalletIcon,
  Settings as SettingsIcon,
  Upload as UploadIcon,
  Layers as BatchesIcon,
  Store as StoreIcon
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const status = ref(null);
const isLoading = ref(true);
const currentTab = ref('overview');
const selectedOrderId = ref(null);

const tabs = [
  { id: 'overview', label: 'Overview', icon: DashboardIcon },
  { id: 'products', label: 'Products', icon: ProductIcon },
  { id: 'bulk', label: 'Bulk', icon: UploadIcon },
  { id: 'batches', label: 'Batches', icon: BatchesIcon },
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

const syncTabFromRoute = () => {
  const tab = route.query.tab;
  if (tab && tabs.some((t) => t.id === tab) && currentTab.value !== tab) {
    currentTab.value = tab;
  }
};

watch(currentTab, (id) => {
  selectedOrderId.value = null;
  if (route.query.tab !== id) {
    router.replace({ query: { ...route.query, tab: id } });
  }
});

watch(() => route.query.tab, syncTabFromRoute);

onMounted(() => {
  fetchStatus();
  syncTabFromRoute();
});
</script>

<style scoped>
.vendor-hub {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.live-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.18);
}

.state,
.gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 2.5rem 1.25rem;
  border-radius: 18px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.gate h3 {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.02em;
  font-size: clamp(1.2rem, 4vw, 1.45rem);
}

.gate p {
  margin: 0;
  max-width: 28rem;
  line-height: 1.5;
}

.gate-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--color-primary);
}

.gate-icon :deep(svg) {
  width: 26px;
  height: 26px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.btn.primary {
  background: var(--color-primary);
  color: #fff;
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

.hub {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tab-rail {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  padding: 0.4rem;
  border-radius: 18px;
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
  border: 1px solid var(--border-color);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
}

.tab-rail::-webkit-scrollbar {
  display: none;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex: 0 0 auto;
  min-height: 42px;
  padding: 0.45rem 0.85rem;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.82rem;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  scroll-snap-align: start;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.tab :deep(svg) {
  width: 16px;
  height: 16px;
}

.tab:hover {
  color: var(--text-primary);
  background: var(--bg-primary);
}

.tab.active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 8px 18px -8px rgba(255, 118, 0, 0.55);
}

.tab-panel {
  min-height: 200px;
}

@media (min-width: 900px) {
  .tab {
    font-size: 0.88rem;
    padding: 0.55rem 1rem;
  }
}
</style>
