<template>
  <div class="blog-tech">
    <div class="grid-lines" aria-hidden="true"></div>
    <div class="glow glow-a" aria-hidden="true"></div>
    <div class="glow glow-b" aria-hidden="true"></div>

    <div class="blog-shell">
      <header class="hero">
        <p class="eyebrow">Live from Origin · /api/blog</p>
        <h1>Origin <span class="accent">Blog</span></h1>
        <p class="lede">
          Field guides, Nigeria power insights, and solar strategy — pulled live from the Origin API.
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

        <div class="filter-rail" role="tablist" aria-label="Blog categories">
          <button
            type="button"
            class="chip"
            :class="{ active: !selectedCategory }"
            @click="selectCategory(null)"
          >
            All
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="chip"
            :class="{ active: selectedCategory === cat.slug }"
            @click="selectCategory(cat.slug)"
          >
            {{ cat.name }}
          </button>
        </div>
      </header>

      <!-- Featured -->
      <section v-if="featured.length && !searchQuery && !selectedCategory" class="featured-section">
        <div class="section-label">
          <span>Featured</span>
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
              <img v-if="post.featured_image" :src="getImgUrl(post.featured_image)" :alt="post.title" />
              <div v-else class="media-fallback mono">{{ initials(post.title) }}</div>
              <span class="badge">{{ post.category_name }}</span>
            </div>
            <div class="featured-body">
              <p class="meta mono">
                <CalendarIcon /> {{ formatDate(post.created_at) }} · {{ minutes(post) }} min
              </p>
              <h2>{{ post.title }}</h2>
              <p>{{ excerpt(post) }}</p>
              <span class="cta">Read feature <ArrowRightIcon /></span>
            </div>
          </article>
        </div>
      </section>

      <!-- Feed -->
      <section class="feed" aria-live="polite">
        <div class="section-label">
          <span>{{ feedTitle }}</span>
          <span class="count">{{ posts.length }}</span>
        </div>

        <div v-if="error" class="banner">{{ error }} <button type="button" @click="reload">Retry</button></div>

        <div v-if="loading" class="grid">
          <div v-for="i in 6" :key="i" class="card skeleton-card">
            <div class="skel media"></div>
            <div class="skel line w-30"></div>
            <div class="skel line w-90"></div>
            <div class="skel line w-70"></div>
          </div>
        </div>

        <div v-else-if="!posts.length" class="empty">
          <BookOpen class="empty-icon" />
          <h3>No matching stories</h3>
          <p>Try another category or clear your search.</p>
          <button type="button" class="btn-primary" @click="clearFilters">Reset filters</button>
        </div>

        <div v-else class="grid">
          <article
            v-for="(post, index) in posts"
            :key="post.id"
            class="card"
            :style="{ '--delay': `${index * 50}ms` }"
            @click="goPost(post.slug)"
            @keydown.enter="goPost(post.slug)"
            tabindex="0"
            role="link"
          >
            <div class="media">
              <img v-if="post.featured_image" :src="getImgUrl(post.featured_image)" :alt="post.title" loading="lazy" />
              <div v-else class="media-fallback mono">{{ initials(post.title) }}</div>
              <span class="badge">{{ post.category_name || 'General' }}</span>
            </div>
            <div class="body">
              <div class="meta mono">
                <CalendarIcon />
                <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
                <span>· {{ minutes(post) }} min</span>
              </div>
              <h2>{{ post.title }}</h2>
              <p>{{ excerpt(post) }}</p>
              <div class="cta">Read article <ArrowRightIcon /></div>
            </div>
          </article>
        </div>
      </section>

      <!-- CTA band -->
      <section class="cta-band">
        <div>
          <p class="eyebrow">Next step</p>
          <h3>Need a system sized for your site?</h3>
          <p>Talk to Origin engineers or browse live marketplace gear.</p>
        </div>
        <div class="cta-actions">
          <router-link to="/account/consultations" class="btn-primary">Book consult</router-link>
          <router-link to="/marketplace" class="btn-ghost">Marketplace</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  Image as ImageIcon,
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
.blog-tech {
  --navy-950: #070b14;
  --navy-900: #0c1220;
  --navy-800: #141c2e;
  --ink: #e8eef8;
  --muted: #93a0b8;
  --line: rgba(148, 163, 184, 0.14);
  --accent: var(--color-primary, #ff7600);

  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  color: var(--ink);
  background: var(--navy-950);
  -webkit-font-smoothing: antialiased;
}

.grid-lines {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.45;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 20%, transparent 75%);
}

.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(72px);
}

.glow-a {
  top: -10rem;
  right: -4rem;
  width: min(30rem, 90vw);
  height: min(30rem, 90vw);
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}

.glow-b {
  bottom: -8rem;
  left: -6rem;
  width: min(22rem, 70vw);
  height: min(22rem, 70vw);
  background: rgba(56, 189, 248, 0.1);
}

.blog-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 64rem;
  margin-inline: auto;
  padding:
    clamp(5.5rem, 12vw, 7.5rem)
    clamp(1rem, 4vw, 1.5rem)
    clamp(3rem, 8vw, 5rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero { text-align: center; }

.eyebrow, .mono {
  font-family: ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace;
}

.eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--accent) 85%, #fff);
}

.hero h1 {
  margin: 0;
  font-family: var(--font-display), Georgia, serif;
  font-size: clamp(2.1rem, 7vw, 3.5rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.08;
  color: #fff;
}

.accent {
  background: linear-gradient(120deg, var(--accent), #ffb347 55%, #7dd3fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lede {
  margin: 0.9rem auto 0;
  max-width: 36rem;
  font-size: clamp(0.95rem, 2.6vw, 1.05rem);
  line-height: 1.6;
  color: var(--muted);
}

.search-bar {
  margin: 1.35rem auto 0;
  max-width: 34rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.35rem 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(12, 18, 32, 0.78);
  backdrop-filter: blur(12px);
}

.search-icon {
  width: 16px;
  height: 16px;
  color: var(--muted);
}

.search-bar input {
  min-height: 42px;
  border: none;
  background: transparent;
  color: #fff;
  font: inherit;
  outline: none;
  width: 100%;
}

.search-bar input::placeholder { color: var(--muted); }

.search-btn {
  min-height: 40px;
  padding: 0 1rem;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.filter-rail {
  display: flex;
  justify-content: center;
  gap: 0.45rem;
  margin-top: 1.15rem;
  padding: 0.35rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.filter-rail::-webkit-scrollbar { display: none; }

.chip {
  flex: 0 0 auto;
  min-height: 40px;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(20, 28, 46, 0.72);
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.chip.active {
  color: #fff;
  background: color-mix(in srgb, var(--accent) 88%, #000);
  border-color: transparent;
  box-shadow: 0 10px 24px -10px color-mix(in srgb, var(--accent) 70%, transparent);
}

.section-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  font-family: ui-monospace, Menlo, Consolas, monospace;
}

.count {
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  color: #fff;
}

.featured-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.featured-card {
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--navy-900) 88%, #000);
  cursor: pointer;
  outline: none;
}

.featured-card:hover,
.featured-card:focus-visible {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
}

.featured-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--navy-800);
  overflow: hidden;
}

.featured-media img,
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.featured-body {
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.featured-body h2,
.body h2 {
  margin: 0;
  font-family: var(--font-display), Georgia, serif;
  font-size: clamp(1.05rem, 3.2vw, 1.35rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #fff;
  line-height: 1.25;
}

.featured-body p,
.body p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: color-mix(in srgb, var(--navy-900) 88%, #000);
  border: 1px solid var(--line);
  cursor: pointer;
  outline: none;
  animation: rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay, 0ms);
}

.card:hover,
.card:focus-visible {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
  transform: translateY(-3px);
}

.media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--navy-800);
}

.media-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: color-mix(in srgb, var(--accent) 70%, #fff);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  background:
    radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 55%),
    var(--navy-800);
}

.badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(7, 11, 20, 0.72);
  border: 1px solid var(--line);
  backdrop-filter: blur(8px);
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1.1rem 1.15rem 1.25rem;
  flex: 1;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--muted);
}

.meta :deep(svg) {
  width: 13px;
  height: 13px;
}

.cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent);
}

.cta :deep(svg) {
  width: 15px;
  height: 15px;
}

.banner {
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: color-mix(in srgb, #f59e0b 16%, transparent);
  color: #fdba74;
  border: 1px solid color-mix(in srgb, #f59e0b 35%, transparent);
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.banner button {
  border: none;
  background: transparent;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.empty {
  text-align: center;
  padding: 3rem 1rem;
  border-radius: 18px;
  border: 1px dashed var(--line);
  background: rgba(12, 18, 32, 0.55);
}

.empty-icon {
  width: 36px;
  height: 36px;
  opacity: 0.45;
  margin-bottom: 0.75rem;
}

.empty h3 { margin: 0 0 0.4rem; color: #fff; }
.empty p { margin: 0 auto 1.1rem; max-width: 26rem; color: var(--muted); }

.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.15rem;
  border-radius: 12px;
  font-weight: 700;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  border: none;
}

.btn-primary { background: var(--accent); color: #fff; }
.btn-ghost {
  background: transparent;
  color: #fff;
  border: 1px solid var(--line);
}

.cta-band {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.35rem;
  border-radius: 18px;
  border: 1px solid var(--line);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 45%),
    rgba(12, 18, 32, 0.85);
}

.cta-band h3 {
  margin: 0.25rem 0 0.35rem;
  color: #fff;
  font-family: var(--font-display), Georgia, serif;
  font-weight: 500;
}

.cta-band p { margin: 0; color: var(--muted); }

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.skeleton-card { pointer-events: none; animation: none; }
.skel {
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.09), rgba(255,255,255,0.04));
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}
.skel.media { aspect-ratio: 16/10; border-radius: 0; }
.skel.line { height: 12px; margin: 0.65rem 1.1rem; }
.w-30 { width: 30%; }
.w-70 { width: 70%; }
.w-90 { width: 90%; }

@keyframes shimmer { to { background-position: -200% 0; } }
@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (min-width: 720px) {
  .featured-card.primary {
    grid-template-columns: 1.15fr 1fr;
  }
  .featured-card.primary .featured-media {
    aspect-ratio: auto;
    min-height: 100%;
  }
  .featured-grid {
    grid-template-columns: 1fr;
  }
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.15rem;
  }
  .cta-band {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (min-width: 960px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .filter-rail { justify-content: flex-start; }
  .search-bar {
    grid-template-columns: auto 1fr;
  }
  .search-btn {
    grid-column: 1 / -1;
  }
}
</style>
