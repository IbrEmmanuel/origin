<template>
  <div class="checkout-page">
    <div class="container py-xl">
      <header class="page-header">
        <h1 class="page-title">Checkout</h1>
      </header>

      <div class="checkout-layout">
        <!-- Delivery Details -->
        <div class="checkout-form-section glass-card">
          <h2 class="section-title">Delivery Details</h2>
          
          <div v-if="loadingProfile" class="loading-state">
            <span class="loader"></span> Loading addresses...
          </div>
          
          <div v-else class="address-selection">
            <div v-if="savedAddresses.length > 0" class="saved-addresses mb-4">
              <h3 class="subtitle">Select Saved Address</h3>
              <div class="address-options">
                <div v-for="addr in savedAddresses" :key="addr.id" 
                     class="address-card" 
                     :class="{'selected': selectedAddressId === addr.id}"
                     @click="selectAddress(addr)">
                  <p class="addr-type">{{ addr.type || 'Home' }}</p>
                  <p class="addr-text">{{ addr.fullAddress }}</p>
                </div>
              </div>
              <button class="text-btn mt-2" @click="selectedAddressId = null">Or enter a new address</button>
            </div>
            
            <form class="new-address-form" @submit.prevent>
              <h3 class="subtitle">{{ selectedAddressId ? 'Confirm Delivery Details' : 'New Address info' }}</h3>
              <div class="form-group">
                <label>Contact Phone</label>
                <input type="tel" v-model="form.phone" class="form-input" placeholder="08012345678" required />
              </div>
              
              <div class="form-row">
                <div class="form-group half">
                  <label>Street Address</label>
                  <input type="text" v-model="form.street" class="form-input" placeholder="123 Main St" required />
                </div>
                <div class="form-group half">
                  <label>City</label>
                  <input type="text" v-model="form.city" class="form-input" placeholder="Lagos" required />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group third">
                  <label>State</label>
                  <input type="text" v-model="form.state" class="form-input" placeholder="Lagos" required />
                </div>
                <div class="form-group third">
                  <label>Country</label>
                  <input type="text" v-model="form.country" class="form-input" placeholder="Nigeria" required />
                </div>
                <div class="form-group third">
                  <label>Postal Code (Optional)</label>
                  <input type="text" v-model="form.postalCode" class="form-input" placeholder="100001" />
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary-section glass-card">
          <h2 class="section-title">Order Summary</h2>
          <div class="items-preview">
            <div class="summary-item" v-for="item in cartItems" :key="item.id">
              <span class="qty">{{ item.quantity }}x</span>
              <span class="name">{{ item.name }}</span>
              <span class="price">₦{{ Number(item.price * item.quantity).toLocaleString() }}</span>
            </div>
          </div>
          
          <div class="summary-divider"></div>
          
          <div class="totals">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₦{{ Number(cartTotal).toLocaleString() }}</span>
            </div>
            <div class="summary-row">
              <span>Delivery Fee</span>
              <span>₦{{ Number(deliveryFee).toLocaleString() }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total-row">
              <span>Total</span>
              <span>₦{{ Number(grandTotal).toLocaleString() }}</span>
            </div>
          </div>
          
          <button @click="processCheckout" class="primary-btn mt-4 full-width" :disabled="isProcessing || cartItems.length === 0">
            {{ isProcessing ? 'Processing...' : 'Pay with Paystack' }}
          </button>
          <p v-if="error" class="error-msg mt-2">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/composables/useCart';

const router = useRouter();
const { cartItems, cartTotal, removeFromCart } = useCart();

const loadingProfile = ref(true);
const savedAddresses = ref([]);
const selectedAddressId = ref(null);
const userPhone = ref('');
const isProcessing = ref(false);
const error = ref('');

const form = ref({
  phone: '',
  street: '',
  city: '',
  state: '',
  country: '',
  postalCode: ''
});

const deliveryFee = ref(2000);
const grandTotal = computed(() => {
  return cartTotal.value + deliveryFee.value;
});

const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login?redirect=/checkout');
    return;
  }
  
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      savedAddresses.value = data.addresses || [];
      userPhone.value = data.user.phone || '';
      form.value.phone = userPhone.value;
      
      const defaultAddr = savedAddresses.value.find(a => a.isDefault) || savedAddresses.value[0];
      if (defaultAddr) {
        selectAddress(defaultAddr);
      }
    }
  } catch (err) {
    console.error('Failed to load profile', err);
  } finally {
    loadingProfile.value = false;
  }
};

const selectAddress = (addr) => {
  selectedAddressId.value = addr.id;
  // Make a best guess parsing of the single string fullAddress
  const parts = (addr.fullAddress || '').split(',').map(s => s.trim());
  form.value.street = parts[0] || '';
  form.value.city = parts[1] || '';
  form.value.state = parts.length > 2 ? parts[2] : '';
  form.value.country = 'Nigeria'; // default guess
  form.value.postalCode = '';
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

const processCheckout = async () => {
  error.value = '';
  if (!form.value.street || !form.value.city || !form.value.state || !form.value.country || !form.value.phone) {
    error.value = 'Please fill out all required delivery address components and your contact phone number.';
    return;
  }

  isProcessing.value = true;
  try {
    await loadPaystackScript();
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Create pending order
    const checkoutRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/user/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cartItems.value.map(item => ({ id: item.id, quantity: item.quantity })),
        delivery_street: form.value.street,
        delivery_city: form.value.city,
        delivery_state: form.value.state,
        delivery_country: form.value.country,
        delivery_postal_code: form.value.postalCode,
        contact_phone: form.value.phone
      })
    });
    
    if (!checkoutRes.ok) throw new Error('Failed to create order');
    const orderData = await checkoutRes.json();
    
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
       console.error("VITE_PAYSTACK_PUBLIC_KEY is not set.");
    }
    
    // Initialize Paystack
    const handler = window.PaystackPop.setup({
      key: paystackKey || 'pk_test_placeholder',
      email: user.email || 'customer@example.com',
      amount: orderData.total * 100, // in kobo
      currency: 'NGN',
      callback: (response) => {
        // Handle verification in an async self-invoking function if needed, 
        // or just call an async method
        verifyPayment(response, orderData.orderId, token);
      },
      onClose: () => {
        isProcessing.value = false;
      }
    });
    handler.openIframe();
  } catch (err) {
    error.value = err.message || 'An error occurred during checkout.';
    isProcessing.value = false;
  }
};

const verifyPayment = async (response, orderId, token) => {
  try {
    const verifyRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/user/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reference: response.reference, orderId })
    });
    
    if (verifyRes.ok) {
      // Clear cart items
      cartItems.value.forEach(item => removeFromCart(item.id));
      router.push('/order-success');
    } else {
       error.value = 'Payment verification failed.';
       isProcessing.value = false;
    }
  } catch (err) {
    error.value = 'Error verifying payment';
    isProcessing.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.checkout-page {
  padding-top: 100px;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
}

.checkout-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 992px) {
  .checkout-layout {
    flex-direction: row;
    align-items: flex-start;
  }
  .checkout-form-section { flex: 2; }
  .order-summary-section { flex: 1; position: sticky; top: 100px; }
}

.glass-card {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.address-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address-card {
  border: 2px solid var(--border-color);
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-primary);
}

.address-card:hover { border-color: #b0c4de; }
.address-card.selected { border-color: var(--color-blue-primary); background: rgba(0, 102, 204, 0.05); }

.addr-type { font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; }
.addr-text { font-size: 0.95rem; color: var(--text-secondary); }

.text-btn {
  background: none;
  border: none;
  color: var(--color-blue-primary);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-blue-primary);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group.half {
  flex: 1;
}

.form-group.third {
  flex: 1;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

.summary-item {
  display: flex;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.summary-item .qty { font-weight: 700; color: var(--color-blue-primary); margin-right: 8px; }
.summary-item .name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 12px; }
.summary-item .price { font-weight: 700; }

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 1.5rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.total-row {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.primary-btn {
  background: var(--color-blue-primary);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.primary-btn.full-width { width: 100%; }
.primary-btn:hover:not(:disabled) { background: var(--color-blue-dark); }
.primary-btn:disabled { background: #cbd5e1; cursor: not-allowed; }

.error-msg {
  color: #ff3b30;
  font-size: 0.9rem;
  text-align: center;
}
.mt-4 { margin-top: 1.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
</style>
