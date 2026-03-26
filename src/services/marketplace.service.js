import api from './api';

const marketplaceService = {
    async getProducts(params = {}) {
        try {
            const response = await api.get('/marketplace/products', { params });
            return response.data;
        } catch (error) {
            console.error('Marketplace fetch error:', error);
            throw error;
        }
    },
    async getProduct(id) {
        const response = await api.get(`/marketplace/products/${id}`);
        return response.data;
    },
    async checkEligibility(id) {
        const response = await api.get(`/marketplace/products/${id}/eligibility`);
        return response.data;
    },
    async submitReview(id, data) {
        const response = await api.post(`/marketplace/products/${id}/reviews`, data);
        return response.data;
    },
    async submitComment(id, data) {
        const response = await api.post(`/marketplace/products/${id}/comments`, data);
        return response.data;
    }
};

export default marketplaceService;
