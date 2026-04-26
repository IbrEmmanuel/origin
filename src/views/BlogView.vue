<template>
  <div class="blog-view bg-secondary">
    <!-- Premium Page Header -->
    <header class="page-header">
      <div class="container mb-8">
        <h1 class="section-title">
          Our <span class="grad-blue">Blog</span>
        </h1>
        <p class="section-desc mx-auto centered">
          Expert opinions, technical guides, and the latest news from the world of sustainable energy and smart security.
        </p>
      </div>

      <!-- Categories Filter -->
      <div class="category-filter-container container">
        <button 
          @click="selectedCategory = null"
          :class="['category-btn', !selectedCategory ? 'active' : '']"
        >
          All Articles
        </button>
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="selectedCategory = cat.slug"
          :class="['category-btn', selectedCategory === cat.slug ? 'active' : '']"
        >
          {{ cat.name }}
        </button>
      </div>
    </header>

    <div class="container page-section">
      <!-- Blog Grid -->
      <div class="blog-grid">
        <div v-if="loading" v-for="i in 6" :key="i">
          <div class="skeleton-box aspect-[16/10] mb-6"></div>
          <div class="skeleton-box h-4 w-1/4 mb-4"></div>
          <div class="skeleton-box h-8 w-full mb-4"></div>
          <div class="skeleton-box h-6 w-3/4"></div>
        </div>

        <div v-else-if="filteredPosts.length === 0" class="col-span-full empty-state fade-in-up">
          <BookOpen class="empty-state-icon" />
          <h3 class="empty-state-title">No Stories Found</h3>
          <p class="empty-state-desc">We haven't published anything in this category yet. Stay tuned for updates!</p>
          <button @click="selectedCategory = null" class="btn btn-primary">View all articles</button>
        </div>

        <article 
          v-else 
          v-for="(post, index) in filteredPosts" 
          :key="post.id" 
          class="blog-card fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="$router.push(`/blog/${post.slug}`)"
        >
            <div class="blog-card-image-wrapper">
              <img 
                v-if="post.featured_image"
                :src="getImgUrl(post.featured_image)" 
                :alt="post.title"
                class="blog-card-image"
              />
              <div v-else class="blog-placeholder">
                <ImageIcon class="icon-placeholder" />
              </div>
              <div class="blog-card-badge">
                {{ post.category_name || 'General' }}
              </div>
            </div>
          
          <div class="blog-card-content">
              <div class="blog-card-meta">
                <CalendarIcon class="icon-meta" />
                <span>{{ formatDate(post.created_at) }}</span>
              </div>
              <h2 class="blog-card-title">
                {{ post.title }}
              </h2>
              <p class="blog-card-excerpt">
                {{ stripMarkdown(post.content) }}
              </p>
              <div class="blog-card-footer">
                <div class="blog-read-more">
                  <span>Read Article</span>
                  <ArrowRightIcon class="icon-read" />
                </div>
              </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  Image as ImageIcon, 
  ArrowRight as ArrowRightIcon, 
  BookOpen,
  Calendar as CalendarIcon
} from 'lucide-vue-next';
import blogService from '@/services/blog.service';

const posts = ref([]);
const categories = ref([]);
const loading = ref(true);
const selectedCategory = ref(null);

const fetchPosts = async () => {
  try {
    loading.value = true;
    posts.value = await blogService.getAllPosts();
  } catch (error) {
    console.error('Error fetching blogs:', error);
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    categories.value = await blogService.getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const filteredPosts = computed(() => {
  if (!selectedCategory.value) return posts.value;
  return posts.value.filter(p => p.category_slug === selectedCategory.value);
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const stripMarkdown = (content) => {
  if (!content) return '';
  // Basic markdown removal
  return content
    .replace(/[#*`_~]/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .slice(0, 160) + '...';
};

const getImgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
};

onMounted(() => {
  fetchPosts();
  fetchCategories();
});
</script>

<style scoped>
.blog-view {
  min-height: 100vh;
}

.empty-state-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.empty-state-desc {
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}
</style>
