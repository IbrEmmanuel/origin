/**
 * Bulk upload stack test (no browser auth required for local validation).
 * Run: node scripts/test-bulk-upload.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const API = 'https://api.originelectricltd.com/api';

const csv = [
  'sku,name,description,price,stock,category,image_url',
  'BULK-TEST-001,Bulk Test Inverter,Test hybrid inverter for import QA,450000,3,solar,',
  'BULK-TEST-002,Bulk Test Battery,LiFePO4 test pack,320000,2,bess,',
  ',Missing SKU,bad row,100,1,solar,',
  'BULK-TEST-003,Bad price,oops,not-a-number,1,solar,'
].join('\n');

const tmp = path.join(root, 'scripts', '_bulk-test.csv');
fs.writeFileSync(tmp, csv, 'utf8');

function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function mapRow(raw) {
  const row = {};
  Object.keys(raw || {}).forEach((k) => {
    row[normalizeHeader(k)] = typeof raw[k] === 'string' ? raw[k].trim() : raw[k];
  });
  return row;
}

function validateImportRow(row, index, { existingSkus = new Set(), mode = 'create' } = {}) {
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
  if (sku && existingSkus.has(sku.toLowerCase()) && mode === 'create') {
    errors.push(`Duplicate SKU "${sku}" already exists`);
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

function rowToProductPayload(row) {
  const images = row.image_url ? [String(row.image_url).trim()].filter(Boolean) : [];
  const descParts = [];
  if (row.description) descParts.push(String(row.description));
  if (row.sku) descParts.push(`SKU: ${row.sku}`);
  return {
    sku: row.sku,
    name: row.name,
    description: descParts.join('\n\n') || row.name,
    price: Number(row.price),
    stock: Number(row.stock),
    category: row.category || '',
    images
  };
}

const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
const rows = (parsed.data || []).map(mapRow);
const validated = rows.map((r, i) => validateImportRow(r, i));
const valid = validated.filter((r) => r.valid);
const invalid = validated.filter((r) => !r.valid);

console.log('=== 1) CSV parse + validate (client stack) ===');
console.log(`rows=${validated.length} valid=${valid.length} invalid=${invalid.length}`);
valid.forEach((r) => console.log(`  OK  #${r.rowIndex} ${r.sku} ${r.name} ₦${r.price}`));
invalid.forEach((r) => console.log(`  BAD #${r.rowIndex} ${r.sku || '(no sku)'} — ${r.errors.join('; ')}`));

console.log('\n=== 2) Payload shape for POST /vendor/products ===');
valid.forEach((r) => console.log(JSON.stringify(rowToProductPayload(r))));

async function probe(method, urlPath, body) {
  const url = `${API}${urlPath}`;
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    let snippet = text.slice(0, 120).replace(/\s+/g, ' ');
    return { method, path: urlPath, status: res.status, snippet };
  } catch (e) {
    return { method, path: urlPath, status: 'ERR', snippet: e.message };
  }
}

console.log('\n=== 3) Live API route probe (no auth) ===');
console.log('401/403 = route exists (auth required) | 404/501 = import job not deployed (CRUD fallback used)');

const probes = await Promise.all([
  probe('GET', '/vendor/products/import/template'),
  probe('GET', '/vendor/products/import/batches'),
  probe('POST', '/vendor/products/import', {}),
  probe('GET', '/vendor/products'),
  probe('POST', '/vendor/products', rowToProductPayload(valid[0])),
  probe('GET', '/vendor/status')
]);

for (const p of probes) {
  const meaning =
    p.status === 401 || p.status === 403
      ? 'EXISTS (auth gated)'
      : p.status === 404 || p.status === 501
        ? 'MISSING — UI falls back to product CRUD'
        : p.status === 405
          ? 'EXISTS (method not allowed without multipart)'
          : String(p.status);
  console.log(`${p.method.padEnd(4)} ${p.path.padEnd(36)} -> ${p.status}  ${meaning}`);
  if (p.snippet) console.log(`      ${p.snippet}`);
}

console.log('\n=== Verdict ===');
const importExists = probes.some(
  (p) => p.path.includes('/import') && (p.status === 401 || p.status === 403 || p.status === 405)
);
const crudExists = probes.some(
  (p) => p.path === '/vendor/products' && (p.status === 401 || p.status === 403)
);

if (valid.length !== 2) {
  console.log('FAIL: expected 2 valid sample rows');
  process.exitCode = 1;
} else if (crudExists) {
  console.log(
    importExists
      ? 'PASS: Server import routes + product CRUD both exist. Bulk upload can use import job or CRUD fallback.'
      : 'PASS: Dedicated import routes not deployed; full-stack path is importProductsDirectly → POST/PUT /vendor/products (auth required).'
  );
} else {
  console.log('WARN: Could not confirm /vendor/products exists. Check API host / Imunify360.');
  process.exitCode = 1;
}

fs.unlinkSync(tmp);
