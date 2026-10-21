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
    },

    // ── Bulk product import / batches ──
    // Soft 404: UI shows config state when backend routes are not deployed yet.

    async downloadImportTemplate(format = 'csv') {
        try {
            const response = await api.get('/vendor/products/import/template', {
                params: { format },
                responseType: 'blob'
            });
            return { available: true, blob: response.data };
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 501) {
                return { available: false, blob: null };
            }
            throw error;
        }
    },

    async previewImport(file, mode = 'create') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode);
        try {
            const response = await api.post('/vendor/products/import/preview', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return { available: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 501) {
                return { available: false, data: null };
            }
            throw error;
        }
    },

    async startImport(file, mode = 'create', options = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode);
        if (options.skipDuplicates != null) {
            formData.append('skip_duplicates', String(options.skipDuplicates));
        }
        try {
            const response = await api.post('/vendor/products/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return { available: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 501) {
                return { available: false, data: null };
            }
            throw error;
        }
    },

    async listBatches(params = {}) {
        try {
            const response = await api.get('/vendor/products/import/batches', { params });
            return { available: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 501) {
                return { available: false, data: [] };
            }
            throw error;
        }
    },

    async getBatch(id) {
        try {
            const response = await api.get(`/vendor/products/import/batches/${id}`);
            return { available: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 501) {
                return { available: false, data: null };
            }
            throw error;
        }
    },

    async downloadBatchErrors(id) {
        try {
            const response = await api.get(`/vendor/products/import/batches/${id}/errors`, {
                responseType: 'blob'
            });
            return { available: true, blob: response.data };
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 501) {
                return { available: false, blob: null };
            }
            throw error;
        }
    },

    async retryBatchFailed(id) {
        try {
            const response = await api.post(`/vendor/products/import/batches/${id}/retry-failed`);
            return { available: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 501) {
                return { available: false, data: null };
            }
            throw error;
        }
    }
};

export default vendorService;
