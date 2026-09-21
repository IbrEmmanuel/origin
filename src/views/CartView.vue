<template>
  <div class="cart-page">
    <div class="container cart-container py-xl">
      <!-- Minimalist Header -->
      <header class="page-header">
        <h1 class="page-title">Your Cart</h1>
        <p class="page-subtitle">Review your items and proceed to checkout.</p>
      </header>

      <div v-if="cartItems.length === 0" class="state-container">
        <ShoppingCartIcon class="empty-icon" />
        <h3 class="state-title">Your cart is empty</h3>
        <p class="state-text">Looks like you haven't added anything to your cart yet.</p>
        <router-link to="/marketplace" class="primary-btn mt-4 inline-block">Continue Shopping</router-link>
      </div>

      <div v-else class="cart-layout">
        <!-- Cart Items List -->
        <div class="cart-items-section">
          <div v-for="item in cartItems" :key="item.id" class="cart-item-card">
            <div class="item-image-wrapper">
              <PackageIcon v-if="!parseImages(item.images)[0]" class="fallback-icon" />
              <img v-else :src="getImageUrl(parseImages(item.images)[0])" :alt="item.name" class="product-img" />
            </div>
            
            <div class="item-details">
              <h3 class="item-title">{{ item.name }}</h3>
              <p class="item-vendor"><StoreIcon class="icon-xs inline-icon" /> {{ item.store_name }}</p>
              <div class="item-price">₦{{ Number(item.price).toLocaleString() }}</div>
            </div>

            <div class="item-actions">
               <div class="cart-stepper">
                  <button @click="updateQuantity(item.id, item.quantity - 1)" class="step-btn">
                     <MinusIcon class="icon-xs" v-if="item.quantity > 1"/>
                     <TrashIcon class="icon-xs text-danger" v-else/>
                  </button>
                  <span class="step-val">{{ item.quantity }}</span>
                  <button @click="addToCart(item, 1)" class="step-btn">
                     <PlusIcon class="icon-xs" />
                  </button>
               </div>
            </div>
            <div class="item-total">
               ₦{{ Number(item.price * item.quantity).toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <h3 class="summary-title">Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>₦{{ Number(cartTotal).toLocaleString() }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total-row">
            <span>Total</span>
            <span>₦{{ Number(cartTotal).toLocaleString() }}</span>
          </div>
          <router-link to="/checkout" class="primary-btn checkout-btn">Proceed to Checkout</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Package as PackageIcon, ShoppingCart as ShoppingCartIcon, Store as StoreIcon, Plus as PlusIcon, Minus as MinusIcon, Trash as TrashIcon } from 'lucide-vue-next';
import { useCart } from '@/composables/useCart';

const { cartItems, addToCart, updateQuantity, cartTotal } = useCart();

const parseImages = (images) => {
  try {
    if (typeof images === 'object' && images !== null) return images;
    return JSON.parse(images || '[]');
  } catch (e) {
    return [];
  }
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
};
</script>

<style scoped>
/* Page Level Overrides */
.cart-page {
  padding-top: 100px;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
  width: 100%;
}

.cart-container {
  padding-top: 3rem;
  padding-bottom: 5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Minimal Header */
.page-header {
  margin-bottom: 3.5rem;
  text-align: center;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.page-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  font-weight: 500;
  line-height: 1.4;
}

.cart-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 992px) {
  .cart-layout {
    flex-direction: row;
    align-items: flex-start;
  }
}

.cart-items-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item-card {
  display: grid;
  grid-template-columns: 84px 1fr;
  grid-template-areas: 
    "image details"
    "image actions";
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  gap: 8px 12px;
}

@media (min-width: 768px) {
  .cart-item-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    gap: 16px;
    border-radius: var(--radius-lg);
  }
}

.item-image-wrapper {
  grid-area: image;
  width: 84px;
  height: 84px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .item-image-wrapper {
    width: 100px;
    height: 100px;
  }
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fallback-icon {
  width: 40px;
  height: 40px;
  color: var(--border-color);
}

.item-details {
  grid-area: details;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.item-vendor {
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 0.5rem 0;
}

.item-price {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-blue-primary);
}

.item-actions {
  grid-area: actions;
  display: flex;
  align-items: center;
}

.cart-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 4px;
}

.step-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  transition: background 0.2s ease;
}

.step-btn:hover { background: var(--border-color); }
.text-danger { color: var(--color-orange-primary); }

.step-val {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
  padding: 0 16px;
  min-width: 20px;
  text-align: center;
}

.item-total {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  min-width: 120px;
  text-align: right;
  display: none;
}

@media (min-width: 768px) {
  .item-total { display: block; }
}

.order-summary {
  width: 100%;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

@media (min-width: 992px) {
  .order-summary { width: 380px; position: sticky; top: 120px; }
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--text-primary);
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 1.5rem 0;
}

.total-row {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.primary-btn {
  width: 100%;
  background: var(--color-blue-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 14px 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-bounce);
  text-align: center;
  text-decoration: none;
  display: block;
  font-family: var(--font-main);
  letter-spacing: 0em;
}

.primary-btn:hover {
  background: var(--color-blue-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.state-container {
  padding: 6rem 2rem;
  text-align: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  max-width: 600px;
  margin: 0 auto;
}
.empty-icon { width: 48px; height: 48px; color: var(--text-secondary); margin-bottom: 1rem; }
.state-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);}
.state-text { color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 500;}

.mt-4 { margin-top: 1.5rem; }
.inline-block { display: inline-block; width: auto; padding: 12px 24px; }
.inline-icon { display: inline-block; width: 14px; height: 14px; margin-right: 4px; }
</style>
