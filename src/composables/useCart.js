import { ref, computed, watch } from 'vue';

const CART_STORAGE_KEY = 'originelectric_cart';

// Shared state for the app
const cartItems = ref([]);

// Load from local storage
try {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    cartItems.value = JSON.parse(stored);
  }
} catch (e) {
  console.error('Failed to load cart', e);
}

// Watch and sync to localStorage
watch(cartItems, (newVal) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

export function useCart() {
  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.value.findIndex(item => item.id === product.id);
    if (existingIndex >= 0) {
      cartItems.value[existingIndex].quantity += quantity;
    } else {
      cartItems.value.push({ ...product, quantity });
    }
  };

  const removeFromCart = (productId) => {
    cartItems.value = cartItems.value.filter(item => item.id !== productId);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cartItems.value.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  };

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  const cartCount = computed(() => {
    return cartItems.value.reduce((count, item) => count + item.quantity, 0);
  });

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  };
}
