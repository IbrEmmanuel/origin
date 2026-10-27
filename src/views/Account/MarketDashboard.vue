<template>
  <div class="market">
    <div class="filter-bar">
      <div class="search-box">
        <SearchIcon class="search-icon" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search live catalog…"
          class="search-input"
          autocomplete="off"
        />
      </div>

      <div class="category-pills" role="tablist" aria-label="Categories">
        <button
          v-for="cat in productCategories"
          :key="cat.id"
          type="button"
          class="pill"
          :class="{ active: selectedCategory === cat.slug }"
          @click="selectedCategory = cat.slug"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="state">
      <span class="loader"></span>
      <p>Loading marketplace…</p>
    </div>

    <div v-else-if="!products.length" class="state empty">
      <PackageIcon class="empty-icon" />
      <h3>No products found</h3>
      <p>Try another search or category.</p>
      <button type="button" class="btn ghost" @click="resetFilters">Reset filters</button>
    </div>

    <template v-else>
      <div class="grid">
        <article v-for="product in products" :key="product.id" class="card">
          <button type="button" class="media" @click="goProduct(product.id)">
            <img :src="resolvePrimaryImage(product.images)" :alt="product.name" />
            <span class="vendor">
              <StoreIcon />
              {{ product.store_name || 'Origin' }}
            </span>
          </button>

          <div class="body">
            <div class="meta">
              <span class="cat">{{ product.category || 'Gear' }}</span>
              <span v-if="product.stock <= 0" class="stock out">Sold out</span>
              <span v-else-if="product.stock <= 5" class="stock">Low stock</span>
            </div>

            <h3 class="title" @click="goProduct(product.id)">{{ product.name }}</h3>
            <p class="price">₦{{ Number(product.price).toLocaleString() }}</p>

            <div class="actions">
              <template v-if="getCartItem(product.id)">
                <div class="stepper">
                  <button type="button" class="step" @click="updateQuantity(product.id, getCartItem(product.id).quantity - 1)">
                    <MinusIcon v-if="getCartItem(product.id).quantity > 1" />
                    <TrashIcon v-else class="danger" />
                  </button>
                  <span>{{ getCartItem(product.id).quantity }}</span>
                  <button type="button" class="step" @click="addToCart(product, 1)">
                    <PlusIcon />
                  </button>
                </div>
              </template>
              <button
                v-else
                type="button"
                class="btn cart"
                :disabled="product.stock <= 0"
                @click="onAddToCart(product)"
              >
                {{ product.stock > 0 ? 'Add to cart' : 'Sold out' }}
              </button>

              <button
                v-if="product.stock > 0"
                type="button"
                class="btn buy"
                @click="onBuyNow(product)"
              >
                Buy now
              </button>
            </div>
          </div>
        </article>
      </div>

      <div v-if="page < totalPages" class="more">
        <button type="button" class="btn ghost" :disabled="loadingMore" @click="loadMore">
          {{ loadingMore ? 'Loading…' : 'Load more' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search as SearchIcon,
  Package as PackageIcon,
  Store as StoreIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Trash2 as TrashIcon
} from 'lucide-vue-next';
import marketplaceService, {
  normalizeProductsResponse,
  normalizeCategories
} from '@/services/marketplace.service';
import { useCart } from '@/composables/useCart';
import { firstMediaUrl } from '@/utils/mediaUrl';

const router = useRouter();
const { cartItems, addToCart, updateQuantity, buyNow } = useCart();

const products = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');
const page = ref(1);
const totalPages = ref(1);
const productCategories = ref([]);

const getCartItem = (id) => cartItems.value.find((item) => item.id === id);
const resolvePrimaryImage = (imagesStr) => firstMediaUrl(imagesStr);
const goProduct = (id) => router.push(`/product/${id}`);

const onAddToCart = (product) => {
  addToCart(product, 1);
  marketplaceService.trackEvent?.({ type: 'add_to_cart', product_id: product.id });
};

const onBuyNow = (product) => {
  const path = buyNow(product, 1);
  marketplaceService.trackEvent?.({ type: 'buy_now', product_id: product.id });
  router.push(path);
};

const fetchProducts = async (reset = false) => {
  if (reset) {
    page.value = 1;
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      marketplaceService.getProducts({
        category: selectedCategory.value,
        search: searchQuery.value,
        page: page.value,
        limit: 8
      }),
      marketplaceService.getCategories()
    ]);

    const normalized = normalizeProductsResponse(productsRes);
    if (reset) products.value = normalized.products;
    else products.value.push(...normalized.products);

    productCategories.value = [
      { id: 'all', name: 'All', slug: '' },
      ...normalizeCategories(categoriesRes)
    ];
    totalPages.value = normalized.totalPages || 1;
  } catch (err) {
    console.error('Market sync failed', err);
    if (reset) products.value = [];
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  if (page.value < totalPages.value) {
    page.value += 1;
    fetchProducts(false);
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
};

let searchTimeout;
watch([selectedCategory, searchQuery], () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchProducts(true), 400);
});

onMounted(() => fetchProducts(true));
</script>

<style scoped>
.market {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
}

.search-box { position: relative; width: 100%; }

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  min-height: 48px;
  padding: 0.7rem 0.9rem 0.7rem 2.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font: inherit;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--color-primary) 50%, var(--border-color));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 16%, transparent);
}

.category-pills {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.category-pills::-webkit-scrollbar { display: none; }

.pill {
  flex-shrink: 0;
  min-height: 36px;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-weight: 650;
  font-size: 0.82rem;
  font-family: inherit;
  cursor: pointer;
}

.pill.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
}

.state h3 { margin: 0; color: var(--text-primary); font-family: var(--font-display); font-weight: 500; }
.state p { margin: 0; }
.empty-icon { width: 36px; height: 36px; opacity: 0.45; }

.loader {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
  overflow: hidden;
}

.media {
  position: relative;
  aspect-ratio: 1;
  border: none;
  padding: 0;
  cursor: pointer;
  background: var(--bg-primary);
  overflow: hidden;
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vendor {
  position: absolute;
  top: 8px;
  left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg-secondary) 88%, transparent);
  border: 1px solid var(--border-color);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-primary);
  max-width: calc(100% - 16px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vendor :deep(svg) { width: 11px; height: 11px; flex-shrink: 0; }

.body {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.75rem;
  flex: 1;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
}

.cat {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.stock { font-size: 0.68rem; font-weight: 700; color: #f59e0b; }
.stock.out { color: var(--color-error); }

.title {
  margin: 0;
  font-size: clamp(0.85rem, 2.8vw, 0.98rem);
  font-weight: 700;
  line-height: 1.3;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4em;
}

.price {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-primary);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  margin-top: auto;
  padding-top: 0.35rem;
}

.actions:has(.stepper) {
  grid-template-columns: 1.2fr 1fr;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 0.55rem;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  font-size: 0.78rem;
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btn.cart {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color-strong, var(--border-color));
}

.btn.buy {
  background: var(--color-primary);
  color: #fff;
}

.btn.ghost {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  min-width: 140px;
}

.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 0.25rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.stepper span {
  font-weight: 800;
  font-size: 0.88rem;
  min-width: 1.25rem;
  text-align: center;
}

.step {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 8px;
}

.step :deep(svg) { width: 14px; height: 14px; }
.step .danger { color: var(--color-error); }

.more {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0 0.25rem;
}

@media (min-width: 720px) {
  .filter-bar {
    flex-direction: row;
    align-items: center;
  }
  .search-box { max-width: 320px; }
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
  .actions { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 380px) {
  .grid { grid-template-columns: 1fr; }
  .actions { grid-template-columns: 1fr; }
}
</style>
