<template>
  <div class="post-tech">
    <div class="grid-lines" aria-hidden="true"></div>
    <div class="glow glow-a" aria-hidden="true"></div>
    <div class="glow glow-b" aria-hidden="true"></div>

    <div class="shell">
      <div v-if="loading" class="loading">
        <div class="skel w-24"></div>
        <div class="skel title"></div>
        <div class="skel hero"></div>
        <p>Loading article from API…</p>
      </div>

      <template v-else-if="post">
        <article class="article">
          <header class="header">
            <router-link to="/blog" class="back">
              <ArrowLeft /> Back to blog
            </router-link>
            <p class="category">{{ post.category_name || 'Innovation' }}</p>
            <h1>{{ post.title }}</h1>
            <div class="meta">
              <span>{{ post.author_name || 'Origin Editorial' }}</span>
              <span class="dot"></span>
              <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
              <span class="dot"></span>
              <span>{{ post.reading_minutes || 5 }} min read</span>
            </div>
          </header>

          <div v-if="post.featured_image" class="hero">
            <img :src="getImgUrl(post.featured_image)" :alt="post.title" />
          </div>
          <div v-else class="hero hero-fallback mono">{{ initials(post.title) }}</div>

          <div class="content" v-html="renderedContent"></div>

          <footer class="footer">
            <span class="share-label">Share</span>
            <div class="share-actions">
              <button type="button" class="share-btn" @click="shareNative" aria-label="Share">
                <Share2 />
              </button>
              <button type="button" class="share-btn" @click="copyLink" aria-label="Copy link">
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </footer>
        </article>

        <section v-if="related.length" class="related">
          <div class="section-label">
            <span>More in {{ post.category_name || 'this topic' }}</span>
            <span class="count">{{ related.length }}</span>
          </div>
          <div class="related-grid">
            <article
              v-for="item in related"
              :key="item.id"
              class="related-card"
              @click="$router.push(`/blog/${item.slug}`)"
              @keydown.enter="$router.push(`/blog/${item.slug}`)"
              tabindex="0"
              role="link"
            >
              <div class="related-media">
                <img v-if="item.featured_image" :src="getImgUrl(item.featured_image)" :alt="item.title" />
                <div v-else class="media-fallback mono">{{ initials(item.title) }}</div>
              </div>
              <div>
                <p class="meta mono">{{ formatDate(item.created_at) }}</p>
                <h3>{{ item.title }}</h3>
              </div>
            </article>
          </div>
        </section>

        <section class="cta-band">
          <div>
            <p class="eyebrow mono">Ready to act?</p>
            <h3>Turn this insight into a working system</h3>
          </div>
          <div class="cta-actions">
            <router-link to="/account/consultations" class="btn">Book consult</router-link>
            <router-link to="/marketplace" class="btn ghost">Shop gear</router-link>
          </div>
        </section>
      </template>

      <div v-else class="empty">
        <h1>Article not found</h1>
        <p>{{ error || 'This post may have moved or is unpublished.' }}</p>
        <router-link to="/blog" class="btn">Return to blog</router-link>
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
.post-tech {
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
  opacity: 0.4;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 55% at 50% 20%, #000 15%, transparent 75%);
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
  right: -3rem;
  width: min(28rem, 85vw);
  height: min(28rem, 85vw);
  background: color-mix(in srgb, var(--accent) 16%, transparent);
}

.glow-b {
  bottom: -8rem;
  left: -5rem;
  width: min(20rem, 70vw);
  height: min(20rem, 70vw);
  background: rgba(56, 189, 248, 0.08);
}

.shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 48rem;
  margin-inline: auto;
  padding:
    clamp(5.25rem, 12vw, 7rem)
    clamp(1rem, 4vw, 1.5rem)
    clamp(3rem, 8vw, 5rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.mono, .eyebrow {
  font-family: ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace;
}

.header { margin-bottom: 0.25rem; }

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  font-family: ui-monospace, Menlo, Consolas, monospace;
}

.back :deep(svg) { width: 14px; height: 14px; }
.back:hover { color: var(--accent); }

.category {
  margin: 0 0 0.55rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  font-family: ui-monospace, Menlo, Consolas, monospace;
}

.header h1 {
  margin: 0;
  font-family: var(--font-display), Georgia, serif;
  font-size: clamp(1.75rem, 6vw, 2.85rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: #fff;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--muted);
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--line);
}

.hero {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--navy-900);
}

.hero img {
  width: 100%;
  height: auto;
  max-height: 460px;
  object-fit: cover;
  display: block;
}

.hero-fallback,
.media-fallback {
  min-height: 180px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--accent) 70%, #fff);
  background:
    radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 55%),
    var(--navy-800);
}

.content {
  font-size: clamp(1rem, 2.5vw, 1.12rem);
  line-height: 1.8;
  color: var(--muted);
}

.content :deep(h2),
.content :deep(h3) {
  color: #fff;
  margin: 1.6rem 0 0.7rem;
  font-family: var(--font-display), Georgia, serif;
  letter-spacing: -0.02em;
}

.content :deep(a) { color: var(--accent); }
.content :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 1rem 0;
}
.content :deep(p) { margin: 0 0 1rem; }
.content :deep(ul),
.content :deep(ol) {
  padding-left: 1.25rem;
  margin: 0 0 1rem;
}

.footer {
  margin-top: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.share-label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.share-actions { display: flex; gap: 0.45rem; }

.share-btn {
  min-height: 40px;
  min-width: 40px;
  padding: 0 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: rgba(12, 18, 32, 0.7);
  color: var(--muted);
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.78rem;
}

.share-btn :deep(svg) { width: 16px; height: 16px; }
.share-btn:hover {
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 40%, var(--line));
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

.related-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

.related-card {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 0.85rem;
  padding: 0.65rem;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(12, 18, 32, 0.75);
  cursor: pointer;
  outline: none;
}

.related-card:hover,
.related-card:focus-visible {
  border-color: color-mix(in srgb, var(--accent) 40%, var(--line));
}

.related-media {
  border-radius: 10px;
  overflow: hidden;
  background: var(--navy-800);
  aspect-ratio: 1;
}

.related-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-card h3 {
  margin: 0.25rem 0 0;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
}

.cta-band {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 45%),
    rgba(12, 18, 32, 0.85);
}

.cta-band h3 {
  margin: 0.2rem 0 0;
  color: #fff;
  font-family: var(--font-display), Georgia, serif;
  font-weight: 500;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.15rem;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.btn.ghost {
  background: transparent;
  border: 1px solid var(--line);
}

.loading,
.empty {
  text-align: center;
  padding: 2rem 0;
  color: var(--muted);
}

.empty h1 { color: #fff; margin-bottom: 0.5rem; }

.skel {
  margin: 0 auto 1rem;
  height: 14px;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.1), rgba(255,255,255,0.04));
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}

.skel.w-24 { width: 6rem; }
.skel.title { width: min(90%, 28rem); height: 2.5rem; }
.skel.hero { width: 100%; height: min(40vw, 280px); border-radius: 16px; }

@keyframes shimmer { to { background-position: -200% 0; } }

@media (min-width: 720px) {
  .related-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .related-card { grid-template-columns: 1fr; }
  .cta-band {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (max-width: 560px) {
  .footer { flex-direction: column; align-items: flex-start; }
}
</style>
