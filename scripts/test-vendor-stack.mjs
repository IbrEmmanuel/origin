/**
 * Live probe for supplier/vendor API surface (no auth token).
 * 401 = route exists and is protected (good).
 * 404 = route not deployed on API host.
 * 200 on marketplace = public catalog healthy.
 */
const API = process.env.VITE_API_BASE_URL || 'https://api.originelectricltd.com';
const base = `${API.replace(/\/$/, '')}/api`;

const checks = [
  ['GET', '/vendor/status'],
  ['GET', '/vendor/dashboard-stats'],
  ['GET', '/vendor/products'],
  ['GET', '/vendor/orders'],
  ['GET', '/vendor/wallet'],
  ['GET', '/vendor/profile'],
  ['POST', '/vendor/apply'],
  ['POST', '/vendor/products'],
  ['POST', '/vendor/withdraw'],
  ['POST', '/vendor/payout-info'],
  ['GET', '/vendor/products/import/template'],
  ['GET', '/vendor/products/import/batches'],
  ['POST', '/vendor/products/import'],
  ['GET', '/marketplace/products?limit=2'],
  ['GET', '/marketplace/categories']
];

const requiredLive = new Set([
  'GET /vendor/status',
  'GET /vendor/dashboard-stats',
  'GET /vendor/products',
  'GET /vendor/orders',
  'GET /vendor/wallet',
  'GET /vendor/profile',
  'POST /vendor/apply',
  'POST /vendor/products',
  'POST /vendor/withdraw',
  'GET /marketplace/products?limit=2',
  'GET /marketplace/categories'
]);

async function probe(method, path) {
  const url = `${base}${path}`;
  const opts = { method, headers: { Accept: 'application/json' } };
  if (method === 'POST') {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = '{}';
  }
  const res = await fetch(url, opts);
  return res.status;
}

const rows = [];
for (const [method, path] of checks) {
  try {
    const status = await probe(method, path);
    rows.push({ key: `${method} ${path}`, status });
    console.log(`${method.padEnd(4)} ${path.padEnd(40)} -> ${status}`);
  } catch (err) {
    rows.push({ key: `${method} ${path}`, status: 'ERR', err: err.message });
    console.log(`${method.padEnd(4)} ${path.padEnd(40)} -> ERR ${err.message}`);
  }
}

const failedRequired = rows.filter((r) => {
  if (!requiredLive.has(r.key.split('?')[0]) && !requiredLive.has(r.key)) return false;
  // Accept 401/403 (auth) or 200 (public)
  return !(r.status === 200 || r.status === 401 || r.status === 403);
});

const optionalMissing = rows.filter(
  (r) =>
    (r.key.includes('/import') || r.key.includes('payout-info')) &&
    r.status === 404
);

console.log('\n--- Summary ---');
if (failedRequired.length) {
  console.error('FAIL: required supplier routes missing or broken:');
  failedRequired.forEach((r) => console.error(`  ${r.key} -> ${r.status}`));
  process.exit(1);
}

console.log('PASS: core supplier routes are live (auth-gated 401 or public 200).');
if (optionalMissing.length) {
  console.log('NOTE: optional routes not on API (SPA uses product CRUD / profile fallbacks):');
  optionalMissing.forEach((r) => console.log(`  ${r.key} -> ${r.status}`));
}
process.exit(0);
