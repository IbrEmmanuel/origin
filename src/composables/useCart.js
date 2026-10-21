import { ref, computed, watch } from 'vue';

const CART_STORAGE_KEY = 'originelectric_cart';

const cartItems = ref([]);

try {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    cartItems.value = JSON.parse(stored);
  }
} catch (e) {
  console.error('Failed to load cart', e);
}

watch(cartItems, (newVal) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

const normalizeProduct = (product) => ({
  id: product.id,
  name: product.name,
  price: Number(product.price) || 0,
  stock: product.stock != null ? Number(product.stock) : undefined,
  images: product.images,
  store_name: product.store_name,
  category: product.category,
  sku: product.sku
});

export function useCart() {
  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const existingIndex = cartItems.value.findIndex(item => item.id === product.id);
    const stock = product.stock != null ? Number(product.stock) : Infinity;

    if (existingIndex >= 0) {
      const next = cartItems.value[existingIndex].quantity + qty;
      cartItems.value[existingIndex].quantity = Math.min(next, stock);
      if (product.price != null) {
        cartItems.value[existingIndex].price = Number(product.price);
      }
      if (product.stock != null) {
        cartItems.value[existingIndex].stock = Number(product.stock);
      }
    } else {
      cartItems.value.push({
        ...normalizeProduct(product),
        quantity: Math.min(qty, stock)
      });
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
      const stock = item.stock != null ? Number(item.stock) : Infinity;
      item.quantity = Math.min(Number(quantity) || 1, stock);
    }
  };

  const clearCart = () => {
    cartItems.value = [];
  };

  /** Replace cart with a single product and return path for checkout */
  const buyNow = (product, quantity = 1) => {
    clearCart();
    addToCart(product, quantity);
    return '/checkout';
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
    clearCart,
    buyNow,
    cartTotal,
    cartCount
  };
}
