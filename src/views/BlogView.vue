<template>
  <div class="blog-page">
    <header class="page-header">
      <div class="container">
        <span class="section-eyebrow">
          <span class="eyebrow-dot" aria-hidden="true"></span>
          Insights
        </span>
        <h1 class="page-title">Origin <span class="highlight">Blog</span></h1>
        <p class="page-subtitle">
          Field guides, Nigeria power insights, and solar strategy from the Origin team.
        </p>

        <form class="search-bar" @submit.prevent="runSearch">
          <SearchIcon class="search-icon" />
          <input
            v-model="searchInput"
            type="search"
            placeholder="Search articles…"
            aria-label="Search blog posts"
            autocomplete="off"
          />
          <button type="submit" class="search-btn" :disabled="loading">Search</button>
        </form>

        <div class="category-filter-container" role="tablist" aria-label="Blog categories">
          <button
            type="button"
            class="category-btn"
            :class="{ active: !selectedCategory }"
            @click="selectCategory(null)"
          >
            All
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="category-btn"
            :class="{ active: selectedCategory === cat.slug }"
            @click="selectCategory(cat.slug)"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </header>

    <div class="container page-section">
      <!-- Featured -->
      <section
        v-if="featured.length && !searchQuery && !selectedCategory"
        class="featured-section"
      >
        <div class="section-label">
          <h2>Featured</h2>
          <span class="count">{{ featured.length }}</span>
        </div>
        <div class="featured-grid">
          <article
            v-for="(post, i) in featured"
            :key="post.id"
            class="featured-card"
            :class="{ primary: i === 0 }"
            @click="goPost(post.slug)"
            @keydown.enter="goPost(post.slug)"
            tabindex="0"
            role="link"
          >
            <div class="featured-media">
              <img
                v-if="post.featured_image"
                :src="getImgUrl(post.featured_image)"
                :alt="post.title"
              />
              <div v-else class="media-fallback">{{ initials(post.title) }}</div>
              <span class="blog-card-badge">{{ post.category_name }}</span>
            </div>
            <div class="featured-body">
              <p class="blog-card-meta">
                <CalendarIcon class="icon-meta" />
                {{ formatDate(post.created_at) }} · {{ minutes(post) }} min
              </p>
              <h3>{{ post.title }}</h3>
              <p>{{ excerpt(post) }}</p>
              <span class="blog-read-more">Read feature <ArrowRightIcon class="icon-read" /></span>
            </div>
          </article>
        </div>
      </section>

      <!-- Feed -->
      <section class="feed" aria-live="polite">
        <div class="section-label">
          <h2>{{ feedTitle }}</h2>
          <span class="count">{{ posts.length }}</span>
        </div>

        <div v-if="error" class="banner">
          {{ error }}
          <button type="button" @click="reload">Retry</button>
        </div>

        <div v-if="loading" class="blog-grid">
          <div v-for="i in 6" :key="i" class="blog-card skeleton-card">
            <div class="skel media"></div>
            <div class="skel line w-30"></div>
            <div class="skel line w-90"></div>
            <div class="skel line w-70"></div>
          </div>
        </div>

        <div v-else-if="!posts.length" class="empty-state">
          <BookOpen class="empty-state-icon" />
          <h3>No matching stories</h3>
          <p>Try another category or clear your search.</p>
          <button type="button" class="btn-primary" @click="clearFilters">Reset filters</button>
        </div>

        <div v-else class="blog-grid">
          <article
            v-for="post in posts"
            :key="post.id"
            class="blog-card"
            @click="goPost(post.slug)"
            @keydown.enter="goPost(post.slug)"
            tabindex="0"
            role="link"
          >
            <div class="blog-card-image-wrapper">
              <img
                v-if="post.featured_image"
                class="blog-card-image"
                :src="getImgUrl(post.featured_image)"
                :alt="post.title"
                loading="lazy"
              />
              <div v-else class="blog-placeholder">{{ initials(post.title) }}</div>
              <span class="blog-card-badge">{{ post.category_name || 'General' }}</span>
            </div>
            <div class="blog-card-content">
              <div class="blog-card-meta">
                <CalendarIcon class="icon-meta" />
                <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
                <span>· {{ minutes(post) }} min</span>
              </div>
              <h3 class="blog-card-title">{{ post.title }}</h3>
              <p class="blog-card-excerpt">{{ excerpt(post) }}</p>
              <div class="blog-card-footer">
                <span class="blog-read-more">
                  Read article <ArrowRightIcon class="icon-read" />
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="cta-band">
        <div>
          <span class="section-eyebrow">Next step</span>
          <h3>Need a system sized for your site?</h3>
          <p>Talk to Origin engineers or browse live marketplace gear.</p>
        </div>
        <div class="cta-actions">
          <router-link to="/account/consultations" class="btn-primary">Book consult</router-link>
          <router-link to="/marketplace" class="btn-outline">Marketplace</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ArrowRight as ArrowRightIcon,
  BookOpen,
  Calendar as CalendarIcon,
  Search as SearchIcon
} from 'lucide-vue-next';
import blogService from '@/services/blog.service';
import { mediaUrl } from '@/utils/mediaUrl';

const router = useRouter();
const route = useRoute();

const posts = ref([]);
const featured = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref('');
const selectedCategory = ref(null);
const searchInput = ref('');
const searchQuery = ref('');

const feedTitle = computed(() => {
  if (searchQuery.value) return `Results for “${searchQuery.value}”`;
  if (selectedCategory.value) {
    const cat = categories.value.find((c) => c.slug === selectedCategory.value);
    return cat?.name || 'Category';
  }
  return 'Latest articles';
});

const getImgUrl = (path) => mediaUrl(path);
const goPost = (slug) => router.push(`/blog/${slug}`);

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const excerpt = (post) => {
  const raw = post.excerpt || post.content || '';
  const plain = String(raw)
    .replace(/[#*`_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 140 ? `${plain.slice(0, 140)}…` : plain;
};

const minutes = (post) => blogService.readingMinutes(post.content);
const initials = (title) =>
  String(title || 'OE')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();

const syncQuery = () => {
  const q = {};
  if (selectedCategory.value) q.category = selectedCategory.value;
  if (searchQuery.value) q.q = searchQuery.value;
  router.replace({ query: q });
};

const fetchCategories = async () => {
  try {
    categories.value = await blogService.getCategories();
  } catch (e) {
    console.error(e);
    categories.value = [];
  }
};

const fetchFeatured = async () => {
  try {
    featured.value = await blogService.getFeaturedPosts();
  } catch (e) {
    console.error(e);
    featured.value = [];
  }
};

const fetchPosts = async () => {
  loading.value = true;
  error.value = '';
  try {
    const params = {};
    if (selectedCategory.value) params.category = selectedCategory.value;
    if (searchQuery.value) params.search = searchQuery.value;
    posts.value = await blogService.getAllPosts(params);
  } catch (e) {
    console.error(e);
    posts.value = [];
    error.value = e.response?.data?.message || 'Could not load articles from the API.';
  } finally {
    loading.value = false;
  }
};

const selectCategory = (slug) => {
  selectedCategory.value = slug;
  syncQuery();
  fetchPosts();
};

const runSearch = () => {
  searchQuery.value = searchInput.value.trim();
  syncQuery();
  fetchPosts();
};

const clearFilters = () => {
  selectedCategory.value = null;
  searchInput.value = '';
  searchQuery.value = '';
  syncQuery();
  fetchPosts();
};

const reload = () => {
  fetchCategories();
  fetchFeatured();
  fetchPosts();
};

onMounted(async () => {
  if (route.query.category) selectedCategory.value = String(route.query.category);
  if (route.query.q) {
    searchQuery.value = String(route.query.q);
    searchInput.value = searchQuery.value;
  }
  await Promise.all([fetchCategories(), fetchFeatured(), fetchPosts()]);
});

watch(
  () => route.query,
  (q) => {
    const nextCat = q.category ? String(q.category) : null;
    const nextQ = q.q ? String(q.q) : '';
    if (nextCat !== selectedCategory.value || nextQ !== searchQuery.value) {
      selectedCategory.value = nextCat;
      searchQuery.value = nextQ;
      searchInput.value = nextQ;
      fetchPosts();
    }
  }
);
</script>

<style scoped>
.blog-page {
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 60vh;
}

.container {
  width: min(100% - 2rem, 1120px);
  margin: 0 auto;
}

.page-header {
  padding: clamp(3rem, 8vw, 5.5rem) 0 var(--space-lg);
  text-align: center;
  background: linear-gradient(to bottom, var(--bg-secondary), transparent);
  border-bottom: 1px solid var(--border-color);
}

.section-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 118, 0, 0.1);
  border: 1px solid rgba(255, 118, 0, 0.28);
  border-radius: var(--radius-xs);
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}

.eyebrow-dot {
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--color-primary);
}

.page-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw, 3.75rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--text-primary);
  margin: 0 0 0.85rem;
}

.page-title .highlight {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  max-width: 36rem;
  margin: 0 auto 1.75rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.55;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 520px;
  margin: 0 auto 1.5rem;
  padding: 0.35rem 0.35rem 0.35rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-bar input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.95rem;
  outline: none;
  min-height: 42px;
}

.search-btn {
  min-height: 42px;
  padding: 0 1rem;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
}

.search-btn:disabled { opacity: 0.65; }

.page-section { padding: var(--space-lg) 0 var(--space-xl); }

.section-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.section-label h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.featured-section { margin-bottom: var(--space-lg); }

.featured-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.featured-card {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--bg-primary);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition-speed), box-shadow var(--transition-speed), transform var(--transition-bounce);
}

.featured-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.featured-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--bg-secondary);
  overflow: hidden;
}

.featured-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-fallback,
.blog-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
}

.featured-body {
  padding: 1.25rem 1.35rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.featured-body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.55rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text-primary);
}

.featured-body p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.55;
}

.feed { margin-bottom: var(--space-lg); }

.banner {
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  background: var(--status-warn-bg);
  color: var(--status-warn-fg);
  border: 1px solid var(--status-warn-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.banner button {
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.75rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.skeleton-card { pointer-events: none; padding: 0; }
.skel {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: skeletonPulse 1.5s infinite linear;
  border-radius: var(--radius-sm);
  margin: 0.75rem 1rem;
}
.skel.media { aspect-ratio: 16/10; margin: 0; border-radius: 0; }
.skel.line { height: 12px; }
.skel.w-30 { width: 30%; }
.skel.w-70 { width: 70%; }
.skel.w-90 { width: 90%; }

.cta-band {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.75rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.cta-band h3 {
  margin: 0.65rem 0 0.4rem;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.cta-band p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.cta-actions .btn-primary,
.cta-actions .btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 1.15rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: var(--radius-sm);
}

@media (min-width: 720px) {
  .featured-grid {
    grid-template-columns: 1.4fr 1fr;
  }
  .featured-card.primary {
    grid-row: span 2;
  }
  .featured-card.primary .featured-media {
    aspect-ratio: 16 / 11;
  }
  .cta-band {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (min-width: 1024px) {
  .featured-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 1.25rem;
  }
}
</style>
