# Origin Electric — SEO system (SPA)

## Audit summary (this repository)

| Area | Finding |
|------|---------|
| Stack | Vue 3 + Vite **client-side SPA** (not SSR/SSG) |
| API / DB | External: `api.originelectricltd.com` (not in this repo) |
| Product URLs | Preserved: `/product/:id` |
| Blog URLs | Preserved: `/blog/:slug` |
| Existing | `useSeo`, build-time `sitemap.xml`, `robots.txt`, homepage JSON-LD in `index.html` |

Google may render JavaScript; ranking/indexing is not guaranteed. Initial HTML for dynamic product/blog pages is the SPA shell until client hydration — full SSR would require a separate rendering project or API-side HTML.

## What this SPA implements

- Central `applySeo()` for title, description, canonical, robots, Open Graph, Twitter
- Product JSON-LD (`Product` + `Offer`) with optional real `AggregateRating`
- Blog JSON-LD (`BlogPosting`)
- BreadcrumbList on product/article pages
- `noindex` for cart, checkout, account, auth, and search/sort marketplace URLs
- Dynamic sitemap at build: static pages + categories + products + posts (`lastmod` when API provides dates)
- `robots.txt` with production sitemap URL and private-route disallows

## Public URLs

- Site: `https://www.originelectricltd.com`
- Sitemap: `https://www.originelectricltd.com/sitemap.xml`
- Robots: `https://www.originelectricltd.com/robots.txt`

Configure `VITE_SITE_URL` to the verified production domain before build.

## Admin / database SEO fields

Product/blog SEO overrides (`seo_title`, `meta_description`, etc.) are **read if the API returns them**. Creating admin editors or DB columns for those fields must be done on the API/admin host — this SPA does not own the database.

Vendor product moderation must keep unpublished listings out of `/marketplace/products` responses; the sitemap only includes what the public API returns.

## Google Search Console (manual)

1. Verify domain ownership for `originelectricltd.com` / `www.originelectricltd.com`.
2. Submit `https://www.originelectricltd.com/sitemap.xml`.
3. Use URL Inspection on homepage, a product URL, and a blog URL.
4. Monitor coverage, structured data, and Core Web Vitals.

Do not claim verification or indexing completed unless you performed those steps in GSC.

## Tests

```bash
npm test
npm run test:vendor
npm run build   # regenerates sitemap.xml via prebuild
```

## Known limitations

1. CSR-only: crawlers that do not execute JS see limited HTML on deep product/blog URLs.
2. No sitemap index split yet (URL count is currently within a single file).
3. Admin SEO panel lives on the API admin, not this Vue app.
4. Slug-based product URLs were not introduced in order to preserve existing `/product/:id` links and sitemap entries.
