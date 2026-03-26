<template>
  <div class="content-section">
    <!-- Initial Welcome / Apply State -->
    <div v-if="status === null && !showForm" class="section-card glass-card vendor-welcome">
      <div class="vendor-badge">Partner Program</div>
      <h2>Become an Origin Electric Vendor</h2>
      <p>Grow your business by offering premium solar and electric solutions. Access our vast network and professional tools.</p>
      <button @click="showForm = true" class="btn primary-btn">Apply Now</button>
    </div>

    <!-- Application Form -->
    <div v-else-if="status === null && showForm" class="section-card glass-card">
      <div class="form-header">
        <button @click="showForm = false" class="back-link">
          <ArrowLeftIcon class="icon-sm" /> Back
        </button>
        <h3>Vendor Application</h3>
      </div>

      <form @submit.prevent="handleSubmit" class="vendor-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" v-model="form.full_name" required placeholder="John Doe" />
          </div>
          <div class="form-group">
            <label for="storeName">Store Name</label>
            <input type="text" id="storeName" v-model="form.store_name" required placeholder="Origin Solar Store" />
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" v-model="form.phone" required placeholder="+234..." />
          </div>
          <div class="form-group">
            <label for="businessType">Business Type</label>
            <select id="businessType" v-model="form.business_type" required>
              <option value="">Select Type</option>
              <option value="retailer">Retailer</option>
              <option value="installer">Installer</option>
              <option value="distributor">Distributor</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="street">Street Address</label>
          <input type="text" id="street" v-model="form.street" required placeholder="123 Energy Way" />
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="form.city" required placeholder="Lagos" />
          </div>
          <div class="form-group">
            <label for="state">State</label>
            <input type="text" id="state" v-model="form.state" required placeholder="Lagos State" />
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" v-model="form.country" required placeholder="Nigeria" />
          </div>
        </div>

        <div class="form-group">
          <label for="description">Tell us about your business</label>
          <textarea id="description" v-model="form.description" rows="3" placeholder="Services offered, years in business, etc."></textarea>
        </div>

        <button type="submit" class="btn primary-btn submit-btn" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="loader"></span>
          <span v-else>Submit Application</span>
        </button>
      </form>
    </div>

    <!-- Pending State -->
    <div v-else-if="status === 'pending'" class="section-card glass-card status-card pending">
      <ClockIcon class="status-icon" />
      <h3>Application under review</h3>
      <p>Thank you for applying! Our team is currently reviewing your business details. We'll notify you via email once approved.</p>
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

    <!-- Rejected State -->
    <div v-else-if="status === 'rejected'" class="section-card glass-card status-card rejected">
      <AlertTriangleIcon class="status-icon" />
      <h3>Application Rejected</h3>
      <p>Unfortunately, your vendor application has been rejected at this time. Please contact our support team for more information.</p>
      <button @click="status = null; showForm = true" class="btn secondary-btn">Re-apply</button>
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
const showForm = ref(false);
const isSubmitting = ref(false);
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

const form = ref({
  full_name: '',
  store_name: '',
  street: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  business_type: '',
  description: ''
});

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

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await vendorService.apply(form.value);
    status.value = 'pending';
    showForm.value = false;
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to submit application');
  } finally {
    isSubmitting.value = false;
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
.vendor-welcome {
  background: linear-gradient(135deg, var(--color-blue-primary) 0%, var(--color-blue-dark) 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border: none;
}

.vendor-welcome h2 { color: white; margin-bottom: 1rem; font-size: 2.25rem; font-weight: 800; }
.vendor-welcome p { opacity: 0.9; margin-bottom: 2rem; max-width: 540px; margin-inline: auto; font-size: 1.1rem; line-height: 1.6; }

.vendor-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.vendor-welcome .primary-btn {
  background: #f97316;
  box-shadow: 0 10px 20px -5px rgba(249, 115, 22, 0.4);
}

.vendor-welcome .primary-btn:hover {
  background: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -10px rgba(249, 115, 22, 0.5);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-header h3 { font-size: 1.5rem; font-weight: 700; }

.back-link {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition-bounce);
}

.back-link:hover { background: var(--border-color); }

.vendor-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

input, select, textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-speed);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-blue-primary);
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

.submit-btn {
  margin-top: 1rem;
  padding: 1.125rem;
  font-size: 1.1rem;
}

.status-card {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.status-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 0.5rem;
}

.pending .status-icon { color: var(--color-blue-primary); }
.approved .status-icon { color: #10b981; }
.rejected .status-icon { color: #ef4444; }

.status-card h3 { font-size: 1.75rem; font-weight: 800; }
.status-card p { color: var(--text-secondary); max-width: 480px; font-size: 1.05rem; line-height: 1.6; }

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
