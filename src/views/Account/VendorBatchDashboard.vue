<template>
  <div class="batches">
    <div class="glass-card section-card">
      <div class="section-head">
        <div>
          <h3>Upload batches</h3>
          <p class="text-secondary">Track bulk imports, failures, and safe retries for your vendor account only.</p>
        </div>
        <button type="button" class="btn ghost-btn" @click="load" :disabled="loading">
          Refresh
        </button>
      </div>

      <div v-if="!available" class="notice notice-warn">
        Batch API not deployed yet. Required routes:
        <code>GET /vendor/products/import/batches</code>,
        <code>GET …/batches/:id</code>,
        <code>GET …/errors</code>,
        <code>POST …/retry-failed</code>.
        Authorization must scope batches to the authenticated vendor.
      </div>

      <div v-else-if="loading" class="state">Loading batches…</div>
      <div v-else-if="!batches.length" class="state">No uploads yet. Use the Bulk Upload tab to start one.</div>

      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Batch</th>
              <th>File</th>
              <th>Uploaded</th>
              <th>Progress</th>
              <th>OK / Fail</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in batches" :key="b.id || b.batch_id">
              <td><code>{{ b.id || b.batch_id }}</code></td>
              <td>{{ b.filename || b.file_name || '—' }}</td>
              <td>{{ formatDate(b.created_at || b.uploaded_at) }}</td>
              <td>
                <div class="progress">
                  <div class="bar" :style="{ width: progressPct(b) + '%' }"></div>
                </div>
                <span class="muted">{{ processed(b) }}/{{ b.total_records || b.total || 0 }}</span>
              </td>
              <td>{{ b.success_count ?? b.successful ?? 0 }} / {{ b.failed_count ?? b.failed ?? 0 }}</td>
              <td><span class="badge" :class="statusClass(b.status)">{{ b.status || 'unknown' }}</span></td>
              <td class="row-actions">
                <button type="button" class="linkish" @click="openDetail(b)">Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="detail" class="glass-card section-card mt-4">
      <div class="section-head">
        <div>
          <h3>Batch {{ detail.id || detail.batch_id }}</h3>
          <p class="text-secondary">{{ detail.filename || detail.file_name }}</p>
        </div>
        <div class="actions-inline">
          <button type="button" class="btn ghost-btn" @click="downloadErrors" :disabled="!failedCount">
            Download errors
          </button>
          <button
            type="button"
            class="btn primary-btn"
            @click="retryFailed"
            :disabled="!failedCount || retrying"
          >
            {{ retrying ? 'Retrying…' : 'Retry failed rows' }}
          </button>
          <button type="button" class="btn ghost-btn" @click="detail = null">Close</button>
        </div>
      </div>

      <ul class="stats">
        <li><strong>Total</strong> {{ detail.total_records || detail.total || 0 }}</li>
        <li><strong>Processed</strong> {{ processed(detail) }}</li>
        <li><strong>Success</strong> {{ detail.success_count ?? detail.successful ?? 0 }}</li>
        <li><strong>Failed</strong> {{ failedCount }}</li>
      </ul>

      <div v-if="(detail.errors || detail.row_errors || []).length" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Row</th><th>SKU</th><th>Error</th></tr>
          </thead>
          <tbody>
            <tr v-for="(err, i) in (detail.errors || detail.row_errors).slice(0, 50)" :key="i">
              <td>{{ err.row || err.rowIndex || '—' }}</td>
              <td>{{ err.sku || '—' }}</td>
              <td>{{ err.message || err.error || (Array.isArray(err.errors) ? err.errors.join('; ') : '—') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import vendorService from '@/services/vendor.service';
import { downloadBlob } from '@/utils/productImport';

const loading = ref(false);
const available = ref(true);
const batches = ref([]);
const detail = ref(null);
const retrying = ref(false);
let pollTimer = null;

const failedCount = computed(() => detail.value?.failed_count ?? detail.value?.failed ?? 0);

const processed = (b) =>
  b.processed_count ??
  b.processed ??
  ((b.success_count ?? b.successful ?? 0) + (b.failed_count ?? b.failed ?? 0));

const progressPct = (b) => {
  const total = b.total_records || b.total || 0;
  if (!total) return 0;
  return Math.min(100, Math.round((processed(b) / total) * 100));
};

const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
};

const statusClass = (s) => {
  const v = String(s || '').toLowerCase();
  if (v.includes('complete') || v === 'done' || v === 'success') return 'ok';
  if (v.includes('fail') || v.includes('error')) return 'err';
  if (v.includes('process') || v === 'pending' || v === 'queued') return 'pending';
  return '';
};

const load = async () => {
  loading.value = true;
  try {
    const res = await vendorService.listBatches();
    available.value = res.available;
    const data = res.data;
    batches.value = Array.isArray(data) ? data : data?.batches || data?.items || [];
  } catch (e) {
    console.error(e);
    alert(e.response?.data?.message || 'Failed to load batches');
  } finally {
    loading.value = false;
  }
};

const openDetail = async (b) => {
  const id = b.id || b.batch_id;
  try {
    const res = await vendorService.getBatch(id);
    detail.value = res.data || b;
  } catch {
    detail.value = b;
  }
};

const downloadErrors = async () => {
  const id = detail.value?.id || detail.value?.batch_id;
  if (!id) return;
  const res = await vendorService.downloadBatchErrors(id);
  if (res.available && res.blob) {
    downloadBlob(res.blob, `batch-${id}-errors.csv`);
    return;
  }
  // Fallback from in-memory errors
  const rows = detail.value?.errors || detail.value?.row_errors || [];
  if (!rows.length) {
    alert('No error report available');
    return;
  }
  const csv = ['row,sku,error']
    .concat(
      rows.map((e) =>
        [e.row || e.rowIndex || '', e.sku || '', JSON.stringify(e.message || e.error || '')].join(',')
      )
    )
    .join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv' }), `batch-${id}-errors.csv`);
};

const retryFailed = async () => {
  const id = detail.value?.id || detail.value?.batch_id;
  if (!id) return;
  retrying.value = true;
  try {
    const res = await vendorService.retryBatchFailed(id);
    if (!res.available) {
      alert('Retry endpoint not available on API yet.');
      return;
    }
    await openDetail({ id });
    await load();
    alert('Failed rows queued for retry (successful rows will not be duplicated).');
  } catch (e) {
    alert(e.response?.data?.message || 'Retry failed');
  } finally {
    retrying.value = false;
  }
};

onMounted(() => {
  load();
  pollTimer = setInterval(() => {
    if (available.value) load();
  }, 15000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<style scoped>
.section-card { padding: 1.5rem; }
.section-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.section-head h3 { margin: 0 0 0.35rem; }
.text-secondary { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }
.notice {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  line-height: 1.5;
}
.notice-warn { background: #fff4ea; color: #9a4d00; border: 1px solid #ffd2a8; }
.notice code { font-size: 0.8rem; }
.state { padding: 2rem; text-align: center; color: var(--text-secondary); }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table th, .data-table td {
  text-align: left;
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}
.progress {
  width: 90px;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 99px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.35rem;
}
.bar { height: 100%; background: var(--color-primary); }
.muted { font-size: 0.75rem; color: var(--text-muted); }
.badge {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
  background: var(--bg-secondary);
}
.badge.ok { background: #e8f5e9; color: #2e7d32; }
.badge.err { background: #ffebee; color: #c62828; }
.badge.pending { background: #eef2ff; color: #1a56db; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  font-family: inherit;
}
.primary-btn { background: var(--color-primary); color: #fff; }
.ghost-btn { background: transparent; border: 1px solid var(--border-color); color: var(--text-primary); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.linkish {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}
.actions-inline { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
}
.stats li {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  font-size: 0.9rem;
}
.mt-4 { margin-top: 1.25rem; }
</style>
