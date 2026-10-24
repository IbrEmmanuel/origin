/**
 * Full-stack smoke test for Paystack payment path (API + CDN + amount math).
 * Does not charge cards — verifies endpoints and configuration surface.
 */
const API = 'https://api.originelectricltd.com/api';

function toKobo(amountNaira) {
  const n = Number(amountNaira);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

async function probe(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  return { status: res.status, text: text.slice(0, 200) };
}

const results = [];

function ok(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

// Amount conversion (kobo)
ok('toKobo integer', toKobo(1500) === 150000, String(toKobo(1500)));
ok('toKobo float round', toKobo(19.99) === 1999, String(toKobo(19.99)));
ok('toKobo reject zero', toKobo(0) === 0);

// Paystack CDN
try {
  const res = await fetch('https://js.paystack.co/v1/inline.js');
  ok('Paystack inline.js CDN', res.ok, `status ${res.status}`);
} catch (e) {
  ok('Paystack inline.js CDN', false, e.message);
}

// Checkout + verify exist (401 without auth = healthy)
const checkout = await probe('POST', '/user/checkout', { items: [] });
ok(
  'POST /user/checkout reachable',
  checkout.status === 401 || checkout.status === 400 || checkout.status === 422,
  `status ${checkout.status}`
);

const verify = await probe('POST', '/user/verify-payment', {
  reference: 'smoke_test_ref',
  orderId: '1'
});
ok(
  'POST /user/verify-payment reachable',
  verify.status === 401 || verify.status === 400 || verify.status === 422,
  `status ${verify.status}`
);

// Env surface (local)
const key = process.env.VITE_PAYSTACK_PUBLIC_KEY || '';
const keyOk = /^pk_(test|live)_[A-Za-z0-9]+$/.test(key);
ok(
  'VITE_PAYSTACK_PUBLIC_KEY set for this process',
  keyOk,
  keyOk ? `${key.slice(0, 12)}…` : 'missing — set in .env / Vercel and rebuild'
);

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.some((f) => f.name.includes('reachable') || f.name.includes('CDN') || f.name.includes('toKobo'))) {
  process.exit(1);
}
// Missing public key is a config warning, not a code failure for CI smoke
process.exit(0);
