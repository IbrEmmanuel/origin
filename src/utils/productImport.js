import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { calculateMarketplacePricing } from '@/lib/commission';

/** Canonical columns for vendor product bulk import */
export const IMPORT_COLUMNS = [
  { key: 'sku', label: 'SKU', required: true },
  { key: 'name', label: 'Name', required: true },
  { key: 'description', label: 'Description', required: false },
  { key: 'price', label: 'Base Price (₦ you receive)', required: true },
  { key: 'stock', label: 'Stock', required: true },
  { key: 'category', label: 'Category', required: false },
  { key: 'image_url', label: 'Image URL', required: false }
];

export const TEMPLATE_HEADERS = IMPORT_COLUMNS.map((c) => c.key);

const normalizeHeader = (h) =>
  String(h || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

export function buildCsvTemplateBlob() {
  const sample = [
    TEMPLATE_HEADERS.join(','),
    'SKU-001,Hybrid Inverter 5kW,Grid-tied hybrid inverter,450000,10,solar,https://example.com/inverter.jpg',
    'SKU-002,Lithium Battery 5kWh,LiFePO4 battery bank,320000,5,bess,'
  ].join('\n');
  return new Blob([sample], { type: 'text/csv;charset=utf-8' });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function mapRow(raw) {
  const row = {};
  Object.keys(raw || {}).forEach((k) => {
    row[normalizeHeader(k)] = typeof raw[k] === 'string' ? raw[k].trim() : raw[k];
  });
  // aliases
  if (row.product_name && !row.name) row.name = row.product_name;
  if (row.qty && row.stock == null) row.stock = row.qty;
  if (row.quantity && row.stock == null) row.stock = row.quantity;
  return row;
}

export function validateImportRow(row, index, { existingSkus = new Set(), mode = 'create' } = {}) {
  const errors = [];
  const sku = String(row.sku || '').trim();
  const name = String(row.name || '').trim();
  const price = Number(row.price);
  const stock = Number(row.stock);

  if (!sku) errors.push('SKU is required');
  if (!name) errors.push('Name is required');
  if (!Number.isFinite(price) || price < 0) errors.push('Price must be a non-negative number');
  if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.push('Stock must be a non-negative integer');
  }

  const skuLower = sku.toLowerCase();
  if (sku && existingSkus.has(skuLower) && mode === 'create') {
    errors.push(`Duplicate SKU "${sku}" already exists — use update mode to overwrite`);
  }

  return {
    rowIndex: index + 1,
    sku,
    name,
    description: row.description || '',
    price: Number.isFinite(price) ? price : null,
    stock: Number.isFinite(stock) ? stock : null,
    category: row.category || '',
    image_url: row.image_url || '',
    errors,
    valid: errors.length === 0
  };
}

export async function parseImportFile(file) {
  const name = (file?.name || '').toLowerCase();
  if (name.endsWith('.csv') || file.type === 'text/csv') {
    return parseCsvFile(file);
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return parseXlsxFile(file);
  }
  throw new Error('Unsupported file type. Upload a .csv or .xlsx file.');
}

function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors?.length) {
          const fatal = result.errors.find((e) => e.type === 'Delimiter');
          if (fatal) {
            reject(new Error(fatal.message));
            return;
          }
        }
        resolve((result.data || []).map(mapRow).filter((r) => Object.values(r).some((v) => v !== '' && v != null)));
      },
      error: (err) => reject(err)
    });
  });
}

async function parseXlsxFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return json.map(mapRow).filter((r) => Object.values(r).some((v) => v !== '' && v != null));
}

export function validateImportRows(rows, options = {}) {
  const seenInFile = new Set();
  const existingSkus = options.existingSkus || new Set();
  const mode = options.mode || 'create';

  return rows.map((row, index) => {
    const result = validateImportRow(row, index, { existingSkus, mode });
    const key = result.sku.toLowerCase();
    if (key && seenInFile.has(key)) {
      result.errors.push(`Duplicate SKU "${result.sku}" appears twice in this file`);
      result.valid = false;
    }
    if (key) seenInFile.add(key);
    return result;
  });
}

/**
 * Map a validated import row to the vendor product API payload.
 * CSV `price` is the vendor base; customer-facing price includes Origin’s 12%.
 */
export function rowToProductPayload(row) {
  const images = row.image_url ? [String(row.image_url).trim()].filter(Boolean) : [];
  const descParts = [];
  if (row.description) descParts.push(String(row.description));
  if (row.sku) descParts.push(`SKU: ${row.sku}`);

  const pricing = calculateMarketplacePricing(row.price);

  return {
    sku: row.sku,
    name: row.name,
    description: descParts.join('\n\n') || row.name,
    base_price: pricing.baseNaira,
    commission_rate_bps: pricing.rateBps,
    commission_amount: pricing.commissionNaira,
    price: pricing.customerNaira,
    stock: Number(row.stock),
    category: row.category || '',
    images
  };
}

const LOCAL_BATCH_KEY = 'vendor_import_batches';

export function loadLocalImportBatches() {
  try {
    const raw = localStorage.getItem(LOCAL_BATCH_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalImportBatch(batch) {
  const list = loadLocalImportBatches();
  list.unshift(batch);
  localStorage.setItem(LOCAL_BATCH_KEY, JSON.stringify(list.slice(0, 40)));
  return batch;
}

export function getLocalImportBatch(id) {
  return loadLocalImportBatches().find((b) => b.id === id || b.batch_id === id) || null;
}

export function updateLocalImportBatch(id, patch) {
  const list = loadLocalImportBatches();
  const idx = list.findIndex((b) => b.id === id || b.batch_id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...patch };
  localStorage.setItem(LOCAL_BATCH_KEY, JSON.stringify(list));
  return list[idx];
}
