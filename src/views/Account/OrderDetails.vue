<template>
  <div class="order-details-container">
    <div class="header-action">
      <router-link to="/account/orders" class="back-link">
        <ArrowLeftIcon class="icon-sm" /> Back to Orders
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="loader"></span>
      <p>Loading order details...</p>
    </div>

    <div v-else-if="!order" class="empty-state">
      <PackageIcon class="empty-icon" />
      <h3>Order Not Found</h3>
      <p>We couldn't find the details for this order.</p>
    </div>

    <div v-else class="order-content">
      <div class="glass-card header-card">
        <div class="header-info">
          <h2 class="order-id">Order #{{ order.id }}</h2>
          <p class="order-date">Placed on {{ order.date }}</p>
        </div>
        <div class="header-status">
          <span class="status-badge" :class="order.status.toLowerCase()">{{ order.status }}</span>
        </div>
      </div>

      <div class="details-grid">
        <!-- Order Items -->
        <div class="glass-card items-card">
          <h3 class="section-title">Items Ordered</h3>
          <div class="items-list">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-icon-box">
                <img v-if="item.image" :src="getImageUrl(item.image)" :alt="item.name" class="item-img" />
                <PackageIcon v-else class="icon-md" />
              </div>
              <div class="item-info">
                <p class="item-name">{{ item.name }}</p>
                <div class="item-meta">
                  <span class="item-qty">Qty: {{ item.qty }}</span>
                  <router-link 
                    v-if="order.status === 'Delivered' && !item.is_rated" 
                    :to="`/product/${item.product_id}#reviews`" 
                    class="btn-rate"
                  >
                    <StarIcon class="icon-xs" /> Rate Product
                  </router-link>
                  <span v-else-if="item.is_rated" class="rated-badge">
                    <CheckCircleIcon class="icon-xs" /> Rated
                  </span>
                </div>
              </div>
              <div class="item-price">{{ item.price }}</div>
            </div>
          </div>
        </div>

        <!-- Order Summary & Delivery info -->
        <div class="side-panel">
          <div class="glass-card summary-card mb-4">
            <h3 class="section-title">Order Summary</h3>
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-val">{{ order.subtotal }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Delivery Fee</span>
              <span class="summary-val">{{ order.delivery_fee }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total-row">
              <span class="summary-label">Total Amount</span>
              <span class="summary-val">{{ order.total }}</span>
            </div>
          </div>

          <div class="glass-card delivery-card">
            <h3 class="section-title">Delivery Information</h3>
            <div class="info-block">
              <p class="info-label">Address</p>
              <p class="info-data">{{ order.delivery_address }}</p>
            </div>
            <div class="info-block mt-3">
              <p class="info-label">Contact Phone</p>
              <p class="info-data">{{ order.contact_phone }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Timeline Tracking -->
      <div class="glass-card timeline-card mt-4">
        <h3 class="section-title">Tracking History</h3>
        <div class="tracking-timeline">
          <!-- 1. Order Placed -->
           <div class="timeline-step completed">
              <div class="step-icon"><CheckIcon class="icon-xs" /></div>
              <div class="step-content">
                 <h4>Order Placed</h4>
                 <p>Your order has been placed successfully.</p>
              </div>
           </div>
           
           <!-- 2. Payment Confirmed -->
           <div class="timeline-step" :class="{ completed: order.status !== 'Pending' }">
              <div class="step-icon">
                <ClockIcon class="icon-xs" v-if="order.status === 'Pending'" />
                <CheckIcon class="icon-xs" v-else />
              </div>
              <div class="step-content">
                 <h4>Payment Confirmed</h4>
                 <p>Your payment was successful and verified.</p>
              </div>
           </div>

           <!-- 3. Accepted by Vendor -->
           <div class="timeline-step" :class="{ completed: ['Accepted', 'Packaged', 'Shipped', 'Delivered'].includes(order.status) }">
              <div class="step-icon"><StoreIcon class="icon-xs" /></div>
              <div class="step-content">
                 <h4>Accepted by Vendor</h4>
                 <p>The vendor has acknowledged your order.</p>
              </div>
           </div>

           <!-- 4. Ready for Dispatch -->
           <div class="timeline-step" :class="{ completed: ['Packaged', 'Shipped', 'Delivered'].includes(order.status) }">
              <div class="step-icon"><PackageIcon class="icon-xs" /></div>
              <div class="step-content">
                 <h4>Ready for Dispatch</h4>
                 <p>Your items are packaged and ready for delivery.</p>
              </div>
           </div>
           
           <!-- 5. Shipped -->
           <div class="timeline-step" :class="{ completed: ['Shipped', 'Delivered'].includes(order.status) }">
              <div class="step-icon"><TruckIcon class="icon-xs" /></div>
              <div class="step-content">
                 <h4>Out for Delivery</h4>
                 <p>Your order has been collected and is on the way.</p>
              </div>
           </div>
           
           <!-- 6. Delivered -->
           <div class="timeline-step" :class="{ completed: order.status === 'Delivered' }">
              <div class="step-icon"><MapPinIcon class="icon-xs" /></div>
              <div class="step-content">
                 <h4>Delivered</h4>
                 <p>Your order has been delivered successfully.</p>
              </div>
           </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  ArrowLeft as ArrowLeftIcon, 
  Package as PackageIcon, 
  Check as CheckIcon, 
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon, 
  MapPin as MapPinIcon, 
  Store as StoreIcon, 
  Truck as TruckIcon,
  Star as StarIcon
} from 'lucide-vue-next';

const route = useRoute();
const order = ref(null);
const loading = ref(true);

const fetchOrderDetails = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/user/orders/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      order.value = await res.json();
    } else {
      console.error('Failed to fetch order details');
    }
  } catch (err) {
    console.error('Error fetching order:', err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
};

onMounted(() => {
  fetchOrderDetails();
});
</script>

<style scoped>
.order-details-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
}

.header-action {
  margin-bottom: 8px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.back-link:hover { color: var(--color-blue-primary); }

.glass-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.order-id { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 4px 0; }
.order-date { font-size: 0.95rem; color: var(--text-secondary); margin: 0; }

.status-badge {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: capitalize;
}

.status-badge.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge.shipped { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.status-badge.processing { background: rgba(0, 102, 204, 0.1); color: #0066cc; }
.status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 992px) {
  .details-grid { grid-template-columns: 2fr 1fr; }
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.order-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.item-icon-box {
  width: 64px;
  height: 64px;
  background: var(--bg-secondary);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info { flex: 1; min-width: 0; }
.item-name { font-weight: 700; font-size: 1rem; color: var(--text-primary); margin: 0 0 6px 0; }

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-qty { font-size: 0.85rem; color: var(--text-secondary); }

.btn-rate {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  color: #0066cc;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-rate:hover {
  background: #0066cc;
  color: white;
}

.rated-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #10b981;
  font-size: 0.75rem;
  font-weight: 700;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 8px;
}

.item-price { font-weight: 800; font-size: 1.1rem; color: var(--text-primary); margin-left: auto; }

.summary-row {
  display: flex; justify-content: space-between; margin-bottom: 12px;
}
.summary-label { color: var(--text-secondary); font-size: 0.95rem; }
.summary-val { color: var(--text-primary); font-weight: 600; font-size: 0.95rem; }

.summary-divider {
  height: 1px; background: var(--border-color); margin: 16px 0;
}
.total-row .summary-label { font-weight: 700; color: var(--text-primary); }
.total-row .summary-val { font-weight: 800; font-size: 1.25rem; color: var(--color-blue-primary); }

.info-label { font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 4px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.info-data { font-size: 0.95rem; color: var(--text-primary); margin: 0; line-height: 1.5; }

.tracking-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.timeline-step {
  display: flex;
  gap: 16px;
  opacity: 0.4;
}
.timeline-step.completed { opacity: 1; }

.step-icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--border-color);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary);
  flex-shrink: 0;
  position: relative;
}
.timeline-step:not(:last-child) .step-icon::after {
  content: '';
  position: absolute;
  top: 32px; left: 15px;
  width: 2px; height: 32px;
  background: var(--border-color);
}

.timeline-step.completed .step-icon {
  background: var(--color-blue-primary); color: white;
}
.timeline-step.completed:not(:last-child) .step-icon::after {
  background: var(--color-blue-primary);
}

.step-content h4 { margin: 0 0 4px 0; font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.step-content p { margin: 0; font-size: 0.85rem; color: var(--text-secondary); }

.loading-state, .empty-state { text-align: center; padding: 60px 20px; }
.loader { display: inline-block; width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: var(--color-blue-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-icon { width: 48px; height: 48px; color: var(--text-secondary); margin-bottom: 16px; }

.mt-3 { margin-top: 16px; }
.mt-4 { margin-top: 24px; }
.mb-4 { margin-bottom: 24px; }
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 24px; height: 24px; color: var(--text-secondary); }
.icon-xs { width: 14px; height: 14px; }
</style>
