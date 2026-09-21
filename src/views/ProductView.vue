<template>
  <div class="product-page">
    <div class="container product-container py-xl">
      <div v-if="loading" class="state-container">
        <span class="loader"></span>
        <p class="state-text">Loading product details...</p>
      </div>

      <div v-else-if="!product" class="state-container">
        <PackageIcon class="empty-icon" />
        <h3 class="state-title">Product not found</h3>
        <p class="state-text">The product you are looking for does not exist or has been removed.</p>
        <router-link to="/marketplace" class="primary-btn mt-4 inline-block">Back to Marketplace</router-link>
      </div>

      <div v-else class="product-layout">
        <!-- Product Images Gallery -->
        <div class="product-images">
          <div class="main-image-wrapper">
             <ImageSlider :images="resolveImages(product.images)" :alt="product.name" />
          </div>
        </div>

        <!-- Product Details -->
        <div class="product-details">
          <div class="product-meta">
            <span class="meta-cat">{{ product.category || 'Gear' }}</span>
            <div class="meta-rating" v-if="avgRating > 0">
               <span class="star filled">★</span> {{ avgRating }} ({{ reviews.length }} reviews)
            </div>
            <span v-if="product.stock <= 5" class="meta-stock" :class="{ 'out': product.stock <= 0 }">
              {{ product.stock > 0 ? 'Low Stock' : 'Sold Out' }}
            </span>
          </div>
          
          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-vendor"><StoreIcon class="icon-sm inline-icon" /> Sold by {{ product.store_name }}</p>
          
          <div class="product-price">₦{{ Number(product.price).toLocaleString() }}</div>
          
          <div class="product-description">{{ product.description || 'No description available for this product.' }}</div>
          
          <div class="product-actions mt-4">
            <div v-if="getCartItem(product.id)" class="cart-stepper-large">
              <button @click="updateQuantity(product.id, getCartItem(product.id).quantity - 1)" class="step-btn">
                 <MinusIcon class="icon-sm" v-if="getCartItem(product.id).quantity > 1"/>
                 <TrashIcon class="icon-sm text-danger" v-else/>
              </button>
              <span class="step-val">{{ getCartItem(product.id).quantity }}</span>
              <button @click="addToCart(product, 1)" class="step-btn">
                 <PlusIcon class="icon-sm" />
              </button>
            </div>
            
            <button v-else @click="addToCart(product, 1)" class="primary-btn large-btn" :disabled="product.stock <= 0">
              {{ product.stock > 0 ? 'Add to Cart' : 'Sold Out' }}
            </button>
            
            <button class="icon-primary-btn large-icon-btn" @click="toggleFavorite(product.id)" :class="{ 'is-fav': isFavorite(product.id) }" title="Favorite">
               <HeartIcon class="icon-lg icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews and Comments Sections -->
      <div v-if="product" class="product-extras-section mt-xl">
        <div class="tabs">
          <button :class="['tab-btn', { active: activeTab === 'reviews' }]" @click="activeTab = 'reviews'">Reviews ({{ reviews.length }})</button>
          <button :class="['tab-btn', { active: activeTab === 'comments' }]" @click="activeTab = 'comments'">Q&A ({{ comments.length }})</button>
        </div>
        
        <div class="tab-content" v-if="activeTab === 'reviews'">
           <div v-if="eligibleToReview" class="write-review-card glass-card mb-4">
              <h4>Write a Review</h4>
              <div class="rating-select mb-2">
                 <button v-for="n in 5" :key="n" @click="newReview.rating = n" :class="['star-btn', { active: n <= newReview.rating }]">★</button>
              </div>
              <textarea v-model="newReview.text" rows="3" class="form-input mb-2" placeholder="Share your experience..."></textarea>
              <button @click="submitReview" class="primary-btn btn-sm" :disabled="submittingReview">Submit Review</button>
           </div>
           
           <div class="reviews-list">
              <div v-if="reviews.length === 0" class="empty-list">No reviews yet. Be the first to review!</div>
              <div v-for="r in reviews" :key="r.id" class="review-item">
                 <div class="review-header">
                    <span class="reviewer-name">{{ r.first_name }} {{ r.last_name }}</span>
                    <span class="stars">
                       <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= r.rating }">★</span>
                    </span>
                 </div>
                 <p class="review-text">{{ r.review_text }}</p>
                 <small class="review-date">{{ new Date(r.created_at).toLocaleDateString() }}</small>
              </div>
           </div>
        </div>

        <div class="tab-content" v-if="activeTab === 'comments'">
           <div class="write-comment-card glass-card mb-4" v-if="isLoggedIn">
              <h4>Ask a Question</h4>
              <textarea v-model="newComment.text" rows="2" class="form-input mb-2" placeholder="What do you want to know?"></textarea>
              <button @click="submitComment" class="primary-btn btn-sm" :disabled="submittingComment">Post Question</button>
           </div>
           <div class="empty-list" v-if="!isLoggedIn && comments.length === 0">Log in to ask a question.</div>
           
           <div class="comments-list">
              <div v-if="comments.length === 0" class="empty-list">No questions yet.</div>
              <div v-for="c in comments" :key="c.id" class="comment-item">
                 <div class="comment-header">
                    <span class="commenter-name">{{ c.first_name }} {{ c.last_name }}</span>
                    <span class="comment-date">{{ new Date(c.created_at).toLocaleDateString() }}</span>
                 </div>
                 <p class="comment-text">{{ c.comment_text }}</p>
              </div>
           </div>
        </div>
      </div>
      
      <!-- Related Products -->
      <div v-if="product && relatedProducts.length > 0" class="related-products-section mt-xl mb-xl">
        <h2 class="section-title">Similar Products</h2>
        <div class="minimal-grid">
          <div v-for="prod in relatedProducts" :key="prod.id" class="minimal-card">
            <div class="card-image-wrapper cursor-pointer" @click="goToProduct(prod.id)">
              <img :src="resolveImages(prod.images)[0]" class="product-img" />
            </div>
            <div class="card-content">
              <h3 class="card-title cursor-pointer" @click="goToProduct(prod.id)">{{ prod.name }}</h3>
              <div class="card-price">₦{{ Number(prod.price).toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Package as PackageIcon, Store as StoreIcon, Heart as HeartIcon, Plus as PlusIcon, Minus as MinusIcon, Trash as TrashIcon } from 'lucide-vue-next';
import marketplaceService from '@/services/marketplace.service';
import { useCart } from '@/composables/useCart';
import ImageSlider from '@/components/ImageSlider.vue';

const route = useRoute();
const router = useRouter();
const { cartItems, addToCart, updateQuantity } = useCart();

const product = ref(null);
const loading = ref(true);
const favorites = ref([]);

const reviews = ref([]);
const comments = ref([]);
const relatedProducts = ref([]);
const avgRating = ref(0);
const eligibleToReview = ref(false);

const activeTab = ref('reviews');
const isLoggedIn = ref(!!localStorage.getItem('token'));
const newReview = ref({ rating: 5, text: '' });
const submittingReview = ref(false);
const newComment = ref({ text: '' });
const submittingComment = ref(false);

try {
  const savedFavs = localStorage.getItem('originelectric_favorites');
  if (savedFavs) favorites.value = JSON.parse(savedFavs);
} catch (e) {}

const goToProduct = (id) => {
  router.push('/product/' + id);
  setTimeout(() => window.location.reload(), 100); // Simple reload to refresh data for new id
};

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

const fetchProduct = async () => {
  loading.value = true;
  try {
    const data = await marketplaceService.getProduct(route.params.id);
    product.value = data.product;
    reviews.value = data.reviews || [];
    comments.value = data.comments || [];
    avgRating.value = data.avgRating || 0;
    relatedProducts.value = data.related || [];
    
    if (product.value) {
      document.title = `${product.value.name} | Origin Electric`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && product.value.description) {
        metaDesc.setAttribute('content', `${product.value.description.slice(0, 150)}...`);
      }
    }
    
    if (isLoggedIn.value) {
        const eligibility = await marketplaceService.checkEligibility(route.params.id);
        eligibleToReview.value = eligibility.eligible;
    }
  } catch (err) {
    console.error('Failed to load product details', err);
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
    if (!newReview.value.text || !newReview.value.rating) return;
    submittingReview.value = true;
    try {
        await marketplaceService.submitReview(product.value.id, {
            rating: newReview.value.rating,
            review_text: newReview.value.text
        });
        newReview.value.text = '';
        await fetchProduct(); // reload data
    } catch (e) {
        console.error(e);
        alert('Failed to submit review');
    } finally {
        submittingReview.value = false;
    }
};

const submitComment = async () => {
    if (!newComment.value.text) return;
    submittingComment.value = true;
    try {
        await marketplaceService.submitComment(product.value.id, {
            comment_text: newComment.value.text
        });
        newComment.value.text = '';
        await fetchProduct(); // reload data
    } catch (e) {
        console.error(e);
        alert('Failed to submit question');
    } finally {
        submittingComment.value = false;
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

const resolveImages = (imagesStr) => {
  const arr = parseImages(imagesStr);
  return arr.map(img => getImageUrl(img));
};

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
/* Page Level Overrides */
.product-page {
  padding-top: 100px;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
  width: 100%;
}

.product-container {
  padding-top: 3rem;
  padding-bottom: 5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.product-layout {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

@media (min-width: 992px) {
  .product-layout {
    flex-direction: row;
    align-items: flex-start;
  }
}

.product-images {
  flex: 1;
  width: 100%;
}

.main-image-wrapper {
  background: var(--bg-secondary);
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fallback-icon-large {
  width: 100px;
  height: 100px;
  color: #d2d2d7;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.meta-cat {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
}

.meta-stock {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-orange-primary);
}
.meta-stock.out { color: #ff3b30; }

.product-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.product-vendor {
  font-size: 1rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 1.5rem 0;
  font-weight: 500;
}

.product-price {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-blue-primary);
  margin-bottom: 2rem;
}

.product-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 2.5rem;
  white-space: pre-wrap;
}

.product-actions {
  display: flex;
  gap: 1rem;
  align-items: stretch;
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
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn:hover:not(:disabled) {
  background: var(--color-blue-dark);
}

.primary-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.cart-stepper-large {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid var(--border-color);
}

.step-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  transition: background 0.2s ease;
}

.step-btn:hover { background: var(--border-color); }
.text-danger { color: #ff3b30; }

.step-val {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.icon-primary-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.icon-primary-btn:hover {
  background: var(--color-blue-primary);
  color: white;
  border-color: var(--color-blue-primary);
}

.icon-primary-btn.is-fav {
  color: #ff3b30;
  border-color: var(--border-color);
}
.icon-primary-btn.is-fav svg {
  fill: #ff3b30;
}

.state-container {
  padding: 6rem 2rem;
  text-align: center;
  background: var(--bg-secondary);
  border-radius: 20px;
  max-width: 600px;
  margin: 0 auto;
}
.empty-icon { width: 48px; height: 48px; color: var(--text-secondary); margin-bottom: 1rem; }
.state-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);}
.state-text { color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 500;}

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

.mt-4 { margin-top: 2rem; }
.mt-xl { margin-top: 4rem; }
.mb-xl { margin-bottom: 4rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 2rem; }
.inline-block { display: inline-block; width: auto; padding: 16px 32px; }
.inline-icon { display: inline-block; width: 14px; height: 14px; margin-right: 4px; }
.icon { width: 24px; height: 24px; }

/* Extras Section */
.tabs { display: flex; gap: 1rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1.5rem; }
.tab-btn { background: none; border: none; padding: 10px 16px; font-size: 1.1rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; }
.tab-btn:hover { color: var(--text-primary); }
.tab-btn.active { color: var(--color-blue-primary); border-bottom-color: var(--color-blue-primary); }

.glass-card { background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 16px; }
.form-input { width: 100%; border: 1px solid var(--border-color); background: var(--bg-primary); border-radius: 12px; padding: 12px; color: var(--text-primary); font-family: inherit; resize: vertical; }
.form-input:focus { outline: none; border-color: var(--color-blue-primary); }

.star-btn { background: none; border: none; font-size: 1.5rem; color: #cbd5e1; cursor: pointer; padding: 0 4px; }
.star-btn.active { color: #f59e0b; }
.star.filled { color: #f59e0b; }
.star { color: #cbd5e1; }

.review-item, .comment-item { padding: 1.5rem 0; border-bottom: 1px solid var(--border-color); }
.review-item:last-child, .comment-item:last-child { border-bottom: none; }
.review-header, .comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.reviewer-name, .commenter-name { font-weight: 700; color: var(--text-primary); }
.review-text, .comment-text { color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px; }
.review-date, .comment-date { color: #86868b; font-size: 0.85rem; }

.empty-list { color: var(--text-secondary); font-style: italic; padding: 1rem 0; }
.meta-rating { display: flex; align-items: center; gap: 6px; font-weight: 600; color: var(--text-primary); font-size: 0.95rem; }

/* Similar Products Mini-Grid */
.minimal-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
@media (max-width: 992px) { .minimal-grid { grid-template-columns: repeat(2, 1fr); } }
.minimal-card { background: var(--bg-secondary); padding: 12px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); transition: transform 0.2s; }
.minimal-card:hover { transform: translateY(-4px); }
.card-image-wrapper { width: 100%; aspect-ratio: 1; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 12px; }
.product-img { width: 100%; height: 100%; object-fit: cover; }
.card-title { font-size: 1rem; font-weight: 700; margin: 0 0 4px 0; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-price { font-weight: 800; color: var(--color-blue-primary); }
.section-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; }
.cursor-pointer { cursor: pointer; }
</style>
