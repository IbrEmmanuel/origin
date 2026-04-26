<template>
  <div class="market-dashboard">
    <!-- Header with Search and Filter -->
    <div class="dashboard-filter-bar">
      <div class="search-box">
        <SearchIcon class="search-icon icon-sm" />
        <input type="text" v-model="searchQuery" placeholder="Search products..." class="search-input" />
      </div>
      
      <div class="category-pills-wrapper">
        <div class="category-pills">
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
    </div>

    <!-- Product Grid -->
    <div v-if="loading" class="state-container">
      <span class="loader"></span>
      <p>Synchronizing energy markets...</p>
    </div>

    <div v-else-if="products.length === 0" class="state-container">
      <PackageIcon class="empty-icon" />
      <h3>No matching systems found</h3>
      <p>Try refining your search criteria.</p>
      <button @click="resetFilters" class="clear-btn">Reset Filters</button>
    </div>

    <div v-else>
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card glass-card">
          <div class="card-image" @click="$router.push('/product/' + product.id)">
            <img :src="resolvePrimaryImage(product.images)" :alt="product.name" />
            <div class="vendor-tag">
              <StoreIcon class="icon-xs" />
              <span>{{ product.store_name }}</span>
            </div>
          </div>
          
          <div class="card-info">
            <div class="meta">
              <span class="category">{{ product.category || 'Gear' }}</span>
              <span v-if="product.stock <= 5" class="stock-warning">Low Stock</span>
            </div>
            <h3 class="title" @click="$router.push('/product/' + product.id)">{{ product.name }}</h3>
            <div class="price-row">
              <span class="price">₦{{ Number(product.price).toLocaleString() }}</span>
              <button @click="addToCart(product, 1)" class="add-btn" :disabled="product.stock <= 0">
                <PlusIcon v-if="!isInCart(product.id)" class="icon-sm" />
                <CheckIcon v-else class="icon-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="page < totalPages" class="load-more">
        <button @click="loadMore" class="btn secondary-btn" :disabled="loadingMore">
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { 
  Search as SearchIcon, 
  Package as PackageIcon, 
  Store as StoreIcon, 
  Plus as PlusIcon,
  Check as CheckIcon
} from 'lucide-vue-next';
import marketplaceService from '@/services/marketplace.service';
import { useCart } from '@/composables/useCart';

const { cartItems, addToCart } = useCart();

const products = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');
const page = ref(1);
const totalPages = ref(1);
const productCategories = ref([]);


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
    
    if (reset) {
      products.value = productsRes.products;
    } else {
      products.value.push(...productsRes.products);
    }
    productCategories.value = [{ id: 'all', name: 'All', slug: '' }, ...categoriesRes];
    totalPages.value = productsRes.totalPages;
  } catch (err) {
    console.error('Market sync failed', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchProducts(false);
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
};

const isInCart = (id) => cartItems.value.some(item => item.id === id);

const resolvePrimaryImage = (imagesStr) => {
  try {
    const images = typeof imagesStr === 'string' ? JSON.parse(imagesStr) : imagesStr;
    const path = images?.[0] || '';
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}${path}`;
  } catch (e) {
    return '';
  }
};

let searchTimeout;
watch([selectedCategory, searchQuery], () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchProducts(true), 500);
});

onMounted(() => fetchProducts(true));
</script>

<style scoped>
.market-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 4rem;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

.dashboard-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-weight: 500;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-blue-primary);
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

.category-pills-wrapper {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.category-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.category-pills::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.pill-btn {
  flex-shrink: 0;
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pill-btn.active {
  background: var(--color-blue-primary);
  color: white;
  border-color: var(--color-blue-primary);
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  padding: 12px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-card:hover {
  transform: translateY(-8px);
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .card-image img {
  transform: scale(1.05);
}

.vendor-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-info {
  padding: 1rem 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.stock-warning {
  font-size: 0.7rem;
  font-weight: 800;
  color: #f97316;
}

.title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.25;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.price {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--color-blue-primary);
}

.add-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: var(--color-blue-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover:not(:disabled) {
  background: var(--color-blue-dark);
  transform: scale(1.05);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* States */
.state-container {
  padding: 6rem 2rem;
  text-align: center;
  background: var(--bg-secondary);
  border-radius: 20px;
  border: 1px dashed var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon { width: 48px; height: 48px; color: var(--text-secondary); opacity: 0.5; }
.loader {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-radius: 50%;
  border-top-color: var(--color-blue-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn:hover:not(:disabled) {
  background: var(--border-color);
}

@media (max-width: 640px) {
  .dashboard-filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-box {
    max-width: 100%;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
