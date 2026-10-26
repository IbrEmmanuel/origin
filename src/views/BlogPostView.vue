<template>
  <div class="post-page">
    <div class="container">
      <div v-if="loading" class="loading" aria-busy="true">
        <div class="skel w-24"></div>
        <div class="skel title"></div>
        <div class="skel meta"></div>
        <div class="skel hero"></div>
        <div class="skel line"></div>
        <div class="skel line w-90"></div>
        <div class="skel line w-70"></div>
      </div>

      <template v-else-if="post">
        <article class="article">
          <header class="article-header">
            <router-link to="/blog" class="back">
              <ArrowLeft class="icon-sm" />
              <span>Back to blog</span>
            </router-link>

            <span class="post-cat">{{ post.category_name || 'Innovation' }}</span>

            <h1 class="article-title">{{ post.title }}</h1>

            <div class="meta">
              <span class="meta-author">{{ post.author_name || 'Origin Editorial' }}</span>
              <span class="dot" aria-hidden="true"></span>
              <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
              <span class="dot" aria-hidden="true"></span>
              <span>{{ post.reading_minutes || minutes(post) }} min read</span>
            </div>
          </header>

          <div v-if="post.featured_image" class="article-hero">
            <img
              class="article-hero-image"
              :src="getImgUrl(post.featured_image)"
              :alt="post.title"
            />
          </div>
          <div v-else class="article-hero article-hero--fallback" aria-hidden="true">
            <div class="hero-grid"></div>
            <span class="hero-fallback">{{ initials(post.title) }}</span>
          </div>

          <div class="article-body">
            <div class="blog-content" v-html="renderedContent"></div>

            <footer class="share-section">
              <div class="share-copy">
                <strong>Share this article</strong>
                <p>Pass it along to someone sizing their next system.</p>
              </div>
              <div class="share-actions">
                <button type="button" class="lp-btn lp-btn--outline lp-btn--icon" @click="shareNative" aria-label="Share">
                  <Share2 class="lp-btn-icon" />
                </button>
                <button type="button" class="lp-btn lp-btn--dark" @click="copyLink">
                  {{ copied ? 'Copied' : 'Copy link' }}
                </button>
              </div>
            </footer>
          </div>
        </article>

        <section v-if="related.length" class="related">
          <div class="section-label">
            <div class="section-label-copy">
              <span class="post-cat">Continue reading</span>
              <h2>More in {{ post.category_name || 'this topic' }}</h2>
            </div>
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
                <span class="blog-read-more">Read article <ArrowRight class="icon-read" /></span>
              </div>
            </article>
          </div>
        </section>

        <section class="cta-band">
          <div class="cta-copy">
            <span class="post-cat">Ready to act?</span>
            <h3>Turn this insight into a working system</h3>
            <p>Book an engineering consult or browse live marketplace gear.</p>
          </div>
          <div class="cta-actions">
            <router-link to="/account/consultations" class="lp-btn lp-btn--accent">
              Book consult
            </router-link>
            <router-link to="/marketplace" class="lp-btn lp-btn--outline">
              Shop gear
            </router-link>
          </div>
        </section>
      </template>

      <div v-else class="empty-state">
        <h1>Article not found</h1>
        <p>{{ error || 'This post may have moved or is unpublished.' }}</p>
        <router-link to="/blog" class="lp-btn lp-btn--accent">Return to blog</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, ArrowRight, Share2 } from 'lucide-vue-next';
import blogService from '@/services/blog.service';
import { mediaUrl } from '@/utils/mediaUrl';
import { marked } from 'marked';
import { applySeo, articleJsonLd, breadcrumbJsonLd, setJsonLd, clearDynamicSeo } from '@/composables/useSeo';

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
      const seoTitle = post.value.seo_title || post.value.meta_title || post.value.title;
      const desc =
        post.value.meta_description ||
        post.value.excerpt ||
        post.value.content ||
        `${post.value.title} — Origin Electric Blog`;

      applySeo({
        title: seoTitle,
        description: desc,
        path,
        image: post.value.featured_image ? mediaUrl(post.value.featured_image) : undefined,
        imageAlt: post.value.title,
        type: 'article',
        jsonLdId: 'article',
        jsonLd: articleJsonLd(post.value, path)
      });
      setJsonLd(
        'breadcrumb',
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.value.title, path }
        ])
      );

      related.value = await blogService.getRelatedPosts(post.value, 3);
    } else {
      clearDynamicSeo();
      applySeo({
        title: 'Article not found',
        description: 'This blog article is unavailable.',
        path: `/blog/${route.params.slug}`,
        noindex: true
      });
    }
  } catch (err) {
    console.error('Error fetching blog post:', err);
    post.value = null;
    clearDynamicSeo();
    applySeo({
      title: 'Article not found',
      description: 'This blog article is unavailable.',
      path: `/blog/${route.params.slug}`,
      noindex: true
    });
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
onUnmounted(() => {
  clearDynamicSeo();
});
</script>

<style scoped>
.post-page {
  --lp-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: clamp(1.75rem, 4vw, 3rem) 0 clamp(4rem, 8vw, 6rem);
  min-height: 70vh;
  width: 100%;
  max-width: 100%;
  overflow-x: clip;
}

.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding-inline: clamp(1rem, 4vw, 1.5rem);
  box-sizing: border-box;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem 0 2rem;
}
.skel {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: skeletonPulse 1.5s infinite linear;
  border-radius: var(--lp-radius);
  height: 14px;
}
.skel.w-24 { width: 140px; height: 28px; }
.skel.title { height: 48px; width: min(100%, 720px); }
.skel.meta { height: 14px; width: 280px; }
.skel.hero { height: clamp(180px, 32vw, 360px); width: 100%; margin: 0.5rem 0 1rem; }
.skel.line { height: 12px; width: 100%; }
.skel.w-90 { width: 90%; }
.skel.w-70 { width: 70%; }

/* Header — stacked rows so nav + category never collide */
.article-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  text-align: left;
  max-width: 760px;
  margin: 0 0 1.75rem;
  position: relative;
  z-index: 1;
}

.back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  height: 40px;
  padding: 0 14px 0 12px;
  margin: 0 0 1.15rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.82rem;
  border: 1px solid var(--border-color);
  border-radius: var(--lp-radius);
  background: var(--bg-secondary);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.back:hover {
  color: var(--color-primary);
  border-color: rgba(255, 118, 0, 0.35);
  background: var(--color-orange-light);
}

.post-cat {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  max-width: 100%;
  padding: 0 12px;
  margin: 0 0 1rem;
  background: rgba(255, 118, 0, 0.08);
  border: 1px solid rgba(255, 118, 0, 0.35);
  border-radius: var(--radius-xs);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
}

.article-title {
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 4.5vw, 3rem);
  font-weight: 550;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--text-primary);
  margin: 0 0 1rem;
  text-align: left;
  max-width: none;
  width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.86rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}
.meta-author {
  font-weight: 600;
  color: var(--text-secondary);
}
.dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.7;
}

/* Hero — full-bleed tech plane */
.article-hero {
  position: relative;
  margin: 0 0 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-secondary);
  width: 100%;
  max-width: 100%;
}
.article-hero-image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
.article-hero--fallback {
  aspect-ratio: 16 / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 118, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 118, 0, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
}
.hero-fallback {
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 8vw, 4rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  color: var(--text-muted);
  opacity: 0.55;
}

/* Body — justified modern editorial */
.article-body {
  max-width: min(720px, 100%);
  width: 100%;
  margin: 0;
  min-width: 0;
}

.blog-content {
  color: var(--text-secondary);
  font-size: 1.0625rem;
  line-height: 1.8;
  text-align: justify;
  text-justify: inter-word;
  hyphens: auto;
  overflow-wrap: anywhere;
  word-break: break-word;
  max-width: 100%;
}
.blog-content :deep(h2),
.blog-content :deep(h3) {
  font-family: var(--font-display);
  color: var(--text-primary);
  font-weight: 550;
  letter-spacing: -0.025em;
  text-align: left;
  margin: 2.25rem 0 0.85rem;
  line-height: 1.2;
}
.blog-content :deep(h2) { font-size: clamp(1.35rem, 2.5vw, 1.75rem); }
.blog-content :deep(h3) { font-size: clamp(1.15rem, 2vw, 1.35rem); }
.blog-content :deep(p) {
  margin: 0 0 1.35rem;
  text-align: justify;
}
.blog-content :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}
.blog-content :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.blog-content :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  padding: 1rem 1.35rem;
  background: var(--bg-secondary);
  border-radius: 0 var(--lp-radius) var(--lp-radius) 0;
  font-style: italic;
  font-size: 1.1rem;
  margin: 1.75rem 0;
  text-align: left;
  color: var(--text-primary);
}
.blog-content :deep(ul),
.blog-content :deep(ol) {
  margin: 0 0 1.5rem;
  padding-left: 1.35rem;
  text-align: left;
}
.blog-content :deep(li) { margin-bottom: 0.45rem; }
.blog-content :deep(img) {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  margin: 1.75rem 0;
  border: 1px solid var(--border-color);
}
.blog-content :deep(code) {
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  font-size: 0.88em;
  color: var(--color-primary);
  word-break: break-word;
}
.blog-content :deep(pre) {
  background: var(--bg-secondary);
  padding: 1.15rem;
  border-radius: var(--radius-md);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1.75rem 0;
  border: 1px solid var(--border-color);
  text-align: left;
  max-width: 100%;
}
.blog-content :deep(table) {
  display: block;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.blog-content :deep(iframe),
.blog-content :deep(video) {
  max-width: 100%;
}

/* Share */
.share-section {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  margin-top: 2.75rem;
  padding: 1.35rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
}
.share-copy strong {
  display: block;
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}
.share-copy p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.45;
}
.share-actions {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  width: 100%;
  max-width: 360px;
}
.share-actions .lp-btn { justify-content: center; }

/* Related */
.related {
  margin-top: clamp(3rem, 6vw, 4.5rem);
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}
.section-label {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.35rem;
}
.section-label-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.55rem;
  min-width: 0;
}
.section-label-copy .post-cat { margin-bottom: 0; }
.section-label h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.85rem);
  font-weight: 550;
  letter-spacing: -0.025em;
  line-height: 1.15;
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
.related-grid {
  margin-top: 0;
}

/* CTA band */
.cta-band {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.35rem;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding: 1.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}
.cta-copy .post-cat { margin-bottom: 0.55rem; }
.cta-band h3 {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 550;
  letter-spacing: -0.025em;
}
.cta-band p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}
.cta-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-self: stretch;
  width: 100%;
}
.cta-actions .lp-btn { width: 100%; justify-content: center; }

/* Shared landing buttons */
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
.lp-btn-icon { width: 15px; height: 15px; flex-shrink: 0; stroke-width: 2; }
.lp-btn--icon { width: 44px; padding: 0; }
.lp-btn--dark {
  background: var(--color-dark);
  color: var(--color-light);
  border-color: var(--color-dark);
}
.lp-btn--dark:hover { background: #1a1a1a; border-color: #1a1a1a; }
.lp-btn--accent {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 2px 12px -3px rgba(255, 118, 0, 0.4);
}
.lp-btn--accent:hover {
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
  background: var(--bg-secondary);
}

.dark-mode .lp-btn--dark,
:global(html.dark-mode) .lp-btn--dark {
  background: var(--color-light);
  color: var(--color-dark);
  border-color: var(--color-light);
}

.empty-state {
  text-align: left;
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}
.empty-state h1 {
  font-family: var(--font-display);
  font-weight: 550;
  margin: 0;
}
.empty-state p {
  color: var(--text-secondary);
  margin: 0 0 0.5rem;
}

@media (min-width: 768px) {
  .article-hero-image,
  .article-hero--fallback {
    aspect-ratio: 21 / 9;
  }
  .share-section {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .share-actions { max-width: 280px; }
  .cta-band {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: center;
  }
  .cta-actions { margin-left: auto; }
}

@media (max-width: 767px) {
  .post-page {
    padding: 1.25rem 0 3.5rem;
  }
  .article-header {
    margin-bottom: 1.25rem;
  }
  .back {
    width: 100%;
    justify-content: flex-start;
  }
  .article-title {
    max-width: none;
    font-size: clamp(1.55rem, 7.5vw, 2.1rem);
  }
  .article-hero {
    margin-bottom: 1.5rem;
    border-radius: var(--radius-sm);
  }
  .meta {
    font-size: 0.8rem;
    gap: 0.4rem;
  }
  .blog-content {
    font-size: 1rem;
    text-align: left;
    hyphens: none;
  }
  .blog-content :deep(p) { text-align: left; }
  .blog-content :deep(blockquote) {
    padding: 0.85rem 1rem;
    font-size: 1rem;
  }
  .share-section {
    padding: 1.1rem 1.15rem;
  }
  .share-actions {
    max-width: none;
    grid-template-columns: 44px minmax(0, 1fr);
  }
  .cta-band {
    padding: 1.25rem;
  }
  .cta-actions {
    grid-template-columns: minmax(0, 1fr);
    max-width: none;
  }
  .cta-actions .lp-btn,
  .share-actions .lp-btn {
    width: 100%;
    min-height: 44px;
  }
  .section-label {
    align-items: flex-start;
  }
}

@media (max-width: 380px) {
  .container {
    padding-inline: 0.85rem;
  }
}
</style>
