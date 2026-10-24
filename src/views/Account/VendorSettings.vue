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
        <div
          id="payout-section"
          class="section-card glass-card"
          :class="{ highlight: needsPayout || forcePayoutSetup }"
        >
          <h3>Payout Information</h3>
          <p class="text-secondary mt-2">Required before you can withdraw earnings to your bank.</p>

          <div v-if="payoutMessage" class="notice" :class="payoutMessage.type">
            {{ payoutMessage.text }}
          </div>

          <div v-if="!showPayoutForm" class="payout-method mt-6">
            <div class="payout-icon">
              <BankIcon class="icon-md" />
            </div>
            <div class="payout-details">
              <p class="bank-name">{{ profile.bank_name || 'Not Connected' }}</p>
              <p class="acc-num text-mini">
                {{
                  profile.account_number
                    ? `Added: **** ${String(profile.account_number).slice(-4)} · ${profile.account_name || 'Account'}`
                    : 'Connect your bank account'
                }}
              </p>
            </div>
          </div>

          <button
            v-if="!showPayoutForm"
            type="button"
            @click="openPayoutForm"
            class="btn secondary-btn border-btn full-width mt-6"
          >
            {{ profile.bank_name ? 'Update Payouts' : 'Setup Payouts' }}
          </button>

          <form v-else class="payout-form mt-6" @submit.prevent="savePayoutInfo">
            <div class="form-group mb-4">
              <label>Bank</label>
              <select v-model="payoutForm.bank_code" :required="banks.length > 0" @change="onBankSelect">
                <option value="" disabled>Select your bank</option>
                <option v-for="bank in banks" :key="bank.code" :value="bank.code">
                  {{ bank.name }}
                </option>
                <option v-if="banks.length" value="other">Other / Not listed</option>
              </select>
              <p v-if="banksLoading" class="hint">Loading Nigerian banks…</p>
              <p v-else-if="!banks.length" class="hint">
                Couldn’t load bank list — enter bank name below.
              </p>
            </div>

            <div v-if="!banks.length || payoutForm.bank_code === 'other'" class="form-group mb-4">
              <label>Bank Name</label>
              <input
                type="text"
                v-model="payoutForm.bank_name"
                placeholder="e.g. Zenith Bank"
                required
              />
            </div>

            <div class="form-group mb-4">
              <label>Account Number</label>
              <input
                type="text"
                inputmode="numeric"
                v-model="payoutForm.account_number"
                placeholder="10 Digits"
                maxlength="10"
                required
                @input="payoutForm.account_number = String(payoutForm.account_number || '').replace(/\D/g, '').slice(0, 10)"
              />
            </div>

            <div class="form-group mb-4">
              <label>Account Name</label>
              <input
                type="text"
                v-model="payoutForm.account_name"
                placeholder="Full Name on Account"
                required
              />
            </div>

            <div class="payout-actions">
              <button type="button" @click="cancelPayoutForm" class="btn btn-text-sm" :disabled="isSaving">
                Cancel
              </button>
              <button type="submit" class="btn primary-btn btn-xs" :disabled="isSaving || !payoutFormValid">
                <span v-if="isSaving" class="loader-sm"></span>
                <span v-else>Save Bank Info</span>
              </button>
            </div>
          </form>

          <router-link
            v-if="vendorService.hasPayoutInfo(profile) && !showPayoutForm"
            to="/account/vendor?tab=wallet"
            class="wallet-link mt-4"
          >
            Back to Wallet →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Landmark as BankIcon } from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';

const route = useRoute();
const router = useRouter();

const profile = ref({
  store_name: '',
  description: '',
  phone: '',
  business_type: '',
  street: '',
  city: '',
  state: '',
  country: 'Nigeria',
  bank_name: '',
  bank_code: '',
  account_number: '',
  account_name: ''
});

const payoutForm = ref({
  bank_name: '',
  bank_code: '',
  account_number: '',
  account_name: ''
});

const banks = ref([]);
const banksLoading = ref(false);
const isSaving = ref(false);
const showPayoutForm = ref(false);
const forcePayoutSetup = ref(false);
const payoutMessage = ref(null);

const needsPayout = computed(() => !vendorService.hasPayoutInfo(profile.value));

const payoutFormValid = computed(() => {
  const bankOk = payoutForm.value.bank_code
    ? payoutForm.value.bank_code === 'other'
      ? String(payoutForm.value.bank_name || '').trim().length > 1
      : true
    : String(payoutForm.value.bank_name || '').trim().length > 1;
  return (
    bankOk &&
    String(payoutForm.value.account_number || '').replace(/\D/g, '').length === 10 &&
    String(payoutForm.value.account_name || '').trim().length > 1
  );
});

const openPayoutForm = () => {
  payoutForm.value = {
    bank_name: profile.value.bank_name || '',
    bank_code: profile.value.bank_code || '',
    account_number: profile.value.account_number || '',
    account_name: profile.value.account_name || ''
  };
  // Match existing bank to list when possible
  if (payoutForm.value.bank_name && !payoutForm.value.bank_code && banks.value.length) {
    const match = banks.value.find(
      (b) => b.name.toLowerCase() === payoutForm.value.bank_name.toLowerCase()
    );
    if (match) payoutForm.value.bank_code = match.code;
  }
  showPayoutForm.value = true;
  payoutMessage.value = null;
};

const cancelPayoutForm = () => {
  showPayoutForm.value = false;
  forcePayoutSetup.value = false;
};

const onBankSelect = () => {
  const selected = banks.value.find((b) => b.code === payoutForm.value.bank_code);
  if (selected) payoutForm.value.bank_name = selected.name;
};

const fetchProfile = async () => {
  try {
    const data = await vendorService.getProfile();
    profile.value = { ...profile.value, ...data };
  } catch (err) {
    console.error('Failed to fetch vendor profile', err);
  }
};

const loadBanks = async () => {
  banksLoading.value = true;
  try {
    banks.value = await vendorService.listNigerianBanks();
  } finally {
    banksLoading.value = false;
  }
};

const maybeOpenPayoutFromQuery = () => {
  const setup = String(route.query.setup || '').toLowerCase();
  if (setup === 'payout' || setup === '1' || route.query.payout === '1') {
    forcePayoutSetup.value = true;
    openPayoutForm();
    // Clear one-shot query so refresh doesn't keep forcing the form
    const q = { ...route.query };
    delete q.setup;
    delete q.payout;
    router.replace({ query: q });
    requestAnimationFrame(() => {
      document.getElementById('payout-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else if (needsPayout.value) {
    // First visit with missing bank info — surface the form
    forcePayoutSetup.value = true;
    openPayoutForm();
  }
};

const updateProfile = async () => {
  isSaving.value = true;
  try {
    const updated = await vendorService.updateProfile({
      store_name: profile.value.store_name,
      description: profile.value.description,
      phone: profile.value.phone,
      street: profile.value.street,
      city: profile.value.city,
      state: profile.value.state,
      country: profile.value.country
    });
    profile.value = { ...profile.value, ...updated };
    alert('Store profile updated successfully!');
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update profile');
  } finally {
    isSaving.value = false;
  }
};

const savePayoutInfo = async () => {
  if (!payoutFormValid.value) {
    payoutMessage.value = {
      type: 'err',
      text: 'Enter bank, a 10-digit account number, and the account name.'
    };
    return;
  }

  isSaving.value = true;
  payoutMessage.value = null;
  try {
    let bankName = payoutForm.value.bank_name;
    if (payoutForm.value.bank_code && payoutForm.value.bank_code !== 'other') {
      const selected = banks.value.find((b) => b.code === payoutForm.value.bank_code);
      if (selected) bankName = selected.name;
    }

    const updated = await vendorService.updatePayoutInfo({
      bank_name: bankName,
      bank_code:
        payoutForm.value.bank_code && payoutForm.value.bank_code !== 'other'
          ? payoutForm.value.bank_code
          : undefined,
      account_number: payoutForm.value.account_number,
      account_name: payoutForm.value.account_name
    });

    profile.value = { ...profile.value, ...updated };
    // Ensure local fields reflect what we saved even if API returns sparse body
    profile.value.bank_name = updated.bank_name || bankName;
    profile.value.bank_code = updated.bank_code || payoutForm.value.bank_code || '';
    profile.value.account_number =
      updated.account_number || String(payoutForm.value.account_number).replace(/\D/g, '');
    profile.value.account_name = updated.account_name || payoutForm.value.account_name;

    showPayoutForm.value = false;
    forcePayoutSetup.value = false;
    payoutMessage.value = {
      type: 'ok',
      text: 'Payout details saved. You can withdraw from Wallet.'
    };
  } catch (err) {
    payoutMessage.value = {
      type: 'err',
      text: err.response?.data?.message || 'Failed to update payout information'
    };
  } finally {
    isSaving.value = false;
  }
};

watch(
  () => [route.query.setup, route.query.payout],
  () => maybeOpenPayoutFromQuery()
);

onMounted(async () => {
  await Promise.all([fetchProfile(), loadBanks()]);
  maybeOpenPayoutFromQuery();
});
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
  box-shadow: none;
}

.section-card.highlight {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
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

input,
textarea,
select {
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

select {
  cursor: pointer;
  appearance: auto;
}

input:focus,
textarea:focus,
select:focus {
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

.hint {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.notice {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.notice.ok {
  background: rgba(59, 183, 94, 0.12);
  color: #1f7a3a;
  border: 1px solid rgba(59, 183, 94, 0.35);
}

.notice.err {
  background: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
  border: 1px solid rgba(239, 68, 68, 0.3);
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
  gap: 0.25rem;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-xs:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  flex-shrink: 0;
}

.bank-name {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.wallet-link {
  display: inline-block;
  margin-top: 1rem;
  font-weight: 700;
  color: var(--color-blue-primary);
  text-decoration: none;
}

.full-width {
  width: 100%;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-mini {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.loader-sm {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-blue-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  .settings-sidebar {
    order: -1;
  }
}
</style>
