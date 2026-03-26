<template>
  <div class="vendor-wallet">
    <!-- Balance Overview Cards -->
    <div class="wallet-stats mb-8">
      <div class="stat-card glass-card">
        <div class="stat-header">
          <span class="stat-label">Available Balance</span>
          <div class="stat-icon-bg"><WalletIcon class="icon-sm" /></div>
        </div>
        <div class="stat-value">₦{{ formatCurrency(stats.availableBalance) }}</div>
        <button @click="showWithdrawModal = true" class="btn primary-btn border-btn accent-orange full-width mt-4">Withdraw Earnings</button>
      </div>

      <div class="stat-card glass-card">
        <div class="stat-header">
          <span class="stat-label">Pending Withdrawals</span>
          <div class="stat-icon-bg pending"><ClockIcon class="icon-sm" /></div>
        </div>
        <div class="stat-value">₦{{ formatCurrency(stats.pendingPayouts) }}</div>
        <p class="stat-hint mt-4">Awaiting admin approval/processing</p>
      </div>

      <div class="stat-card glass-card">
        <div class="stat-header">
          <span class="stat-label">Lifetime Earnings</span>
          <div class="stat-icon-bg earnings"><TrendingUpIcon class="icon-sm" /></div>
        </div>
        <div class="stat-value">₦{{ formatCurrency(stats.lifetimeEarnings) }}</div>
        <p class="stat-hint mt-4">Total revenue from delivered orders</p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="wallet-content">
      <!-- Transaction History -->
      <div class="history-section glass-card">
        <div class="section-header">
          <h3>Transaction History</h3>
        </div>

        <div class="transactions-list mt-6">
          <div v-if="loading" class="loading-state">
            <div class="loader-sm"></div>
          </div>
          <div v-else-if="transactions.length === 0" class="empty-state">
            <ReceiptIcon class="empty-icon" />
            <p>No transactions yet</p>
          </div>
          <div v-else class="transactions-table-wrapper">
            <table class="transactions-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in transactions" :key="tx.id">
                  <td>
                    <div class="type-cell">
                      <div :class="['type-icon', tx.type]">
                        <ArrowDownRight v-if="tx.type === 'credit'" class="icon-xs" />
                        <ArrowUpRight v-else class="icon-xs" />
                      </div>
                      <span class="capitalize">{{ tx.type === 'sale' ? 'Sale' : 'Withdrawal' }}</span>
                    </div>
                  </td>
                  <td><span class="ref-text">{{ tx.reference }}</span></td>
                  <td>{{ formatDate(tx.created_at) }}</td>
                  <td>
                    <span :class="['amount-text', tx.type === 'credit' ? 'positive' : 'negative']">
                      {{ tx.type === 'credit' ? '+' : '-' }}₦{{ formatCurrency(Math.abs(tx.amount)) }}
                    </span>
                  </td>
                  <td>
                    <span :class="['status-pill', tx.status]">{{ tx.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdrawModal" class="modal-overlay" @click.self="showWithdrawModal = false">
      <div class="modal-content minimalist-modal">
        <div class="modal-header">
          <h3>Request Withdrawal</h3>
          <p class="text-secondary">Enter the amount you'd like to transfer to your bank account.</p>
        </div>
        
        <div v-if="!isPayoutInfoComplete" class="payout-warning mt-6">
          <AlertCircle class="icon-md warning-icon" />
          <div class="warning-text">
            <p class="font-bold">Missing Payout Info</p>
            <p class="text-secondary text-sm">Please complete your bank details in settings before withdrawing.</p>
            <router-link to="/account/vendor?tab=settings" class="settings-link mt-2">Go to Settings</router-link>
          </div>
        </div>

        <template v-else>
          <div class="payout-summary">
            <label class="label-xs">Sending to</label>
            <div class="bank-info mt-1">
              <span class="bank-name">{{ vendorProfile.bank_name }}</span>
              <span class="acc-num">•••• {{ vendorProfile.account_number.slice(-4) }}</span>
            </div>
          </div>

          <div class="amount-field-container mt-6">
            <label class="label-xs">Amount to Withdraw</label>
            <div class="input-with-currency mt-2">
              <span class="currency">₦</span>
              <input 
                type="number" 
                v-model="withdrawAmount" 
                class="simple-input"
                placeholder="0.00"
                :max="stats.availableBalance"
              />
            </div>
            <div class="quick-pills mt-3">
               <button v-for="pct in [25, 50, 75, 100]" :key="pct" 
                 @click="withdrawAmount = Math.floor(stats.availableBalance * (pct/100))"
                 class="pill-btn"
               >{{ pct }}%</button>
            </div>
            <div class="balance-line mt-3">
              <span>Available Balance:</span>
              <span class="balance-amt">₦{{ formatCurrency(stats.availableBalance) }}</span>
            </div>
          </div>
        </template>

        <div class="modal-btns mt-8">
          <button @click="showWithdrawModal = false" class="btn text-btn">Cancel</button>
          <button v-if="isPayoutInfoComplete" @click="handleWithdraw" class="btn action-btn" :disabled="isSubmitting || withdrawAmount <= 0 || withdrawAmount > stats.availableBalance">
            <span v-if="isSubmitting" class="loader-sm"></span>
            <span v-else>Withdraw Funds</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  Wallet as WalletIcon, 
  Clock as ClockIcon, 
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Landmark as BankIcon,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';

const loading = ref(true);
const stats = ref({
  availableBalance: 0,
  pendingPayouts: 0,
  lifetimeEarnings: 0
});

const vendorProfile = ref({});
const transactions = ref([]);
const withdrawals = ref([]);
const showWithdrawModal = ref(false);
const withdrawAmount = ref(0);
const isSubmitting = ref(false);

const isPayoutInfoComplete = computed(() => {
  return vendorProfile.value.bank_name && 
         vendorProfile.value.account_number && 
         vendorProfile.value.account_name;
});

const fetchData = async () => {
    loading.value = true;
    try {
        const [walletData, profileData] = await Promise.all([
            vendorService.getWallet(),
            vendorService.getProfile()
        ]);

        vendorProfile.value = profileData;
        stats.value.availableBalance = walletData.balance;
        stats.value.pendingPayouts = walletData.pendingWithdrawals;
        
        transactions.value = walletData.transactions.map(tx => ({
            ...tx,
            type: tx.type === 'sale' ? 'credit' : 'debit',
            reference: tx.order_id ? `ORD-${tx.order_id}` : 'WDR'
        }));
        
        withdrawals.value = walletData.withdrawals;

        // Calculate lifetime earnings from completed sale transactions
        const lifetime = walletData.transactions
            .filter(tx => tx.type === 'sale' && (tx.status === 'completed' || tx.status === 'success'))
            .reduce((sum, tx) => sum + Number(tx.amount), 0);
        stats.value.lifetimeEarnings = lifetime;

    } catch (err) {
        console.error('Failed to fetch wallet data', err);
    } finally {
        loading.value = false;
    }
};

const handleWithdraw = async () => {
    if (withdrawAmount.value <= 0) return alert('Please enter a valid amount');
    if (withdrawAmount.value > stats.value.availableBalance) return alert('Insufficient balance');

    isSubmitting.value = true;
    try {
        await vendorService.requestWithdrawal(withdrawAmount.value);
        alert('Withdrawal request submitted!');
        showWithdrawModal.value = false;
        fetchData(); // Refresh
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to request withdrawal');
    } finally {
        isSubmitting.value = false;
    }
};

const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString();
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
};

onMounted(fetchData);
</script>

<style scoped>
.wallet-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  padding: 1.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-icon-bg {
  width: 32px;
  height: 32px;
  background: rgba(0, 102, 204, 0.1);
  color: var(--color-blue-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-bg.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.stat-icon-bg.earnings { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.stat-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.history-section {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
}

.transactions-table-wrapper {
  margin-top: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.transactions-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.95rem;
}

.transactions-table tr:last-child td {
  border-bottom: none;
}

.type-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.type-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-icon.credit { background: rgba(22, 101, 52, 0.1); color: #16a34a; }
.type-icon.debit { background: rgba(220, 38, 38, 0.1); color: #dc2626; }

.ref-text {
  font-family: monospace;
  font-weight: 600;
  color: var(--text-secondary);
}

.amount-text {
  font-weight: 800;
}

.amount-text.positive { color: #059669; }
.amount-text.negative { color: #dc2626; }

.status-pill {
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.05em;
}

.status-pill.completed { background: rgba(22, 101, 52, 0.1); color: #16a34a; }
.status-pill.pending { background: rgba(217, 119, 6, 0.1); color: #d97706; }

.border-btn {
  border: 1.5px solid var(--border-color);
  background: transparent;
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

.full-width { width: 100%; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }
.mb-8 { margin-bottom: 2rem; }
.capitalize { text-transform: capitalize; }
.icon-xs { width: 14px; height: 14px; }
.icon-sm { width: 18px; height: 18px; }

@media (max-width: 992px) {
  .wallet-stats { grid-template-columns: 1fr; }
}

/* Minimalist Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Unified overlay across themes */
  display: flex;
  align-items: center; justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.minimalist-modal {
  background: var(--bg-primary);
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.payout-summary {
  margin-top: 2rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.bank-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.bank-name {
    font-weight: 700;
    color: var(--text-primary);
    font-size: 0.95rem;
}

.acc-num {
    color: var(--text-secondary);
    font-family: monospace;
    font-size: 0.9rem;
}

.payout-warning {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  align-items: flex-start;
}

.warning-icon {
  color: #f59e0b;
  flex-shrink: 0;
}

.warning-text p.font-bold {
  color: var(--text-primary);
  margin-bottom: 4px;
}

.settings-link {
  display: inline-block;
  color: var(--color-blue-primary);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
}

.settings-link:hover {
  text-decoration: underline;
}

.input-with-currency {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 16px;
  font-weight: 700;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.simple-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.2s;
  color: var(--text-primary);
}

.simple-input:focus {
  border-color: var(--color-blue-primary);
  outline: none;
  background: var(--bg-primary);
}

.quick-pills {
  display: flex;
  gap: 8px;
  margin: 1rem 0; /* Added vertical margin */
}

.pill-btn {
  flex: 1;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 6px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.pill-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

.balance-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.balance-amt {
    font-weight: 700;
    color: var(--text-primary);
}

.modal-btns {
  display: flex;
  gap: 12px;
}

.text-btn {
  flex: 1;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
}

.text-btn:hover {
    color: var(--text-primary);
    background: var(--bg-secondary);
}

.action-btn {
  flex: 2;
  background: var(--text-primary);
  color: var(--bg-primary);
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.label-xs {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  display: block;
}
</style>
