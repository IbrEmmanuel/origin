/**
 * Read-only health probe for storefront dependencies.
 * Does not require secrets. Exit 0 if core API surface responds.
 */
import { writeFileSync } from 'node:fs';

const API = 'https://api.originelectricltd.com/api';
const SITE = 'https://www.originelectricltd.com';
const AGENT = 'https://staging-ai-agent.fly.dev';

async function probe(name, url, { method = 'GET', expectOk = true } = {}) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method,
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(20000)
    });
    const ms = Date.now() - started;
    const pass = expectOk
      ? res.status < 500
      : true;
    return {
      name,
      url,
      status: res.status,
      ms,
      ok: pass
    };
  } catch (err) {
    return {
      name,
      url,
      status: 0,
      ms: Date.now() - started,
      ok: false,
      error: err.message
    };
  }
}

const checks = await Promise.all([
  probe('api.marketplace.products', `${API}/marketplace/products?limit=1`),
  probe('api.blog', `${API}/blog?limit=1`),
  probe('api.auth.login.options', `${API}/auth/login`, { method: 'OPTIONS' }),
  probe('site.home', SITE),
  probe('site.robots', `${SITE}/robots.txt`),
  probe('site.sitemap', `${SITE}/sitemap.xml`),
  probe('paystack.inline', 'https://js.paystack.co/v1/inline.js'),
  probe('agent.health', `${AGENT}/health`)
]);

const failed = checks.filter((c) => !c.ok);
const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    total: checks.length,
    passed: checks.length - failed.length,
    failed: failed.length
  },
  checks
};

console.log(JSON.stringify(report, null, 2));
writeFileSync(new URL('../health-report.json', import.meta.url), JSON.stringify(report, null, 2));

if (failed.length) {
  console.error(`\nHealth check failed: ${failed.map((f) => f.name).join(', ')}`);
  process.exit(1);
}
console.log('\nAll health probes passed.');
