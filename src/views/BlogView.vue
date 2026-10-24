<template>
  <div class="blog-page">
    <header class="page-header">
      <div class="container header-inner">
        <div class="header-copy">
          <span class="blog-eyebrow">
            <span class="eyebrow-dot" aria-hidden="true"></span>
            Insights
          </span>
          <h1 class="page-title">Origin <span class="highlight">Blog</span></h1>
          <p class="page-subtitle">
            Field guides, Nigeria power insights, and solar strategy from the Origin engineering team.
          </p>
        </div>

        <form class="search-bar" @submit.prevent="runSearch">
          <SearchIcon class="search-icon" aria-hidden="true" />
          <input
            v-model="searchInput"
            type="search"
            placeholder="Search articles…"
            aria-label="Search blog posts"
            autocomplete="off"
          />
          <button type="submit" class="lp-btn lp-btn--accent search-submit" :disabled="loading">
            Search
          </button>
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
          <span>{{ error }}</span>
          <button type="button" class="lp-btn lp-btn--outline banner-retry" @click="reload">Retry</button>
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
          <button type="button" class="lp-btn lp-btn--accent" @click="clearFilters">Reset filters</button>
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
        <div class="cta-copy">
          <span class="blog-eyebrow">Next step</span>
          <h3>Need a system sized for your site?</h3>
          <p>Talk to Origin engineers or browse live marketplace gear.</p>
        </div>
        <div class="cta-actions">
          <router-link to="/account/consultations" class="lp-btn lp-btn--accent">Book consult</router-link>
          <router-link to="/marketplace" class="lp-btn lp-btn--outline">Marketplace</router-link>
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
  --lp-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 70vh;
}

.container {
  width: min(100% - 2rem, 1120px);
  margin: 0 auto;
}

/* Header — left-aligned premium */
.page-header {
  padding: clamp(2.5rem, 6vw, 4.5rem) 0 2rem;
  text-align: left;
  background:
    linear-gradient(180deg, var(--bg-secondary) 0%, transparent 100%);
  border-bottom: 1px solid var(--border-color);
  position: relative;
}
.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 118, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 118, 0, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.45), transparent 85%);
  pointer-events: none;
}
.header-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.35rem;
}

.header-copy {
  max-width: 640px;
}

.blog-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 12px;
  background: rgba(255, 118, 0, 0.08);
  border: 1px solid rgba(255, 118, 0, 0.35);
  border-radius: var(--radius-xs);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--color-primary);
  text-transform: uppercase;
  margin-bottom: 1rem;
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
  font-size: clamp(2.2rem, 5.5vw, 3.5rem);
  font-weight: 550;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--text-primary);
  margin: 0 0 0.85rem;
  text-align: left;
}

.page-title .highlight {
  color: var(--color-primary);
  background: none;
  -webkit-text-fill-color: var(--color-primary);
}

.page-subtitle {
  max-width: 36rem;
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
  text-align: left;
}

/* Search — full-width justified bar */
.search-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  max-width: 640px;
  padding: 0.35rem 0.35rem 0.35rem 1rem;
  border-radius: var(--lp-radius);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-bar input {
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.95rem;
  outline: none;
  min-height: 42px;
}

.search-submit {
  height: 40px !important;
  padding: 0 16px !important;
}

/* Category chips — justified equal tech row */
.category-filter-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin: 0;
  width: 100%;
}

.category-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: var(--lp-radius);
  font-weight: 600;
  font-size: 0.8rem;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.2s var(--transition-bounce);
}
.category-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}
.category-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 2px 10px -2px rgba(255, 118, 0, 0.4);
}

.page-section {
  padding: clamp(2rem, 4vw, 3.25rem) 0 clamp(4rem, 8vw, 5.5rem);
}

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
  font-size: clamp(1.35rem, 3vw, 1.85rem);
  font-weight: 550;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.count {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.featured-section { margin-bottom: 2.75rem; }

.featured-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.featured-card {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-primary);
  cursor: pointer;
  box-shadow: none;
  transition: border-color 0.2s, box-shadow 0.25s, transform 0.25s var(--transition-bounce);
}
.featured-card:hover {
  border-color: rgba(255, 118, 0, 0.4);
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
  transition: transform 0.6s var(--transition-bounce);
}
.featured-card:hover .featured-media img {
  transform: scale(1.04);
}

.media-fallback,
.blog-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)),
    linear-gradient(rgba(255, 118, 0, 0.05) 1px, transparent 1px);
  background-size: auto, 32px 32px;
  color: var(--text-muted);
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
}

.featured-body {
  padding: 1.25rem 1.35rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  text-align: left;
}
.featured-body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.55rem);
  font-weight: 550;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: var(--text-primary);
}
.featured-body p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.55;
}

.feed { margin-bottom: 2.75rem; }

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
.banner-retry {
  height: 36px !important;
  padding: 0 14px !important;
  font-size: 0.8rem !important;
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

/* CTA */
.cta-band {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.35rem;
  padding: 1.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  text-align: left;
}
.cta-band h3 {
  margin: 0.55rem 0 0.4rem;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 550;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}
.cta-band p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}
.cta-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
  align-self: stretch;
}
.cta-actions .lp-btn {
  width: 100%;
  justify-content: center;
}

/* Shared buttons */
.lp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px;
  border-radius: var(--lp-radius);
  font-family: var(--font-main);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.2s var(--transition-bounce);
}
.lp-btn:hover { transform: translateY(-1px); }
.lp-btn:active { transform: scale(0.97); }
.lp-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.lp-btn--accent {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 2px 12px -3px rgba(255, 118, 0, 0.4);
}
.lp-btn--accent:hover:not(:disabled) {
  background: var(--color-primary-light);
  border-color: var(--color-primary-light);
}
.lp-btn--outline {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color-strong);
}
.lp-btn--outline:hover {
  border-color: var(--text-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 0.65rem;
  padding: 2.5rem 0;
}
.empty-state-icon {
  width: 40px;
  height: 40px;
  color: var(--text-muted);
  opacity: 0.5;
}
.empty-state h3 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 550;
}
.empty-state p {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
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
    grid-template-columns: 1.4fr 1fr;
    align-items: center;
  }
  .cta-actions {
    margin-left: auto;
  }
}

@media (min-width: 1024px) {
  .featured-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 14px;
  }
}

@media (max-width: 768px) {
  .search-bar {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
  }
  .search-submit {
    grid-column: 1 / -1;
    width: 100%;
  }
  .cta-actions {
    grid-template-columns: 1fr;
    max-width: none;
  }
  .cta-actions .lp-btn {
    width: 100%;
  }
}
</style>
