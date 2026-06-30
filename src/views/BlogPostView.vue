<template>
  <div class="blog-post-view page-section bg-primary">
    <div v-if="loading" class="post-loading container">
      <div class="skeleton-box skeleton-date mx-auto"></div>
      <div class="skeleton-box skeleton-title mx-auto"></div>
      <div class="skeleton-box skeleton-hero mb-12"></div>
      <p class="loading-text">Unfolding the Story...</p>
    </div>

    <template v-else-if="post">
      <article class="post-article-simple container fade-in-up">
        <header class="post-header-simple">
          <router-link to="/blog" class="back-link-simple">
            <ArrowLeft class="icon-meta" /> Back to Blog
          </router-link>
          
          <div class="post-meta-top">
            <span class="category-tag">{{ post.category_name || 'Innovation' }}</span>
          </div>
          
          <h1 class="post-title-simple">{{ post.title }}</h1>
          
          <div class="post-meta-bottom">
            <span>By Origin Editorial</span>
            <span class="dot-separator"></span>
            <span>{{ formatDate(post.created_at) }}</span>
            <span class="dot-separator"></span>
            <span>5 min read</span>
          </div>
        </header>

        <div v-if="post.featured_image" class="post-hero-simple">
          <img :src="getImgUrl(post.featured_image)" :alt="post.title" class="hero-img-simple" />
        </div>

        <div 
          class="blog-content main-body-simple"
          v-html="renderedContent"
        ></div>
        
        <footer class="post-footer-simple">
          <div class="share-minimal">
            <span class="share-label">Share article</span>
            <div class="share-links-simple">
              <button class="share-icon-btn"><Share2 class="icon-meta" /></button>
              <button class="share-icon-btn"><Twitter class="icon-meta" /></button>
              <button class="share-icon-btn"><Linkedin class="icon-meta" /></button>
            </div>
          </div>
        </footer>
      </article>
    </template>

    <div v-else class="container py-24 text-center fade-in-up">
      <div class="empty-state">
        <h1 class="empty-state-title">Article Not Found</h1>
        <p class="empty-state-desc mx-auto">The post you're looking for might have been moved or unpublished. Return to our blog to find more energy insights.</p>
        <router-link to="/blog" class="btn btn-primary">
          Return to Blog
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, Clock, Loader2, Share2, Twitter, Linkedin } from 'lucide-vue-next';
import blogService from '@/services/blog.service';
import { marked } from 'marked';

const route = useRoute();
const post = ref(null);
const loading = ref(true);

const fetchPost = async () => {
  try {
    loading.value = true;
    post.value = await blogService.getPostBySlug(route.params.slug);
    if (post.value) {
      document.title = `${post.value.title} | Origin Electric`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && post.value.content) {
        const plainText = post.value.content
          .replace(/[#*`_~]/g, '')
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
          .trim()
          .slice(0, 150);
        metaDesc.setAttribute('content', `${plainText}...`);
      }
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
  } finally {
    loading.value = false;
  }
};

const renderedContent = computed(() => {
  if (!post.value || !post.value.content) return '';
  return marked.parse(post.value.content);
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const getImgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
};

onMounted(fetchPost);
</script>

<style scoped>
.blog-post-view {
  min-height: 100vh;
}

.post-article-simple {
  max-width: 800px;
  padding: var(--space-xl) var(--space-md);
}

.post-header-simple {
  margin-bottom: var(--space-lg);
}

.back-link-simple {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-md);
}

.back-link-simple:hover {
  color: var(--color-blue-primary);
}

.category-tag {
  color: var(--color-blue-primary);
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.post-title-simple {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin: var(--space-xs) 0 var(--space-md);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .post-title-simple { font-size: 2rem; }
}

.post-meta-bottom {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  opacity: 0.8;
}

.dot-separator {
  width: 4px;
  height: 4px;
  background: var(--border-color);
  border-radius: 50%;
}

.post-hero-simple {
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.hero-img-simple {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
}

.main-body-simple {
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.post-footer-simple {
  margin-top: var(--space-xl);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-color);
}

.share-minimal {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.share-label {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.share-links-simple {
  display: flex;
  gap: 8px;
}

.share-icon-btn {
  background: none;
  border: 1px solid var(--border-color);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-speed);
}

.share-icon-btn:hover {
  color: var(--color-blue-primary);
  border-color: var(--color-blue-primary);
  background: var(--color-blue-light);
}

.post-loading {
  text-align: center;
  padding: var(--space-xl) 0;
}

.skeleton-date { height: 1.5rem; width: 100px; margin-bottom: 1rem; }
.skeleton-title { height: 4rem; width: 80%; margin-bottom: 2rem; }
.skeleton-hero { height: 400px; width: 100%; border-radius: var(--radius-md); }

.loading-text {
  font-weight: 700;
  color: var(--text-secondary);
}

.empty-state-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--space-xs);
}

.empty-state-desc {
  max-width: 450px;
  margin-bottom: var(--space-md);
}
</style>
