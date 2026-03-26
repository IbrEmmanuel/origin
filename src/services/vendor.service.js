import api from './api';

const vendorService = {
    async apply(formData) {
        const response = await api.post('/vendor/apply', formData);
        return response.data;
    },

    async getStatus() {
        const response = await api.get('/vendor/status');
        return response.data;
    },

    async getDashboardStats() {
        const response = await api.get('/vendor/dashboard-stats');
        return response.data;
    },

    async getProducts() {
        const response = await api.get('/vendor/products');
        return response.data;
    },

    async uploadImages(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        const response = await api.post('/vendor/products/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async addProduct(productData) {
        const response = await api.post('/vendor/products', productData);
        return response.data;
    },

    async updateProduct(id, productData) {
        const response = await api.put(`/vendor/products/${id}`, productData);
        return response.data;
    },

    async deleteProduct(id) {
        const response = await api.delete(`/vendor/products/${id}`);
        return response.data;
    },

    async getProfile() {
        const response = await api.get('/vendor/profile');
        return response.data;
    },

    async updateProfile(profileData) {
        const response = await api.post('/vendor/profile', profileData);
        return response.data;
    },

    async getOrders() {
        const response = await api.get('/vendor/orders');
        return response.data;
    },

    async getOrderDetails(id) {
        const response = await api.get(`/vendor/orders/${id}`);
        return response.data;
    },

    async updateOrderStatus(id, status) {
        const response = await api.patch(`/vendor/orders/${id}/status`, { status });
        return response.data;
    },

    async getWallet() {
        const response = await api.get('/vendor/wallet');
        return response.data;
    },

    async requestWithdrawal(amount) {
        const response = await api.post('/vendor/withdraw', { amount });
        return response.data;
    }
};

export default vendorService;
