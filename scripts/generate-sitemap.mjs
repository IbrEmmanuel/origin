/**
 * Build-time sitemap from live marketplace + blog APIs.
 * Run before vite build so dist/sitemap.xml is crawlable.
 * Only includes public, indexable URLs (no account/checkout/cart).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE = (process.env.VITE_SITE_URL || 'https://www.originelectricltd.com').replace(
  /\/$/,
  ''
);
const API = 'https://api.originelectricltd.com/api';

const STATIC = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/marketplace', priority: '0.9', changefreq: 'daily' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/load-audit', priority: '0.6', changefreq: 'monthly' },
  { path: '/refund-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/use-policy', priority: '0.3', changefreq: 'yearly' }
];

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(25000)
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

function toLastmod(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

async function collectProducts() {
  const products = [];
  let page = 1;
  const limit = 100;
  for (;;) {
    let data;
    try {
      data = await fetchJson(`${API}/marketplace/products?limit=${limit}&page=${page}`);
    } catch {
      break;
    }
    const list = Array.isArray(data?.products)
      ? data.products
      : Array.isArray(data)
        ? data
        : [];
    if (!list.length) break;
    for (const p of list) {
      if (p?.id == null) continue;
      // Skip clearly unpublished if API exposes flags
      const status = String(p.status || p.moderation_status || p.publication_status || '')
        .toLowerCase();
      if (status && ['draft', 'rejected', 'unpublished', 'private', 'hidden'].includes(status)) {
        continue;
      }
      products.push({
        id: String(p.id),
        lastmod: toLastmod(p.updated_at || p.updatedAt || p.created_at)
      });
    }
    if (list.length < limit || products.length >= 5000) break;
    page += 1;
    if (page > 50) break;
  }
  return products;
}

async function collectBlogPosts() {
  const posts = [];
  try {
    const data = await fetchJson(`${API}/blog?limit=200`);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.posts)
        ? data.posts
        : Array.isArray(data?.data)
          ? data.data
          : [];
    for (const post of list) {
      if (!post?.slug) continue;
      const status = String(post.status || post.state || '').toLowerCase();
      if (status && ['draft', 'scheduled', 'archived', 'unpublished', 'private'].includes(status)) {
        continue;
      }
      posts.push({
        slug: String(post.slug),
        lastmod: toLastmod(post.updated_at || post.published_at || post.created_at)
      });
    }
  } catch {
    /* keep static sitemap */
  }
  return posts;
}

async function collectCategories() {
  const slugs = new Set();
  try {
    const data = await fetchJson(`${API}/marketplace/categories`);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.value)
        ? data.value
        : Array.isArray(data?.categories)
          ? data.categories
          : [];
    for (const c of list) {
      const slug = c?.slug || c?.id || (typeof c === 'string' ? c : null);
      if (slug) slugs.add(String(slug));
    }
  } catch {
    /* optional */
  }
  return [...slugs];
}

function urlEntry(loc, { priority = '0.5', changefreq = 'weekly', lastmod } = {}) {
  const last = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>
    <loc>${loc}</loc>${last}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function writeXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

async function main() {
  const [products, blogPosts, categories] = await Promise.all([
    collectProducts(),
    collectBlogPosts(),
    collectCategories()
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const entries = [
    ...STATIC.map((s) =>
      urlEntry(`${SITE}${s.path}`, {
        priority: s.priority,
        changefreq: s.changefreq,
        lastmod: today
      })
    ),
    ...categories.map((slug) =>
      urlEntry(`${SITE}/marketplace?category=${encodeURIComponent(slug)}`, {
        priority: '0.75',
        changefreq: 'daily',
        lastmod: today
      })
    ),
    ...products.map((p) =>
      urlEntry(`${SITE}/product/${p.id}`, {
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: p.lastmod || today
      })
    ),
    ...blogPosts.map((p) =>
      urlEntry(`${SITE}/blog/${encodeURIComponent(p.slug)}`, {
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: p.lastmod || today
      })
    )
  ];

  const xml = writeXml(entries);
  const outPublic = join(ROOT, 'public', 'sitemap.xml');
  mkdirSync(dirname(outPublic), { recursive: true });
  writeFileSync(outPublic, xml, 'utf8');
  console.log(
    `sitemap.xml: ${STATIC.length} static + ${categories.length} categories + ${products.length} products + ${blogPosts.length} posts`
  );
}

main().catch((err) => {
  console.warn('sitemap generation failed, writing static fallback:', err.message);
  const today = new Date().toISOString().slice(0, 10);
  const entries = STATIC.map((s) =>
    urlEntry(`${SITE}${s.path}`, {
      priority: s.priority,
      changefreq: s.changefreq,
      lastmod: today
    })
  );
  writeFileSync(join(ROOT, 'public', 'sitemap.xml'), writeXml(entries), 'utf8');
});
