import api from './api';
import {
  rowToProductPayload,
  saveLocalImportBatch,
  updateLocalImportBatch
} from '@/utils/productImport';

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
    },

    /**
     * Full-stack fallback: create/update each valid row via existing product CRUD.
     * Used when POST /vendor/products/import is not deployed on the API host.
     */
    async importProductsDirectly(validRows, mode = 'create', { filename = 'import.csv', onProgress } = {}) {
        const productsRes = await this.getProducts();
        const list = Array.isArray(productsRes) ? productsRes : productsRes?.products || [];
        const bySku = new Map();
        list.forEach((p) => {
            const key = String(p.sku || '').trim().toLowerCase();
            if (key) bySku.set(key, p);
        });

        const batchId = `local-${Date.now()}`;
        const batch = {
            id: batchId,
            batch_id: batchId,
            filename,
            file_name: filename,
            mode,
            source: 'direct_crud',
            status: 'processing',
            created_at: new Date().toISOString(),
            uploaded_at: new Date().toISOString(),
            total_records: validRows.length,
            total: validRows.length,
            processed_count: 0,
            success_count: 0,
            failed_count: 0,
            errors: [],
            row_errors: []
        };
        saveLocalImportBatch(batch);

        let success = 0;
        let failed = 0;
        const errors = [];

        for (let i = 0; i < validRows.length; i++) {
            const row = validRows[i];
            const payload = rowToProductPayload(row);
            const skuKey = String(row.sku || '').trim().toLowerCase();
            const existing = skuKey ? bySku.get(skuKey) : null;

            try {
                if (existing && mode === 'update') {
                    await this.updateProduct(existing.id, {
                        ...existing,
                        ...payload,
                        images: payload.images?.length ? payload.images : (existing.images || [])
                    });
                } else if (existing && mode === 'create') {
                    throw new Error(`SKU "${row.sku}" already exists`);
                } else {
                    const created = await this.addProduct(payload);
                    if (skuKey && created?.id) {
                        bySku.set(skuKey, { ...created, sku: row.sku });
                    } else if (skuKey) {
                        bySku.set(skuKey, { id: created?.id || created?.product?.id, sku: row.sku });
                    }
                }
                success += 1;
            } catch (err) {
                failed += 1;
                const message =
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    err.message ||
                    'Failed to save product';
                errors.push({
                    row: row.rowIndex,
                    rowIndex: row.rowIndex,
                    sku: row.sku,
                    message,
                    error: message
                });
            }

            const processed = i + 1;
            updateLocalImportBatch(batchId, {
                processed_count: processed,
                success_count: success,
                failed_count: failed,
                errors,
                row_errors: errors,
                status: processed >= validRows.length ? (failed && !success ? 'failed' : failed ? 'completed_with_errors' : 'completed') : 'processing'
            });

            if (typeof onProgress === 'function') {
                onProgress({
                    processed,
                    total: validRows.length,
                    success,
                    failed
                });
            }
        }

        const finalStatus = failed && !success ? 'failed' : failed ? 'completed_with_errors' : 'completed';
        const result = updateLocalImportBatch(batchId, {
            status: finalStatus,
            processed_count: validRows.length,
            success_count: success,
            failed_count: failed,
            errors,
            row_errors: errors,
            finished_at: new Date().toISOString()
        });

        return result || {
            id: batchId,
            batch_id: batchId,
            status: finalStatus,
            success_count: success,
            failed_count: failed,
            total_records: validRows.length,
            errors
        };
    }
};

export default vendorService;
