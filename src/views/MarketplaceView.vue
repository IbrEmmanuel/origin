<template>
  <div class="marketplace-page">
    <div class="container marketplace-container py-xl">
      
      <!-- Minimalist Header -->
      <header class="page-header">
        <h1 class="page-title">Marketplace</h1>
        <p class="page-subtitle">Curated energy goods from verified distributors. Designed for scale, simplicity, and savings.</p>
      </header>

      <!-- Minimal Filter Bar -->
      <div class="filter-section">
        <div class="search-box">
          <SearchIcon class="search-icon icon-sm" />
          <input type="text" v-model="searchQuery" placeholder="Search for products..." class="search-input" />
        </div>
        
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
               
               <button v-else @click="addToCart(product, 1)" class="primary-btn" :disabled="product.stock <= 0">
                 {{ product.stock > 0 ? 'Add to Cart' : 'Sold Out' }}
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
import { Package as PackageIcon, ShoppingCart as ShoppingCartIcon, Store as StoreIcon, Search as SearchIcon, Heart as HeartIcon, Eye as EyeIcon, Plus as PlusIcon, Minus as MinusIcon, Trash as TrashIcon } from 'lucide-vue-next';
import marketplaceService from '@/services/marketplace.service';
import { useCart } from '@/composables/useCart';
import ImageSlider from '@/components/ImageSlider.vue';

const { cartItems, addToCart, updateQuantity } = useCart();

const products = ref([]);
const productCategories = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('');
const favorites = ref([]);
const page = ref(1);
const totalPages = ref(1);

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
        page: page.value,
        limit: 20
      }),
      productCategories.value.length === 0
        ? marketplaceService.getCategories().catch(() => [])
        : Promise.resolve(productCategories.value)
    ]);
    
    // Handle products array — API returns { products: [], total, page, limit, totalPages }
    const newProducts = productsRes.products || productsRes || [];
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
watch([selectedCategory, searchQuery], () => {
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
/* Page Level Overrides */
.marketplace-page {
  padding-top: 0; /* Offset for the fixed headers */
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
  width: 100%;
}

.marketplace-container {
  padding-top: 1rem;
  padding-bottom: 5rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (max-width: 768px) {
  .marketplace-container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
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

/* Minimal Filter Area */
.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .filter-section {
    flex-direction: row;
    justify-content: space-between;
  }
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #86868b;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: none;
  background: var(--bg-secondary);
  border-radius: 999px;
  font-size: 0.95rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  background: var(--bg-primary);
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.15);
}

.category-pills {
  display: flex;
  gap: 0.5rem;
  padding-bottom: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  width: 100%;
  -webkit-overflow-scrolling: touch;
}
.category-pills::-webkit-scrollbar { display: none; }

.pill-btn {
  white-space: nowrap;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-btn:hover {
  background: var(--border-color);
}

.pill-btn.active {
  background: var(--color-blue-primary);
  color: #ffffff;
  border-color: var(--color-blue-primary);
}

/* Minimal Grid */
.minimal-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 1100px) {
  .minimal-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .minimal-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

@media (max-width: 420px) {
  .minimal-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* Borderless Card Concept */
.minimal-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s var(--transition-bounce);
}

.minimal-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-color);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.minimal-card:hover .product-img {
  transform: scale(1.04);
}

.fallback-icon {
  width: 54px;
  height: 54px;
  color: #d2d2d7;
}

.tag-vendor {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.5rem 0.25rem 0.25rem 0.25rem;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.meta-cat {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.15s ease;
}

.meta-cat:hover {
  color: var(--color-blue-primary);
}

.meta-stock {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-orange-primary);
}
.meta-stock.out { color: #ff3b30; }

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  transition: color 0.15s ease;
}

.card-title:hover {
  color: var(--color-blue-primary);
}

.card-price {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--color-blue-primary);
  margin-bottom: 1rem;
}

/* Action Row (Always Visible) */
.card-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  margin-top: auto;
}

.card-actions svg {
  width: 16px;
  height: 16px;
}

.primary-btn {
  flex: 1;
  background: var(--color-blue-primary);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.primary-btn:hover:not(:disabled) {
  background: var(--color-blue-dark);
  color: white;
}

.primary-btn:disabled {
  background: #cbd5e1;
  color: white;
  cursor: not-allowed;
  opacity: 1;
}

.cart-stepper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 4px;
}

.step-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  transition: background 0.2s ease;
}

.step-btn:hover { background: var(--bg-secondary); }
.text-danger { color: #ff3b30; }

.step-val {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
  padding: 0 10px;
}

.icon-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
}

.icon-primary-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.icon-primary-btn:hover {
  background: var(--color-blue-primary);
  color: white;
}

.icon-primary-btn.is-fav {
  color: #ff3b30;
}
.icon-primary-btn.is-fav svg {
  fill: #ff3b30;
}

/* Empty & Loaders */
.state-container {
  padding: 6rem 2rem;
  text-align: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}
.empty-icon { width: 48px; height: 48px; color: var(--text-secondary); margin-bottom: 1rem; }
.state-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);}
.state-text { color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 500;}
.clear-btn { 
  background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 10px 24px; border-radius: 999px;
  font-weight: 600; cursor: pointer; transition: background 0.2s ease;
}
.clear-btn:hover { background: var(--border-color); }

.loader {
  border: 4px solid rgba(0, 102, 204, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--color-blue-primary);
  width: 40px;
  height: 40px;
  animation: spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
  display: inline-block;
  margin-bottom: 1.5rem;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.load-more-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  width: 100%;
}

.load-more-btn {
  padding: 12px 32px;
  font-size: 1rem;
  background: var(--bg-secondary);
}
.load-more-btn:hover {
  background: var(--border-color);
}
</style>
