import api from './api';
import {
  rowToProductPayload,
  saveLocalImportBatch,
  updateLocalImportBatch,
  getLocalImportBatch
} from '@/utils/productImport';

const vendorService = {
    /**
     * Submit supplier application.
     * Accepts a plain object or FormData (store photos / verification docs).
     * Axios sets multipart boundaries automatically when given FormData.
     */
    async apply(payload) {
        const response = await api.post('/vendor/apply', payload);
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

    /**
     * Live supplier overview: prefer /vendor/dashboard-stats, otherwise compose
     * from products + orders + wallet so the hub never shows empty “demo” zeros
     * when the dedicated stats route is missing or incomplete.
     */
    async getLiveDashboard() {
        let stats = null;
        try {
            stats = await this.getDashboardStats();
        } catch {
            stats = null;
        }

        const hasStats =
            stats &&
            (stats.totalProducts != null ||
                stats.total_products != null ||
                stats.totalOrders != null ||
                stats.total_orders != null ||
                stats.totalSales != null ||
                stats.total_sales != null ||
                (stats.recentActivity || stats.recent_activity || []).length);

        if (hasStats) {
            return {
                source: 'dashboard-stats',
                totalProducts: Number(stats.totalProducts ?? stats.total_products ?? 0),
                totalOrders: Number(stats.totalOrders ?? stats.total_orders ?? 0),
                totalSales: Number(stats.totalSales ?? stats.total_sales ?? 0),
                recentActivity: stats.recentActivity || stats.recent_activity || [],
                walletBalance: Number(
                    stats.walletBalance ?? stats.wallet_balance ?? stats.available_balance ?? 0
                )
            };
        }

        const [productsRes, ordersRes, walletRes] = await Promise.allSettled([
            this.getProducts(),
            this.getOrders(),
            this.getWallet()
        ]);

        const productsRaw =
            productsRes.status === 'fulfilled' ? productsRes.value : [];
        const products = Array.isArray(productsRaw)
            ? productsRaw
            : productsRaw?.products || [];

        const ordersRaw = ordersRes.status === 'fulfilled' ? ordersRes.value : [];
        const orders = Array.isArray(ordersRaw)
            ? ordersRaw
            : ordersRaw?.orders || ordersRaw?.items || [];

        const wallet =
            walletRes.status === 'fulfilled' ? walletRes.value || {} : {};

        const totalSales = orders.reduce((sum, o) => {
            const line =
                o.vendor_total ??
                o.vendorTotal ??
                o.total ??
                o.amount ??
                o.subtotal ??
                0;
            return sum + (Number(line) || 0);
        }, 0);

        const recentActivity = orders
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.created_at || b.createdAt || 0) -
                    new Date(a.created_at || a.createdAt || 0)
            )
            .slice(0, 8)
            .map((o) => ({
                id: o.id,
                product_name:
                    o.product_name ||
                    o.items?.[0]?.name ||
                    o.items?.[0]?.product_name ||
                    `${o.items_count || o.items?.length || 0} item(s)`,
                qty: o.items_count || o.items?.length || o.qty || 1,
                price:
                    Number(o.vendor_total ?? o.vendorTotal ?? o.total ?? o.amount ?? 0) /
                    Math.max(1, o.items_count || o.items?.length || 1),
                created_at: o.created_at || o.createdAt,
                status: o.status || 'processing'
            }));

        if (
            productsRes.status === 'rejected' &&
            ordersRes.status === 'rejected' &&
            walletRes.status === 'rejected'
        ) {
            const err =
                productsRes.reason ||
                ordersRes.reason ||
                walletRes.reason ||
                new Error('Could not load supplier dashboard');
            throw err;
        }

        return {
            source: 'composed',
            totalProducts: products.length,
            totalOrders: orders.length,
            totalSales,
            recentActivity,
            walletBalance: Number(
                wallet.balance ??
                    wallet.available_balance ??
                    wallet.availableBalance ??
                    0
            )
        };
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

    /** Normalize vendor profile + payout fields from varied API shapes. */
    normalizeProfile(raw = {}) {
        const payout = raw.payout || raw.payout_info || raw.bank || {};
        const bankName =
            raw.bank_name ||
            raw.bankName ||
            payout.bank_name ||
            payout.bankName ||
            payout.name ||
            '';
        const accountNumber = String(
            raw.account_number ||
                raw.accountNumber ||
                payout.account_number ||
                payout.accountNumber ||
                payout.number ||
                ''
        ).replace(/\D/g, '');
        const accountName =
            raw.account_name ||
            raw.accountName ||
            payout.account_name ||
            payout.accountName ||
            payout.account_holder ||
            '';
        const bankCode =
            raw.bank_code ||
            raw.bankCode ||
            payout.bank_code ||
            payout.bankCode ||
            '';

        return {
            ...raw,
            store_name: raw.store_name || raw.storeName || raw.business_name || '',
            description: raw.description || raw.bio || '',
            phone: raw.phone || raw.phone_number || '',
            business_type: raw.business_type || raw.businessType || '',
            street: raw.street || raw.address || raw.address_line1 || '',
            city: raw.city || '',
            state: raw.state || '',
            country: raw.country || 'Nigeria',
            bank_name: bankName,
            bank_code: bankCode,
            account_number: accountNumber,
            account_name: accountName
        };
    },

    hasPayoutInfo(profile) {
        const p = this.normalizeProfile(profile || {});
        return Boolean(
            String(p.bank_name || '').trim() &&
                String(p.account_number || '').trim().length >= 10 &&
                String(p.account_name || '').trim()
        );
    },

    async getProfile() {
        const response = await api.get('/vendor/profile');
        return this.normalizeProfile(response.data);
    },

    async updateProfile(profileData) {
        const response = await api.post('/vendor/profile', profileData);
        return this.normalizeProfile(response.data?.profile || response.data || profileData);
    },

    async updatePayoutInfo({ bank_name, bank_code, account_number, account_name }) {
        const payload = {
            bank_name: String(bank_name || '').trim(),
            bank_code: bank_code ? String(bank_code).trim() : undefined,
            account_number: String(account_number || '').replace(/\D/g, ''),
            account_name: String(account_name || '').trim()
        };
        // Prefer dedicated payout route when present; fall back to profile update.
        try {
            const response = await api.post('/vendor/payout-info', payload);
            return this.normalizeProfile(response.data?.profile || response.data || payload);
        } catch (error) {
            if (![404, 405, 501].includes(error.response?.status)) throw error;
        }
        try {
            const response = await api.put('/vendor/profile', payload);
            return this.normalizeProfile(response.data?.profile || response.data || payload);
        } catch (error) {
            if (![404, 405, 501].includes(error.response?.status)) throw error;
        }
        const response = await api.post('/vendor/profile', payload);
        return this.normalizeProfile(response.data?.profile || response.data || payload);
    },

    async listNigerianBanks() {
        try {
            const res = await fetch('https://api.paystack.co/bank?country=nigeria&currency=NGN');
            if (!res.ok) return [];
            const json = await res.json();
            const list = Array.isArray(json?.data) ? json.data : [];
            return list
                .filter((b) => b?.active !== false && b?.name)
                .map((b) => ({ name: b.name, code: b.code }))
                .sort((a, b) => a.name.localeCompare(b.name));
        } catch {
            return [];
        }
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
                    error: message,
                    // Keep payload so Batches → Retry can re-POST to live product API
                    rowData: { ...row }
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
    },

    /**
     * Retry failed rows from a local (direct CRUD) import batch against the live API.
     */
    async retryLocalImportBatch(batchId, { onProgress } = {}) {
        const batch = getLocalImportBatch(batchId);
        if (!batch) {
            throw new Error('Import batch not found on this device');
        }
        const failedRows = (batch.errors || batch.row_errors || [])
            .map((e) => e.rowData)
            .filter(Boolean);
        if (!failedRows.length) {
            throw new Error('No retryable row data stored for this batch');
        }
        return this.importProductsDirectly(failedRows, batch.mode || 'create', {
            filename: `retry-${batch.filename || batch.file_name || 'import.csv'}`,
            onProgress
        });
    }
};

export default vendorService;
