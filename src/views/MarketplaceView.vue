<template>
  <div class="marketplace-page">
    <div class="container marketplace-container py-xl">
      
      <!-- Premium Header -->
      <header class="page-header">
        <span class="mkt-eyebrow">Live catalog</span>
        <h1 class="page-title">Marketplace</h1>
        <p class="page-subtitle">Real inventory from verified distributors — prices and stock from the Origin API.</p>
      </header>

      <!-- Minimal Filter Bar -->
      <div class="filter-section">
        <div class="search-box">
          <SearchIcon class="search-icon icon-sm" />
          <input type="text" v-model="searchQuery" placeholder="Search for products..." class="search-input" />
        </div>

        <select v-model="sortBy" class="sort-select" aria-label="Sort products">
          <option value="">Sort: Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="name_asc">Name: A–Z</option>
        </select>
        
        <div class="category-pills">
           <button :class="['pill-btn', { active: selectedCategory === '' }]" @click="selectedCategory = ''">All</button>
           <button 
             v-for="cat in productCategories" 
             :key="cat.id" 
             :class="['pill-btn', { active: selectedCategory === cat.slug }]" 
             @click="selectedCategory = cat.slug"
           >
             {{ cat.name }}
           </button>
        </div>
      </div>

      <!-- Main Layout -->
      <div v-if="loading" class="state-container">
        <span class="loader"></span>
        <p class="state-text">Loading curated selection...</p>
      </div>

      <div v-else-if="products.length === 0" class="state-container">
        <PackageIcon class="empty-icon" />
        <h3 class="state-title">No matching products</h3>
        <p class="state-text">Try adjusting your search or category filters.</p>
        <button @click="resetFilters" class="clear-btn">Clear Filters</button>
      </div>

      <div v-else>
        <div class="minimal-grid">
          <div v-for="product in products" :key="product.id" class="minimal-card">
          
          <div class="card-image-wrapper">
            <ImageSlider :images="resolveImages(product.images)" :alt="product.name" @click-image="$router.push('/product/' + product.id)" />
            
            <div class="tag-vendor">
              <StoreIcon class="tag-icon icon-xs" /> {{ product.store_name }}
            </div>
          </div>

          <div class="card-content">
            <div class="card-meta">
              <span class="meta-cat" @click="$router.push('/product/' + product.id)">{{ product.category || 'Gear' }}</span>
              <span v-if="product.stock <= 5" class="meta-stock" :class="{ 'out': product.stock <= 0 }">
                {{ product.stock > 0 ? 'Low Stock' : 'Sold Out' }}
              </span>
            </div>
            
            <h3 class="card-title" :title="product.name" @click="$router.push('/product/' + product.id)">{{ product.name }}</h3>
            <div class="card-price">₦{{ Number(product.price).toLocaleString() }}</div>
            
            <!-- Visible Actions Row -->
            <div class="card-actions">
               <!-- Cart Button / Stepper -->
               <div v-if="getCartItem(product.id)" class="cart-stepper">
                  <button @click="updateQuantity(product.id, getCartItem(product.id).quantity - 1)" class="step-btn">
                     <MinusIcon class="icon-xs" v-if="getCartItem(product.id).quantity > 1"/>
                     <TrashIcon class="icon-xs text-danger" v-else/>
                  </button>
                  <span class="step-val">{{ getCartItem(product.id).quantity }}</span>
                  <button @click="addToCart(product, 1)" class="step-btn">
                     <PlusIcon class="icon-xs" />
                  </button>
               </div>
               
               <button v-else @click="onAddToCart(product)" class="primary-btn" :disabled="product.stock <= 0">
                 {{ product.stock > 0 ? 'Add to Cart' : 'Sold Out' }}
               </button>
               <button
                 v-if="product.stock > 0"
                 type="button"
                 class="buy-now-btn"
                 @click="onBuyNow(product)"
               >
                 Buy Now
               </button>
               
               <!-- Secondary Action Buttons -->
               <div class="icon-group">
                 <button class="icon-primary-btn" @click="toggleFavorite(product.id)" :class="{ 'is-fav': isFavorite(product.id) }" title="Favorite">
                   <HeartIcon class="icon-sm" />
                 </button>
                 <button class="icon-primary-btn" title="View Details" @click="$router.push('/product/' + product.id)">
                   <EyeIcon class="icon-sm" />
                 </button>
               </div>
            </div>
          </div>

        </div>
        
        <div v-if="page < totalPages" class="load-more-section">
           <button @click="loadMore" class="clear-btn load-more-btn">Load More Products</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Package as PackageIcon, Store as StoreIcon, Search as SearchIcon, Heart as HeartIcon, Eye as EyeIcon, Plus as PlusIcon, Minus as MinusIcon, Trash as TrashIcon } from 'lucide-vue-next';
import marketplaceService from '@/services/marketplace.service';
import { useCart } from '@/composables/useCart';
import ImageSlider from '@/components/ImageSlider.vue';

const router = useRouter();
const { cartItems, addToCart, updateQuantity, buyNow } = useCart();

const products = ref([]);
const productCategories = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('');
const favorites = ref([]);
const page = ref(1);
const totalPages = ref(1);

const onAddToCart = (product) => {
  addToCart(product, 1);
  marketplaceService.trackEvent({ type: 'add_to_cart', product_id: product.id });
};

const onBuyNow = (product) => {
  const path = buyNow(product, 1);
  marketplaceService.trackEvent({ type: 'buy_now', product_id: product.id });
  router.push(path);
};

const applyClientSort = (list) => {
  const arr = [...list];
  switch (sortBy.value) {
    case 'price_asc':
      return arr.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price_desc':
      return arr.sort((a, b) => Number(b.price) - Number(a.price));
    case 'name_asc':
      return arr.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    case 'newest':
      return arr.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    default:
      return arr;
  }
};

// Load favorites from local storage
try {
  const savedFavs = localStorage.getItem('originelectric_favorites');
  if (savedFavs) favorites.value = JSON.parse(savedFavs);
} catch (e) {}

const isFavorite = (id) => favorites.value.includes(id);

const toggleFavorite = (id) => {
  if (isFavorite(id)) {
    favorites.value = favorites.value.filter(favId => favId !== id);
  } else {
    favorites.value.push(id);
  }
  localStorage.setItem('originelectric_favorites', JSON.stringify(favorites.value));
};

const getCartItem = (productId) => {
  return cartItems.value.find(item => item.id === productId);
};

const fetchProducts = async (reset = false) => {
  if (reset) page.value = 1;
  if (reset) loading.value = true;
  
  try {
    // Fetch products and categories in parallel
    // Use limit=20 to show more products per page
    const [productsRes, categoriesRes] = await Promise.all([
      marketplaceService.getProducts({
        category: selectedCategory.value || undefined,
        search: searchQuery.value || undefined,
        sort: sortBy.value || undefined,
        page: page.value,
        limit: 20
      }),
      productCategories.value.length === 0
        ? marketplaceService.getCategories().catch(() => [])
        : Promise.resolve(productCategories.value)
    ]);
    
    // Handle products array — API returns { products: [], total, page, limit, totalPages }
    let newProducts = productsRes.products || productsRes || [];
    newProducts = applyClientSort(newProducts);
    if (reset) {
       products.value = newProducts;
    } else {
       products.value.push(...newProducts);
    }

    // Handle categories — API returns { value: [], Count: N }
    if (productCategories.value.length === 0) {
      const cats = categoriesRes;
      if (Array.isArray(cats)) {
        productCategories.value = cats;
      } else if (cats && Array.isArray(cats.value)) {
        productCategories.value = cats.value;
      } else if (cats && typeof cats === 'object') {
        productCategories.value = Object.entries(cats).map(([slug, name]) => ({
          id: slug, slug, name: typeof name === 'string' ? name : slug
        }));
      }
    }

    totalPages.value = productsRes.totalPages || 1;
  } catch (err) {
    console.error('Failed to load marketplace products', err);
  } finally {
    loading.value = false;
  }
};

let searchTimeout;
watch([selectedCategory, searchQuery, sortBy], () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchProducts(true);
    }, 500);
});

const loadMore = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchProducts(false);
    }
};

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
  // Use production API base for relative paths
  const base = import.meta.env.VITE_API_BASE_URL || 'https://api.originelectricltd.com';
  return `${base}${path}`;
};

const resolveImages = (imagesStr) => {
  const arr = parseImages(imagesStr);
  return arr.map(img => getImageUrl(img));
};

const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = '';
};

onMounted(() => {
  fetchProducts(true);
});
</script>

<style scoped>
.marketplace-page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-main);
  overflow-x: hidden;
  width: 100%;
}

.marketplace-container {
  padding-top: 1.25rem;
  padding-bottom: 5.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: min(100% - 0rem, 1200px);
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: left;
}
.mkt-eyebrow {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  margin-bottom: 0.85rem;
  border: 1px solid rgba(255, 118, 0, 0.35);
  border-radius: var(--radius-xs);
  background: rgba(255, 118, 0, 0.08);
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.page-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 550;
  letter-spacing: -0.03em;
  margin: 0 0 0.65rem;
  color: var(--text-primary);
  line-height: 1.1;
}
.page-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 36rem;
  margin: 0;
  line-height: 1.55;
}

.filter-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 1.75rem;
  align-items: stretch;
}
.search-box {
  position: relative;
  width: 100%;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}
.search-input {
  width: 100%;
  height: 46px;
  padding: 0 14px 0 42px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  color: var(--text-primary);
  font-family: inherit;
  box-sizing: border-box;
}
.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 118, 0, 0.12);
  background: var(--bg-primary);
}
.sort-select {
  height: 46px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font: inherit;
  font-size: 0.875rem;
  width: 100%;
}
.category-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2px;
}
.category-pills::-webkit-scrollbar { display: none; }
.pill-btn {
  flex: 0 0 auto;
  height: 40px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color-strong);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s ease;
}
.pill-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.pill-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

/* Premium responsive grid — mobile first */
.minimal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-items: stretch;
}
@media (min-width: 480px) {
  .minimal-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
}
@media (min-width: 900px) {
  .minimal-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
}
@media (min-width: 1200px) {
  .minimal-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
}

.minimal-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: 10px;
  border: 1px solid var(--border-color);
  box-shadow: none;
  transition: transform 0.3s var(--transition-bounce), box-shadow 0.3s, border-color 0.2s;
}
.minimal-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: rgba(255, 118, 0, 0.35);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 0.65rem;
}
.tag-vendor {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 5px 9px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--glass-border);
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 5px;
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.15rem 0.15rem 0.1rem;
  text-align: left;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.35rem;
}
.meta-cat {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  cursor: pointer;
}
.meta-cat:hover { color: var(--color-primary); }
.meta-stock {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-primary);
}
.meta-stock.out { color: var(--color-error); }

.card-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 550;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 0 0 0.4rem;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
}
.card-title:hover { color: var(--color-primary); }

.card-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.85rem;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: auto;
}
.card-actions .primary-btn,
.card-actions .buy-now-btn,
.card-actions .cart-stepper {
  grid-column: 1 / -1;
}
.card-actions .icon-group {
  grid-column: 1 / -1;
}

.primary-btn,
.buy-now-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: 100%;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.18s, transform 0.2s var(--transition-bounce), border-color 0.18s;
}
.primary-btn {
  background: var(--color-primary);
  color: #fff;
  border: 1px solid var(--color-primary);
}
.primary-btn:hover:not(:disabled) {
  background: var(--color-primary-light);
  border-color: var(--color-primary-light);
  transform: translateY(-1px);
}
.primary-btn:disabled {
  background: var(--border-color-strong);
  border-color: var(--border-color-strong);
  color: var(--text-muted);
  cursor: not-allowed;
}
.buy-now-btn {
  background: var(--color-dark);
  color: var(--color-light);
  border: 1px solid var(--color-dark);
}
.buy-now-btn:hover {
  background: #1a1a1a;
  transform: translateY(-1px);
}

.cart-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 4px;
  height: 42px;
}
.step-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
}
.text-danger { color: var(--color-error); }
.step-val {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.icon-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}
.icon-primary-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.18s ease;
}
.icon-primary-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.icon-primary-btn.is-fav { color: var(--color-error); }
.icon-primary-btn.is-fav svg { fill: var(--color-error); }

.state-container {
  padding: 3.5rem 1.25rem;
  text-align: left;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}
.empty-icon { width: 40px; height: 40px; color: var(--text-muted); margin-bottom: 0.75rem; }
.state-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 550;
  margin-bottom: 0.4rem;
  color: var(--text-primary);
}
.state-text { color: var(--text-secondary); margin-bottom: 1.25rem; }
.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 20px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
.clear-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

.loader {
  border: 3px solid var(--border-color);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-bottom: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

.load-more-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;
}
.load-more-btn { width: min(100%, 280px); }

@media (min-width: 768px) {
  .filter-section {
    grid-template-columns: minmax(0, 1.4fr) minmax(160px, 0.5fr);
    align-items: center;
  }
  .category-pills { grid-column: 1 / -1; }
  .page-header { margin-bottom: 2.5rem; }
  .marketplace-container { padding-left: 1.5rem; padding-right: 1.5rem; }
}

@media (max-width: 479px) {
  .card-actions {
    grid-template-columns: 1fr;
  }
}
</style>
