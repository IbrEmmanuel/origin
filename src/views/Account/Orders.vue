<template>
  <div class="orders-container">
    <div v-if="orders.length > 0" class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card glass-card">
        <div class="order-header">
          <div class="order-meta">
            <span class="order-number">Order #{{ order.id }}</span>
            <span class="order-date">{{ order.date }}</span>
          </div>
          <span class="status-badge" :class="order.status.toLowerCase()">{{ order.status }}</span>
        </div>
        
        <div class="order-items">
          <div v-for="item in order.items" :key="item.name" class="order-item">
            <div class="item-icon-box">
              <img v-if="item.image" :src="getImageUrl(item.image)" :alt="item.name" class="item-img" />
              <PackageIcon v-else class="icon-sm" />
            </div>
            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-quantity">Qty: {{ item.qty }}</p>
            </div>
            <span class="item-price">{{ item.price }}</span>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">
            <span>Total Amount</span>
            <strong>{{ order.total }}</strong>
          </div>
          <div class="order-actions">
            <!-- Paid/Processing orders see Track and Details -->
            <template v-if="order.status !== 'Pending' && order.status !== 'Cancelled'">
              <router-link :to="`/account/orders/${order.id.replace('ORD-', '')}`" class="btn btn-outline btn-sm action-btn">Track Order</router-link>
              <router-link :to="`/account/orders/${order.id.replace('ORD-', '')}`" class="btn btn-primary btn-sm action-btn">Order Details</router-link>
            </template>
            <!-- Unpaid orders see Pay Now and Cancel -->
            <template v-else-if="order.status === 'Pending'">
              <button @click="cancelOrder(order.id)" class="btn btn-outline btn-sm action-btn" :disabled="isProcessing === order.id">
                {{ isProcessing === order.id ? 'Cancelling...' : 'Cancel Order' }}
              </button>
              <button @click="payNow(order)" class="btn btn-primary btn-sm action-btn">Pay Now</button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="section-card glass-card">
      <div class="empty-state">
        <ShoppingBagIcon class="empty-icon" />
        <h3>No Orders Yet</h3>
        <p>You haven't placed any orders for energy systems yet.</p>
        <router-link to="/marketplace" class="btn btn-primary mt-4">Browse Marketplace</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  ShoppingBag as ShoppingBagIcon,
  Package as PackageIcon
} from 'lucide-vue-next';

const orders = ref([]);
const loading = ref(true);
const isProcessing = ref(null);

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
};

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      loading.value = false;
      return;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      orders.value = await response.json();
    } else {
      console.error('Failed to fetch orders');
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const payNow = async (order) => {
  try {
    await loadPaystackScript();
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    
    // Amount is in naira in order.total string like "₦5,000", need to parse to number
    const amountStr = order.total.replace('₦', '').replace(/,/g, '');
    const amount = parseFloat(amountStr);

    const handler = window.PaystackPop.setup({
      key: paystackKey || 'pk_test_placeholder',
      email: user.email || 'customer@example.com',
      amount: amount * 100, // in kobo
      currency: 'NGN',
      callback: (response) => {
        verifyPayment(response.reference, order.id.replace('ORD-', ''), token);
      }
    });
    handler.openIframe();
  } catch (error) {
    console.error('Payment error:', error);
    alert('Failed to initialize payment');
  }
};

const verifyPayment = async (reference, orderId, token) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reference, orderId })
    });

    if (response.ok) {
      alert('Payment successful!');
      fetchOrders();
    } else {
      alert('Payment verification failed');
    }
  } catch (error) {
    console.error('Verify error:', error);
    alert('Error verifying payment');
  }
};

const cancelOrder = async (orderId) => {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  
  isProcessing.value = orderId;
  try {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason: 'not_paid' })
    });

    if (response.ok) {
      alert('Order cancelled successfully');
      fetchOrders();
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to cancel order');
    }
  } catch (error) {
    console.error('Cancel error:', error);
    alert('Error cancelling order');
  } finally {
    isProcessing.value = null;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
}

.order-card {
  padding: 16px;
  border-radius: 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-number {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
}

.order-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-badge.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge.shipped { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon-box {
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.item-quantity {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

.item-price {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.order-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

@media (min-width: 640px) {
  .order-footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
  }
}

.order-total {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

@media (min-width: 640px) {
  .order-total {
    flex-direction: column;
    align-items: flex-start;
    width: auto;
  }
}

.order-total span {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.order-total strong {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
}

.order-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

@media (min-width: 640px) {
  .order-actions {
    width: auto;
  }
}

.btn-sm {
  flex: 1;
  padding: 10px 0;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

@media (min-width: 640px) {
  .btn-sm {
    flex: none;
    padding: 8px 16px;
  }
}

.action-btn {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-outline:hover {
  background: var(--bg-secondary);
}

.btn-primary {
  background: var(--color-blue-primary);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.empty-state p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
}

.icon-sm { width: 16px; height: 16px; color: var(--text-secondary); }
</style>
