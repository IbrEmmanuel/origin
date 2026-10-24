/**
 * Build-time sitemap from live marketplace + blog APIs.
 * Run before vite build so dist/sitemap.xml is crawlable.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE = 'https://www.originelectricltd.com';
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

async function collectProductIds() {
  const ids = new Set();
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
      if (p?.id != null) ids.add(String(p.id));
    }
    if (list.length < limit || ids.size >= 2000) break;
    page += 1;
    if (page > 30) break;
  }
  return [...ids];
}

async function collectBlogSlugs() {
  const slugs = new Set();
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
      if (post?.slug) slugs.add(String(post.slug));
    }
  } catch {
    /* keep static sitemap */
  }
  return [...slugs];
}

function urlEntry(loc, { priority = '0.5', changefreq = 'weekly' } = {}) {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  const [productIds, blogSlugs] = await Promise.all([
    collectProductIds(),
    collectBlogSlugs()
  ]);

  const entries = [
    ...STATIC.map((s) =>
      urlEntry(`${SITE}${s.path}`, {
        priority: s.priority,
        changefreq: s.changefreq
      })
    ),
    ...productIds.map((id) =>
      urlEntry(`${SITE}/product/${id}`, {
        priority: '0.7',
        changefreq: 'weekly'
      })
    ),
    ...blogSlugs.map((slug) =>
      urlEntry(`${SITE}/blog/${encodeURIComponent(slug)}`, {
        priority: '0.8',
        changefreq: 'weekly'
      })
    )
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  const outPublic = join(ROOT, 'public', 'sitemap.xml');
  mkdirSync(dirname(outPublic), { recursive: true });
  writeFileSync(outPublic, xml, 'utf8');
  console.log(
    `sitemap.xml: ${STATIC.length} static + ${productIds.length} products + ${blogSlugs.length} posts`
  );
}

main().catch((err) => {
  console.warn('sitemap generation failed, writing static fallback:', err.message);
  const entries = STATIC.map((s) =>
    urlEntry(`${SITE}${s.path}`, {
      priority: s.priority,
      changefreq: s.changefreq
    })
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
  writeFileSync(join(ROOT, 'public', 'sitemap.xml'), xml, 'utf8');
});
