<template>
  <div class="vendor-products">
    <div class="action-bar mb-6">
      <div class="search-box">
        <SearchIcon class="search-icon" />
        <input type="text" placeholder="Search products..." v-model="searchQuery" />
      </div>
      <button v-if="!showForm" @click="showForm = true" class="btn primary-btn add-btn">
        <PlusIcon class="icon-sm" /> Add Product
      </button>
    </div>

    <!-- Add/Edit Product Form (INLINE) -->
    <div v-if="showForm" class="product-form-container glass-card mb-8">
      <div class="form-header">
        <h3>{{ editingProductData ? 'Edit Product' : 'Add New Product' }}</h3>
        <p class="text-secondary">Fill in the details below to {{ editingProductData ? 'update your product' : 'list a new product' }} in the marketplace.</p>
      </div>

      <form @submit.prevent="saveProduct" class="product-form">
        <div class="product-form-grid">
          <!-- Left Column: Details -->
          <div class="form-column">
            <h4 class="section-title">Product Details</h4>
            
            <div class="form-group">
              <label>Product Name</label>
              <input type="text" v-model="form.name" required placeholder="e.g. 5kVA Hybrid Inverter" />
            </div>
            
            <div class="form-row-2">
              <div class="form-group">
                <label>Category</label>
                <select v-model="form.category">
                  <option v-for="cat in productCategories" :key="cat.id" :value="cat.slug">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Stock Count</label>
                <input type="number" v-model="form.stock" required />
              </div>
            </div>

            <div class="form-group">
              <label>Price (₦)</label>
              <div class="price-input-wrapper">
                <span class="currency-symbol">₦</span>
                <input type="text" :value="displayPrice" @input="handlePriceInput" required placeholder="0.00" />
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" rows="5" placeholder="Technical specifications, warranty details, etc."></textarea>
            </div>
          </div>

          <!-- Right Column: Media -->
          <div class="form-column">
            <h4 class="section-title">Product Media</h4>
            
            <div class="media-upload-section">
              <div class="upload-area" :class="{ 'has-images': imagePreviews.length > 0 }">
                <label v-if="imagePreviews.length < 5" class="upload-trigger">
                  <input type="file" multiple accept="image/*" @change="handleFileSelect" class="hidden-input" />
                  <div class="upload-empty-state">
                    <div class="upload-icon-circle">
                      <PlusIcon class="upload-icon-svg" />
                    </div>
                    <span>Click to browse or drag images here</span>
                    <small>Upload up to 5 images (Max 5MB each)</small>
                  </div>
                </label>
                
                <div class="image-gallery-grid" v-if="imagePreviews.length > 0">
                  <div v-for="(img, index) in imagePreviews" :key="index" class="gallery-item">
                    <img :src="img.src" alt="Product preview" />
                    <button type="button" @click="removeImage(index)" class="remove-gallery-item" aria-label="Remove image">
                      <XIcon class="icon-xs" />
                    </button>
                    <span class="cover-badge" v-if="index === 0">Cover</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions-footer">
          <button type="button" @click="closeForm" class="btn secondary-btn border-btn">Cancel</button>
          <button type="submit" class="btn primary-btn accent-orange" :disabled="isSaving">
            <span v-if="isSaving" class="loader-sm"></span>
            <span v-else>{{ editingProductData ? 'Update Product' : 'Publish Product' }}</span>
          </button>
        </div>
      </form>
      </div>

      <div v-if="loading" class="loading-state glass-card">
        <span class="loader"></span>
        <p>Loading your catalog...</p>
      </div>

      <div v-else-if="products.length > 0 && !showForm" class="products-grid-container">
        <div class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="premium-product-card">
            <div class="card-media-box">
              <PackageIcon v-if="!parseImages(product.images)[0]" class="fallback-icon" />
              <img v-else :src="getImageUrl(parseImages(product.images)[0])" :alt="product.name" class="card-img" />
              
              <!-- Floating Stock Badge -->
              <span :class="['floating-badge stock-badge', getStockLevel(product.stock)]">
                {{ product.stock }} Left
              </span>
            </div>
            
            <div class="card-info-box">
              <div class="info-top-row">
                <span class="meta-category">{{ product.category || 'Uncategorized' }}</span>
                <div class="status-indicator" :class="product.status.toLowerCase()" :title="product.status">
                    <span class="status-pulse"></span>
                </div>
              </div>
              
              <router-link :to="`/product/${product.id}`" class="title-link">
                <h4 class="meta-title" :title="product.name">{{ product.name }}</h4>
              </router-link>
              
                <div class="info-bottom-row">
                  <span class="meta-price">₦{{ product.price.toLocaleString() }}</span>
                  <span class="meta-id">ID: #{{ product.id }}</span>
                </div>
                
                <div class="card-actions-row mt-4">
                  <button @click="editProduct(product)" class="btn-action edit-btn" title="Edit Product">
                    <EditIcon class="icon-xs" /> Edit
                  </button>
                  <button @click="confirmDelete(product)" class="btn-action delete-btn" title="Delete Product">
                    <TrashIcon class="icon-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div v-else-if="!showForm" class="empty-state glass-card">
      <PackageIcon class="empty-icon" />
      <h3>Your Catalog is Empty</h3>
      <p>Start selling by adding your first product to the platform.</p>
      <button @click="showForm = true" class="btn primary-btn border-btn accent-orange mt-4">Create Product</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  Plus as PlusIcon, 
  Search as SearchIcon, 
  Package as PackageIcon,
  MoreVertical as MoreIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon
} from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';
import marketplaceService from '@/services/marketplace.service';

const products = ref([]);
const productCategories = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const showForm = ref(false);
const editingProductData = ref(null);
const isSaving = ref(false);

const form = ref({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  category: 'inverters'
});

const displayPrice = ref('');

const handlePriceInput = (e) => {
  let val = e.target.value.replace(/[^\d.]/g, '');
  
  const parts = val.split('.');
  if (parts.length > 2) {
    val = parts[0] + '.' + parts.slice(1).join('');
  }

  form.value.price = parseFloat(val) || 0;

  if (parts[0]) {
    parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
  }
  
  displayPrice.value = parts.join('.');
};

const imagePreviews = ref([]); // Now stores { src, file, isExisting, path }

const fetchProducts = async () => {
  loading.value = true;
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      vendorService.getProducts(),
      marketplaceService.getCategories()
    ]);
    products.value = productsRes;
    productCategories.value = categoriesRes;
  } catch (err) {
    console.error('Failed to fetch data', err);
  } finally {
    loading.value = false;
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
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
};

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const q = searchQuery.value.toLowerCase();
  return products.value.filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
});

const getStockLevel = (stock) => {
  if (stock <= 5) return 'low';
  if (stock <= 20) return 'medium';
  return 'high';
};

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);
  const remaining = 5 - imagePreviews.value.length;
  const toAdd = files.slice(0, remaining);

  toAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push({
        src: e.target.result,
        file: file,
        isExisting: false
      });
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  imagePreviews.value.splice(index, 1);
};

const editProduct = (product) => {
  editingProductData.value = product;
  form.value = { ...product };
  displayPrice.value = product.price ? Number(product.price).toLocaleString('en-US') : '';
  // Load existing images into previews
  const existingImages = parseImages(product.images);
  imagePreviews.value = existingImages.map(path => ({
    src: getImageUrl(path),
    path: path,
    isExisting: true
  }));
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingProductData.value = null;
  form.value = { name: '', price: 0, stock: 0, description: '', category: productCategories.value[0]?.slug || '' };
  displayPrice.value = '';
  imagePreviews.value = [];
};

const saveProduct = async () => {
  isSaving.value = true;
  try {
    const newFiles = imagePreviews.value
      .filter(img => !img.isExisting)
      .map(img => img.file);
    
    let existingPaths = imagePreviews.value
      .filter(img => img.isExisting)
      .map(img => img.path);

    if (newFiles.length > 0) {
      const uploadRes = await vendorService.uploadImages(newFiles);
      existingPaths = [...existingPaths, ...uploadRes.urls];
    }

    const productData = {
      ...form.value,
      images: existingPaths.slice(0, 5)
    };

    if (editingProductData.value) {
      await vendorService.updateProduct(editingProductData.value.id, productData);
    } else {
      await vendorService.addProduct(productData);
    }
    await fetchProducts();
    closeForm();
  } catch (err) {
    console.error(err);
    alert('Failed to save product. Please check your connection and try again.');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (product) => {
  if (confirm(`Are you sure you want to delete ${product.name}?`)) {
    try {
      await vendorService.deleteProduct(product.id);
      await fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  }
};

onMounted(fetchProducts);
</script>

<style scoped>
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  background: var(--bg-primary);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 480px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  width: 20px;
  opacity: 0.6;
}

.search-box input {
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  width: 100%;
  transition: all 0.3s;
  border-radius: var(--radius-md);
}

.search-box input:focus {
  background: var(--bg-primary);
  border-color: var(--color-blue-primary);
  outline: none;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 1.75rem;
  font-weight: 800;
  border: 1.5px solid var(--color-blue-primary);
  background: transparent;
  color: var(--color-blue-primary);
  box-shadow: none !important;
}

.add-btn:hover {
  background: var(--color-blue-primary);
  color: white;
}

/* Inline Product Form */
.product-form-container {
  padding: 2.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: none;
}

.form-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-header h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.product-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-top: 1.5rem;
}

@media (min-width: 1024px) {
  .product-form-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 3.5rem;
  }
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--border-color);
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 1.25rem;
  color: var(--text-secondary);
  font-weight: 800;
  font-size: 1.1rem;
}

.price-input-wrapper input {
  padding-left: 2.5rem !important;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.upload-area:hover {
  border-color: var(--color-blue-primary);
  background: var(--bg-secondary);
  opacity: 0.8;
}

.upload-area.has-images {
  padding: 1.5rem;
}

.upload-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.upload-icon-circle {
  width: 64px;
  height: 64px;
  background: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  margin-bottom: 0.5rem;
  color: var(--color-blue-primary);
  transition: transform 0.3s ease;
}

.upload-trigger:hover .upload-icon-circle {
  transform: scale(1.05);
}

.upload-icon-svg {
  width: 28px;
  height: 28px;
}

.upload-empty-state span {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.05rem;
}

.upload-empty-state small {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.image-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  box-shadow: var(--shadow-sm);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-gallery-item {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}

.remove-gallery-item:hover {
  background: #ef4444;
}

.gallery-item:hover .remove-gallery-item {
  opacity: 1;
}

.cover-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-blue-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  text-align: center;
  padding: 4px 0;
  letter-spacing: 0.05em;
}

.form-actions-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.form-group label {
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary);
}

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.8rem 1rem;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
  color: var(--text-primary);
}

.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
  border-color: var(--color-blue-primary);
  background: var(--bg-primary);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.border-btn {
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 800;
  padding: 0.8rem 2rem;
  box-shadow: none !important;
}

.border-btn:hover {
  background: var(--bg-secondary);
}

.accent-orange {
  border-color: #f97316 !important;
  color: #f97316 !important;
}

.accent-orange:hover {
  background: #f97316 !important;
  color: white !important;
}

/* Premium Modern Card */
.products-grid-container {
  margin-top: 1.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

.premium-product-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
}

.premium-product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  border-color: var(--color-blue-primary);
}

.card-media-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-product-card:hover .card-img {
  transform: scale(1.05);
}

.fallback-icon {
  width: 64px;
  height: 64px;
  color: var(--border-color);
}

/* Floating Badges */
.floating-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.stock-badge.low { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
.stock-badge.medium { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
.stock-badge.high { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }

/* Product Card Actions */
.card-actions-row {
  display: flex;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.btn-action {
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
}

.edit-btn {
  flex: 1;
}

.edit-btn:hover {
  background: var(--bg-secondary);
  color: var(--color-blue-primary);
  border-color: var(--color-blue-primary);
}

.delete-btn {
  width: 36px;
  flex-shrink: 0;
  color: #ef4444;
}

.delete-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

/* Info Box */
.card-info-box {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: var(--bg-primary);
}

.info-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.meta-category {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
}
.status-indicator.active { background: #10b981; }
.status-indicator.inactive { background: #94a3b8; }
.status-pulse {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: inherit;
  opacity: 0.4;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.4; }
  70% { transform: scale(2); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

.title-link {
  text-decoration: none;
  display: block;
}

.title-link:hover .meta-title {
  color: var(--color-blue-primary);
}

.meta-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 1.25rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-bottom-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: auto;
}

.meta-price {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.meta-id {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.image-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-img-btn:hover {
  background: #ef4444;
}

.upload-placeholder {
  display: block;
  width: 100%;
  max-width: 320px;
  height: 100px;
  border: 1.5px dashed var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.upload-placeholder:hover {
  border-color: var(--color-blue-primary);
  background: var(--bg-secondary);
}

.upload-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
}

.hidden-input {
  display: none;
}

.loading-state, .empty-state {
  padding: 6rem 2rem;
  text-align: center;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--border-color);
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.icon-xs { width: 16px; height: 16px; }
.loader-sm {
  border: 2px solid var(--border-color);
  border-top-color: var(--color-blue-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .product-form-container {
    padding: 1.25rem;
  }

  .form-header {
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
  }

  .product-form-grid {
    gap: 1.75rem;
  }
  
  .form-row-2 {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .form-column {
    gap: 1.25rem;
  }

  .upload-area {
    padding: 1.5rem 1rem;
  }
  
  .upload-area.has-images {
    padding: 1rem;
  }

  .form-actions-footer {
    display: flex;
    flex-direction: column-reverse; /* Cancel below, submit above on mobile */
    gap: 0.75rem;
    margin-top: 2rem;
  }
  
  .form-actions-footer button {
    width: 100%;
  }

  .form-row-3 {
    grid-template-columns: 1fr;
  }

  .loading-state, .empty-state {
    padding: 3rem 1.5rem;
  }

  th, td {
    padding: 1rem;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .products-list {
    overflow-x: auto;
  }
}
</style>
