<template>
  <div class="batches">
    <div class="panel">
      <div class="panel-head">
        <div>
          <p class="kicker mono">Vendor · imports</p>
          <h3>Upload batches</h3>
          <p class="sub">Track bulk imports, failures, and retries for your catalog.</p>
        </div>
        <button type="button" class="btn ghost" @click="load" :disabled="loading">
          Refresh
        </button>
      </div>

      <div class="notice">
        Imports write to your live catalog via the Origin product API. Batch history merges server jobs with this device’s import runs.
      </div>

      <div v-if="loading && !batches.length" class="state">Loading batches…</div>
      <div v-else-if="!batches.length" class="state">
        No uploads yet. Use the <strong>Bulk</strong> tab to start one.
      </div>

      <!-- Mobile cards -->
      <div v-else class="card-list mobile-only">
        <article v-for="b in batches" :key="b.id || b.batch_id" class="batch-card">
          <header>
            <code>{{ b.id || b.batch_id }}</code>
            <span class="badge" :class="statusClass(b.status)">{{ b.status || 'unknown' }}</span>
          </header>
          <p class="file">{{ b.filename || b.file_name || 'Import file' }}</p>
          <p class="muted">{{ formatDate(b.created_at || b.uploaded_at) }}</p>
          <div class="progress-row">
            <div class="progress"><div class="bar" :style="{ width: progressPct(b) + '%' }"></div></div>
            <span class="muted">{{ processed(b) }}/{{ b.total_records || b.total || 0 }}</span>
          </div>
          <div class="foot">
            <span>{{ b.success_count ?? b.successful ?? 0 }} ok · {{ b.failed_count ?? b.failed ?? 0 }} fail</span>
            <button type="button" class="linkish" @click="openDetail(b)">Details</button>
          </div>
        </article>
      </div>

      <!-- Desktop table -->
      <div v-if="batches.length" class="table-wrap desktop-only">
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
              <td><button type="button" class="linkish" @click="openDetail(b)">Details</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="detail" class="panel detail">
      <div class="panel-head">
        <div>
          <h3>Batch {{ detail.id || detail.batch_id }}</h3>
          <p class="sub">{{ detail.filename || detail.file_name }}</p>
        </div>
        <div class="actions">
          <button type="button" class="btn ghost" @click="downloadErrors" :disabled="!failedCount">
            Download errors
          </button>
          <button
            type="button"
            class="btn primary"
            @click="retryFailed"
            :disabled="!failedCount || retrying"
          >
            {{ retrying ? 'Retrying…' : 'Retry failed' }}
          </button>
          <button type="button" class="btn ghost" @click="detail = null">Close</button>
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
import { downloadBlob, loadLocalImportBatches, getLocalImportBatch } from '@/utils/productImport';

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

const mergeBatches = (remoteList) => {
  const local = loadLocalImportBatches();
  const map = new Map();
  [...remoteList, ...local].forEach((b) => {
    const id = String(b.id || b.batch_id || '');
    if (!id) return;
    if (!map.has(id)) map.set(id, b);
  });
  return Array.from(map.values()).sort((a, b) => {
    const da = new Date(a.created_at || a.uploaded_at || 0).getTime();
    const db = new Date(b.created_at || b.uploaded_at || 0).getTime();
    return db - da;
  });
};

const load = async () => {
  loading.value = true;
  try {
    const res = await vendorService.listBatches();
    available.value = res.available;
    const data = res.data;
    const remote = Array.isArray(data) ? data : data?.batches || data?.items || [];
    batches.value = mergeBatches(remote);
  } catch (e) {
    console.error(e);
    batches.value = mergeBatches([]);
  } finally {
    loading.value = false;
  }
};

const openDetail = async (b) => {
  const id = b.id || b.batch_id;
  if (String(id).startsWith('local-') || b.source === 'direct_crud') {
    detail.value = getLocalImportBatch(id) || b;
    return;
  }
  try {
    const res = await vendorService.getBatch(id);
    detail.value = res.data || b;
  } catch {
    detail.value = getLocalImportBatch(id) || b;
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
    const isLocal =
      String(id).startsWith('local-') || detail.value?.source === 'direct_crud';

    if (isLocal) {
      const result = await vendorService.retryLocalImportBatch(id);
      await openDetail(result);
      await load();
      alert(
        result.failed_count
          ? `Retry finished with ${result.failed_count} failure(s).`
          : `Retried successfully — ${result.success_count} product(s) saved to your live catalog.`
      );
      return;
    }

    const res = await vendorService.retryBatchFailed(id);
    if (!res.available) {
      // Server job API missing — fall back to local row payloads if present
      if ((detail.value?.errors || []).some((e) => e.rowData)) {
        const result = await vendorService.retryLocalImportBatch(id);
        await openDetail(result);
        await load();
        alert(`Retried via live product API — ${result.success_count} ok, ${result.failed_count} failed.`);
        return;
      }
      alert('Could not retry: no server retry route and no stored row data.');
      return;
    }
    await openDetail({ id });
    await load();
    alert('Failed rows queued for retry on the server.');
  } catch (e) {
    alert(e.response?.data?.message || e.message || 'Retry failed');
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
.batches { display: flex; flex-direction: column; gap: 1rem; }

.panel {
  padding: 1.15rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.85rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.kicker {
  margin: 0 0 0.25rem;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.mono { font-family: ui-monospace, Menlo, Consolas, monospace; }

.panel-head h3 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.02em;
  font-size: 1.2rem;
}

.sub { margin: 0.3rem 0 0; color: var(--text-secondary); font-size: 0.88rem; }

.notice {
  padding: 0.8rem 0.95rem;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 0.85rem;
  background: var(--status-info-bg);
  color: var(--status-info-fg);
  border: 1px solid color-mix(in srgb, var(--status-info-fg) 22%, transparent);
}

.state {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.batch-card {
  padding: 0.9rem;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.batch-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}

.batch-card code { font-size: 0.78rem; }
.file { margin: 0; font-weight: 700; font-size: 0.9rem; }
.muted { margin: 0.2rem 0 0; font-size: 0.75rem; color: var(--text-muted); }

.progress-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.65rem;
}

.progress {
  flex: 1;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 99px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.bar { height: 100%; background: var(--color-primary); }

.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.7rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  min-width: 640px;
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.badge {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
  background: var(--bg-secondary);
}

.badge.ok { background: var(--status-ok-bg); color: var(--status-ok-fg); }
.badge.err { background: var(--status-err-bg); color: var(--status-err-fg); }
.badge.pending { background: var(--status-info-bg); color: var(--status-info-fg); }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 42px;
  padding: 0 0.9rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.btn.primary { background: var(--color-primary); color: #fff; }
.btn.ghost {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.linkish {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.actions { display: flex; gap: 0.45rem; flex-wrap: wrap; }

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
}

.stats li {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem;
  font-size: 0.88rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.mobile-only { display: block; }
.desktop-only { display: none; }

@media (min-width: 800px) {
  .mobile-only { display: none; }
  .desktop-only { display: block; }
  .stats { grid-template-columns: repeat(4, 1fr); }
}
</style>
