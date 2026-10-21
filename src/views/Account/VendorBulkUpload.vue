<template>
  <div class="bulk-upload">
    <div class="glass-card section-card">
      <div class="section-head">
        <div>
          <h3>Bulk product upload</h3>
          <p class="text-secondary">Import products via CSV or XLSX. Preview and fix errors before committing.</p>
        </div>
        <button type="button" class="btn ghost-btn" @click="downloadTemplate" :disabled="busy">
          <DownloadIcon class="icon-sm" /> Download template
        </button>
      </div>

      <div v-if="apiNotice" class="notice notice-warn">
        {{ apiNotice }}
      </div>

      <div class="controls">
        <label class="field">
          <span>Import mode</span>
          <select v-model="mode" class="form-input">
            <option value="create">Create new (reject existing SKUs)</option>
            <option value="update">Create + update existing SKUs</option>
          </select>
        </label>

        <label class="file-drop" :class="{ dragging }" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="onDrop">
          <input type="file" accept=".csv,.xlsx,.xls" hidden @change="onFileChange" />
          <UploadCloudIcon class="icon-lg" />
          <span v-if="file">{{ file.name }} ({{ formatBytes(file.size) }})</span>
          <span v-else>Drop CSV / XLSX here or click to browse</span>
        </label>
      </div>

      <div class="actions" v-if="file">
        <button type="button" class="btn primary-btn" @click="runPreview" :disabled="busy">
          {{ busy ? 'Parsing…' : 'Validate & preview' }}
        </button>
        <button type="button" class="btn ghost-btn" @click="resetFile" :disabled="busy">Clear</button>
      </div>
    </div>

    <div v-if="previewRows.length" class="glass-card section-card mt-4">
      <div class="section-head">
        <div>
          <h3>Preview</h3>
          <p class="text-secondary">
            {{ validCount }} valid · {{ invalidCount }} with errors · {{ previewRows.length }} total
          </p>
        </div>
        <div class="actions-inline">
          <button
            v-if="invalidCount"
            type="button"
            class="btn ghost-btn"
            @click="downloadLocalErrors"
          >
            Download error report
          </button>
          <button
            type="button"
            class="btn primary-btn"
            :disabled="busy || validCount === 0"
            @click="commitImport"
          >
            {{ busy ? 'Uploading…' : `Import ${validCount} valid row(s)` }}
          </button>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>SKU</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in previewRows.slice(0, 100)" :key="row.rowIndex" :class="{ bad: !row.valid }">
              <td>{{ row.rowIndex }}</td>
              <td>{{ row.sku || '—' }}</td>
              <td>{{ row.name || '—' }}</td>
              <td>{{ row.price != null ? `₦${Number(row.price).toLocaleString()}` : '—' }}</td>
              <td>{{ row.stock != null ? row.stock : '—' }}</td>
              <td>
                <span v-if="row.valid" class="badge ok">OK</span>
                <span v-else class="badge err" :title="row.errors.join('; ')">{{ row.errors[0] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="previewRows.length > 100" class="text-secondary hint">Showing first 100 rows.</p>
      </div>
    </div>

    <div v-if="lastResult" class="glass-card section-card mt-4 success-card">
      <h3>Import submitted</h3>
      <p class="text-secondary">
        Batch <strong>{{ lastResult.batch_id || lastResult.id || 'queued' }}</strong>
        — check the Batches tab for progress.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Download as DownloadIcon, UploadCloud as UploadCloudIcon } from 'lucide-vue-next';
import vendorService from '@/services/vendor.service';
import {
  buildCsvTemplateBlob,
  downloadBlob,
  parseImportFile,
  validateImportRows
} from '@/utils/productImport';

const emit = defineEmits(['imported']);

const file = ref(null);
const mode = ref('create');
const busy = ref(false);
const dragging = ref(false);
const previewRows = ref([]);
const existingSkus = ref(new Set());
const apiNotice = ref('');
const lastResult = ref(null);

const validCount = computed(() => previewRows.value.filter((r) => r.valid).length);
const invalidCount = computed(() => previewRows.value.filter((r) => !r.valid).length);

const formatBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const loadExistingSkus = async () => {
  try {
    const products = await vendorService.getProducts();
    const list = Array.isArray(products) ? products : products?.products || [];
    existingSkus.value = new Set(
      list.map((p) => String(p.sku || '').toLowerCase()).filter(Boolean)
    );
  } catch {
    existingSkus.value = new Set();
  }
};

const downloadTemplate = async () => {
  busy.value = true;
  try {
    const remote = await vendorService.downloadImportTemplate('csv');
    if (remote.available && remote.blob) {
      downloadBlob(remote.blob, 'origin-product-import-template.csv');
      return;
    }
    downloadBlob(buildCsvTemplateBlob(), 'origin-product-import-template.csv');
    apiNotice.value =
      'Using local CSV template. Deploy GET /vendor/products/import/template on the API for the official file.';
  } catch (e) {
    downloadBlob(buildCsvTemplateBlob(), 'origin-product-import-template.csv');
  } finally {
    busy.value = false;
  }
};

const resetFile = () => {
  file.value = null;
  previewRows.value = [];
  lastResult.value = null;
};

const onFileChange = (e) => {
  const f = e.target.files?.[0];
  if (f) {
    file.value = f;
    previewRows.value = [];
    lastResult.value = null;
  }
};

const onDrop = (e) => {
  dragging.value = false;
  const f = e.dataTransfer?.files?.[0];
  if (f) {
    file.value = f;
    previewRows.value = [];
    lastResult.value = null;
  }
};

const runPreview = async () => {
  if (!file.value) return;
  busy.value = true;
  apiNotice.value = '';
  try {
    // Prefer server preview when available
    const remote = await vendorService.previewImport(file.value, mode.value);
    if (remote.available && remote.data) {
      const rows = remote.data.rows || remote.data.preview || [];
      previewRows.value = rows.map((r, i) => ({
        rowIndex: r.rowIndex || r.row || i + 1,
        sku: r.sku,
        name: r.name,
        price: r.price,
        stock: r.stock,
        errors: r.errors || [],
        valid: !(r.errors && r.errors.length)
      }));
      return;
    }

    apiNotice.value =
      'Server preview API not available — validating locally. Deploy POST /vendor/products/import/preview for server-side checks.';
    const parsed = await parseImportFile(file.value);
    previewRows.value = validateImportRows(parsed, {
      existingSkus: existingSkus.value,
      mode: mode.value
    });
  } catch (err) {
    alert(err.response?.data?.message || err.message || 'Failed to parse file');
  } finally {
    busy.value = false;
  }
};

const downloadLocalErrors = () => {
  const lines = [['row', 'sku', 'errors'].join(',')];
  previewRows.value
    .filter((r) => !r.valid)
    .forEach((r) => {
      lines.push(
        [r.rowIndex, JSON.stringify(r.sku || ''), JSON.stringify(r.errors.join('; '))].join(',')
      );
    });
  downloadBlob(new Blob([lines.join('\n')], { type: 'text/csv' }), 'import-errors.csv');
};

const commitImport = async () => {
  if (!file.value || validCount.value === 0) return;
  busy.value = true;
  try {
    const remote = await vendorService.startImport(file.value, mode.value, {
      skipDuplicates: mode.value === 'create'
    });
    if (!remote.available) {
      apiNotice.value =
        'Bulk import API is not deployed yet (POST /vendor/products/import). Local preview still works; ask backend to add vendor-scoped import + batch endpoints.';
      alert(apiNotice.value);
      return;
    }
    lastResult.value = remote.data;
    emit('imported', remote.data);
    alert('Import started. Open the Batches tab to track progress.');
  } catch (err) {
    alert(err.response?.data?.message || 'Import failed');
  } finally {
    busy.value = false;
  }
};

onMounted(loadExistingSkus);
</script>

<style scoped>
.section-card { padding: 1.5rem; gap: 1.25rem; }
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}
.section-head h3 { margin: 0 0 0.35rem; font-size: 1.15rem; }
.text-secondary { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }
.controls { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; font-weight: 600; max-width: 360px; }
.form-input {
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font: inherit;
}
.file-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 120px;
  border: 1.5px dashed var(--border-color-strong);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  cursor: pointer;
  color: var(--text-secondary);
  text-align: center;
  padding: 1.25rem;
}
.file-drop.dragging { border-color: var(--color-primary); color: var(--color-primary); }
.actions, .actions-inline { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  font-family: inherit;
}
.primary-btn { background: var(--color-primary); color: #fff; }
.ghost-btn { background: transparent; border: 1px solid var(--border-color); color: var(--text-primary); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.notice {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  margin-top: 0.75rem;
}
.notice-warn { background: #fff4ea; color: #9a4d00; border: 1px solid #ffd2a8; }
.table-wrap { overflow-x: auto; margin-top: 1rem; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table th, .data-table td {
  text-align: left;
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
.data-table tr.bad { background: rgba(235, 0, 0, 0.04); }
.badge {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.badge.ok { background: #e8f5e9; color: #2e7d32; }
.badge.err { background: #ffebee; color: #c62828; }
.hint { margin-top: 0.75rem; font-size: 0.8rem; }
.success-card { border-color: #c8e6c9; }
.icon-sm { width: 16px; height: 16px; }
.icon-lg { width: 28px; height: 28px; }
.mt-4 { margin-top: 1.25rem; }
</style>
