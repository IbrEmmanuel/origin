<template>
  <div class="orders">
    <div v-if="loading" class="state">
      <span class="loader"></span>
      <p>Loading orders…</p>
    </div>

    <div v-else-if="!orders.length" class="empty panel">
      <ShoppingBagIcon class="empty-icon" />
      <h3>No orders yet</h3>
      <p>When you buy from the marketplace, tracking and payments show up here.</p>
      <router-link to="/marketplace" class="btn primary">Browse marketplace</router-link>
    </div>

    <div v-else class="list">
      <article v-for="order in orders" :key="order.id" class="card">
        <header class="card-top">
          <div>
            <strong>{{ order.id }}</strong>
            <span>{{ formatDate(order.date) }}</span>
          </div>
          <span class="pill" :class="statusClass(order.status)">{{ order.status }}</span>
        </header>

        <div class="items">
          <div v-for="(item, idx) in order.items" :key="idx" class="item">
            <div class="thumb">
              <img v-if="item.image" :src="getImageUrl(item.image)" :alt="item.name" />
              <PackageIcon v-else />
            </div>
            <div class="item-copy">
              <p>{{ item.name }}</p>
              <small>Qty {{ item.qty }}</small>
            </div>
            <span class="item-price">{{ item.price }}</span>
          </div>
          <p v-if="!order.items.length" class="muted">No line items returned for this order.</p>
        </div>

        <footer class="card-foot">
          <div class="total">
            <span>Total</span>
            <strong>{{ order.total }}</strong>
          </div>
          <div class="actions">
            <template v-if="!isPending(order.status) && !isCancelled(order.status)">
              <router-link :to="`/account/orders/${order.rawId}`" class="btn ghost">Track</router-link>
              <router-link :to="`/account/orders/${order.rawId}`" class="btn primary">Details</router-link>
            </template>
            <template v-else-if="isPending(order.status)">
              <button
                type="button"
                class="btn ghost"
                :disabled="isProcessing === order.id"
                @click="cancelOrder(order.id)"
              >
                {{ isProcessing === order.id ? 'Cancelling…' : 'Cancel' }}
              </button>
              <button type="button" class="btn primary" @click="payNow(order)">Pay now</button>
            </template>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ShoppingBag as ShoppingBagIcon, Package as PackageIcon } from 'lucide-vue-next';
import userService from '@/services/user.service';
import { openPaystackPopup, isPaystackConfigured } from '@/composables/usePaystack';

const orders = ref([]);
const loading = ref(true);
const isProcessing = ref(null);

const getImageUrl = (path) => userService.getImageUrl(path);

const isPending = (status) => /pending|unpaid/i.test(String(status || ''));
const isCancelled = (status) => /cancel/i.test(String(status || ''));

const statusClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (s.includes('deliver') || s.includes('complete') || s.includes('paid') || s.includes('success')) return 'ok';
  if (s.includes('ship') || s.includes('process')) return 'info';
  if (s.includes('cancel') || s.includes('fail')) return 'err';
  return 'warn';
};

const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return d;
  }
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    orders.value = await userService.getOrders();
  } catch (error) {
    console.error('Error fetching orders:', error);
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

const payNow = async (order) => {
  if (!isPaystackConfigured()) {
    alert('Paystack is not configured on this deployment. Set VITE_PAYSTACK_PUBLIC_KEY and redeploy.');
    return;
  }
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const amount = order.totalAmount || Number(String(order.total).replace(/[₦,\s]/g, ''));

    await openPaystackPopup({
      email: user.email,
      amountNaira: amount,
      metadata: { order_id: order.rawId },
      onSuccess: (response) => {
        verifyPayment(response.reference, order.rawId);
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    alert(error.message || 'Failed to initialize payment');
  }
};

const verifyPayment = async (reference, orderId) => {
  try {
    await userService.verifyPayment(reference, orderId);
    alert('Payment successful!');
    fetchOrders();
  } catch (error) {
    console.error('Verify error:', error);
    alert(error.response?.data?.message || 'Payment verification failed');
  }
};

const cancelOrder = async (orderId) => {
  if (!confirm('Cancel this unpaid order?')) return;
  isProcessing.value = orderId;
  try {
    await userService.cancelOrder(orderId);
    await fetchOrders();
  } catch (error) {
    console.error('Cancel error:', error);
    alert(error.response?.data?.message || 'Failed to cancel order');
  } finally {
    isProcessing.value = null;
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
.orders {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.state,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  text-align: center;
  padding: 2.5rem 1.25rem;
  color: var(--text-secondary);
}

.panel {
  border-radius: 18px;
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
  border: 1px solid var(--border-color);
}

.empty h3 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.empty p {
  margin: 0;
  max-width: 28rem;
  font-size: 0.92rem;
}

.empty-icon {
  width: 36px;
  height: 36px;
  opacity: 0.45;
}

.loader {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.card {
  padding: 1.05rem;
  border-radius: 18px;
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
  border: 1px solid var(--border-color);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border-color);
}

.card-top > div {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.card-top strong {
  font-size: 0.98rem;
  color: var(--text-primary);
}

.card-top span {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
}

.pill.ok { background: var(--status-ok-bg); color: var(--status-ok-fg); }
.pill.warn { background: var(--status-warn-bg); color: var(--status-warn-fg); }
.pill.err { background: var(--status-err-bg); color: var(--status-err-fg); }
.pill.info { background: var(--status-info-bg); color: var(--status-info-fg); }

.items {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 0.9rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.thumb {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  flex-shrink: 0;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb :deep(svg) {
  width: 18px;
  height: 18px;
}

.item-copy {
  flex: 1;
  min-width: 0;
}

.item-copy p {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-copy small {
  color: var(--text-muted);
}

.item-price {
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--text-primary);
}

.muted {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.card-foot {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-color);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.total span {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.total strong {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 0.9rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.88rem;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  border: none;
  -webkit-tap-highlight-color: transparent;
}

.btn.primary {
  background: var(--color-primary);
  color: #fff;
}

.btn.ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color-strong);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 720px) {
  .card-foot {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .actions {
    width: auto;
    grid-template-columns: auto auto;
  }

  .btn {
    min-width: 120px;
  }
}
</style>
