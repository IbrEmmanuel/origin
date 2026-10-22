import api from './api';

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.posts)) return data.posts;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (data && typeof data === 'object' && data.id && data.slug) return [data];
  return [];
}

function normalizePost(raw = {}) {
  return {
    id: raw.id,
    title: raw.title || 'Untitled',
    slug: raw.slug,
    content: raw.content || '',
    excerpt: raw.excerpt || '',
    featured_image: raw.featured_image || raw.image || null,
    category_id: raw.category_id,
    category_name: raw.category_name || raw.category?.name || 'General',
    category_slug: raw.category_slug || raw.category?.slug || '',
    is_featured: !!(raw.is_featured === 1 || raw.is_featured === true),
    is_published: raw.is_published !== 0 && raw.is_published !== false,
    author_id: raw.author_id,
    author_name: raw.author_name || raw.author?.name || 'Origin Editorial',
    created_at: raw.created_at,
    updated_at: raw.updated_at
  };
}

function readingMinutes(content = '') {
  const words = String(content).replace(/[#*_`>~\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

const blogService = {
  async getAllPosts(params = {}) {
    const { data } = await api.get('/blog', { params });
    return asList(data).map(normalizePost);
  },

  async getFeaturedPosts() {
    try {
      const { data } = await api.get('/blog/featured');
      const list = asList(data).map(normalizePost);
      if (list.length) return list;
    } catch (err) {
      if (![404, 501].includes(err.response?.status)) throw err;
    }
    const all = await this.getAllPosts();
    const featured = all.filter((p) => p.is_featured);
    return featured.length ? featured : all.slice(0, 3);
  },

  async getCategories() {
    const { data } = await api.get('/blog/categories');
    const list = Array.isArray(data) ? data : data?.categories || data?.items || [];
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      created_at: c.created_at
    }));
  },

  async getPostBySlug(slug) {
    const { data } = await api.get(`/blog/${slug}`);
    const post = normalizePost(data?.post || data);
    return {
      ...post,
      reading_minutes: readingMinutes(post.content)
    };
  },

  async getRelatedPosts(post, limit = 3) {
    if (!post) return [];
    try {
      const params = post.category_slug ? { category: post.category_slug } : {};
      const list = await this.getAllPosts(params);
      return list.filter((p) => p.slug !== post.slug).slice(0, limit);
    } catch {
      return [];
    }
  },

  readingMinutes
};

export default blogService;
