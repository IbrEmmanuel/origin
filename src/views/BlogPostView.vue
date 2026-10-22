<template>
  <div class="post-page">
    <div class="container">
      <div v-if="loading" class="loading">
        <div class="skel w-24"></div>
        <div class="skel title"></div>
        <div class="skel hero"></div>
        <p>Loading article…</p>
      </div>

      <template v-else-if="post">
        <article class="article">
          <header class="article-header">
            <router-link to="/blog" class="back">
              <ArrowLeft class="icon-sm" /> Back to blog
            </router-link>
            <span class="section-eyebrow">{{ post.category_name || 'Innovation' }}</span>
            <h1 class="article-title">{{ post.title }}</h1>
            <div class="meta">
              <span>{{ post.author_name || 'Origin Editorial' }}</span>
              <span class="dot" aria-hidden="true"></span>
              <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
              <span class="dot" aria-hidden="true"></span>
              <span>{{ post.reading_minutes || minutes(post) }} min read</span>
            </div>
          </header>

          <div v-if="post.featured_image" class="article-hero-image-wrapper">
            <img
              class="article-hero-image"
              :src="getImgUrl(post.featured_image)"
              :alt="post.title"
            />
          </div>
          <div v-else class="article-hero-image-wrapper fallback">
            <div class="hero-fallback">{{ initials(post.title) }}</div>
          </div>

          <div class="article-content-wrapper">
            <div class="blog-content" v-html="renderedContent"></div>

            <footer class="share-section">
              <div>
                <strong>Share this article</strong>
                <p>Pass it along to someone sizing their next system.</p>
              </div>
              <div class="share-buttons">
                <button type="button" class="share-btn" @click="shareNative" aria-label="Share">
                  <Share2 class="icon-sm" />
                </button>
                <button type="button" class="copy-btn" @click="copyLink">
                  {{ copied ? 'Copied' : 'Copy link' }}
                </button>
              </div>
            </footer>
          </div>
        </article>

        <section v-if="related.length" class="related">
          <div class="section-label">
            <h2>More in {{ post.category_name || 'this topic' }}</h2>
            <span class="count">{{ related.length }}</span>
          </div>
          <div class="blog-grid related-grid">
            <article
              v-for="item in related"
              :key="item.id"
              class="blog-card"
              @click="$router.push(`/blog/${item.slug}`)"
              @keydown.enter="$router.push(`/blog/${item.slug}`)"
              tabindex="0"
              role="link"
            >
              <div class="blog-card-image-wrapper">
                <img
                  v-if="item.featured_image"
                  class="blog-card-image"
                  :src="getImgUrl(item.featured_image)"
                  :alt="item.title"
                />
                <div v-else class="blog-placeholder">{{ initials(item.title) }}</div>
              </div>
              <div class="blog-card-content">
                <p class="blog-card-meta">{{ formatDate(item.created_at) }}</p>
                <h3 class="blog-card-title">{{ item.title }}</h3>
              </div>
            </article>
          </div>
        </section>

        <section class="cta-band">
          <div>
            <span class="section-eyebrow">Ready to act?</span>
            <h3>Turn this insight into a working system</h3>
          </div>
          <div class="cta-actions">
            <router-link to="/account/consultations" class="btn-primary">Book consult</router-link>
            <router-link to="/marketplace" class="btn-outline">Shop gear</router-link>
          </div>
        </section>
      </template>

      <div v-else class="empty-state">
        <h1>Article not found</h1>
        <p>{{ error || 'This post may have moved or is unpublished.' }}</p>
        <router-link to="/blog" class="btn-primary">Return to blog</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, Share2 } from 'lucide-vue-next';
import blogService from '@/services/blog.service';
import { mediaUrl } from '@/utils/mediaUrl';
import { marked } from 'marked';
import { applySeo, articleJsonLd } from '@/composables/useSeo';

const route = useRoute();
const post = ref(null);
const related = ref([]);
const loading = ref(true);
const error = ref('');
const copied = ref(false);

const fetchPost = async () => {
  loading.value = true;
  error.value = '';
  related.value = [];
  try {
    post.value = await blogService.getPostBySlug(route.params.slug);
    if (post.value) {
      const path = `/blog/${post.value.slug || route.params.slug}`;
      const desc = (
        post.value.excerpt ||
        post.value.meta_description ||
        post.value.content ||
        ''
      )
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160);

      applySeo({
        title: post.value.title,
        description: desc || `${post.value.title} — Origin Electric Blog`,
        path,
        image: post.value.featured_image ? mediaUrl(post.value.featured_image) : undefined,
        type: 'article',
        jsonLdId: 'article',
        jsonLd: articleJsonLd(post.value, path)
      });

      related.value = await blogService.getRelatedPosts(post.value, 3);
    }
  } catch (err) {
    console.error('Error fetching blog post:', err);
    post.value = null;
    error.value = err.response?.data?.message || 'Failed to load this article from the API.';
  } finally {
    loading.value = false;
  }
};

const renderedContent = computed(() => {
  if (!post.value?.content) return '';
  return marked.parse(post.value.content);
});

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const minutes = (p) => blogService.readingMinutes(p?.content);
const getImgUrl = (path) => mediaUrl(path);
const initials = (title) =>
  String(title || 'OE')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();

const shareNative = async () => {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: post.value?.title || 'Origin Blog', url });
    } catch {
      /* cancelled */
    }
    return;
  }
  await copyLink();
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    /* ignore */
  }
};

onMounted(fetchPost);
watch(() => route.params.slug, fetchPost);
</script>

<style scoped>
.post-page {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: clamp(2rem, 5vw, 3.5rem) 0 var(--space-xl);
  min-height: 60vh;
}

.container {
  width: min(100% - 2rem, 960px);
  margin: 0 auto;
}

.loading {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 2rem 0;
  color: var(--text-secondary);
}

.skel {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: skeletonPulse 1.5s infinite linear;
  border-radius: var(--radius-md);
  height: 14px;
}
.skel.w-24 { width: 24%; }
.skel.title { height: 42px; width: 80%; }
.skel.hero { height: 220px; width: 100%; margin-top: 0.5rem; }

.article-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto var(--space-md);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  margin-bottom: 1.25rem;
}

.back:hover { color: var(--color-primary); }

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
  margin-bottom: 1rem;
}

.article-title {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 5vw, 3.2rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--text-primary);
  margin: 0 0 1rem;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  color: var(--text-muted);
  font-size: 0.88rem;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-muted);
}

.article-hero-image-wrapper {
  margin-bottom: var(--space-lg);
}

.article-hero-image {
  width: 100%;
  aspect-ratio: 21 / 9;
  object-fit: cover;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.article-hero-image-wrapper.fallback .hero-fallback {
  width: 100%;
  aspect-ratio: 21 / 9;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 500;
  color: var(--text-muted);
}

.article-content-wrapper {
  max-width: 760px;
  margin: 0 auto;
}

.related {
  margin-top: var(--space-xl);
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
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.02em;
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

.related-grid {
  margin-top: 0;
}

.copy-btn {
  min-height: 44px;
  padding: 0 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.copy-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.cta-band {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: var(--space-xl);
  padding: 1.75rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.cta-band h3 {
  margin: 0.65rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.02em;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.cta-actions .btn-primary,
.cta-actions .btn-outline,
.empty-state .btn-primary {
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

.empty-state h1 {
  font-family: var(--font-display);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

@media (min-width: 768px) {
  .cta-band {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
