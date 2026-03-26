<template>
  <div class="vendor-settings">
    <div class="settings-grid">
      <div class="settings-main">
        <div class="section-card glass-card">
          <div class="card-header">
            <h3>Store Profile</h3>
            <p class="text-secondary">Update your public store information and business details.</p>
          </div>

          <form @submit.prevent="updateProfile" class="settings-form">
            <div class="form-group">
              <label>Store Name</label>
              <input type="text" v-model="profile.store_name" required placeholder="Origin Solar Store" />
            </div>

            <div class="form-group">
              <label>Store Description</label>
              <textarea v-model="profile.description" rows="4" placeholder="Describe your business, services, and expertise..."></textarea>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" v-model="profile.phone" required />
              </div>
              <div class="form-group">
                <label>Business Type</label>
                <input type="text" :value="profile.business_type" disabled class="disabled-input" />
              </div>
            </div>

            <div class="form-divider"></div>
            
            <h4 class="settings-sub-title">Business Address</h4>
            
            <div class="form-group">
              <label>Street Address</label>
              <input type="text" v-model="profile.street" required />
            </div>

            <div class="form-grid-3">
              <div class="form-group">
                <label>City</label>
                <input type="text" v-model="profile.city" required />
              </div>
              <div class="form-group">
                <label>State</label>
                <input type="text" v-model="profile.state" required />
              </div>
              <div class="form-group">
                <label>Country</label>
                <input type="text" v-model="profile.country" required />
              </div>
            </div>

            <div class="form-footer">
              <button type="submit" class="btn primary-btn border-btn accent-orange" :disabled="isSaving">
                <span v-if="isSaving" class="loader-sm"></span>
                <span v-else>Update Store Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="settings-sidebar">
        <div class="section-card glass-card">
          <h3>Payout Information</h3>
          <p class="text-secondary mt-2">Manage where your earnings are sent.</p>
          
          <div v-if="!showPayoutForm" class="payout-method mt-6">
            <div class="payout-icon">
              <BankIcon class="icon-md" />
            </div>
            <div class="payout-details">
              <p class="bank-name">{{ profile.bank_name || 'Not Connected' }}</p>
              <p class="acc-num text-mini">{{ profile.account_number ? 'Added: **** ' + profile.account_number.slice(-4) : 'Connect your bank account' }}</p>
            </div>
          </div>
          
          <button v-if="!showPayoutForm" @click="showPayoutForm = true" class="btn secondary-btn border-btn full-width mt-6">
            {{ profile.bank_name ? 'Update Payouts' : 'Setup Payouts' }}
          </button>

          <div v-else class="payout-form mt-6">
            <div class="form-group mb-4">
              <label>Bank Name</label>
              <input type="text" v-model="profile.bank_name" placeholder="e.g. Zenith Bank" />
            </div>
            <div class="form-group mb-4">
              <label>Account Number</label>
              <input type="text" v-model="profile.account_number" placeholder="10 Digits" maxlength="10" />
            </div>
            <div class="form-group mb-4">
              <label>Account Name</label>
              <input type="text" v-model="profile.account_name" placeholder="Full Name on Account" />
            </div>
            <div class="payout-actions">
              <button @click="showPayoutForm = false" class="btn btn-text-sm">Cancel</button>
              <button @click="savePayoutInfo" class="btn primary-btn btn-xs" :disabled="isSaving">Save Bank Info</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Landmark as BankIcon } from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';

const profile = ref({
  store_name: '',
  description: '',
  phone: '',
  business_type: '',
  street: '',
  city: '',
  state: '',
  country: '',
  bank_name: '',
  account_number: '',
  account_name: ''
});

const isSaving = ref(false);
const showPayoutForm = ref(false);

const fetchProfile = async () => {
  try {
    const data = await vendorService.getProfile();
    profile.value = data;
  } catch (err) {
    console.error('Failed to fetch vendor profile', err);
  }
};

const updateProfile = async () => {
  isSaving.value = true;
  try {
    await vendorService.updateProfile(profile.value);
    alert('Store profile updated successfully!');
  } catch (err) {
    alert('Failed to update profile');
  } finally {
    isSaving.value = false;
  }
};

const savePayoutInfo = async () => {
    isSaving.value = true;
    try {
        await vendorService.updateProfile(profile.value);
        showPayoutForm.value = false;
        alert('Payout information updated successfully!');
    } catch (err) {
        alert('Failed to update payout information');
    } finally {
        isSaving.value = false;
    }
};

onMounted(fetchProfile);
</script>

<style scoped>
.vendor-settings {
  padding-bottom: 2rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 2.5rem;
}

.section-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  box-shadow: none; /* Removed shadows */
}

.card-header {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.card-header h3 { 
  font-size: 1.75rem; 
  font-weight: 800; 
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.card-header p {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
}

.form-group label {
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input, textarea {
  width: 100%;
  box-sizing: border-box;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
  color: var(--text-primary);
}

input:focus, textarea:focus {
  background: var(--bg-primary);
  border-color: var(--color-blue-primary);
  outline: none;
}

.disabled-input {
  background: var(--bg-secondary);
  opacity: 0.8;
  cursor: not-allowed;
  border-color: var(--border-color);
}

.form-divider {
  height: 1px;
  background: var(--border-color);
  margin: 1.5rem 0;
}

.settings-sub-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-sub-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.form-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.border-btn {
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 800;
  padding: 0.8rem 2rem;
  transition: all 0.2s;
}

.border-btn:hover {
  background: var(--bg-secondary);
}

.accent-orange {
  border-color: #f97316 !important;
  color: #f97316 !important;
}

.accent-orange:hover {
  background: #f97316 !important;
  color: white !important;
}

.primary-btn {
  padding: 1rem 2.5rem;
  font-weight: 800;
}

.payout-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.payout-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-text-sm {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
}

.btn-xs {
    padding: 0.6rem 1.25rem;
    font-size: 0.85rem;
    border-radius: var(--radius-md);
    background: var(--text-primary);
    color: var(--bg-primary);
    border: 1px solid transparent;
}

.btn-xs:hover:not(:disabled) {
    opacity: 0.9;
}

.payout-method {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.payout-method:hover {
  border-color: var(--color-blue-primary);
}

.payout-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blue-primary);
  border: 1px solid var(--border-color);
}

.bank-name { font-weight: 800; font-size: 0.95rem; color: var(--text-primary); }

.full-width { width: 100%; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.text-mini { font-size: 0.8rem; color: var(--text-secondary); }

.loader-sm {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-blue-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  .settings-sidebar { order: -1; }
}
</style>
