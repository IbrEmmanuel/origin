<template>
  <div class="vendor-order-details">
    <button @click="$emit('back')" class="back-link mb-6">
      <ArrowLeftIcon class="icon-sm" /> Back to Orders
    </button>

    <div v-if="loading" class="loading-state glass-card">
      <span class="loader"></span>
      <p>Loading order details...</p>
    </div>

    <div v-else-if="details" class="details-content">
      <div class="header-card glass-card mb-6">
        <div class="order-info">
          <h2>Order #{{ details.order.id }}</h2>
          <p class="order-date">Placed on {{ formatDate(details.order.created_at) }}</p>
        </div>
        <div class="order-status-control">
          <div class="status-display mb-2">
            <span class="status-badge" :class="details.order.status.toLowerCase()">{{ details.order.status }}</span>
          </div>
          
          <div class="status-actions">
            <template v-if="details.order.status !== 'Cancelled'">
              <button 
                v-if="details.order.status === 'Processing'" 
                @click="handleStatusUpdate('Accepted')"
                :disabled="updating"
                class="btn-action pulse"
              >
                Accept Order
              </button>
              
              <button 
                v-if="details.order.status === 'Accepted'" 
                @click="handleStatusUpdate('Packaged')"
                :disabled="updating"
                class="btn-action primary"
              >
                Mark as Packaged
              </button>
              
              <!-- Message for completed vendor steps -->
              <div v-if="details.order.status === 'Packaged'" class="status-note">
                <CheckCircleIcon class="icon-sm" />
                <span>Order packaged. Waiting for admin to ship.</span>
              </div>
            </template>
            <div v-else class="cancel-reason-box">
              <AlertTriangleIcon class="icon-sm" />
              <span>Cancelled: {{ details.order.cancel_reason ? details.order.cancel_reason.replace(/_/g, ' ') : 'No reason provided' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <div class="items-column">
          <div class="glass-card">
            <h3 class="section-title">Your Items to Fulfill</h3>
            <div class="items-list">
              <div v-for="item in details.items" :key="item.id" class="vendor-item">
                <div class="item-media">
                  <img v-if="item.image" :src="getImageUrl(item.image)" :alt="item.name" />
                  <PackageIcon v-else class="icon-md" />
                </div>
                <div class="item-info">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <div class="item-meta">
                    <span class="qty">Qty: {{ item.qty }}</span>
                    <span class="price">₦{{ Number(item.price).toLocaleString() }}</span>
                  </div>
                </div>
                <div class="item-total">
                  ₦{{ (item.qty * item.price).toLocaleString() }}
                </div>
              </div>
            </div>
            
            <div class="vendor-subtotal mt-6">
              <div class="subtotal-row">
                <span>Your Total Earnings</span>
                <strong>₦{{ calculateVendorTotal().toLocaleString() }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="info-column">
          <div class="glass-card instructions-card mb-6">
            <h3 class="section-title">Fulfillment Steps</h3>
            <div class="fulfillment-steps">
                <div class="step" :class="{ active: details.order.status === 'Processing' }">
                    <span class="step-num">1</span>
                    <p>Order paid. Accept the order to begin preparation.</p>
                </div>
                <div class="step" :class="{ active: details.order.status === 'Accepted' }">
                    <span class="step-num">2</span>
                    <p>Package the item carefully and mark as packaged.</p>
                </div>
                <div class="step" :class="{ disabled: !['Packaged', 'Shipped', 'Delivered'].includes(details.order.status) }">
                    <span class="step-num">3</span>
                    <p>Admin will handle shipping and final delivery.</p>
                </div>
            </div>
          </div>

          <div class="glass-card instructions-card">
            <h3 class="section-title">Vendor Notes</h3>
            <p class="text-secondary small">Please ensure items are packed securely for transit. Once you mark an order as "Packaged", the admin will be notified to handle the shipping and final delivery.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  ArrowLeft as ArrowLeftIcon, 
  Package as PackageIcon,
  CheckCircle as CheckCircleIcon,
  AlertTriangle as AlertTriangleIcon
} from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';

const props = defineProps(['orderId']);
const emit = defineEmits(['back']);

const details = ref(null);
const loading = ref(true);
const updating = ref(false);

const fetchDetails = async () => {
  try {
    const data = await vendorService.getOrderDetails(props.orderId);
    details.value = data;
  } catch (err) {
    console.error('Failed to fetch order details', err);
  } finally {
    loading.value = false;
  }
};

const handleStatusUpdate = async (newStatus) => {
  if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
  
  updating.value = true;
  try {
    await vendorService.updateOrderStatus(props.orderId, newStatus);
    await fetchDetails(); // Refresh data
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update status');
  } finally {
    updating.value = false;
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
};

const calculateVendorTotal = () => {
  if (!details.value) return 0;
  return details.value.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
};

onMounted(fetchDetails);
</script>

<style scoped>
.vendor-order-details {
  animation: fadeIn 0.3s ease-out;
}

.back-link {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.back-link:hover { color: var(--color-blue-primary); }

.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
}

.order-info h2 { font-size: 1.75rem; font-weight: 800; margin-bottom: 4px; }
.order-date { font-size: 0.95rem; color: var(--text-secondary); }

.status-badge {
  padding: 8px 20px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.status-badge.accepted { background: rgba(0, 102, 204, 0.1); color: #0066cc; }
.status-badge.packaged { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.status-badge.shipped { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.status-badge.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.order-status-control {
  text-align: right;
}

.status-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-action {
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-action.pulse {
  background: var(--color-blue-primary);
  color: white;
  box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4);
  animation: pulse-blue 2s infinite;
}

@keyframes pulse-blue {
  0% { transform: scale(0.98); box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 102, 204, 0); }
  100% { transform: scale(0.98); box-shadow: 0 0 0 0 rgba(0, 102, 204, 0); }
}

.btn-action.primary {
  background: var(--color-blue-primary);
  color: white;
}

.btn-action.success {
  background: #10b981;
  color: white;
}

.btn-action:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: var(--shadow-md);
}

.details-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 1.5px solid var(--border-color);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vendor-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.item-media {
  width: 64px;
  height: 64px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-media img { width: 100%; height: 100%; object-fit: cover; }

.item-info { flex: 1; }
.item-name { font-weight: 700; font-size: 1rem; margin-bottom: 4px; }
.item-meta { display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary); }

.item-total { font-weight: 800; font-size: 1.1rem; color: var(--text-primary); }

.vendor-subtotal {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--border-color);
}

.subtotal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtotal-row span { font-size: 1rem; color: var(--text-secondary); }
.subtotal-row strong { font-size: 1.5rem; font-weight: 900; color: var(--color-blue-primary); }

.info-group { margin-bottom: 1.5rem; }
.info-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 4px;
  letter-spacing: 0.05em;
}

.info-group p { font-size: 1rem; color: var(--text-primary); line-height: 1.6; }

@media (max-width: 992px) {
  .details-grid { grid-template-columns: 1fr; }
}

.status-note {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #10b981;
  font-weight: 700;
  font-size: 0.9rem;
}

.fulfillment-steps {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.step {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    opacity: 0.4;
    transition: opacity 0.3s;
}

.step.active { opacity: 1; }
.step.disabled { opacity: 0.2; }

.step-num {
    width: 24px;
    height: 24px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    flex-shrink: 0;
}

.step.active .step-num {
    background: var(--color-blue-primary);
    color: white;
    border-color: var(--color-blue-primary);
}

.step p {
    font-size: 0.85rem;
    line-height: 1.4;
    color: var(--text-secondary);
    margin: 0;
}

.step.active p {
    color: var(--text-primary);
    font-weight: 600;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.mb-6 { margin-bottom: 1.5rem; }
.mt-6 { margin-top: 1.5rem; }
.small { font-size: 0.85rem; }
.icon-md { width: 32px; height: 32px; color: var(--border-color); }

.cancel-reason-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-weight: 700;
  text-transform: capitalize;
}
</style>
