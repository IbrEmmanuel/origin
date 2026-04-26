import api from './api';

const blogService = {
    /**
     * Get all published blog posts
     * @param {Object} params - Query parameters (category, search)
     */
    async getAllPosts(params = {}) {
        const response = await api.get('/blog', { params });
        return response.data;
    },

    /**
     * Get top featured blog posts
     */
    async getFeaturedPosts() {
        const response = await api.get('/blog/featured');
        return response.data;
    },

    /**
     * Get all blog categories
     */
    async getCategories() {
        const response = await api.get('/blog/categories');
        return response.data;
    },

    /**
     * Get a single blog post by its slug
     * @param {string} slug 
     */
    async getPostBySlug(slug) {
        const response = await api.get(`/blog/${slug}`);
        return response.data;
    }
};

export default blogService;
