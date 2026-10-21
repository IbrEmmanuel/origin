# Dashboard extensions (Marketplace / Vendor Bulk / Ads)

This Vue SPA was extended **in place**. There is **no database in this repo** — persistence lives on `api.originelectricltd.com`. New UI modules call documented API routes and show a clear configuration state when those routes return 404/501.

## Existing stack (unchanged)

- Vue 3 + Vite + Vue Router + Axios
- Account shell: `src/views/Account/AccountLayout.vue`
- Vendor portal tabs: `src/views/Account/Vendor.vue`
- Marketplace / cart / Paystack checkout already existed

## Files modified

- `src/composables/useCart.js` — stock-aware qty, `buyNow`, `clearCart`
- `src/services/marketplace.service.js` — sort params, `validateCart`, `trackEvent`
- `src/services/vendor.service.js` — bulk import + batch endpoints
- `src/views/MarketplaceView.vue` — sort + Buy Now
- `src/views/ProductView.vue` — Buy Now + product_view events
- `src/views/CheckoutView.vue` — same-origin API helper, cart validate, Paystack test-mode warning
- `src/views/Account/Vendor.vue` — tabs: Bulk Upload, Batches, Ads
- `vite.config.js` / `vercel.json` / `.env` — `/api` proxy (prior work)
- `package.json` — `papaparse`, `xlsx`

## Files added

- `src/services/ads.service.js`
- `src/utils/productImport.js`
- `src/views/Account/VendorBulkUpload.vue`
- `src/views/Account/VendorBatchDashboard.vue`
- `src/views/Account/VendorAds.vue`
- `docs/DASHBOARD_EXTENSIONS.md` (this file)

## Database migrations

**Not in this frontend repo.** Backend must add vendor-scoped tables/indexes for:

- import batches + row errors
- ad campaigns + ad events
- optional cart validation / marketplace events
- consent flags for audience segments

Do **not** reset production data when adding migrations.

## Backend routes still required

### Bulk import

| Method | Path |
|--------|------|
| GET | `/vendor/products/import/template` |
| POST | `/vendor/products/import/preview` |
| POST | `/vendor/products/import` |
| GET | `/vendor/products/import/batches` |
| GET | `/vendor/products/import/batches/:id` |
| GET | `/vendor/products/import/batches/:id/errors` |
| POST | `/vendor/products/import/batches/:id/retry-failed` |

Must enforce **vendor ownership** on every batch/product mutation.

### Advertising

| Method | Path |
|--------|------|
| GET/POST | `/vendor/ads/campaigns` |
| GET/PUT | `/vendor/ads/campaigns/:id` |
| PATCH | `/vendor/ads/campaigns/:id/status` |
| GET | `/vendor/ads/analytics` |
| GET | `/vendor/ads/audience-segments` |
| POST | `/vendor/ads/events` |

### Marketplace extras

| Method | Path |
|--------|------|
| POST | `/marketplace/cart/validate` |
| POST | `/marketplace/events` |

## Env / payments

```
VITE_API_URL=https://api.originelectricltd.com/api
VITE_API_BASE_URL=https://api.originelectricltd.com
VITE_PAYSTACK_PUBLIC_KEY=pk_test_…   # test = not live; pk_live_… for production
```

**Imunify360:** Do not proxy the main API through Vite/Vercel — bot-protection blocks datacenter/proxy IPs. The browser must call the API directly. On the host: whitelist client IPs or disable bot-protection for `/api/auth/*`, and enable CORS for `https://www.originelectricltd.com` (and `http://localhost:5173` for local dev).

## Tested in this pass

- Project builds (run `npm run build` after install)
- Existing vendor tabs still mount with new tabs added
- Local CSV template + client-side validation work without backend
- Ads / Batches UIs show explicit “API not deployed” when 404

## Limitations

- Server-side import processing, ad metrics, and audience segments require the external API.
- Client-side preview cannot replace server authorization or idempotent retries.
- No second database or new app was introduced.
